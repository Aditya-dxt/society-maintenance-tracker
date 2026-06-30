const prisma = require('../prismaClient')
const { sendStatusChangeEmail } = require('../services/email.service')
const { uploadImageBuffer } = require('../services/cloudinary.service')

// POST /api/complaints  (resident) — multipart/form-data, photo optional
async function createComplaint(req, res) {
  try {
    const { title, description, category } = req.body
    if (!title || !description || !category) {
      return res.status(400).json({ error: 'title, description, and category are required' })
    }

    let photoUrl = null
    if (req.file) {
      photoUrl = await uploadImageBuffer(req.file.buffer)
    }

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        category,
        photoUrl,
        societyId: req.societyId,
        residentId: req.user.id,
        history: {
          create: {
            newStatus: 'OPEN',
            note: 'Complaint raised',
            changedById: req.user.id,
          },
        },
      },
      include: { history: true },
    })

    return res.status(201).json({ complaint })
  } catch (err) {
    console.error('createComplaint error:', err)
    return res.status(500).json({ error: 'Something went wrong raising the complaint' })
  }
}

// GET /api/complaints/mine  (resident) — only their own, within their society
async function getMyComplaints(req, res) {
  try {
    const complaints = await prisma.complaint.findMany({
      where: { societyId: req.societyId, residentId: req.user.id },
      include: { history: { orderBy: { changedAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    })
    return res.json({ complaints })
  } catch (err) {
    console.error('getMyComplaints error:', err)
    return res.status(500).json({ error: 'Something went wrong fetching your complaints' })
  }
}

// GET /api/complaints  (admin) — all complaints in their society, with filters
async function getAllComplaints(req, res) {
  try {
    const { status, category, from, to } = req.query

    const where = { societyId: req.societyId }
    if (status) where.status = status
    if (category) where.category = category
    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(from)
      if (to) where.createdAt.lte = new Date(to)
    }

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        resident: { select: { id: true, name: true, flatNumber: true } },
        history: { orderBy: { changedAt: 'asc' } },
      },
      // Overdue first, then high priority first, then newest first
      orderBy: [{ isOverdue: 'desc' }, { priority: 'desc' }, { createdAt: 'desc' }],
    })
    return res.json({ complaints })
  } catch (err) {
    console.error('getAllComplaints error:', err)
    return res.status(500).json({ error: 'Something went wrong fetching complaints' })
  }
}

// GET /api/complaints/:id  (resident sees own, admin sees any in society)
async function getComplaintById(req, res) {
  try {
    const complaint = await prisma.complaint.findFirst({
      where: { id: req.params.id, societyId: req.societyId },
      include: {
        resident: { select: { id: true, name: true, flatNumber: true } },
        history: { orderBy: { changedAt: 'asc' }, include: { changedBy: { select: { name: true, role: true } } } },
      },
    })
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' })

    if (req.user.role === 'RESIDENT' && complaint.residentId !== req.user.id) {
      return res.status(403).json({ error: 'You can only view your own complaints' })
    }

    return res.json({ complaint })
  } catch (err) {
    console.error('getComplaintById error:', err)
    return res.status(500).json({ error: 'Something went wrong fetching the complaint' })
  }
}

// PATCH /api/complaints/:id/status  (admin)
async function updateStatus(req, res) {
  try {
    const { status, note } = req.body
    const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `status must be one of ${validStatuses.join(', ')}` })
    }

    const existing = await prisma.complaint.findFirst({
      where: { id: req.params.id, societyId: req.societyId },
      include: { resident: { select: { name: true, email: true } } },
    })
    if (!existing) return res.status(404).json({ error: 'Complaint not found' })

    const updated = await prisma.$transaction(async (tx) => {
      const c = await tx.complaint.update({
        where: { id: existing.id },
        data: {
          status,
          isOverdue: status === 'RESOLVED' ? false : existing.isOverdue,
          resolvedAt: status === 'RESOLVED' ? new Date() : null,
          history: {
            create: {
              oldStatus: existing.status,
              newStatus: status,
              note: note || null,
              changedById: req.user.id,
            },
          },
        },
        include: { history: { orderBy: { changedAt: 'asc' } } },
      })
      return c
    })

    sendStatusChangeEmail({
      to: existing.resident.email,
      residentName: existing.resident.name,
      complaintTitle: existing.title,
      newStatus: status,
      note,
    })

    return res.json({ complaint: updated })
  } catch (err) {
    console.error('updateStatus error:', err)
    return res.status(500).json({ error: 'Something went wrong updating status' })
  }
}

// PATCH /api/complaints/:id/priority  (admin)
async function updatePriority(req, res) {
  try {
    const { priority } = req.body
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH']
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: `priority must be one of ${validPriorities.join(', ')}` })
    }

    const existing = await prisma.complaint.findFirst({
      where: { id: req.params.id, societyId: req.societyId },
    })
    if (!existing) return res.status(404).json({ error: 'Complaint not found' })

    const updated = await prisma.complaint.update({
      where: { id: existing.id },
      data: { priority },
    })
    return res.json({ complaint: updated })
  } catch (err) {
    console.error('updatePriority error:', err)
    return res.status(500).json({ error: 'Something went wrong updating priority' })
  }
}

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateStatus,
  updatePriority,
}
