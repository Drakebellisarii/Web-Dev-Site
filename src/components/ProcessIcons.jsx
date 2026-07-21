// Hand-built, single-stroke geometric marks — no icon pack. Kept to the
// same hairline weight as the browser-frame borders and dot-grid so they
// read as part of one drawn system, not a dropped-in library.
const shared = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.1, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function DiscoverIcon(props) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" {...props}>
      <circle cx="14" cy="14" r="9.5" {...shared} />
      <circle cx="14" cy="14" r="1" fill="currentColor" stroke="none" />
      <line x1="20.6" y1="20.6" x2="27" y2="27" {...shared} />
    </svg>
  )
}

export function DesignIcon(props) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" {...props}>
      <circle cx="12.5" cy="14" r="8.5" {...shared} />
      <circle cx="19.5" cy="14" r="8.5" {...shared} />
    </svg>
  )
}

export function BuildIcon(props) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" {...props}>
      <path d="M16 3 L28 9.5 L16 16 L4 9.5 Z" {...shared} />
      <path d="M4 16 L16 22.5 L28 16" {...shared} />
      <path d="M4 22.5 L16 29 L28 22.5" {...shared} />
    </svg>
  )
}

export function LaunchIcon(props) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" {...props}>
      <line x1="5" y1="27" x2="27" y2="5" {...shared} />
      <path d="M17 5 H27 V15" {...shared} />
    </svg>
  )
}
