import { motion } from 'framer-motion'

const steps = [
  {
    n: '01',
    role: 'Resident',
    title: 'Raise it',
    desc: 'Pick a category, describe the issue, attach a photo if it helps. Takes under a minute.',
  },
  {
    n: '02',
    role: 'Admin',
    title: 'Prioritise it',
    desc: 'Every complaint lands in one queue. Set priority, and overdue ones rise to the top automatically.',
  },
  {
    n: '03',
    role: 'Admin',
    title: 'Work it',
    desc: 'Move it through Open → In Progress → Resolved. Each step is logged with a note and timestamp.',
  },
  {
    n: '04',
    role: 'Resident',
    title: 'Track it',
    desc: 'See the full history on your complaint, and get an email the moment its status changes.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function HowItWorks() {
  return (
    <section id="how" className="py-28 md:py-36 bg-paper-aged relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          custom={0}
          className="max-w-lg mb-16 md:mb-20"
        >
          <span className="stamp text-rust text-xs tracking-[0.2em] uppercase">A logbook, not a black box</span>
          <h2 className="font-display text-[36px] md:text-[44px] text-verandah mt-3 leading-[1.1]">
            How a complaint moves through Aangan
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-0 border-t border-ink/15">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeUp}
              custom={i}
              className="group border-b md:border-b-0 md:border-r last:border-r-0 border-ink/15 py-9 px-2 md:px-6 hover:bg-card/70 transition-colors duration-500"
            >
              <span className="font-display text-[15px] text-rust/70 italic">{s.n}</span>
              <p className="stamp text-[11px] text-ink-soft tracking-widest uppercase mt-3 mb-1">{s.role}</p>
              <h3 className="font-display text-[24px] text-verandah mt-1 group-hover:text-rust transition-colors duration-300">
                {s.title}
              </h3>
              <p className="text-[14.5px] text-ink-soft leading-relaxed mt-3">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
