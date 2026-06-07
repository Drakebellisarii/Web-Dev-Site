import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#top',      label: 'Home',     id: 'top' },
  { href: '#work',     label: 'Work',     id: 'work' },
  { href: '#skills',   label: 'Skills',   id: 'skills' },
  { href: '#approach', label: 'Approach', id: 'approach' },
  { href: '#contact',  label: 'Contact',  id: 'contact' },
]

export default function Nav() {
  const [active, setActive] = useState('top')

  useEffect(() => {
    const getActive = () => {
      // Find whichever section's top edge is closest to 30% down the viewport
      const threshold = window.innerHeight * 0.3

      let current = LINKS[0].id
      for (const { id } of LINKS) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= threshold) current = id
      }
      setActive(current)
    }

    getActive()
    window.addEventListener('scroll', getActive, { passive: true })
    return () => window.removeEventListener('scroll', getActive)
  }, [])

  return (
    <nav className="nav-vertical" data-section={active} aria-label="Site navigation">
      {LINKS.map(({ href, label, id }) => (
        <a
          key={id}
          href={href}
          className={`nav-vertical__item${active === id ? ' is-active' : ''}`}
          aria-current={active === id ? 'page' : undefined}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}
