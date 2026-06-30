const prisma = require('../prismaClient')
const { generateUniqueJoinCode } = require('../services/code.service')

// GET /api/society
// Returns the logged-in user's own society details — always scoped via req.societyId.
async function getMySociety(req, res) {
  try {
    const society = await prisma.society.findUnique({ where: { id: req.societyId } })
    if (!society) return res.status(404).json({ error: 'Society not found' })
    return res.json({ society })
  } catch (err) {
    console.error('getMySociety error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

// POST /api/society/regenerate-code  (admin only)
async function regenerateCode(req, res) {
  try {
    const society = await prisma.society.findUnique({ where: { id: req.societyId } })
    if (!society) return res.status(404).json({ error: 'Society not found' })

    const newCode = await generateUniqueJoinCode(society.name, prisma)
    const updated = await prisma.society.update({
      where: { id: req.societyId },
      data: { joinCode: newCode },
    })
    return res.json({ society: updated })
  } catch (err) {
    console.error('regenerateCode error:', err)
    return res.status(500).json({ error: 'Something went wrong regenerating the code' })
  }
}

// PATCH /api/society/settings  (admin only) — e.g. overdue threshold
async function updateSettings(req, res) {
  try {
    const { overdueThresholdDays, name, address } = req.body
    const data = {}
    if (overdueThresholdDays !== undefined) {
      const n = Number(overdueThresholdDays)
      if (!Number.isInteger(n) || n < 1) {
        return res.status(400).json({ error: 'overdueThresholdDays must be a positive integer' })
      }
      data.overdueThresholdDays = n
    }
    if (name) data.name = name
    if (address !== undefined) data.address = address

    const updated = await prisma.society.update({
      where: { id: req.societyId },
      data,
    })
    return res.json({ society: updated })
  } catch (err) {
    console.error('updateSettings error:', err)
    return res.status(500).json({ error: 'Something went wrong updating settings' })
  }
}

module.exports = { getMySociety, regenerateCode, updateSettings }
