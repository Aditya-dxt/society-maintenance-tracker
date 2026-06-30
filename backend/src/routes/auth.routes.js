const express = require('express')
const router = express.Router()
const { adminSignup, residentSignup, login, me } = require('../controllers/auth.controller')
const { requireAuth } = require('../middleware/auth.middleware')

router.post('/admin/signup', adminSignup)     // creates a new Society + admin
router.post('/resident/signup', residentSignup) // requires a valid joinCode
router.post('/login', login)
router.get('/me', requireAuth, me)

module.exports = router
