import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth() {
  const { user, loading } = useAuth()
  if (loading) return <FullPageLoader />
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export function RequireRole({ role }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/resident'} replace />
  }
  return <Outlet />
}

function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <span className="stamp text-sm text-verandah/60 tracking-widest">LOADING…</span>
    </div>
  )
}
