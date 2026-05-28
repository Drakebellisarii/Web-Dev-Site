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
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
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
