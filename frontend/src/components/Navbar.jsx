import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-paper/90 backdrop-blur-md border-b border-ink/10 py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 group">
          <svg width="30" height="30" viewBox="0 0 30 30" className="shrink-0">
            <rect x="2" y="2" width="26" height="26" rx="2" fill="none" stroke="#1C3829" strokeWidth="1.6"/>
            <path d="M9 19 L15 9 L21 19" stroke="#C75D3A" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="6" y1="23" x2="24" y2="23" stroke="#1C3829" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <span className="font-display text-xl tracking-tight text-verandah">Aangan</span>
        </a>

        <nav className="hidden md:flex items-center gap-9 font-body text-[14.5px] text-ink-soft">
          <a href="#how" className="relative hover:text-verandah transition-colors duration-300 nav-link">How it works</a>
          <a href="#features" className="relative hover:text-verandah transition-colors duration-300 nav-link">Features</a>
          <a href="#board" className="relative hover:text-verandah transition-colors duration-300 nav-link">Notice board</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline-block text-[14.5px] font-medium text-ink-soft hover:text-verandah transition-colors duration-300"
          >
            Log in
          </Link>
          <Link
            to="/signup/resident"
            className="group relative inline-flex items-center gap-2 bg-verandah text-paper px-5 py-2.5 text-[14.5px] font-medium overflow-hidden"
          >
            <span className="relative z-10">Get started</span>
            <span className="absolute inset-0 bg-rust translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </Link>
        </div>
      </div>

      <style>{`
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -4px;
          width: 0; height: 1.5px;
          background: #C75D3A;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }
      `}</style>
    </motion.header>
  )
}
