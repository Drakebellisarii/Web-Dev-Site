import { useRef, useEffect } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  transform,
} from 'framer-motion'

// Desktop / laptop and larger — gets the scroll-scrubbed video hero.
// Smaller screens autoplay the film once and hold on its final frame.
const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 861px)').matches

const EASE = [0.16, 1, 0.3, 1]

// Mobile has no scrub — the ad type just sets itself after the film starts
const enter = (delay) =>
  isDesktop
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, delay, ease: EASE },
      }

// `src` is normally a blob URL handed over by the Boot screen (already fully
// downloaded); the plain path is the fallback if boot fetching failed.
export default function Hero({ src = '/Hero-inspo.mp4' }) {
  const ref = useRef(null)
  const videoRef = useRef(null)

  // Progress runs across the whole tall section while the inner pins
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // The film finishes early; the remaining scroll "typesets" the print ad
  // around its last frame — wash, headline, column, tagline, in that order.
  const V_END = 0.62

  // Imperative motion values, NOT useTransform(scrollYProgress, ...) —
  // framer would offload that chain to a WAAPI scroll-timeline animation,
  // which mismeasures targets containing a sticky child and freezes the
  // styles at wrong values. Plain values can't be precomputed, so they
  // stay on the reliable JS path.
  const washOpacity = useMotionValue(0)
  const headOpacity = useMotionValue(0)
  const headY = useMotionValue(28)
  const colOpacity = useMotionValue(0)
  const colY = useMotionValue(24)
  const tagOpacity = useMotionValue(0)
  const tagY = useMotionValue(18)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    washOpacity.set(transform(p, [0.6, 0.74], [0, 1]))
    headOpacity.set(transform(p, [0.64, 0.74], [0, 1]))
    headY.set(transform(p, [0.64, 0.74], [28, 0]))
    colOpacity.set(transform(p, [0.72, 0.82], [0, 1]))
    colY.set(transform(p, [0.72, 0.82], [24, 0]))
    tagOpacity.set(transform(p, [0.8, 0.9], [0, 1]))
    tagY.set(transform(p, [0.8, 0.9], [18, 0]))
  })

  // Don't let the invisible tagline swallow clicks before it has set
  const tagPointer = useTransform(tagOpacity, (v) => (v > 0.2 ? 'auto' : 'none'))

  useEffect(() => {
    if (!isDesktop) return
    const v = videoRef.current
    if (!v) return

    // Prime decoding so seeked frames actually paint (Safari/Chrome quirk)
    v.muted = true
    const pr = v.play()
    if (pr && pr.then) pr.then(() => v.pause()).catch(() => {})
    else v.pause()

    let raf = 0
    const scrub = (p) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const d = v.duration
        if (!d || Number.isNaN(d)) return
        v.currentTime = Math.min(d - 0.05, Math.max(0, (p / V_END) * d))
      })
    }
    const onMeta = () => scrub(scrollYProgress.get())
    if (v.readyState >= 1) onMeta()
    v.addEventListener('loadedmetadata', onMeta)
    const unsub = scrollYProgress.on('change', scrub)

    return () => {
      unsub()
      v.removeEventListener('loadedmetadata', onMeta)
      cancelAnimationFrame(raf)
    }
  }, [scrollYProgress])

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero__sticky">
        <div className="hero__video-wrap">
          {isDesktop ? (
            <video
              ref={videoRef}
              className="hero__video"
              muted
              playsInline
              preload="auto"
              src={src}
            />
          ) : (
            <video
              className="hero__video"
              autoPlay
              muted
              playsInline
              preload="auto"
              src={src}
            />
          )}
        </div>

        {/* Parchment wash — the film frame becomes the printed page */}
        <motion.div
          className="hero__wash"
          style={isDesktop ? { opacity: washOpacity } : { opacity: 1 }}
        />
        <div className="hero__overlay" />

        <div className="hero__ad">
          <motion.h1
            className="hero__ad-head display"
            style={isDesktop ? { opacity: headOpacity, y: headY } : undefined}
            {...enter(0.5)}
          >
            <span>My name is Drake&nbsp;Bellisari</span>
            <span>and I build premium software.</span>
          </motion.h1>

          <motion.div
            className="hero__ad-col"
            style={isDesktop ? { opacity: colOpacity, y: colY } : undefined}
            {...enter(0.9)}
          >
            <p>
              All along, the promise of good software has been the same: it should feel
              obvious the moment you touch it.
            </p>
            <p>
              I design and build websites and web apps for small businesses and founders
              — work that looks composed, loads fast, and earns trust before it asks for
              anything.
            </p>
            <p>Every typeface, every animation, every line of copy is put there on purpose.</p>
            <p>
              Because the hard part of premium software isn&rsquo;t imagining it. The hard
              part is shipping it.
            </p>
          </motion.div>

          <motion.div
            className="hero__ad-foot"
            style={isDesktop ? { opacity: tagOpacity, y: tagY, pointerEvents: tagPointer } : undefined}
            {...enter(1.3)}
          >
            <a href="#contact" className="hero__ad-tag display">
              Start a project.
            </a>
            <p className="hero__ad-fine">
              &copy; 2026 Drake Bellisari &middot; Hartford, CT &middot; Columbus, OH
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
