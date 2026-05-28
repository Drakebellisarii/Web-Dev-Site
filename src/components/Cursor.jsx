import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const DOT_SPRING  = { mass: 0.08, damping: 9,  stiffness: 140 }
const RING_SPRING = { mass: 0.3,  damping: 18, stiffness: 90  }

export default function Cursor() {
  const [hovered, setHovered] = useState(false)

  const dotX  = useSpring(useMotionValue(-200), DOT_SPRING)
  const dotY  = useSpring(useMotionValue(-200), DOT_SPRING)
  const ringX = useSpring(useMotionValue(-200), RING_SPRING)
  const ringY = useSpring(useMotionValue(-200), RING_SPRING)
  const opacity = useSpring(0, { mass: 0.1, damping: 12, stiffness: 150 })

  useEffect(() => {
    const move = (e) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      ringX.set(e.clientX)
      ringY.set(e.clientY)
    }
    const enter = () => opacity.set(1)
    const leave = () => opacity.set(0)
    const over = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label'))
        setHovered(true)
    }
    const out = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label'))
        setHovered(false)
    }

    window.addEventListener('pointermove', move)
    document.documentElement.addEventListener('pointerenter', enter)
    document.documentElement.addEventListener('pointerleave', leave)
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerout', out)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerenter', enter)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerout', out)
    }
  }, [dotX, dotY, ringX, ringY, opacity])

  // Both elements use a zero-size anchor at the cursor position.
  // The inner span is absolutely centered on that anchor via top/left 50% + translate(-50%,-50%).
  // This avoids the translateX/x conflict in framer-motion.
  return (
    <>
      <motion.span style={{ position: 'fixed', top: 0, left: 0, x: ringX, y: ringY, width: 0, height: 0, pointerEvents: 'none', zIndex: 99998, opacity }}>
        <span style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: hovered ? 42 : 28,
          height: hovered ? 42 : 28,
          borderRadius: '50%',
          border: '1.5px solid rgba(192,74,24,0.55)',
          transition: 'width 0.25s ease, height 0.25s ease',
          display: 'block',
        }} />
      </motion.span>

      <motion.span style={{ position: 'fixed', top: 0, left: 0, x: dotX, y: dotY, width: 0, height: 0, pointerEvents: 'none', zIndex: 99999, opacity }}>
        <span style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: hovered ? 6 : 8,
          height: hovered ? 6 : 8,
          borderRadius: '50%',
          background: 'var(--ember)',
          transition: 'width 0.2s ease, height 0.2s ease',
          display: 'block',
        }} />
      </motion.span>
    </>
  )
}
