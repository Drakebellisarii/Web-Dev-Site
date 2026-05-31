import { useEffect } from 'react'
import Lenis from 'lenis'
import Nav from './sections/Nav'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import Process from './sections/Process'
import Steps from './sections/Steps'
import Contact from './sections/Contact'
import Cursor from './components/Cursor'
import Scrollbar from './components/Scrollbar'
import './app.css'

export default function App() {
  useEffect(() => {
    // Prevent browser scroll restoration from initialising the page mid-scroll,
    // which makes Framer Motion's useScroll read a non-zero value on load and
    // hides the hero content via the opacity transform.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    })

    // Lenis 1.x intercepts wheel/touch but still drives native scroll position,
    // so Framer Motion useScroll works. Emitting a synthetic scroll event on
    // each Lenis tick keeps any scroll listeners perfectly in sync.
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
      <Cursor />
      <Scrollbar />
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Process />
        <Steps />
        <Contact />
      </main>
    </div>
  )
}
