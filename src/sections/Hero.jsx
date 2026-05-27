import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function CharReveal({ text, delay = 0, className = '' }) {
  const chars = text.split('')
  return (
    <span className={className} aria-label={text} style={{ display: 'inline-flex', flexWrap: 'nowrap' }}>
      {chars.map((ch, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', lineHeight: 1.05 }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              delay: delay + i * 0.038,
              duration: 0.72,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const opacityContent = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  const fadeUp = {
    hidden: { y: 28, opacity: 0 },
    show: (i = 0) => ({ y: 0, opacity: 1, transition: { delay: 0.1 + i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] } }),
  }

  return (
    <section className="hero" id="top" ref={ref}>
      {/* Video background */}
      <motion.div className="hero__video-wrap" style={{ scale: videoScale }}>
        <video
          ref={videoRef}
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src="/Web-Dev-Hero.mp4"
          onCanPlay={() => { if (videoRef.current) videoRef.current.playbackRate = 0.5 }}
        />
      </motion.div>

      {/* Overlay */}
      <div className="hero__overlay" />

      {/* Content */}
      <motion.div className="hero__content shell" style={{ y: yText, opacity: opacityContent }}>
        <motion.div
          className="hero__eyebrow"
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={0}
        >
          <span className="eyebrow-dot" />
          <span className="eyebrow eyebrow--ember">Computer Science · Cybersecurity</span>
        </motion.div>

        <h1 className="hero__title display">
          <span className="hero__line">
            <CharReveal text="Drake" delay={0.18} />
          </span>
          <span className="hero__line">
            <CharReveal text="Bellisari." delay={0.42} className="hero__ember display-italic" />
          </span>
        </h1>

        <div className="hero__base">
          <motion.div
            className="hero__intro"
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={4}
          >
            <p className="hero__lede">
              B.S. in Computer Science with an Experiential Certificate in Cybersecurity from{' '}
              <strong>Trinity College</strong> in Hartford, CT. Originally from{' '}
              <strong>Columbus, Ohio</strong>. I build thoughtful, secure digital experiences
              that sit at the intersection of design and engineering.
            </p>
            <ul className="hero__signals">
              <li><Cross stroke="var(--ember)" size={10} /> Computer Science</li>
              <li><Cross stroke="var(--ember)" size={10} /> Cybersecurity</li>
              <li><Cross stroke="var(--ember)" size={10} /> Web Development</li>
              <li><Cross stroke="var(--ember)" size={10} /> UI / UX Design</li>
            </ul>
          </motion.div>

          <motion.div
            className="hero__cta"
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={5}
          >
            <a href="#work" className="btn btn--primary">
              <span>View Projects</span>
              <ArrowDown />
            </a>
            <a href="#contact" className="btn btn--ghost">Get in touch</a>
          </motion.div>
        </div>

        <motion.div
          className="hero__index"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1.2 }}
        >
          <div className="hero__index-cell">
            <span className="eyebrow">Degree</span>
            <span className="hero__index-val">B.S. Comp. Sci.</span>
          </div>
          <div className="hero__index-cell">
            <span className="eyebrow">Certificate</span>
            <span className="hero__index-val">Cybersecurity</span>
          </div>
          <div className="hero__index-cell">
            <span className="eyebrow">Institution</span>
            <span className="hero__index-val">Trinity College</span>
          </div>
          <div className="hero__index-cell">
            <span className="eyebrow">Hometown</span>
            <span className="hero__index-val">Columbus, OH</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="eyebrow">Scroll · Featured Work</span>
        <span className="hero__scroll-line" />
      </motion.div>

      {/* Marquee */}
      <div className="hero__marquee" aria-hidden>
        <div className="hero__marquee-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>
              <em>React</em>
              <span className="hero__marquee-sep">✦</span>
              <em>Python</em>
              <span className="hero__marquee-sep">✦</span>
              <em>UI/UX</em>
              <span className="hero__marquee-sep">✦</span>
              <em>SEO</em>
              <span className="hero__marquee-sep">✦</span>
              <em>AI integration</em>
              <span className="hero__marquee-sep">✦</span>
              <em>Cybersecurity</em>
              <span className="hero__marquee-sep">✦</span>
              <em>Trinity College · Hartford, CT</em>
              <span className="hero__marquee-sep">✦</span>
              <em>Responsive Design</em>
              <span className="hero__marquee-sep">✦</span>
              <em>Affordable</em>
              <span className="hero__marquee-sep">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Cross({ stroke = 'currentColor', size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M6 1 L6 11 M1 6 L11 6" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ArrowDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1 L7 13 M1 7 L7 13 L13 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
