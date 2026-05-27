import { useEffect, useState } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav__pill">
        <a href="#top" className="nav__monogram" aria-label="Drake Bellisari — home">
          <span className="nav__bracket">[</span>
          <span className="nav__monogram-letters">DPB</span>
          <span className="nav__bracket">]</span>
        </a>

        <div className="nav__sep" aria-hidden />

        <nav className="nav__links">
          <a href="#work">Work</a>
          <a href="#skills">Skills</a>
          <a href="#approach">Approach</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav__sep nav__sep--hide" aria-hidden />

        <div className="nav__location">
          <span className="nav__pulse" aria-hidden />
          <span>Hartford, CT</span>
        </div>
      </div>
    </header>
  )
}
