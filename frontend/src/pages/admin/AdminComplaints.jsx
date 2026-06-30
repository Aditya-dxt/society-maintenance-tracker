import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, ListChecks, Pin, Settings } from 'lucide-react'
import DashboardShell from '../../components/DashboardShell'
import { StatusBadge, PriorityDot, OverdueTag } from '../../components/StatusBadge'
import { SelectInput } from '../../components/FormElements'
import { complaintApi } from '../../api/resources'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/complaints', label: 'Complaints', icon: ListChecks },
  { to: '/admin/notices', label: 'Notices', icon: Pin },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH']
const CATEGORIES = ['Plumbing', 'Electrical', 'Lift', 'Cleanliness', 'Security', 'Parking', 'Other']

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState(null)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ status: '', category: '' })
  const [expandedId, setExpandedId] = useState(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [savingId, setSavingId] = useState(null)

  const load = useCallback(() => {
    const params = {}
    if (filters.status) params.status = filters.status
    if (filters.category) params.category = filters.category
    complaintApi
      .all(params)
      .then((res) => setComplaints(res.data.complaints))
      .catch((err) => setError(err.response?.data?.error || 'Could not load complaints'))
  }, [filters])

  useEffect(() => {
    load()
  }, [load])

  async function handleStatusChange(id, status) {
    setSavingId(id)
    try {
      await complaintApi.updateStatus(id, { status, note: noteDraft || undefined })
      setNoteDraft('')
      setExpandedId(null)
      load()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update status')
    } finally {
      setSavingId(null)
    }
  }

  async function handlePriorityChange(id, priority) {
    setSavingId(id)
    try {
      await complaintApi.updatePriority(id, { priority })
      load()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update priority')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <DashboardShell navItems={navItems}>
      <span className="stamp text-rust text-xs tracking-[0.2em] uppercase">Manage</span>
      <h1 className="font-display text-[32px] text-verandah mt-1 mb-6">Complaints</h1>

      <div className="flex gap-3 mb-8 max-w-md">
        <SelectInput value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </SelectInput>
        <SelectInput value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </SelectInput>
      </div>

      {error && <p className="text-rust text-[14px] mb-6">{error}</p>}
      {complaints === null && !error && <p className="stamp text-[13px] text-ink-soft/60 tracking-wide">LOADING…</p>}

      {complaints && complaints.length === 0 && (
        <div className="border border-dashed border-ink/20 py-20 text-center">
          <p className="font-display text-[20px] text-verandah mb-2">No complaints found</p>
          <p className="text-ink-soft text-[14.5px]">Nothing matches these filters yet.</p>
        </div>
      )}

      {complaints && complaints.length > 0 && (
        <div className="border-t border-ink/15">
          {complaints.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="border-b border-ink/15"
            >
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-4 px-2">
                {c.photoUrl ? (
                  <img src={c.photoUrl} alt="" className="w-14 h-14 object-cover shrink-0" />
                ) : (
                  <div className="w-14 h-14 bg-card shrink-0" />
                )}
                <div className="flex-1 min-w-[180px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    {c.isOverdue && <OverdueTag />}
                    <p className="stamp text-[11px] text-ink-soft uppercase tracking-wide">{c.category}</p>
                  </div>
                  <p className="font-display text-[16px] text-ink mt-0.5 truncate">{c.title}</p>
                  <p className="text-[13px] text-ink-soft mt-0.5">
                    {c.resident?.name} · Flat {c.resident?.flatNumber} ·{' '}
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>

                <SelectInput
                  value={c.priority}
                  disabled={savingId === c.id}
                  onChange={(e) => handlePriorityChange(c.id, e.target.value)}
                  className="!py-2 !text-[13px] w-28 sm:w-32"
                >
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </SelectInput>

                <StatusBadge status={c.status} />

                <button
                  onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                  className="text-[13px] text-verandah hover:text-rust transition-colors font-medium shrink-0"
                >
                  {expandedId === c.id ? 'Close' : 'Update'}
                </button>
              </div>

              {expandedId === c.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-2 pb-5 bg-card/50"
                >
                  <p className="text-[14px] text-ink-soft mb-3 pt-3 max-w-2xl">{c.description}</p>
                  <textarea
                    placeholder="Optional note about this status change…"
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    rows={2}
                    className="w-full max-w-md bg-paper border border-ink/20 px-3 py-2 text-[13.5px] mb-3 focus:outline-none focus:border-rust"
                  />
                  <div className="flex gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        disabled={savingId === c.id || s === c.status}
                        onClick={() => handleStatusChange(c.id, s)}
                        className="text-[13px] px-3 py-2 border border-ink/20 hover:border-rust hover:text-rust transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Mark {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
