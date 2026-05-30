import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const SKILLS = [
  {
    n: 'I',
    title: 'Frontend',
    body: 'React, Next.js, TypeScript, and vanilla CSS. I build interfaces that are fast, accessible, and pixel-precise, from component architecture down to scroll animations and micro-interactions.',
    tag: 'Design to Code',
  },
  {
    n: 'II',
    title: 'Backend & APIs',
    body: 'Node.js, Python, REST APIs, and database design. Comfortable wiring together authentication flows, form submissions, third-party integrations, and lightweight server-side logic.',
    tag: 'Data & Logic',
  },
  {
    n: 'III',
    title: 'Cybersecurity',
    body: 'Network security, secure coding practices, penetration testing fundamentals, and OSINT. Trained to think like an attacker so I can build like a defender. Every project ships with security in mind.',
    tag: 'Defense & Offense',
  },
  {
    n: 'IV',
    title: 'Systems & Tools',
    body: 'Linux, Git, Docker, command-line tooling, and Figma. Equally at home in the terminal and in a design file. I own the full stack from concept through deployment.',
    tag: 'Infrastructure',
  },
  {
    n: 'V',
    title: 'Languages',
    body: 'Python, JavaScript, TypeScript, Java, and C. Each selected for the task at hand, not force-fit because it was already there.',
    tag: 'Fluency',
  },
]

function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
    opacity: 0.012 + i * 0.006,
  }))

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <svg
        style={{ width: '100%', height: '100%' }}
        viewBox="0 0 1400 700"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="rgba(239,232,216,1)"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + (path.id % 7) * 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export default function Process() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const lineFill = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%'])

  return (
    <section className="process" id="skills" ref={ref}>
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />

      <div className="shell">
        <header className="process__head">
          <span className="eyebrow eyebrow--ember">
            <span className="eyebrow-dot" />
            §03 — Skills & Stack
          </span>
          <h2 className="process__title display">
            What I know,<br />
            <em className="display-italic">how I use it</em>.
          </h2>
        </header>

        {/* Desktop — scroll-driven rail */}
        <div className="process__rail process__desktop-only">
          <div className="process__rail-track" />
          <motion.div className="process__rail-fill" style={{ height: lineFill }} />
          {SKILLS.map((s, i) => (
            <Step key={s.n} step={s} index={i} progress={scrollYProgress} total={SKILLS.length} />
          ))}
        </div>

        {/* Mobile — viewport-triggered editorial entries */}
        <div className="process__mobile-entries process__mobile-only">
          {SKILLS.map((s, i) => (
            <MobileEntry key={s.n} step={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MobileEntry({ step, index }) {
  return (
    <motion.article
      className="process-entry"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.55,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Giant ghost roman numeral — watermark behind content */}
      <span className="process-entry__ghost display" aria-hidden>{step.n}</span>

      <div className="process-entry__content">
        <span className="process-entry__tag eyebrow eyebrow--ember">{step.tag}</span>
        <h3 className="process-entry__title display">{step.title}</h3>
        <div className="process-entry__rule" aria-hidden />
        <p className="process-entry__body">{step.body}</p>
      </div>
    </motion.article>
  )
}

function Step({ step, index, progress, total }) {
  const start = (index / total) * 0.8 + 0.05
  const opacity = useTransform(progress, [start - 0.05, start + 0.05], [0.3, 1])
  const x = useTransform(progress, [start - 0.05, start + 0.05], [-20, 0])

  return (
    <motion.div className="step" style={{ opacity, x }}>
      <div className="step__node" aria-hidden>
        <span>{step.n}</span>
      </div>
      <div className="step__body">
        <div className="step__head">
          <h3 className="step__title display">{step.title}</h3>
          <span className="step__tag">{step.tag}</span>
        </div>
        <p>{step.body}</p>
      </div>
    </motion.div>
  )
}
