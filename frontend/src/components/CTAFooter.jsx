import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function CTAFooter() {
  return (
    <>
      <section className="py-28 md:py-36 bg-paper-aged">
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-[34px] md:text-[46px] text-verandah leading-[1.1]">
              Stop tracking complaints
              <br />
              <span className="italic text-rust">in a notebook.</span>
            </h2>
            <p className="text-ink-soft text-[15.5px] mt-5 max-w-md mx-auto leading-relaxed">
              Set up your society in a few minutes. Residents and admins both get an account, free.
            </p>
            <div className="mt-9 flex items-center justify-center gap-4 flex-wrap">
              <Link
                to="/signup/admin"
                className="group relative inline-flex items-center gap-2 bg-rust text-paper px-8 py-3.5 text-[15px] font-medium overflow-hidden"
              >
                <span className="relative z-10">Set up your society</span>
                <span className="absolute inset-0 bg-verandah translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
              <Link
                to="/signup/resident"
                className="text-[15px] font-medium text-verandah border-b border-verandah/40 pb-0.5 hover:border-rust hover:text-rust transition-colors duration-300"
              >
                Join with a society code
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-ink text-paper/60 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 30 30">
              <rect x="2" y="2" width="26" height="26" rx="2" fill="none" stroke="#FAF7F0" strokeWidth="1.6"/>
              <path d="M9 19 L15 9 L21 19" stroke="#C75D3A" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="6" y1="23" x2="24" y2="23" stroke="#FAF7F0" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <span className="font-display text-[15px] text-paper">Aangan</span>
          </div>
          <p className="stamp text-[12px]">Built for societies that deserve a working noticeboard.</p>
        </div>
      </footer>
    </>
  )
}
