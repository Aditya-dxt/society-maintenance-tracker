const express = require('express')
const router = express.Router()
const { getMySociety, regenerateCode, updateSettings } = require('../controllers/society.controller')
const { requireAuth } = require('../middleware/auth.middleware')
const { tenantScope } = require('../middleware/tenantScope.middleware')
const { requireRole } = require('../middleware/role.middleware')

router.use(requireAuth, tenantScope)

router.get('/', getMySociety)
router.post('/regenerate-code', requireRole('ADMIN'), regenerateCode)
router.patch('/settings', requireRole('ADMIN'), updateSettings)

module.exports = router
