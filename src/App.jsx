import { useEffect, useState, lazy, Suspense } from 'react'
import Lenis from 'lenis'
import Nav from './sections/Nav'
import Hero from './sections/Hero'
import Scrollbar from './components/Scrollbar'
import Boot from './components/Boot'
import './app.css'

const About        = lazy(() => import('./sections/About'))
const Projects     = lazy(() => import('./sections/Projects'))
const Testimonials = lazy(() => import('./sections/Testimonials'))
const Process      = lazy(() => import('./sections/Process'))
const TechStrip    = lazy(() => import('./sections/TechStrip'))
const Contact      = lazy(() => import('./sections/Contact'))

// Touch devices get native momentum scroll — Lenis rAF loop hurts mobile perf
const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

export default function App() {
  // Boot gates the site: content mounts once assets are in (so the hero film
  // never double-downloads), and the overlay unmounts after its CRT-off exit
  const [entered, setEntered] = useState(false)
  const [showBoot, setShowBoot] = useState(true)
  const [heroSrc, setHeroSrc] = useState(null)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    // Skip Lenis entirely on touch/mobile — native scroll is faster
    if (isTouchDevice) return

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    })

    // Re-entry guard: Lenis also hears the synthetic event and re-emits,
    // which recurses until the stack overflows and starves other listeners
    let bridging = false
    lenis.on('scroll', () => {
      if (bridging) return
      bridging = true
      window.dispatchEvent(new Event('scroll'))
      bridging = false
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <div className="app">
      {showBoot && (
        <Boot
          onReady={(src) => {
            setHeroSrc(src)
            setEntered(true)
          }}
          onGone={() => setShowBoot(false)}
        />
      )}
      {entered && (
        <>
          <Scrollbar />
          <Nav />
          <main>
            <Hero src={heroSrc} />
            <Suspense fallback={null}>
              <About />
              <Projects />
              <Testimonials />
              <Process />
              <TechStrip />
              <Contact />
            </Suspense>
          </main>
        </>
      )}
    </div>
  )
}
