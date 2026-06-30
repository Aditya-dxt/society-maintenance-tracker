import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-paper grain flex">
      <div className="w-full max-w-md mx-auto flex flex-col justify-center px-6 py-16">
        <Link to="/" className="flex items-center gap-2.5 mb-10">
          <svg width="28" height="28" viewBox="0 0 30 30">
            <rect x="2" y="2" width="26" height="26" rx="2" fill="none" stroke="#1C3829" strokeWidth="1.6"/>
            <path d="M9 19 L15 9 L21 19" stroke="#C75D3A" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="6" y1="23" x2="24" y2="23" stroke="#1C3829" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <span className="font-display text-xl tracking-tight text-verandah">Aangan</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="stamp text-rust text-xs tracking-[0.2em] uppercase">{eyebrow}</span>
          <h1 className="font-display text-[32px] text-verandah mt-2 leading-tight">{title}</h1>
          {subtitle && <p className="text-ink-soft text-[14.5px] mt-2 leading-relaxed">{subtitle}</p>}

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-7 text-center text-[14px] text-ink-soft">{footer}</div>}
        </motion.div>
      </div>
    </div>
  )
}
