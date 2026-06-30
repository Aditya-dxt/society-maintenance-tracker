import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, ListChecks, Pin, Settings, RefreshCw, Copy, Check } from 'lucide-react'
import DashboardShell from '../../components/DashboardShell'
import { FormField, TextInput, PrimaryButton } from '../../components/FormElements'
import { societyApi } from '../../api/resources'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/complaints', label: 'Complaints', icon: ListChecks },
  { to: '/admin/notices', label: 'Notices', icon: Pin },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSettings() {
  const [society, setSociety] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [threshold, setThreshold] = useState('')
  const [savingThreshold, setSavingThreshold] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  function load() {
    societyApi
      .mine()
      .then((res) => {
        setSociety(res.data.society)
        setThreshold(String(res.data.society.overdueThresholdDays))
      })
      .catch((err) => setError(err.response?.data?.error || 'Could not load society settings'))
  }

  useEffect(() => {
    load()
  }, [])

  async function handleRegenerate() {
    setError('')
    setSuccess('')
    setRegenerating(true)
    try {
      const res = await societyApi.regenerateCode()
      setSociety(res.data.society)
      setSuccess('New code generated. Share it with residents — the old code no longer works.')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not regenerate code')
    } finally {
      setRegenerating(false)
    }
  }

  async function handleThresholdSave(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSavingThreshold(true)
    try {
      const res = await societyApi.updateSettings({ overdueThresholdDays: Number(threshold) })
      setSociety(res.data.society)
      setSuccess('Overdue threshold updated.')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update settings')
    } finally {
      setSavingThreshold(false)
    }
  }

  function handleCopy() {
    if (!society) return
    navigator.clipboard.writeText(society.joinCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardShell navItems={navItems}>
      <span className="stamp text-rust text-xs tracking-[0.2em] uppercase">Society</span>
      <h1 className="font-display text-[32px] text-verandah mt-1 mb-8">Settings</h1>

      {error && <p className="text-rust text-[14px] mb-6">{error}</p>}
      {success && <p className="text-verandah text-[14px] mb-6">{success}</p>}

      {!society && !error && <p className="stamp text-[13px] text-ink-soft/60 tracking-wide">LOADING…</p>}

      {society && (
        <div className="max-w-xl space-y-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="font-display text-[18px] text-verandah mb-1">{society.name}</p>
            {society.address && <p className="text-[14px] text-ink-soft mb-5">{society.address}</p>}

            <p className="stamp text-[11px] text-ink-soft uppercase tracking-wide mb-2">Join code for residents</p>
            <div className="flex items-center gap-3">
              <div className="bg-card border border-ink/10 px-5 py-3 flex-1">
                <span className="stamp text-[22px] text-rust tracking-[0.12em]">{society.joinCode}</span>
              </div>
              <button
                onClick={handleCopy}
                className="p-3 border border-ink/15 hover:border-rust hover:text-rust transition-colors"
                title="Copy code"
              >
                {copied ? <Check size={17} /> : <Copy size={17} />}
              </button>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="p-3 border border-ink/15 hover:border-rust hover:text-rust transition-colors disabled:opacity-50"
                title="Regenerate code"
              >
                <RefreshCw size={17} className={regenerating ? 'animate-spin' : ''} />
              </button>
            </div>
            <p className="text-[12.5px] text-ink-soft mt-2">
              Regenerating immediately invalidates the old code — residents will need the new one to join.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleThresholdSave}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="border-t border-ink/15 pt-8"
          >
            <p className="font-display text-[18px] text-verandah mb-1">Overdue threshold</p>
            <p className="text-[14px] text-ink-soft mb-4">
              Complaints still open past this many days are automatically flagged as overdue.
            </p>
            <div className="flex items-center gap-3 max-w-xs">
              <TextInput
                type="number"
                min={1}
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
              />
              <span className="text-[14px] text-ink-soft whitespace-nowrap">days</span>
            </div>
            <PrimaryButton type="submit" loading={savingThreshold} className="max-w-xs mt-4">
              Save
            </PrimaryButton>
          </motion.form>
        </div>
      )}
    </DashboardShell>
  )
}
