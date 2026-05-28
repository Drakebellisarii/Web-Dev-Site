import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

const STEPS = [
  {
    n: '01',
    title: 'Listen & Learn',
    tag: 'Discovery',
    body: 'Every project starts with questions. I want to understand your business, your customers, and what you actually need the site to do before a single pixel moves. That foundation is what separates a site that looks good from one that performs.',
  },
  {
    n: '02',
    title: 'Design & Build',
    tag: 'Execution',
    body: 'Once I understand the goal, I translate it into something real. Design rounds in Figma, built in React or Next.js, tested across devices. You see progress early and often — no black boxes, no surprise reveals.',
  },
  {
    n: '03',
    title: 'Launch & Grow',
    tag: 'Continuity',
    body: 'Shipping is not the finish line. I make sure you understand what you have, how to use it, and how to keep it healthy. The goal is a long-term relationship, not a handoff and a goodbye.',
  },
  {
    n: '04',
    title: 'Iterate & Improve',
    tag: 'Longevity',
    body: 'Great digital products evolve. As your business grows, your site should too. I stay available for updates, new features, and strategic pivots — a partner invested in your continued success, not just the initial build.',
  },
]

export default function Steps() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // Continuous progress bar width (0% → 100% across the whole section)
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(Math.floor(v * STEPS.length), STEPS.length - 1)
    setActive(idx)
  })

  return (
    <section ref={ref} id="approach" className="steps">
      <div className="steps__sticky">
        <div className="steps__banner shell">

          {/* Top bar: eyebrow + step dots */}
          <div className="steps__topbar">
            <span className="eyebrow eyebrow--ember">
              <span className="eyebrow-dot" />
              §04 — The Approach
            </span>
            <div className="steps__dots">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`steps__dot${i === active ? ' steps__dot--active' : ''}${i < active ? ' steps__dot--done' : ''}`}
                />
              ))}
            </div>
          </div>

          {/* Continuous progress bar */}
          <div className="steps__progress-track">
            <motion.div className="steps__progress-fill" style={{ width: progressWidth }} />
          </div>

          {/* Animated step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="steps__content"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="steps__n-col">
                <span className="steps__big-n display" aria-hidden>{STEPS[active].n}</span>
              </div>
              <div className="steps__text-col">
                <span className="steps__tag eyebrow">{STEPS[active].tag}</span>
                <h2 className="steps__title display">{STEPS[active].title}</h2>
                <p className="steps__body">{STEPS[active].body}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom: counter + scroll hint */}
          <div className="steps__footer">
            <span className="eyebrow steps__counter">
              {String(active + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
            </span>
            {active < STEPS.length - 1 && (
              <span className="eyebrow steps__hint">scroll to continue</span>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
