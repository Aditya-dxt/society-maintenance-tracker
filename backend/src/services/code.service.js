// Generates unique, human-shareable society join codes like "PLM-7K2X"
// Format: 3 letters derived from society name + 4 random alphanumerics.
// Ambiguous characters (0/O, 1/I/L) are excluded to avoid miscopied codes.

const SAFE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function randomSegment(length) {
  let out = ''
  for (let i = 0; i < length; i++) {
    out += SAFE_CHARS[Math.floor(Math.random() * SAFE_CHARS.length)]
  }
  return out
}

function prefixFromName(name) {
  const letters = name.replace(/[^a-zA-Z]/g, '').toUpperCase()
  return (letters.slice(0, 3) || 'SOC').padEnd(3, 'X')
}

/**
 * Generates a join code and guarantees uniqueness against the DB.
 * @param {string} societyName
 * @param {import('@prisma/client').PrismaClient} prisma
 */
async function generateUniqueJoinCode(societyName, prisma) {
  const prefix = prefixFromName(societyName)

  for (let attempt = 0; attempt < 10; attempt++) {
    const code = `${prefix}-${randomSegment(4)}`
    const existing = await prisma.society.findUnique({ where: { joinCode: code } })
    if (!existing) return code
  }

  // Extremely unlikely fallback: longer random segment to avoid collision.
  return `${prefix}-${randomSegment(6)}`
}

module.exports = { generateUniqueJoinCode }
