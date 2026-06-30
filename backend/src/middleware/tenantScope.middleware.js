// THE data-isolation guard. Must run after requireAuth on every protected route.
//
// req.societyId is set ONLY from the verified JWT (req.user.societyId) —
// never from req.body, req.query, or req.params. Every controller in this
// app must filter its Prisma queries using req.societyId, with no exceptions.
//
// This is what guarantees Society A can never see Society B's complaints,
// notices, or users, even if a client tries to pass a different societyId
// in the request.
function tenantScope(req, res, next) {
  if (!req.user || !req.user.societyId) {
    return res.status(403).json({ error: 'No society context on this account' })
  }
  req.societyId = req.user.societyId
  next()
}

module.exports = { tenantScope }
