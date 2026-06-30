const express = require('express')
const router = express.Router()
const { getNotices, createNotice, deleteNotice } = require('../controllers/notice.controller')
const { requireAuth } = require('../middleware/auth.middleware')
const { tenantScope } = require('../middleware/tenantScope.middleware')
const { requireRole } = require('../middleware/role.middleware')

router.use(requireAuth, tenantScope)

router.get('/', getNotices)
router.post('/', requireRole('ADMIN'), createNotice)
router.delete('/:id', requireRole('ADMIN'), deleteNotice)

module.exports = router
