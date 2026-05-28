import { useEffect, useRef } from 'react'
import { useScroll, useSpring } from 'framer-motion'

export default function Scrollbar() {
  const thumbRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const spring = useSpring(scrollYProgress, { stiffness: 220, damping: 34, restDelta: 0.001 })

  useEffect(() => {
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
  }, [spring])

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, bottom: 0,
      width: 6, zIndex: 9990, pointerEvents: 'none',
    }}>
      <div ref={thumbRef} style={{
        position: 'absolute', top: 0, width: '100%',
        background: '#c04a18', borderRadius: '999px',
        opacity: 0.75, willChange: 'transform, height',
      }} />
    </div>
  )
}
