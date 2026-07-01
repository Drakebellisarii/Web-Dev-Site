import { useEffect, lazy, Suspense } from 'react'
import Lenis from 'lenis'
import Nav from './sections/Nav'
import Hero from './sections/Hero'
import Scrollbar from './components/Scrollbar'
import './app.css'

const Projects = lazy(() => import('./sections/Projects'))
const Steps    = lazy(() => import('./sections/Steps'))
const Contact  = lazy(() => import('./sections/Contact'))

// Touch devices get native momentum scroll — Lenis rAF loop hurts mobile perf
const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

export default function App() {
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

    lenis.on('scroll', () => window.dispatchEvent(new Event('scroll')))

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <div className="app">
      <Scrollbar />
      <Nav />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <Projects />
          <Steps />
          <Contact />
        </Suspense>
      </main>
    </div>
  )
}
