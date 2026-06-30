const prisma = require('../prismaClient')

// Flags complaints as overdue if they're still OPEN/IN_PROGRESS past their
// OWN society's configured threshold. Each society can set a different
// threshold, so this must be computed per-society, never with a global constant.
async function recalculateOverdueFlags() {
  const societies = await prisma.society.findMany({
    select: { id: true, overdueThresholdDays: true },
  })

  let totalFlagged = 0

  for (const society of societies) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - society.overdueThresholdDays)

    const result = await prisma.complaint.updateMany({
      where: {
        societyId: society.id,
        status: { in: ['OPEN', 'IN_PROGRESS'] },
        createdAt: { lte: cutoff },
        isOverdue: false,
      },
      data: { isOverdue: true },
    })
    totalFlagged += result.count
  }

  return totalFlagged
}

module.exports = { recalculateOverdueFlags }
