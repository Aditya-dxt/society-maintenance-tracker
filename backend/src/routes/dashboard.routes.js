const express = require('express')
const router = express.Router()
const { getDashboard } = require('../controllers/dashboard.controller')
const { requireAuth } = require('../middleware/auth.middleware')
const { tenantScope } = require('../middleware/tenantScope.middleware')
const { requireRole } = require('../middleware/role.middleware')

router.use(requireAuth, tenantScope, requireRole('ADMIN'))

router.get('/', getDashboard)

module.exports = router
