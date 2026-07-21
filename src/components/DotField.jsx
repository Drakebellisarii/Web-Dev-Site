import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

// A white dot-grid on black, built entirely from CSS (no image assets).
// "floor" tilts the grid into a receding 3D plane and drifts + tracks the
// pointer, used behind the hero's video placeholder. "flat" is a static,
// near-invisible texture used behind the manifesto's typography.
const TILT_SPRING = { stiffness: 60, damping: 20, mass: 0.6 }

export default function DotField({ variant = 'floor' }) {
  const reduced = useReducedMotion()
  const wrapRef = useRef(null)
  const rx = useSpring(useMotionValue(0), TILT_SPRING)
  const ry = useSpring(useMotionValue(0), TILT_SPRING)

  if (variant === 'flat') {
    return <div className="dotfield dotfield--flat" aria-hidden="true" />
  }

  const onMove = (e) => {
    if (reduced) return
    const el = wrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 8)
    rx.set(py * -6)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <div
      ref={wrapRef}
      className="dotfield dotfield--floor"
      aria-hidden="true"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div
        className="dotfield__plane"
        style={{ rotateX: rx, rotateY: ry }}
      />
      <div className="dotfield__horizon" />
    </div>
  )
}
