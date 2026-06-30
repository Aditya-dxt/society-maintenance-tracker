const prisma = require('../prismaClient')

// GET /api/dashboard  (admin only) — all stats scoped to req.societyId
async function getDashboard(req, res) {
  try {
    const [byStatus, byCategory, overdueCount, totalCount] = await Promise.all([
      prisma.complaint.groupBy({
        by: ['status'],
        where: { societyId: req.societyId },
        _count: true,
      }),
      prisma.complaint.groupBy({
        by: ['category'],
        where: { societyId: req.societyId },
        _count: true,
      }),
      prisma.complaint.count({
        where: { societyId: req.societyId, isOverdue: true },
      }),
      prisma.complaint.count({
        where: { societyId: req.societyId },
      }),
    ])

    return res.json({
      total: totalCount,
      overdueCount,
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
      byCategory: byCategory.map((c) => ({ category: c.category, count: c._count })),
    })
  } catch (err) {
    console.error('getDashboard error:', err)
    return res.status(500).json({ error: 'Something went wrong building the dashboard' })
  }
}

module.exports = { getDashboard }
