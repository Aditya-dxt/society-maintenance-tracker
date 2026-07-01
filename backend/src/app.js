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

// Explicit CORS — list every origin that's allowed to call this API.
// Add your Vercel URL to ALLOWED_ORIGINS in your backend's environment variables.
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : []),
]

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true)
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true)
    callback(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
// Handle preflight for all routes
app.options('*', cors(corsOptions))
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