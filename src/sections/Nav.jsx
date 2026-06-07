import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#approach', label: 'Approach' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on scroll
  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    window.addEventListener('scroll', close, { passive: true, once: true })
    return () => window.removeEventListener('scroll', close)
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nav__pill">
          <a href="#top" className="nav__monogram" aria-label="Drake Bellisari — home">
            <span className="nav__bracket">[</span>
            <span className="nav__monogram-letters">Drake's Sites</span>
            <span className="nav__bracket">]</span>
          </a>

          <div className="nav__sep" aria-hidden />

          <nav className="nav__links">
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </nav>

          {/* Hamburger — mobile only */}
          <button
            className={`nav__burger${menuOpen ? ' nav__burger--open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="nav__mobile-menu" role="dialog" aria-label="Navigation">
          <nav className="nav__mobile-links">
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} onClick={close}>{label}</a>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
