import { useEffect, useRef, useState } from 'react'
import { useScroll, useSpring } from 'framer-motion'

export default function Scrollbar() {
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  )
  const thumbRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const spring = useSpring(scrollYProgress, { stiffness: 220, damping: 34, restDelta: 0.001 })

  useEffect(() => {
    if (isTouch) return
    const thumb = thumbRef.current
    if (!thumb) return

    const calcThumbHeight = () => {
      const viewH = window.innerHeight
      const docH = Math.max(document.documentElement.scrollHeight, viewH + 1)
      return Math.max(36, (viewH / docH) * viewH)
    }

    const update = (progress) => {
      if (!thumb) return
      const viewH = window.innerHeight
      const h = calcThumbHeight()
      thumb.style.height = `${h}px`
      thumb.style.transform = `translateY(${progress * (viewH - h)}px)`
    }

    update(spring.get())
    const unsubscribe = spring.on('change', update)
    const onResize = () => update(spring.get())
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(onResize)
    ro.observe(document.body)

    return () => {
      unsubscribe()
      window.removeEventListener('resize', onResize)
      ro.disconnect()
    }
  }, [isTouch, spring])

  if (isTouch) return null

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, bottom: 0,
      width: 6, zIndex: 9990, pointerEvents: 'none',
    }}>
      <div ref={thumbRef} style={{
        position: 'absolute', top: 0, width: '100%',
        background: '#ffffff', borderRadius: '999px',
        mixBlendMode: 'difference', opacity: 0.9, willChange: 'transform, height',
      }} />
    </div>
  )
}
