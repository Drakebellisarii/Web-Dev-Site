import { useRef, useEffect } from 'react'
import { useScroll } from 'framer-motion'

// Desktop / laptop and larger — gets the scroll-scrubbed video hero.
// Smaller screens just autoplay it as a looping background.
const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 861px)').matches

export default function Hero() {
  const ref = useRef(null)
  const videoRef = useRef(null)

  // Progress runs across the whole tall section while the inner pins
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // Scrub the video frame-by-frame with scroll. It reaches its final frame just
  // before the section releases. (desktop only)
  const V_END = 0.96

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
              src="/Hero-Finalized.mp4"
            />
          ) : (
            <video
              className="hero__video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              src="/Hero-Finalized.mp4"
            />
          )}
        </div>
        <div className="hero__overlay" />
      </div>
    </section>
  )
}
