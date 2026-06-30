import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RequireAuth, RequireRole } from './components/RouteGuards'

// Marketing/landing
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import NoticeBoard from './components/NoticeBoard'
import CTAFooter from './components/CTAFooter'

// Auth
import Login from './pages/auth/Login'
import AdminSignup from './pages/auth/AdminSignup'
import ResidentSignup from './pages/auth/ResidentSignup'

// Resident
import ResidentDashboard from './pages/resident/ResidentDashboard'
import RaiseComplaint from './pages/resident/RaiseComplaint'
import ComplaintDetail from './pages/resident/ComplaintDetail'
import ResidentNoticeBoard from './pages/resident/ResidentNoticeBoard'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminComplaints from './pages/admin/AdminComplaints'
import AdminNotices from './pages/admin/AdminNotices'
import AdminSettings from './pages/admin/AdminSettings'

function Landing() {
  return (
    <div className="bg-paper min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <NoticeBoard />
      <CTAFooter />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/admin" element={<AdminSignup />} />
          <Route path="/signup/resident" element={<ResidentSignup />} />

          {/* Resident — protected */}
          <Route element={<RequireAuth />}>
            <Route element={<RequireRole role="RESIDENT" />}>
              <Route path="/resident" element={<ResidentDashboard />} />
              <Route path="/resident/raise" element={<RaiseComplaint />} />
              <Route path="/resident/complaints/:id" element={<ComplaintDetail />} />
              <Route path="/resident/notices" element={<ResidentNoticeBoard />} />
            </Route>

            {/* Admin — protected */}
            <Route element={<RequireRole role="ADMIN" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />
              <Route path="/admin/notices" element={<AdminNotices />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
