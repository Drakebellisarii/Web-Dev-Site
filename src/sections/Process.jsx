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

export default function Process() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const lineFill = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%'])

  return (
    <section className="process" id="skills" ref={ref}>
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

        <div className="process__rail">
          <div className="process__rail-track" />
          <motion.div className="process__rail-fill" style={{ height: lineFill }} />

          {SKILLS.map((s, i) => (
            <Step key={s.n} step={s} index={i} progress={scrollYProgress} total={SKILLS.length} />
          ))}
        </div>
      </div>
    </section>
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
