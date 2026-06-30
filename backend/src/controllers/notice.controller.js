const prisma = require('../prismaClient')
const { sendImportantNoticeEmail } = require('../services/email.service')

// GET /api/notices  — pinned/important notices first, then newest first
async function getNotices(req, res) {
  try {
    const notices = await prisma.notice.findMany({
      where: { societyId: req.societyId },
      include: { postedBy: { select: { name: true } } },
      orderBy: [{ isImportant: 'desc' }, { createdAt: 'desc' }],
    })
    return res.json({ notices })
  } catch (err) {
    console.error('getNotices error:', err)
    return res.status(500).json({ error: 'Something went wrong fetching notices' })
  }
}

// POST /api/notices  (admin only)
async function createNotice(req, res) {
  try {
    const { title, content, isImportant } = req.body
    if (!title || !content) {
      return res.status(400).json({ error: 'title and content are required' })
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        isImportant: !!isImportant,
        societyId: req.societyId,
        postedById: req.user.id,
      },
    })

    // Fan out an email to every resident in this society if marked important.
    if (notice.isImportant) {
      const residents = await prisma.user.findMany({
        where: { societyId: req.societyId, role: 'RESIDENT' },
        select: { name: true, email: true },
      })
      for (const resident of residents) {
        sendImportantNoticeEmail({
          to: resident.email,
          residentName: resident.name,
          noticeTitle: title,
          noticeContent: content,
        })
      }
    }

    return res.status(201).json({ notice })
  } catch (err) {
    console.error('createNotice error:', err)
    return res.status(500).json({ error: 'Something went wrong posting the notice' })
  }
}

// DELETE /api/notices/:id  (admin only)
async function deleteNotice(req, res) {
  try {
    const existing = await prisma.notice.findFirst({
      where: { id: req.params.id, societyId: req.societyId },
    })
    if (!existing) return res.status(404).json({ error: 'Notice not found' })

    await prisma.notice.delete({ where: { id: existing.id } })
    return res.status(204).send()
  } catch (err) {
    console.error('deleteNotice error:', err)
    return res.status(500).json({ error: 'Something went wrong deleting the notice' })
  }
}

module.exports = { getNotices, createNotice, deleteNotice }
