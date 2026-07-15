import { motion, useReducedMotion } from 'framer-motion'
import Magnetic from '../components/Magnetic'

// The hero is a broadsheet front page — THE BELLISARI TIMES. The film
// (already halftone-screened to look like a printed press photo) runs as
// the front-page photograph, so the portrait "moves" on the printed sheet.
// No scroll scrubbing, no pin track: a newspaper is a page, so it flows.

const EASE = [0.16, 1, 0.3, 1]

// Live dateline — the paper is always today's edition
const DATELINE = new Date()
  .toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  .toUpperCase()

const HEADLINE_ARIA =
  'Hello, my name is Drake Bellisari — and I design, develop and ship premium software.'

export default function Hero({ src = '/Hero-News.mp4' }) {
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

        {/* ── Banner headline — kicker, name, deck ── */}
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

          {/* Rubber stamp — thumps down after the page has printed */}
          <motion.div
            className="np-stamp"
            aria-hidden="true"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 2.4, rotate: 4 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: -9 }}
            transition={
              reduced
                ? { duration: 0.4, delay: 1 }
                : { type: 'spring', stiffness: 320, damping: 17, delay: 1.15 }
            }
          >
            <span>Final</span>
            <span>Edition</span>
          </motion.div>
        </div>

        {/* ── Page body — article | photograph | index & classifieds ── */}
        <div className="np-body">
          <motion.article className="np-article" variants={ink} custom={5}>
            <h2 className="np-article__head">
              Area Developer Declines to Ship Anything Less Than Premium
            </h2>
            <p>
              HARTFORD &mdash; Sources close to the desk of Drake Bellisari confirmed
              this week what clients have long suspected: every site that leaves the
              studio is designed by hand, built by hand, and released only when it is
              fast, sharp, and unmistakably custom.
            </p>
            <h3 className="np-article__sub">Craft Over Templates</h3>
            <p>
              Witnesses describe interfaces carrying the polish of a national agency
              with none of the overhead. &ldquo;He sweats the kerning,&rdquo; one
              client reported. &ldquo;The motion, the load times &mdash; all of
              it.&rdquo; No templates were found at the scene.
            </p>
            <p>
              The full account of the author &mdash; his process, his tools, and the
              studio itself &mdash; continues inside this edition.{' '}
              <a className="np-jump" href="#about">Continued on Page A2 &rarr;</a>
            </p>
          </motion.article>

          <motion.figure className="np-photo" variants={ink} custom={6}>
            <div className="np-photo__frame">
              <video
                className="np-photo__video"
                src={src}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            </div>
            <figcaption className="np-photo__caption">
              The developer, photographed for this edition. Readers are advised that
              the portrait does not hold still; the front page is, in his words,
              &ldquo;meant to feel alive.&rdquo;
            </figcaption>
            <p className="np-photo__credit">Staff Photograph &mdash; Hartford, Conn.</p>
          </motion.figure>

          <motion.aside className="np-aside" variants={ink} custom={7}>
            <div className="np-inside">
              <h3 className="np-inside__head">Inside the Edition</h3>
              <a href="#about"><span>About the Author</span><i /><b>A2</b></a>
              <a href="#work"><span>Selected Work</span><i /><b>B1</b></a>
              <a href="#contact"><span>Correspondence</span><i /><b>D4</b></a>
            </div>

            <div className="np-brief">
              <h3 className="np-brief__head">Bulletin</h3>
              <p>
                Visitors to sites of the developer&rsquo;s making report pages that
                &ldquo;simply fly.&rdquo; Investigators traced the phenomenon to an
                obsessive habit of shipping less code, better.
              </p>
            </div>

            <div className="np-classified">
              <h3 className="np-classified__head">Situations Wanted</h3>
              <p>
                Designer &amp; developer, Hartford, Conn., accepting a limited number
                of new commissions this season. Premium work only. Apply within.
              </p>
              <Magnetic>
                <a href="#contact" className="np-cta">
                  Start a Project
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                    <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </Magnetic>
            </div>
          </motion.aside>
        </div>

        {/* ── Folio — bottom of page one ── */}
        <motion.div className="np-folio" variants={ink} custom={8}>
          <span>The Bellisari Times</span>
          <span className="np-folio__page">Page A1 &mdash; continue scrolling for Section A2 &darr;</span>
          <span className="np-folio__colophon">
            <i className="np-barcode" aria-hidden="true" />
            Printed digitally in Hartford, Conn.
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}
