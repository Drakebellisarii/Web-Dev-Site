import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Magnetic from '../components/Magnetic'

// No top bar. Two fixed, corner-anchored elements — a toggle mark and a
// booking pill — sit directly on the page with mix-blend-mode: difference,
// so they read correctly over both black and white sections without any
// scroll-based theme detection. The mark expands into a fullscreen menu.
const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
]

const EASE = [0.16, 1, 0.3, 1]

export default function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <div className="corner-brand">
        <button
          type="button"
          className={`corner-mark${open ? ' is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span />
          <span />
        </button>
        <span className="corner-name" aria-hidden="true">Drake Bellisari</span>
      </div>

      <Magnetic strength={0.2} className="corner-cta-wrap">
        <a href="#book" className="corner-cta">
          Book a call
          <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
            <path d="M0 4.5h12M8.5 1l3.5 3.5L8.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </Magnetic>

      <AnimatePresence>
        {open && (
          <motion.div
            className="site-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <nav className="site-menu__links" aria-label="Primary">
              {LINKS.map(({ href, label }, i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.6, delay: 0.08 * i, ease: EASE }}
                >
                  {label}
                </motion.a>
              ))}
            </nav>

            <motion.div
              className="site-menu__foot"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
            >
              <a href="#book" className="site-menu__book" onClick={() => setOpen(false)}>
                Book a call
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                  <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <span className="eyebrow">Hartford, CT &middot; dpbellisari@gmail.com</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
