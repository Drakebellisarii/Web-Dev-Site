import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Magnetic hover wrapper — the child drifts toward the cursor while it's
// over the element and springs back to rest on leave. Pointer-hover devices
// only; on touch it renders a plain wrapper with no listeners.
const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

const SPRING = { stiffness: 320, damping: 22, mass: 0.6 }

export default function Magnetic({ children, strength = 0.3, block = false }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, SPRING)
  const sy = useSpring(y, SPRING)

  if (!canHover) {
    return <span style={{ display: block ? 'block' : 'inline-block' }}>{children}</span>
  }

  const onMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ display: block ? 'block' : 'inline-block', x: sx, y: sy }}
    >
      {children}
    </motion.span>
  )
}
