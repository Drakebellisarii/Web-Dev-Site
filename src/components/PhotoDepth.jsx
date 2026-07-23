import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * PhotoDepth
 *
 * A two-layer "cutout" parallax standing in for a real depth map. No
 * ML depth-estimation tool was available to generate one, and imagery is
 * Drake's to produce — so instead this reuses the subject/background
 * separation technique already proven in DotField.jsx: a live, in-browser
 * canvas pass keys the light studio backdrop out via a luminance threshold
 * (soft-edged, same smoothstep approach), producing a mask for the subject
 * silhouette. That mask becomes a CSS mask-image on a sharp foreground
 * copy of the photo, layered over a softly blurred, slightly larger
 * background copy. The two move at different rates under the cursor, plus
 * a subtle perspective tilt on the frame — the same illusion a real
 * depth-map parallax produces, computed rather than supplied.
 *
 * Pass `depthSrc` to use a real depth map instead (e.g. exported from
 * Photoshop's Neural Filter or an online depth tool) — sharper edges than
 * the computed mask, same rendering pipeline either way.
 */
const SPRING = { stiffness: 120, damping: 18, mass: 0.8 }
const BG_AMOUNT = 8 // px
const FG_AMOUNT = 22 // px
const TILT_DEG = 5

export default function PhotoDepth({ src, depthSrc, alt = '', className = '' }) {
  const reduced = useReducedMotion()
  const containerRef = useRef(null)
  const [maskUrl, setMaskUrl] = useState(null)

  const bgX = useSpring(useMotionValue(0), SPRING)
  const bgY = useSpring(useMotionValue(0), SPRING)
  const fgX = useSpring(useMotionValue(0), SPRING)
  const fgY = useSpring(useMotionValue(0), SPRING)
  const rotX = useSpring(useMotionValue(0), SPRING)
  const rotY = useSpring(useMotionValue(0), SPRING)

  // ---- build the depth mask (skipped entirely if a real one was passed
  // in — depthSrc is used directly in render instead) ---------------------
  useEffect(() => {
    if (depthSrc) return
    let cancelled = false

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => {
      if (cancelled) return
      const w = 480
      const h = Math.round((img.height / img.width) * w)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)

      const frame = ctx.getImageData(0, 0, w, h)
      const data = frame.data
      const bgThreshold = 0.82
      const bgEdge = 0.18
      for (let i = 0; i < data.length; i += 4) {
        const raw = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
        const mask = 1 - smoothstep(bgThreshold - bgEdge, bgThreshold, raw)
        data[i + 3] = Math.round(mask * 255)
      }
      ctx.putImageData(frame, 0, 0)
      if (!cancelled) setMaskUrl(canvas.toDataURL('image/png'))
    }

    return () => { cancelled = true }
  }, [src, depthSrc])

  // ---- pointer tracking -------------------------------------------------
  useEffect(() => {
    const el = containerRef.current
    if (!el || reduced || !window.matchMedia('(pointer: fine)').matches) return

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      bgX.set(-px * BG_AMOUNT)
      bgY.set(-py * BG_AMOUNT)
      fgX.set(px * FG_AMOUNT)
      fgY.set(py * FG_AMOUNT)
      rotY.set(px * TILT_DEG)
      rotX.set(-py * TILT_DEG)
    }
    const onLeave = () => {
      bgX.set(0); bgY.set(0)
      fgX.set(0); fgY.set(0)
      rotX.set(0); rotY.set(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced, bgX, bgY, fgX, fgY, rotX, rotY])

  const effectiveMask = depthSrc || maskUrl

  return (
    <motion.div
      ref={containerRef}
      className={`photo-depth${className ? ` ${className}` : ''}`}
      style={{ perspective: 800, rotateX: rotX, rotateY: rotY }}
    >
      <motion.img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="photo-depth__bg"
        style={{ x: bgX, y: bgY }}
      />
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className="photo-depth__fg"
        style={{
          x: fgX,
          y: fgY,
          WebkitMaskImage: effectiveMask ? `url(${effectiveMask})` : undefined,
          maskImage: effectiveMask ? `url(${effectiveMask})` : undefined,
        }}
      />
    </motion.div>
  )
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}
