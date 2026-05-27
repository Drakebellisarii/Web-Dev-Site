// Hand-crafted botanical SVG elements used as parallax layers.
// Stroke-only line art so they read like editorial illustrations.

export function FernBranch({ className = '', style = {}, stroke = 'currentColor', strokeWidth = 1 }) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 600" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M100 590 C100 500, 100 360, 100 20" />
        {Array.from({ length: 22 }).map((_, i) => {
          const y = 40 + i * 24
          const len = 80 - i * 2.6
          const curve = 18 + i * 0.6
          return (
            <g key={i}>
              <path d={`M100 ${y} Q ${100 - len * 0.4} ${y - curve}, ${100 - len} ${y - curve * 1.6}`} />
              <path d={`M100 ${y + 12} Q ${100 + len * 0.4} ${y + 12 - curve}, ${100 + len} ${y + 12 - curve * 1.6}`} />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export function PineBough({ className = '', style = {}, stroke = 'currentColor', strokeWidth = 1.1 }) {
  return (
    <svg className={className} style={style} viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 110 C 120 90, 260 110, 490 100" />
        {Array.from({ length: 40 }).map((_, i) => {
          const x = 30 + i * 11
          const baseY = 110 - Math.sin(i * 0.3) * 4
          const upLen = 30 + Math.sin(i * 0.5) * 10
          const downLen = 26 + Math.cos(i * 0.4) * 8
          return (
            <g key={i}>
              <line x1={x} y1={baseY} x2={x + 2} y2={baseY - upLen} />
              <line x1={x} y1={baseY} x2={x - 2} y2={baseY + downLen} />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export function LeafCluster({ className = '', style = {}, stroke = 'currentColor', fill = 'none', strokeWidth = 1 }) {
  return (
    <svg className={className} style={style} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <g stroke={stroke} strokeWidth={strokeWidth} fill={fill} strokeLinecap="round" strokeLinejoin="round">
        <path d="M120 220 C 60 180, 30 120, 80 60 C 100 100, 130 130, 130 200" />
        <path d="M120 220 C 180 180, 210 120, 160 60 C 140 100, 110 130, 110 200" />
        <path d="M120 220 L 120 50" />
        <path d="M120 130 C 80 110, 60 80, 75 50" />
        <path d="M120 130 C 160 110, 180 80, 165 50" />
      </g>
    </svg>
  )
}

export function SunDisc({ className = '', style = {}, stroke = 'currentColor', strokeWidth = 1 }) {
  return (
    <svg className={className} style={style} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <g stroke={stroke} strokeWidth={strokeWidth} fill="none">
        <circle cx="200" cy="200" r="120" />
        <circle cx="200" cy="200" r="150" strokeDasharray="2 6" />
        <circle cx="200" cy="200" r="180" strokeDasharray="1 10" />
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2
          const x1 = 200 + Math.cos(a) * 195
          const y1 = 200 + Math.sin(a) * 195
          const x2 = 200 + Math.cos(a) * 205
          const y2 = 200 + Math.sin(a) * 205
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </g>
    </svg>
  )
}

export function TopoLines({ className = '', style = {}, stroke = 'currentColor', strokeWidth = 0.8, count = 9 }) {
  return (
    <svg className={className} style={style} viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden>
      <g stroke={stroke} strokeWidth={strokeWidth} fill="none">
        {Array.from({ length: count }).map((_, i) => {
          const r = 80 + i * 50
          return <ellipse key={i} cx="400" cy="400" rx={r} ry={r * 0.75} />
        })}
      </g>
    </svg>
  )
}

export function Cross({ className = '', style = {}, stroke = 'currentColor', size = 14, strokeWidth = 1 }) {
  return (
    <svg className={className} style={{ width: size, height: size, ...style }} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <line x1="7" y1="0" x2="7" y2="14" stroke={stroke} strokeWidth={strokeWidth} />
      <line x1="0" y1="7" x2="14" y2="7" stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  )
}
