import { useEffect, useState } from 'react'
import Magnetic from '../components/Magnetic'

const LINKS = [
  { href: '#about',   label: 'about',   id: 'about' },
  { href: '#work',    label: 'work',    id: 'work' },
  { href: '#contact', label: 'contact', id: 'contact' },
]

// Every section the theme-detector watches — a superset of the nav LINKS,
// since sections without a nav item (About) still flip the header color
const THEME_IDS = ['about', 'work', 'contact']

// Sections rendered on a light background — header text flips to dark ink
// over these. The hero is a newsprint front page now, so the whole site is
// paper-toned and the header reads in ink everywhere.
const LIGHT_SECTIONS = new Set(['top', 'about', 'work', 'contact'])

export default function Nav() {
  const [active, setActive] = useState('top')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // Active section: whichever top edge is closest to 30% down the viewport
      const threshold = window.innerHeight * 0.3
      let current = 'top'
      for (const id of THEME_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= threshold) current = id
      }
      setActive(current)
      setScrolled(window.scrollY > 24)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const theme = LIGHT_SECTIONS.has(active) ? 'light' : 'dark'

  return (
    <header
      className={`site-header${scrolled ? ' is-scrolled' : ''}`}
      data-theme={theme}
    >
      <div className="site-header__bar shell">
        <a href="#top" className="site-header__logo" onClick={() => setOpen(false)}>
          DrakeSites<span className="site-header__logo-dot">.</span>
        </a>

        <nav className="site-header__nav" aria-label="Primary">
          {LINKS.map(({ href, label, id }) => (
            <a
              key={id}
              href={href}
              className={`site-header__link${active === id ? ' is-active' : ''}`}
              aria-current={active === id ? 'page' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>

        <Magnetic>
          <a href="#contact" className="site-header__cta">
            start a project
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path d="M2 8 L8 2 M3.4 2 L8 2 L8 6.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Magnetic>

        <button
          className={`site-header__burger${open ? ' is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`site-header__menu${open ? ' is-open' : ''}`}>
        <nav aria-label="Mobile">
          {LINKS.map(({ href, label, id }) => (
            <a key={id} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="site-header__menu-cta"
            onClick={() => setOpen(false)}
          >
            start a project
          </a>
        </nav>
      </div>
    </header>
  )
}
