import { useRef, useEffect, useState } from 'react'
import {
  motion,
  useScroll,
  useMotionValue,
  useMotionValueEvent,
  transform,
} from 'framer-motion'
import Magnetic from '../components/Magnetic'

// Desktop / laptop and larger — gets the scroll-scrubbed video hero.
// Smaller screens get an autoplaying film and timed type-on instead — no
// tall pin track on mobile (perf), and no waiting on scroll gestures.
const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 861px)').matches

const EASE = [0.16, 1, 0.3, 1]

const LINE1 = 'My name is Drake Bellisari'
const LINE1_WORDS = LINE1.split(' ')

// Second line is its own little typewriter — "and I " stays put, the verb
// cycles design → develop → ship (typed, held, deleted), and once "ship"
// lands the tail types in and everything stops there for good.
const LINE2_PREFIX = 'I '
const LINE2_VERBS = ['design', 'develop', 'ship']
const LINE2_SUFFIX = ' premium software.'
const LINE2_FULL = `${LINE2_PREFIX}${LINE2_VERBS[LINE2_VERBS.length - 1]}${LINE2_SUFFIX}`

function buildLine2Script() {
  const steps = [{ type: 'type', text: LINE2_PREFIX, delay: 42 }]
  LINE2_VERBS.forEach((verb, i) => {
    steps.push({ type: 'type', text: verb, delay: 58 })
    if (i < LINE2_VERBS.length - 1) {
      steps.push({ type: 'pause', ms: 620 })
      steps.push({ type: 'delete', count: verb.length, delay: 32 })
    }
  })
  steps.push({ type: 'type', text: LINE2_SUFFIX, delay: 42 })
  return steps
}

// Desktop scrubs line 2 against scroll, so the whole type-hold-delete cycle
// is precomputed as a flat list of frames — one displayed string per scroll
// notch. Scrolling fast just plays the frames fast; nothing can be skipped
// past unseen, and scrolling back up literally rewinds the typing.
const LINE2_HOLD_FRAMES = 10
function buildLine2Frames() {
  const frames = ['']
  let text = ''
  for (const ch of LINE2_PREFIX) { text += ch; frames.push(text) }
  LINE2_VERBS.forEach((verb, i) => {
    for (const ch of verb) { text += ch; frames.push(text) }
    if (i < LINE2_VERBS.length - 1) {
      for (let k = 0; k < LINE2_HOLD_FRAMES; k++) frames.push(text)
      for (let k = 0; k < verb.length; k++) { text = text.slice(0, -1); frames.push(text) }
    }
  })
  for (const ch of LINE2_SUFFIX) { text += ch; frames.push(text) }
  return frames
}
const LINE2_FRAMES = buildLine2Frames()

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// `src` is normally a blob URL handed over by the Boot screen (already fully
// downloaded); the plain path is the fallback if boot fetching failed.
export default function Hero({ src = '/Hero-inspo.mp4' }) {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const wordsShownRef = useRef(0)
  const line2FrameRef = useRef(0)
  const line2StartedRef = useRef(false)

  const [wordsShown, setWordsShown] = useState(0)
  const [line2Active, setLine2Active] = useState(false)
  const [line2Text, setLine2Text] = useState('')

  // Progress runs across the whole tall section while the inner pins
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // The film finishes early; the remaining scroll "typesets" the print ad
  // around its last frame — wash, headline (typed word by word), tagline.
  const V_END = 0.62

  // Imperative motion values, NOT useTransform(scrollYProgress, ...) —
  // framer would offload that chain to a WAAPI scroll-timeline animation,
  // which mismeasures targets containing a sticky child and freezes the
  // styles at wrong values. Plain values can't be precomputed, so they
  // stay on the reliable JS path.
  const washOpacity = useMotionValue(0)
  const headOpacity = useMotionValue(0)
  const headY = useMotionValue(20)
  const tagOpacity = useMotionValue(0)
  const tagY = useMotionValue(18)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    washOpacity.set(transform(p, [0.6, 0.74], [0, 1]))
    headOpacity.set(transform(p, [0.66, 0.72], [0, 1]))
    headY.set(transform(p, [0.66, 0.72], [20, 0]))
    tagOpacity.set(transform(p, [0.9, 0.99], [0, 1]))
    tagY.set(transform(p, [0.9, 0.99], [18, 0]))

    if (!isDesktop) return
    const typeP = transform(p, [0.68, 0.84], [0, 1])
    const words = Math.round(LINE1_WORDS.length * Math.max(0, Math.min(1, typeP)))
    if (words !== wordsShownRef.current) {
      wordsShownRef.current = words
      setWordsShown(words)
    }

    // Line 2 scrubs right behind line 1 — the design/develop/ship cycle is
    // just frames indexed by scroll position, so it can't be blown past.
    const frame = Math.round(transform(p, [0.84, 0.99], [0, LINE2_FRAMES.length - 1]))
    if (frame !== line2FrameRef.current) {
      line2FrameRef.current = frame
      setLine2Text(LINE2_FRAMES[frame])
    }
  })

  // Mobile only: the headline types on a timer (no scrub track there), so
  // once it finishes, hand off to line 2's own one-shot type-and-delete run.
  useEffect(() => {
    if (isDesktop) return
    if (wordsShown >= LINE1_WORDS.length && !line2StartedRef.current) {
      line2StartedRef.current = true
      setLine2Active(true)
    }
  }, [wordsShown])

  useEffect(() => {
    if (!line2Active) return
    let cancelled = false

    const run = async () => {
      let text = ''
      for (const step of buildLine2Script()) {
        if (cancelled) return
        if (step.type === 'type') {
          for (const ch of step.text) {
            if (cancelled) return
            text += ch
            setLine2Text(text)
            await wait(step.delay)
          }
        } else if (step.type === 'delete') {
          for (let i = 0; i < step.count; i++) {
            if (cancelled) return
            text = text.slice(0, -1)
            setLine2Text(text)
            await wait(step.delay)
          }
        } else if (step.type === 'pause') {
          await wait(step.ms)
        }
      }
    }
    run()

    return () => { cancelled = true }
  }, [line2Active])

  const line2Done = line2Text === LINE2_FULL

  // Desktop: scrub the film frame-by-frame against scroll progress.
  useEffect(() => {
    if (!isDesktop) return
    const v = videoRef.current
    if (!v) return

    // Prime decoding so seeked frames actually paint (Safari/Chrome quirk).
    // Pause is called synchronously, NOT inside the play() promise's .then
    // — awaiting the promise lets the film actually run for a visible beat
    // before it stops, which reads as autoplay. Firing pause() in the same
    // tick cancels playback before the browser paints a moving frame.
    v.muted = true
    v.play().catch(() => {})
    v.pause()

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

  // Mobile/tablet: no scrub track, so everything runs on load — muted
  // inline video autoplays immediately (waiting for a scroll gesture broke
  // iOS's play() gesture rules and left a dead first paint), the headline
  // types on right away, and line 2's cycle picks up automatically once
  // wordsShown reaches the end. Scrolling is never blocked.
  useEffect(() => {
    if (isDesktop) return
    const v = videoRef.current
    if (v) {
      v.muted = true
      v.play().catch(() => {})
    }

    let i = 0
    const id = setInterval(() => {
      i += 1
      setWordsShown((w) => Math.max(w, Math.min(i, LINE1_WORDS.length)))
      if (i >= LINE1_WORDS.length) clearInterval(id)
    }, 160)
    return () => clearInterval(id)
  }, [])

  const line1Shown = LINE1_WORDS.slice(0, Math.min(wordsShown, LINE1_WORDS.length)).join(' ')

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero__sticky">
        <div className="hero__video-wrap">
          <video
            ref={videoRef}
            className="hero__video"
            muted
            playsInline
            preload="auto"
            src={src}
          />
        </div>

        {/* Parchment wash — the film frame becomes the printed page */}
        <motion.div
          className="hero__wash"
          style={isDesktop ? { opacity: washOpacity } : { opacity: 1 }}
        />
        <div className="hero__overlay" />

        <div className="hero__ad">
          <div className="hero__ad-head-group">
            <motion.h1
              className="hero__ad-head display"
              style={isDesktop ? { opacity: headOpacity, y: headY } : undefined}
              initial={isDesktop ? undefined : { opacity: 0, y: 20 }}
              animate={isDesktop ? undefined : { opacity: 1, y: 0 }}
              transition={isDesktop ? undefined : { duration: 0.6, ease: EASE }}
              aria-label={`${LINE1} ${LINE2_FULL}`}
            >
              <span aria-hidden="true">{line1Shown}</span>
            </motion.h1>

            {/* Second line — desktop pulls this down to the bottom-right
                corner of the section; mobile keeps it stacked under the
                first line. Same plain display font as the first line, just
                ember-toned, with its own design/develop/ship type-cycle. */}
            <motion.p
              className="hero__ad-line2 display"
              style={isDesktop ? { opacity: headOpacity, y: headY } : undefined}
              initial={isDesktop ? undefined : { opacity: 0, y: 20 }}
              animate={isDesktop ? undefined : { opacity: 1, y: 0 }}
              transition={isDesktop ? undefined : { duration: 0.6, ease: EASE }}
              aria-hidden="true"
            >
              {line2Text}
              {(line2Active || line2Text.length > 0) && !line2Done && <span className="hero__ad-line2-cursor" />}
            </motion.p>
          </div>

          <motion.div
            className="hero__ad-foot"
            style={isDesktop ? { opacity: tagOpacity, y: tagY } : undefined}
            initial={isDesktop ? undefined : { opacity: 0, y: 18 }}
            animate={isDesktop ? undefined : { opacity: 1, y: 0 }}
            transition={isDesktop ? undefined : { duration: 0.7, delay: 0.15, ease: EASE }}
          >
            <Magnetic>
              <a href="#contact" className="hero__cta">
                start a project
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                  <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
