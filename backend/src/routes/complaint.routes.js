const express = require('express')
const router = express.Router()
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateStatus,
  updatePriority,
} = require('../controllers/complaint.controller')
const { requireAuth } = require('../middleware/auth.middleware')
const { tenantScope } = require('../middleware/tenantScope.middleware')
const { requireRole } = require('../middleware/role.middleware')
const { upload } = require('../middleware/upload.middleware')

router.use(requireAuth, tenantScope)

// Resident routes
router.post('/', requireRole('RESIDENT'), upload.single('photo'), createComplaint)
router.get('/mine', requireRole('RESIDENT'), getMyComplaints)

// Admin routes
router.get('/', requireRole('ADMIN'), getAllComplaints)
router.patch('/:id/status', requireRole('ADMIN'), updateStatus)
router.patch('/:id/priority', requireRole('ADMIN'), updatePriority)

// Shared (controller enforces resident can only view their own)
router.get('/:id', getComplaintById)

module.exports = router
