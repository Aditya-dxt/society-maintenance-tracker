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
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.options(/(.*)/, cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/society', societyRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/notices', noticeRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Aangan API running on port ${PORT}`)
  recalculateOverdueFlags().catch((e) => console.error('Initial overdue check failed:', e))
  setInterval(() => {
    recalculateOverdueFlags().catch((e) => console.error('Overdue check failed:', e))
  }, 15 * 60 * 1000)
})