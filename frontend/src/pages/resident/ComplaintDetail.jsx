import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, PlusCircle, Pin, ArrowLeft } from 'lucide-react'
import DashboardShell from '../../components/DashboardShell'
import { StatusBadge, PriorityDot } from '../../components/StatusBadge'
import { complaintApi } from '../../api/resources'

const navItems = [
  { to: '/resident', label: 'My Complaints', icon: Home, end: true },
  { to: '/resident/raise', label: 'Raise Complaint', icon: PlusCircle },
  { to: '/resident/notices', label: 'Notice Board', icon: Pin },
]

export default function ComplaintDetail() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    complaintApi
      .byId(id)
      .then((res) => {
        if (!cancelled) setComplaint(res.data.complaint)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error || 'Could not load this complaint')
      })
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <DashboardShell navItems={navItems}>
      <Link
        to="/resident"
        className="inline-flex items-center gap-1.5 text-[14px] text-ink-soft hover:text-rust transition-colors mb-6"
      >
        <ArrowLeft size={15} /> Back to my complaints
      </Link>

      {error && <p className="text-rust text-[14px]">{error}</p>}
      {!complaint && !error && <p className="stamp text-[13px] text-ink-soft/60 tracking-wide">LOADING…</p>}

      {complaint && (
        <div className="grid md:grid-cols-[1fr_320px] gap-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="stamp text-[11px] text-ink-soft uppercase tracking-wide">{complaint.category}</span>
              <StatusBadge status={complaint.status} />
              <PriorityDot priority={complaint.priority} />
            </div>
            <h1 className="font-display text-[28px] text-verandah leading-snug">{complaint.title}</h1>
            <p className="text-[15px] text-ink-soft leading-relaxed mt-4">{complaint.description}</p>

            {complaint.photoUrl && (
              <img
                src={complaint.photoUrl}
                alt="Complaint"
                className="mt-6 w-full max-w-md object-cover border border-ink/10"
              />
            )}

            <div className="mt-12">
              <span className="stamp text-rust text-xs tracking-[0.2em] uppercase">History</span>
              <div className="mt-4 border-l-2 border-ink/15 pl-6 space-y-7">
                {complaint.history.map((h, i) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="relative"
                  >
                    <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-rust rounded-full" />
                    <p className="font-display text-[16px] text-ink">
                      {h.oldStatus ? `${h.oldStatus.replace('_', ' ')} → ` : ''}
                      {h.newStatus.replace('_', ' ')}
                    </p>
                    {h.note && <p className="text-[14px] text-ink-soft mt-1">{h.note}</p>}
                    <p className="stamp text-[12px] text-ink-soft/60 mt-1.5">
                      {new Date(h.changedAt).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                      {h.changedBy?.name ? ` · ${h.changedBy.name}` : ''}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <aside className="bg-card border border-ink/10 p-5 h-fit">
            <p className="stamp text-[11px] text-ink-soft uppercase tracking-wide mb-1">Raised on</p>
            <p className="text-[14.5px] text-ink mb-4">
              {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {complaint.resolvedAt && (
              <>
                <p className="stamp text-[11px] text-ink-soft uppercase tracking-wide mb-1">Resolved on</p>
                <p className="text-[14.5px] text-ink">
                  {new Date(complaint.resolvedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </>
            )}
          </aside>
        </div>
      )}
    </DashboardShell>
  )
}
