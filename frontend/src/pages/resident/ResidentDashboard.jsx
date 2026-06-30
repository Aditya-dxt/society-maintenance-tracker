import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, PlusCircle, Pin, ChevronRight } from 'lucide-react'
import DashboardShell from '../../components/DashboardShell'
import { StatusBadge } from '../../components/StatusBadge'
import { complaintApi } from '../../api/resources'

const navItems = [
  { to: '/resident', label: 'My Complaints', icon: Home, end: true },
  { to: '/resident/raise', label: 'Raise Complaint', icon: PlusCircle },
  { to: '/resident/notices', label: 'Notice Board', icon: Pin },
]

export default function ResidentDashboard() {
  const [complaints, setComplaints] = useState(null) // null = loading
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    complaintApi
      .mine()
      .then((res) => {
        if (!cancelled) setComplaints(res.data.complaints)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error || 'Could not load your complaints')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <DashboardShell navItems={navItems}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="stamp text-rust text-xs tracking-[0.2em] uppercase">Your complaints</span>
          <h1 className="font-display text-[32px] text-verandah mt-1">My Complaints</h1>
        </div>
        <Link
          to="/resident/raise"
          className="group relative inline-flex items-center gap-2 bg-verandah text-paper px-5 py-2.5 text-[14.5px] font-medium overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <PlusCircle size={16} /> Raise a complaint
          </span>
          <span className="absolute inset-0 bg-rust translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        </Link>
      </div>

      {error && <p className="text-rust text-[14px] mb-6">{error}</p>}

      {complaints === null && !error && (
        <p className="stamp text-[13px] text-ink-soft/60 tracking-wide">LOADING…</p>
      )}

      {complaints && complaints.length === 0 && (
        <div className="border border-dashed border-ink/20 py-20 text-center">
          <p className="font-display text-[20px] text-verandah mb-2">No complaints yet</p>
          <p className="text-ink-soft text-[14.5px] mb-6">
            Raised something that needs fixing? Log it and track it here.
          </p>
          <Link
            to="/resident/raise"
            className="inline-block text-rust border-b border-rust/40 hover:border-rust transition-colors text-[14.5px] font-medium"
          >
            Raise your first complaint
          </Link>
        </div>
      )}

      {complaints && complaints.length > 0 && (
        <div className="border-t border-ink/15">
          {complaints.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to={`/resident/complaints/${c.id}`}
                className="flex items-center gap-5 py-5 border-b border-ink/15 hover:bg-card/50 transition-colors duration-200 group px-2"
              >
                {c.photoUrl ? (
                  <img src={c.photoUrl} alt="" className="w-16 h-16 object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-card shrink-0 flex items-center justify-center">
                    <span className="stamp text-[10px] text-ink-soft/50">NO PHOTO</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="stamp text-[11px] text-ink-soft uppercase tracking-wide">{c.category}</p>
                  <p className="font-display text-[17px] text-ink mt-0.5 truncate group-hover:text-rust transition-colors">
                    {c.title}
                  </p>
                  <p className="text-[13px] text-ink-soft mt-1">
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <StatusBadge status={c.status} />
                <ChevronRight size={18} className="text-ink-soft/40 group-hover:text-rust transition-colors shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
