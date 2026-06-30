import { motion } from 'framer-motion'
import { Pin } from 'lucide-react'

const notices = [
  { important: true, title: 'AGM scheduled for July 12, 7pm — Community Hall', date: 'Jun 28' },
  { important: true, title: 'Water tank cleaning, Wed — supply affected 11am–2pm', date: 'Jun 27' },
  { important: false, title: 'New visitor parking rules effective from next week', date: 'Jun 24' },
  { important: false, title: 'Lift B annual maintenance completed', date: 'Jun 20' },
  { important: false, title: 'Diwali cleaning drive — volunteers needed', date: 'Jun 18' },
]

export default function NoticeBoard() {
  return (
    <section id="board" className="py-28 md:py-36 bg-verandah relative overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none opacity-50" />
      <div className="max-w-5xl mx-auto px-6 md:px-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="stamp text-marigold text-xs tracking-[0.2em] uppercase">No more missed announcements</span>
          <h2 className="font-display text-[36px] md:text-[44px] text-paper mt-3 leading-[1.1]">
            One board, everyone sees it
          </h2>
          <p className="text-paper/70 text-[15.5px] mt-4 max-w-md mx-auto leading-relaxed">
            Important notices are pinned to the top and emailed to every resident the moment they're posted.
          </p>
        </motion.div>

        <div className="bg-paper p-3 md:p-4 shadow-2xl">
          {notices.map((n, i) => (
            <motion.div
              key={n.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`group flex items-center gap-4 px-4 md:px-6 py-4 border-b last:border-b-0 border-ink/10 hover:bg-card/60 transition-colors duration-300 ${
                n.important ? 'bg-marigold/10' : ''
              }`}
            >
              {n.important ? (
                <Pin size={15} className="text-rust shrink-0 -rotate-45" />
              ) : (
                <span className="w-[15px] shrink-0" />
              )}
              <p className="font-body text-[14.5px] md:text-[15.5px] text-ink flex-1 group-hover:text-verandah transition-colors">
                {n.title}
              </p>
              <span className="stamp text-[11px] text-ink-soft shrink-0">{n.date}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
