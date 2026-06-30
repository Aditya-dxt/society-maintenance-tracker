const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../prismaClient')
const { generateUniqueJoinCode } = require('../services/code.service')

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, societyId: user.societyId, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

function publicUser(user, society) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    flatNumber: user.flatNumber,
    society: society ? { id: society.id, name: society.name, joinCode: society.joinCode } : undefined,
  }
}

// POST /api/auth/admin/signup
// Creates a brand-new Society AND its first admin account in one transaction.
// Only this endpoint can create a society — residents can never create one.
async function adminSignup(req, res) {
  try {
    const { name, email, password, societyName, address } = req.body

    if (!name || !email || !password || !societyName) {
      return res.status(400).json({ error: 'name, email, password, and societyName are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    const joinCode = await generateUniqueJoinCode(societyName, prisma)
    const passwordHash = await bcrypt.hash(password, 10)

    const { society, admin } = await prisma.$transaction(async (tx) => {
      const society = await tx.society.create({
        data: { name: societyName, address, joinCode },
      })
      const admin = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'ADMIN',
          societyId: society.id,
        },
      })
      return { society, admin }
    })

    const token = signToken({ ...admin, societyId: society.id })
    return res.status(201).json({ token, user: publicUser(admin, society) })
  } catch (err) {
    console.error('adminSignup error:', err)
    return res.status(500).json({ error: 'Something went wrong creating your society' })
  }
}

// POST /api/auth/resident/signup
// Requires a valid society joinCode. No code => no account.
async function residentSignup(req, res) {
  try {
    const { name, email, password, flatNumber, joinCode } = req.body

    if (!name || !email || !password || !joinCode) {
      return res.status(400).json({ error: 'name, email, password, and joinCode are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    const society = await prisma.society.findUnique({ where: { joinCode: joinCode.trim().toUpperCase() } })
    if (!society) {
      return res.status(404).json({ error: 'Invalid society code. Check with your admin and try again.' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const resident = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'RESIDENT',
        flatNumber,
        societyId: society.id,
      },
    })

    const token = signToken({ ...resident, societyId: society.id })
    return res.status(201).json({ token, user: publicUser(resident, society) })
  } catch (err) {
    console.error('residentSignup error:', err)
    return res.status(500).json({ error: 'Something went wrong creating your account' })
  }
}

// POST /api/auth/login
// Shared login for both roles — role and society come from the stored user record.
async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { society: true },
    })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = signToken(user)
    return res.json({ token, user: publicUser(user, user.society) })
  } catch (err) {
    console.error('login error:', err)
    return res.status(500).json({ error: 'Something went wrong logging you in' })
  }
}

// GET /api/auth/me
async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { society: true },
    })
    if (!user) return res.status(404).json({ error: 'User not found' })
    return res.json({ user: publicUser(user, user.society) })
  } catch (err) {
    console.error('me error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

module.exports = { adminSignup, residentSignup, login, me }
