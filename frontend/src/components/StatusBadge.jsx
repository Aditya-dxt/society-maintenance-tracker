const STATUS_STYLES = {
  OPEN: 'bg-rust/10 text-rust-dark border-rust/30',
  IN_PROGRESS: 'bg-marigold/20 text-rust-dark border-marigold/40',
  RESOLVED: 'bg-verandah/10 text-verandah border-verandah/30',
}

const STATUS_LABELS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
}

export function StatusBadge({ status }) {
  return (
    <span className={`stamp inline-block text-[11px] border px-2 py-1 ${STATUS_STYLES[status] || ''}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

const PRIORITY_STYLES = {
  LOW: 'text-ink-soft',
  MEDIUM: 'text-marigold',
  HIGH: 'text-rust',
}

export function PriorityDot({ priority }) {
  return (
    <span className={`stamp text-[11px] inline-flex items-center gap-1.5 ${PRIORITY_STYLES[priority] || ''}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {priority}
    </span>
  )
}

export function OverdueTag() {
  return (
    <span className="stamp inline-flex items-center gap-1 text-[11px] bg-rust text-paper px-2 py-1">
      OVERDUE
    </span>
  )
}