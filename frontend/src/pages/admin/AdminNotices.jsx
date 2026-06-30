import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, ListChecks, Pin, Settings, Trash2 } from 'lucide-react'
import DashboardShell from '../../components/DashboardShell'
import { FormField, TextInput, TextArea, PrimaryButton } from '../../components/FormElements'
import { noticeApi } from '../../api/resources'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/complaints', label: 'Complaints', icon: ListChecks },
  { to: '/admin/notices', label: 'Notices', icon: Pin },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminNotices() {
  const [notices, setNotices] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', content: '', isImportant: false })
  const [posting, setPosting] = useState(false)

  const load = useCallback(() => {
    noticeApi
      .list()
      .then((res) => setNotices(res.data.notices))
      .catch((err) => setError(err.response?.data?.error || 'Could not load notices'))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setPosting(true)
    try {
      await noticeApi.create(form)
      setForm({ title: '', content: '', isImportant: false })
      load()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not post notice')
    } finally {
      setPosting(false)
    }
  }

  async function handleDelete(id) {
    try {
      await noticeApi.remove(id)
      load()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete notice')
    }
  }

  return (
    <DashboardShell navItems={navItems}>
      <span className="stamp text-rust text-xs tracking-[0.2em] uppercase">Announcements</span>
      <h1 className="font-display text-[32px] text-verandah mt-1 mb-8">Notice Board</h1>

      <div className="grid md:grid-cols-[380px_1fr] gap-10">
        <form onSubmit={handleSubmit} className="bg-card border border-ink/10 p-6 h-fit">
          <p className="font-display text-[18px] text-verandah mb-5">Post a notice</p>

          <FormField label="Title">
            <TextInput
              required
              placeholder="e.g. AGM scheduled for July 12"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </FormField>

          <FormField label="Content">
            <TextArea
              required
              rows={4}
              placeholder="Details for residents…"
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            />
          </FormField>

          <label className="flex items-center gap-2.5 mb-5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isImportant}
              onChange={(e) => setForm((f) => ({ ...f, isImportant: e.target.checked }))}
              className="accent-rust w-4 h-4"
            />
            <span className="text-[14px] text-ink">
              Mark as important <span className="text-ink-soft">(pins it + emails residents)</span>
            </span>
          </label>

          {error && <p className="text-rust text-[13.5px] mb-4">{error}</p>}

          <PrimaryButton type="submit" loading={posting}>
            Post notice
          </PrimaryButton>
        </form>

        <div>
          {notices === null && !error && <p className="stamp text-[13px] text-ink-soft/60 tracking-wide">LOADING…</p>}
          {notices && notices.length === 0 && (
            <div className="border border-dashed border-ink/20 py-16 text-center">
              <p className="text-ink-soft text-[14.5px]">No notices posted yet.</p>
            </div>
          )}
          {notices && notices.length > 0 && (
            <div className="space-y-3">
              {notices.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className={`flex items-start gap-4 p-5 border border-ink/10 ${n.isImportant ? 'bg-marigold/10' : 'bg-card'}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {n.isImportant && <Pin size={13} className="text-rust -rotate-45" />}
                      <p className="font-display text-[16px] text-ink">{n.title}</p>
                    </div>
                    <p className="text-[13.5px] text-ink-soft mt-1.5 leading-relaxed">{n.content}</p>
                    <p className="stamp text-[11px] text-ink-soft/60 mt-2">
                      {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-ink-soft/50 hover:text-rust transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
