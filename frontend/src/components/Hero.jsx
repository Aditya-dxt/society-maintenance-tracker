import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const pinnedCards = [
  {
    rot: -4,
    top: '6%',
    left: '4%',
    type: 'notice',
    title: 'Water supply shut 11am–2pm, Wed',
    tag: 'IMPORTANT',
  },
  {
    rot: 3,
    top: '54%',
    left: '2%',
    type: 'complaint',
    title: 'Lift B making grinding noise',
    status: 'In Progress',
  },
  {
    rot: -2.5,
    top: '14%',
    right: '3%',
    type: 'complaint',
    title: 'Common area light, Block C',
    status: 'Resolved',
  },
  {
    rot: 4.5,
    top: '62%',
    right: '6%',
    type: 'notice',
    title: 'Diwali cleaning drive — Sat 9am',
    tag: '',
  },
]

const statusColor = {
  'In Progress': 'bg-marigold/20 text-rust-dark border-rust/30',
  'Resolved': 'bg-verandah/10 text-verandah border-verandah/30',
}

function Card({ c, delay }) {
  const isNotice = c.type === 'notice'
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: c.rot }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute',
        top: c.top,
        left: c.left,
        right: c.right,
        '--rot': `${c.rot}deg`,
      }}
      className="sway pin-shadow w-[200px] md:w-[230px] bg-card border border-ink/10 p-4 hidden sm:block"
    >
      {/* pin */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-rust shadow-md" />
      {isNotice && c.tag && (
        <span className="stamp inline-block text-[10px] text-rust border border-rust/50 px-1.5 py-0.5 mb-2 -rotate-2">
          {c.tag}
        </span>
      )}
      {!isNotice && (
        <span className={`stamp inline-block text-[10px] border px-1.5 py-0.5 mb-2 ${statusColor[c.status]}`}>
          {c.status.toUpperCase()}
        </span>
      )}
      <p className="font-display text-[15px] leading-snug text-ink">{c.title}</p>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section id="top" className="relative pt-36 pb-28 md:pt-44 md:pb-40 overflow-hidden">
      {/* faint board texture backdrop */}
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <div className="relative min-h-[520px] md:min-h-[600px] flex items-center justify-center">

          {pinnedCards.map((c, i) => (
            <Card c={c} key={i} delay={0.3 + i * 0.15} />
          ))}

          {/* center headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-center max-w-2xl"
          >
            <span className="stamp text-rust text-xs tracking-[0.2em] uppercase">
              The society notice board, finally organised
            </span>
            <h1 className="font-display text-[44px] sm:text-[58px] md:text-[68px] leading-[1.04] text-verandah mt-4 tracking-tight">
              Every complaint,
              <br />
              <span className="italic text-rust">tracked end to end.</span>
            </h1>
            <p className="font-body text-[16.5px] md:text-[17.5px] text-ink-soft mt-6 max-w-md mx-auto leading-relaxed">
              Residents raise it with a photo. Admins prioritise and resolve it.
              Everyone sees what's pending, what's overdue, and what's done —
              no more lost WhatsApp messages.
            </p>

            <div className="mt-9 flex items-center justify-center gap-4">
              <Link
                to="/signup/admin"
                className="group relative inline-flex items-center gap-2 bg-verandah text-paper px-7 py-3.5 text-[15px] font-medium overflow-hidden"
              >
                <span className="relative z-10">Set up your society</span>
                <span className="absolute inset-0 bg-rust translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
              <a
                href="#how"
                className="text-[15px] font-medium text-verandah border-b border-verandah/40 pb-0.5 hover:border-rust hover:text-rust transition-colors duration-300"
              >
                See how it works
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
