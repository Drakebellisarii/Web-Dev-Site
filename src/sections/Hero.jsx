import { motion, useReducedMotion } from 'framer-motion'
import Magnetic from '../components/Magnetic'
import DotField from '../components/DotField'

// Full-bleed, black. The dot-grid floor is the current visual — drop a real
// clip into public/hero.mp4 (or wire a different src through Boot.jsx) and
// it layers on top at full bleed, scrim included, with no layout changes.
const EASE = [0.16, 1, 0.3, 1]

const HEADLINE_ARIA =
  "I build the kind of sites I'd actually want to use."

export default function Hero({ src }) {
  const reduced = useReducedMotion()

  const ink = {
    hidden: { opacity: 0, y: reduced ? 0 : 18 },
    shown: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.09 * i, ease: EASE },
    }),
  }

  return (
    <section className="hero" id="top">
      <div className="hero__stage" aria-hidden="true">
        <DotField variant="floor" />
        <video
          className="hero__video"
          src={src || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        />
        <div className="hero__scrim" />
      </div>

      <motion.div
        className="hero__content shell"
        initial="hidden"
        animate="shown"
      >
        <motion.span className="eyebrow hero__eyebrow" variants={ink} custom={0}>
          Web Design &amp; Development &middot; Hartford, CT
        </motion.span>

        <h1 className="hero__title display" aria-label={HEADLINE_ARIA}>
          <motion.span variants={ink} custom={1} aria-hidden="true">I build the kind of sites</motion.span>
          <motion.span variants={ink} custom={2} aria-hidden="true">I&rsquo;d actually want to use.</motion.span>
        </h1>

        <motion.p className="hero__deck" variants={ink} custom={3}>
          One person, start to finish — no account managers, no templates, no filler.
        </motion.p>

        <motion.div variants={ink} custom={4}>
          <Magnetic>
            <a href="#work" className="hero__cta">
              See the work
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  )
}
