require('dotenv').config()
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')
const societyRoutes = require('./routes/society.routes')
const complaintRoutes = require('./routes/complaint.routes')
const noticeRoutes = require('./routes/notice.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
const { recalculateOverdueFlags } = require('./services/overdue.service')

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
}))
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/society', societyRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/notices', noticeRoutes)
app.use('/api/dashboard', dashboardRoutes)

// 404 fallback
app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

// Central error handler (e.g. multer file-type/size errors)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Aangan API running on port ${PORT}`)

  // Recalculate overdue flags every 15 minutes. For production, prefer a
  // dedicated cron job (Render Cron, GitHub Actions, etc.) over an in-process
  // timer, since this resets if the server restarts/sleeps on free tiers.
  recalculateOverdueFlags().catch((e) => console.error('Initial overdue check failed:', e))
  setInterval(() => {
    recalculateOverdueFlags().catch((e) => console.error('Overdue check failed:', e))
  }, 15 * 60 * 1000)
})
