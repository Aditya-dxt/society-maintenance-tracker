import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, PlusCircle, Pin } from 'lucide-react'
import DashboardShell from '../../components/DashboardShell'
import { noticeApi } from '../../api/resources'

const navItems = [
  { to: '/resident', label: 'My Complaints', icon: Home, end: true },
  { to: '/resident/raise', label: 'Raise Complaint', icon: PlusCircle },
  { to: '/resident/notices', label: 'Notice Board', icon: Pin },
]

export default function ResidentNoticeBoard() {
  const [notices, setNotices] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    noticeApi
      .list()
      .then((res) => {
        if (!cancelled) setNotices(res.data.notices)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error || 'Could not load notices')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <DashboardShell navItems={navItems}>
      <span className="stamp text-rust text-xs tracking-[0.2em] uppercase">Society announcements</span>
      <h1 className="font-display text-[32px] text-verandah mt-1 mb-8">Notice Board</h1>

      {error && <p className="text-rust text-[14px]">{error}</p>}
      {notices === null && !error && <p className="stamp text-[13px] text-ink-soft/60 tracking-wide">LOADING…</p>}

      {notices && notices.length === 0 && (
        <div className="border border-dashed border-ink/20 py-20 text-center">
          <p className="font-display text-[20px] text-verandah mb-2">No notices yet</p>
          <p className="text-ink-soft text-[14.5px]">Your admin hasn't posted anything yet.</p>
        </div>
      )}

      {notices && notices.length > 0 && (
        <div className="bg-card border border-ink/10">
          {notices.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`flex items-start gap-4 px-6 py-5 border-b last:border-b-0 border-ink/10 ${
                n.isImportant ? 'bg-marigold/10' : ''
              }`}
            >
              {n.isImportant ? (
                <Pin size={16} className="text-rust shrink-0 -rotate-45 mt-1" />
              ) : (
                <span className="w-4 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-display text-[17px] text-ink">{n.title}</p>
                <p className="text-[14px] text-ink-soft mt-1.5 leading-relaxed">{n.content}</p>
                <p className="stamp text-[11px] text-ink-soft/60 mt-2.5">
                  {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {n.postedBy?.name ? ` · ${n.postedBy.name}` : ''}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
