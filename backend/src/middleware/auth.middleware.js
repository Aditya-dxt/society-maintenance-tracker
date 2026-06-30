const jwt = require('jsonwebtoken')

// Verifies the JWT and attaches the decoded payload to req.user.
// The token payload is the ONLY source of truth for who the user is —
// nothing here ever trusts req.body for identity or societyId.
function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }

  const token = header.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload // { id, role, societyId, email }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = { requireAuth }
