import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const PILLARS = [
  {
    n: '01',
    title: 'Listen & Learn',
    body: 'Every project starts the same way: I ask questions. I want to understand your business, your customers, and what you actually need the site to do before a single pixel moves. That foundation is what separates a site that just looks good from one that performs.',
    tag: 'Discovery',
  },
  {
    n: '02',
    title: 'Design & Build',
    body: 'Once I understand the goal, I translate it into something real. Design rounds in Figma, built in React and Next.js, tested across devices. You see progress early and often. No black boxes, no surprise reveals at the end.',
    tag: 'Execution',
  },
  {
    n: '03',
    title: 'Launch & Grow',
    body: 'Shipping is not the finish line. I make sure you understand what you have, how to use it, and how to keep it healthy. The goal is a long-term relationship, not a handoff and a goodbye.',
    tag: 'Continuity',
  },
]

export default function Manifesto() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  return (
    <section className="approach" id="approach" ref={ref}>
      <div className="shell">
        <div className="approach__head">
          <div className="approach__head-left">
            <span className="eyebrow eyebrow--ember">
              <span className="eyebrow-dot" />
              §04 — The Approach
            </span>
            <h2 className="approach__title display">
              How I work<br />
              <em className="display-italic">with you</em>.
            </h2>
          </div>
          <div className="approach__head-right">
            <p className="approach__lede">
              Building a website for your business is not a transaction. It is a collaboration. I bring the technical skill. You bring the vision, the context, and the goals. Together we build something that works.
            </p>
          </div>
        </div>

        <div className="approach__pillars">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.n} pillar={p} index={i} progress={scrollYProgress} total={PILLARS.length} />
          ))}
        </div>

        <div className="approach__footer">
          <div className="approach__footer-rule" />
          <div className="approach__footer-content">
            <span className="eyebrow">Built on relationship, not just requirement.</span>
            <span className="approach__sig display display-italic">Drake Bellisari</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function PillarCard({ pillar, index, progress, total }) {
  const start = (index / total) * 0.6 + 0.1
  const opacity = useTransform(progress, [start - 0.08, start + 0.08], [0, 1])
  const y = useTransform(progress, [start - 0.08, start + 0.08], [40, 0])

  return (
    <motion.div className="approach__pillar" style={{ opacity, y }}>
      <div className="approach__pillar-top">
        <span className="approach__pillar-n display">{pillar.n}</span>
        <span className="eyebrow approach__pillar-tag">{pillar.tag}</span>
      </div>
      <div className="approach__pillar-divider" />
      <h3 className="approach__pillar-title display">{pillar.title}</h3>
      <p className="approach__pillar-body">{pillar.body}</p>
    </motion.div>
  )
}
