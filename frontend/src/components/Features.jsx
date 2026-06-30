import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

const fadeIn = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
}

function FeatureRow({ reverse, eyebrow, title, desc, points, imgUrl, imgAlt }) {
  return (
    <div className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center ${reverse ? 'md:[direction:rtl]' : ''}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        className="relative overflow-hidden group [direction:ltr]"
      >
        <div className="absolute inset-0 bg-verandah/10 z-10 group-hover:bg-transparent transition-colors duration-700" />
        <img
          src={imgUrl}
          alt={imgAlt}
          className="w-full h-[340px] md:h-[420px] object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
        />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-rust scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="[direction:ltr]"
      >
        <span className="stamp text-rust text-xs tracking-[0.2em] uppercase">{eyebrow}</span>
        <h3 className="font-display text-[30px] md:text-[36px] text-verandah mt-3 leading-[1.12]">{title}</h3>
        <p className="text-[15.5px] text-ink-soft leading-relaxed mt-4 max-w-md">{desc}</p>
        <ul className="mt-6 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-[14.5px] text-ink">
              <span className="mt-2 w-1.5 h-1.5 bg-rust shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}

export default function Features() {
  return (
    <section id="features" className="py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-28 md:space-y-36">
        <FeatureRow
          eyebrow="For residents"
          title="Raise it with a photo, not a guessing game"
          desc="A leaking pipe is easier to fix when the plumber can see it before showing up. Attach a photo, pick a category, and you're done."
          points={[
            'Category, description, and an optional photo',
            'Full status history on every complaint you raise',
            'Email the moment something changes',
          ]}
          imgUrl="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80"
          imgAlt="Plumber repairing a pipe"
        />

        <FeatureRow
          reverse
          eyebrow="For admins"
          title="Nothing falls through the cracks"
          desc="One queue for every complaint in the society, sortable by category, status, or date — with overdue issues surfaced automatically."
          points={[
            'Set priority: Low, Medium, High',
            'Configurable overdue threshold, flagged at the top',
            'Every status change logged with a note and timestamp',
          ]}
          imgUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80"
          imgAlt="Apartment building courtyard"
        />
      </div>
    </section>
  )
}
