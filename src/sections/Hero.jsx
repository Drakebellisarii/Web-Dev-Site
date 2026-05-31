import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function CharReveal({ text, baseDelay = 0, className = '' }) {
  return (
    <span
      className={className}
      aria-label={text}
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        paddingRight: '0.06em',
        marginRight: '-0.06em',
      }}
    >
      <span style={{ display: 'inline-flex', flexWrap: 'nowrap' }}>
        {text.split('').map((ch, i) => (
          <motion.span
            key={i}
            style={{ display: 'inline-block' }}
            initial={{ y: '115%' }}
            animate={{ y: '0%' }}
            transition={{
              delay: baseDelay + i * 0.045,
              duration: 0.82,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        ))}
      </span>
    </span>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const marqueeRef = useRef(null)

  useEffect(() => {
    const track = marqueeRef.current
    if (!track) return
    const setShift = () => {
      const span = track.firstElementChild
      if (span) track.style.setProperty('--marquee-shift', `-${span.offsetWidth}px`)
    }
    setShift()
    window.addEventListener('resize', setShift)
    return () => window.removeEventListener('resize', setShift)
  }, [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const opacityContent = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !window.matchMedia('(max-width: 720px)').matches) return

    const CLIP = 6
    const getStart = () => Math.max(0, video.duration - CLIP)

    const onLoaded = () => {
      video.loop = false
      video.currentTime = getStart()
    }

    const onEnded = () => {
      video.currentTime = getStart()
      video.play()
    }

    video.addEventListener('loadedmetadata', onLoaded)
    video.addEventListener('ended', onEnded)
    if (video.readyState >= 1) onLoaded()

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('ended', onEnded)
      video.loop = true
    }
  }, [])

  const fadeUp = {
    hidden: { y: 28, opacity: 0 },
    show: (i = 0) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.1 + i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    }),
  }

  return (
    <section className="hero" id="top" ref={ref}>
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

      <div className="hero__overlay" />

      <motion.div className="hero__content shell" style={{ y: yText, opacity: opacityContent }}>
        <motion.div
          className="hero__eyebrow"
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={0}
        >
          <span className="eyebrow-dot" />
          <span className="eyebrow eyebrow--ember">Web Agency · Design &amp; Development</span>
        </motion.div>

        <h1 className="hero__title display">
          <span className="hero__line">
            <CharReveal text="Drake's" baseDelay={0.2} />
          </span>
          <span className="hero__line">
            <CharReveal
              text="Sites."
              baseDelay={0.52}
              className="hero__ember display-italic"
            />
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
              We design and build websites, web apps, and digital brands for businesses
              ready to compete online. Founded by <strong>Drake Bellisari</strong> — B.S.
              Computer Science, Cybersecurity Certificate from{' '}
              <strong>Trinity College</strong>. We work closely with every client from the
              first conversation to launch and long after.
            </p>
            <ul className="hero__signals">
              <li><Cross stroke="var(--ember)" size={10} /> Custom Websites</li>
              <li><Cross stroke="var(--ember)" size={10} /> Web Apps &amp; APIs</li>
              <li><Cross stroke="var(--ember)" size={10} /> SEO &amp; Growth</li>
              <li><Cross stroke="var(--ember)" size={10} /> Cybersecurity</li>
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
              <span>View Our Work</span>
              <ArrowDown />
            </a>
            <a href="#contact" className="btn btn--ghost">Start a Project</a>
          </motion.div>
        </div>

        <motion.div
          className="hero__index"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1.2 }}
        >
          <div className="hero__index-cell">
            <span className="eyebrow">Founded by</span>
            <span className="hero__index-val">Drake Bellisari</span>
          </div>
          <div className="hero__index-cell">
            <span className="eyebrow">Credentials</span>
            <span className="hero__index-val">B.S. CS · Cybersecurity</span>
          </div>
          <div className="hero__index-cell">
            <span className="eyebrow">Based in</span>
            <span className="hero__index-val">Hartford, CT</span>
          </div>
          <div className="hero__index-cell">
            <span className="eyebrow">Status</span>
            <span className="hero__index-val">Taking Clients</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        
        <span className="hero__scroll-line" />
      </motion.div>

      <div className="hero__marquee" aria-hidden>
        <div className="hero__marquee-track" ref={marqueeRef}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>
              <em>React</em>
              <span className="hero__marquee-sep">✦</span>
              <em>Next.js</em>
              <span className="hero__marquee-sep">✦</span>
               <em>Vite</em>
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
              <em>Hosting</em>
              <span className="hero__marquee-sep">✦</span>
              <em>Maintenance</em>
              <span className="hero__marquee-sep">✦</span>
              <em>Google Analytics</em>
              <span className="hero__marquee-sep">✦</span>
              <em>AIO</em>
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
