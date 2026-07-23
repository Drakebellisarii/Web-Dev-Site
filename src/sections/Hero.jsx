import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import Magnetic from '../components/Magnetic'
import DotField from '../components/DotField'

// The dot field is the hero's visual: a canvas of white dots on black where
// the founder's portrait resolves out of the same field that fills the rest
// of the frame. Layered behind the headline, full hero bounds — drop a real
// clip into public/hero.mp4 (or wire a different src through Boot.jsx) and
// it plays on top at full bleed, scrim included, with no layout changes.
const HEADLINE_ARIA = 'I build Premium Software'

const DESKTOP_BOX = { x: 0.52, y: 0.0, w: 0.46, h: 1.0 }
// Mobile: a right-half portrait doesn't translate to a phone — stack it
// above the headline instead, full width, at lower opacity via the
// hero__dotfield--mobile class rather than scaled down. Starts below y:0 —
// flush against the top otherwise puts bright hair dots directly under the
// fixed corner mark/CTA, and mix-blend-mode: difference cancels white on
// white to black, making them invisible right where they need to work.
const MOBILE_BOX = { x: 0.06, y: 0.1, w: 0.88, h: 0.4 }

export default function Hero({ src }) {
  const reduced = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const [textBox, setTextBox] = useState(null)

  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const eyebrowRef = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Where the headline sits, as fractions of the hero — lets the dot field
  // know where drops should splash off the text instead of falling through
  // it. Remeasured on resize since the text reflows across breakpoints.
  useEffect(() => {
    const measure = () => {
      const hero = heroRef.current
      const title = titleRef.current
      if (!hero || !title) return
      const heroRect = hero.getBoundingClientRect()
      const titleRect = title.getBoundingClientRect()
      if (!heroRect.width || !heroRect.height) return
      setTextBox({
        x: (titleRect.left - heroRect.left) / heroRect.width,
        y: (titleRect.top - heroRect.top) / heroRect.height,
        w: titleRect.width / heroRect.width,
        h: titleRect.height / heroRect.height,
      })
    }
    measure()
    // The entrance animation offsets the title by a few px via `y` during
    // its transition — one more measure once it settles keeps the splash
    // point accurate instead of a few px off for the rest of the visit.
    const settle = setTimeout(measure, 1300)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(settle)
      window.removeEventListener('resize', measure)
    }
  }, [isMobile])

  // GSAP entrance — a per-line wipe-up, choreographed against the dot
  // field's own resolve rather than competing with it.
  useEffect(() => {
    const els = [eyebrowRef.current, line1Ref.current, line2Ref.current, ctaRef.current].filter(Boolean)
    if (!els.length) return

    if (reduced) {
      gsap.set(els, { clipPath: 'inset(0 0 0% 0)', y: 0, opacity: 1 })
      return
    }

    gsap.set(els, { clipPath: 'inset(0 0 100% 0)', y: 16, opacity: 1 })
    const tl = gsap.timeline({ delay: 0.15 })
    tl.to(els, {
      clipPath: 'inset(0 0 0% 0)',
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.08,
    })

    return () => tl.kill()
  }, [reduced])

  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="hero__stage" aria-hidden="true">
        <DotField
          className={`hero__dotfield${isMobile ? ' hero__dotfield--mobile' : ''}`}
          src="/Drake.webp"
          portraitBox={isMobile ? MOBILE_BOX : DESKTOP_BOX}
          textBox={textBox}
        />
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

      <div className="hero__content shell">
        <span ref={eyebrowRef} className="eyebrow hero__eyebrow">
          Web Design &amp; Development &middot; New York, NY
        </span>

        <h1 ref={titleRef} className="hero__title display" aria-label={HEADLINE_ARIA}>
          <span ref={line1Ref} aria-hidden="true">I build Premium</span>
          <span ref={line2Ref} aria-hidden="true">Software</span>
        </h1>

        <div ref={ctaRef} className="hero__cta-wrap">
          <Magnetic strength={0.25}>
            <a href="#work" className="hero__cta">
              <span className="hero__cta-label">See the work</span>
              <span className="hero__cta-ring" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2.5 10.5L10.5 2.5M10.5 2.5H4.8M10.5 2.5V8.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
