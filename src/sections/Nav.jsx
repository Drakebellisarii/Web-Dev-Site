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
    // Observe each section — whichever crosses the 30% mark from top becomes active
    const observers = []

    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <nav className="nav-vertical" aria-label="Site navigation">
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
