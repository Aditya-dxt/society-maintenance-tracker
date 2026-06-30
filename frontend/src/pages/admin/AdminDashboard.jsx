import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, ListChecks, Pin, Settings, AlertTriangle } from 'lucide-react'
import DashboardShell from '../../components/DashboardShell'
import { dashboardApi } from '../../api/resources'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/complaints', label: 'Complaints', icon: ListChecks },
  { to: '/admin/notices', label: 'Notices', icon: Pin },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

const STATUS_LABELS = { OPEN: 'Open', IN_PROGRESS: 'In Progress', RESOLVED: 'Resolved' }

function StatCard({ label, value, accent, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card border border-ink/10 p-6"
    >
      <p className="stamp text-[11px] text-ink-soft uppercase tracking-wide mb-2">{label}</p>
      <p className={`font-display text-[40px] leading-none ${accent || 'text-verandah'}`}>{value}</p>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    dashboardApi
      .get()
      .then((res) => {
        if (!cancelled) setData(res.data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error || 'Could not load dashboard')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <DashboardShell navItems={navItems}>
      <span className="stamp text-rust text-xs tracking-[0.2em] uppercase">Overview</span>
      <h1 className="font-display text-[32px] text-verandah mt-1 mb-8">Dashboard</h1>

      {error && <p className="text-rust text-[14px]">{error}</p>}
      {!data && !error && <p className="stamp text-[13px] text-ink-soft/60 tracking-wide">LOADING…</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <StatCard label="Total Complaints" value={data.total} delay={0} />
            <StatCard label="Overdue" value={data.overdueCount} accent="text-rust" delay={0.06} />
            {data.byStatus.map((s, i) => (
              <StatCard
                key={s.status}
                label={STATUS_LABELS[s.status] || s.status}
                value={s.count}
                delay={0.12 + i * 0.06}
              />
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <span className="stamp text-rust text-xs tracking-[0.2em] uppercase">By category</span>
              <div className="mt-4 space-y-3">
                {data.byCategory.length === 0 && (
                  <p className="text-ink-soft text-[14px]">No complaints yet.</p>
                )}
                {data.byCategory.map((c) => {
                  const max = Math.max(...data.byCategory.map((x) => x.count), 1)
                  return (
                    <div key={c.category}>
                      <div className="flex justify-between text-[13.5px] mb-1">
                        <span className="text-ink">{c.category}</span>
                        <span className="stamp text-ink-soft">{c.count}</span>
                      </div>
                      <div className="h-2 bg-card">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(c.count / max) * 100}%` }}
                          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full bg-rust"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {data.overdueCount > 0 && (
              <div className="bg-rust/10 border border-rust/30 p-6 h-fit">
                <div className="flex items-center gap-2 text-rust mb-2">
                  <AlertTriangle size={18} />
                  <span className="font-display text-[18px]">Needs attention</span>
                </div>
                <p className="text-[14px] text-ink-soft leading-relaxed">
                  {data.overdueCount} complaint{data.overdueCount !== 1 ? 's are' : ' is'} overdue. Check the
                  complaints queue — overdue items surface at the top automatically.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
