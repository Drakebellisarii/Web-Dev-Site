import { motion, useReducedMotion } from 'framer-motion'
import Magnetic from '../components/Magnetic'

// The hero is a broadsheet masthead — a brief front-page introduction, not
// the full paper. No scroll scrubbing, no pin track: a newspaper is a page,
// so it flows.

const EASE = [0.16, 1, 0.3, 1]

// Live dateline — the paper is always today's edition
const DATELINE = new Date()
  .toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  .toUpperCase()

const HEADLINE_ARIA =
  'Hello, my name is Drake Bellisari — and I design, develop and ship premium software.'

export default function Hero() {
  const reduced = useReducedMotion()

  // One orchestrated page-load: the press "prints" the page top to bottom.
  const ink = {
    hidden: { opacity: 0, y: reduced ? 0 : 16 },
    shown: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.08 * i, ease: EASE },
    }),
  }

  return (
    <section className="hero" id="top">
      <motion.div
        className="np-page"
        initial="hidden"
        animate="shown"
        aria-label="Front page"
      >
        {/* ── Agate line — volume, dateline, price ── */}
        <motion.div className="np-agate" variants={ink} custom={0}>
          <span>VOL. I &middot; NO. 1</span>
          <span className="np-agate__date">HARTFORD, CONNECTICUT &mdash; {DATELINE}</span>
          <span>PRICE: ONE GOOD IDEA</span>
        </motion.div>

        <motion.div className="np-rule-double" variants={ink} custom={1} aria-hidden="true" />

        {/* ── Banner headline — kicker, name, deck, CTA ── */}
        <div className="np-head-block">
          <h1 className="np-head" aria-label={HEADLINE_ARIA}>
            <motion.span className="np-head__kicker" variants={ink} custom={2} aria-hidden="true">
              Hello, my name is
            </motion.span>
            <motion.span className="np-head__banner" variants={ink} custom={3} aria-hidden="true">
              Drake Bellisari
            </motion.span>
            <motion.span className="np-head__deck" variants={ink} custom={4} aria-hidden="true">
              And I Design, Develop &amp; Ship Premium Software.
            </motion.span>
          </h1>

          <motion.div className="np-head__cta" variants={ink} custom={5}>
            <Magnetic>
              <a href="#contact" className="np-cta">
                Start a Project
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                  <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
