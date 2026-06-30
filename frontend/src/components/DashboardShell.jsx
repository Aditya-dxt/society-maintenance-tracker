import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function DashboardShell({ navItems, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const sidebarContent = (
    <>
      <div className="px-6 py-6 border-b border-paper/10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 30 30">
              <rect x="2" y="2" width="26" height="26" rx="2" fill="none" stroke="#FAF7F0" strokeWidth="1.6"/>
              <path d="M9 19 L15 9 L21 19" stroke="#C75D3A" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="6" y1="23" x2="24" y2="23" stroke="#FAF7F0" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <span className="font-display text-lg">Aangan</span>
          </div>
          {user?.society?.name && (
            <p className="stamp text-[11px] text-paper/60 mt-2 tracking-wide truncate">{user.society.name}</p>
          )}
        </div>
        <button onClick={() => setMobileOpen(false)} className="md:hidden text-paper/70">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-[14.5px] font-medium transition-colors duration-200 ${
                isActive ? 'bg-paper/10 text-paper' : 'text-paper/65 hover:text-paper hover:bg-paper/5'
              }`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-5 border-t border-paper/10">
        <div className="px-3 mb-3">
          <p className="text-[14px] font-medium text-paper truncate">{user?.name}</p>
          <p className="stamp text-[11px] text-paper/50 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 text-[14px] text-paper/65 hover:text-rust transition-colors duration-200 w-full"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-verandah text-paper flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 30 30">
            <rect x="2" y="2" width="26" height="26" rx="2" fill="none" stroke="#FAF7F0" strokeWidth="1.6"/>
            <path d="M9 19 L15 9 L21 19" stroke="#C75D3A" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="6" y1="23" x2="24" y2="23" stroke="#FAF7F0" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <span className="font-display text-base">Aangan</span>
        </div>
        <button onClick={() => setMobileOpen(true)}>
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-ink/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static on desktop */}
      <aside
        className={`w-64 shrink-0 bg-verandah text-paper flex flex-col h-screen fixed md:sticky top-0 z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 pt-16 md:pt-0">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-10">{children}</div>
      </main>
    </div>
  )
}
