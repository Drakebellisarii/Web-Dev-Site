import { useEffect, useRef } from 'react'

/**
 * DotField
 *
 * A single canvas grid of white dots on black. Every cell carries a base
 * ambient value; cells that fall inside the portrait box add luminance
 * sampled from `src`. The portrait emerges out of the same field that fills
 * the rest of the hero rather than sitting on top of it as a separate
 * graphic — that continuity is the whole point, so any tuning should widen
 * or soften the falloff at the portrait's edge rather than adding a new
 * visual element on top.
 *
 * `src` here is a normal studio portrait on a light backdrop, not a
 * pre-keyed black-background plate — samplePlate() does that keying itself:
 * bright, near-uniform pixels (the backdrop) are pushed toward zero through
 * a soft-edged mask (smoothstep, not a hard cutout, or the box edge shows),
 * and the remaining subject tones are remapped onto a lifted floor so dark
 * hair/clothing keep a visible silhouette instead of vanishing into the
 * canvas black.
 *
 * The main ongoing motion is a small pool of raindrops: each falls straight
 * down through its own grid column as a short bright streak, then blooms
 * into a brief expanding ring where it "lands" on the bottom row before
 * pausing and respawning elsewhere. Deliberately sparse (rainDrops) and
 * deliberately slow (rainSpeed) — this reads as atmosphere, not an effect.
 * A drop whose column crosses `textBox` splashes off its top edge instead
 * of falling through it — that impact seeds 4 smaller fragments that
 * scatter and arc back down under their own light gravity, then fade.
 *
 * The rest of the field carries an extremely faint per-cell shimmer —
 * independent random phase per cell (a hash, not a shared clock), so nearby
 * dots drift out of sync with each other and it reads as ambient noise, not
 * a sweep (a coordinated wave was tried earlier and cut — it read as a
 * moving beam). Confined to non-portrait cells via the same mask that keys
 * the backdrop, and small enough that it should be felt more than seen.
 *
 * Layer this behind the headline, full hero bounds. It's decorative, so
 * it's aria-hidden.
 *
 * Props
 *   src              source portrait: subject on a light/plain backdrop
 *   spacing          px between dot centers. 8-10 keeps facial features;
 *                    past ~14 the face collapses into a blob — a resolution
 *                    ceiling, not a tuning knob.
 *   ambient          base brightness of the background grid, 0-1
 *   ambientShimmer   amplitude of the random per-cell ambient flicker, 0-1
 *   portraitBox      where the portrait sits, as fractions of the canvas
 *   portraitDotScale dot-size multiplier over the portrait relative to the
 *                    ambient field (<1 shrinks them for more apparent detail)
 *   textBox          optional obstacle, as fractions of the canvas — a
 *                     falling drop whose column crosses it splashes off the
 *                     top edge into 4 fragments instead of falling through
 *   revealMs         entrance duration: uniform grid -> resolved portrait
 *   bgThreshold      luminance above which a source pixel counts as backdrop
 *   bgEdge           width of the soft mask transition below bgThreshold
 *   floor            minimum tone for the darkest subject pixel (hair/clothing)
 *   rainDrops        max concurrent raindrops — keep this low
 *   rainSpeed        base fall speed, px/sec
 */
const SPLASH_DURATION = 0.6 // seconds
const MAX_SPLASH_RADIUS = 3.2 // grid cells
const FRAGMENT_GRAVITY = 260 // px/sec^2
const FRAGMENT_LIGHT = 0.58 // dimmer + smaller than a falling drop's 0.75

export default function DotField({
  src,
  spacing = 9,
  ambient = 0.1,
  ambientShimmer = 0.022,
  dotScale = 0.52,
  portraitBox = { x: 0.52, y: 0.0, w: 0.46, h: 1.0 },
  portraitDotScale = 0.62,
  textBox = null,
  revealMs = 1600,
  bgThreshold = 0.82,
  bgEdge = 0.18,
  floor = 0.3,
  rainDrops = 3,
  rainSpeed = 130,
  className = '',
}) {
  const canvasRef = useRef(null)
  const plateRef = useRef(null)
  const rafRef = useRef(0)

  // ---- load the portrait plate -------------------------------------
  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => {
      if (!cancelled) plateRef.current = img
    }
    return () => {
      cancelled = true
    }
  }, [src])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let cols = 0
    let rows = 0
    let lum = null // Float32Array, portrait tone per cell, 0-1
    let mask = null // Float32Array, 1 = subject, 0 = backdrop — drives portrait dot-size shrink
    let phase = null // Float32Array, per-cell pseudo-random shimmer offset, 0-1
    let w = 0
    let h = 0
    let dpr = 1
    let start = performance.now()
    let lastT = start
    let visible = true
    let drops = []
    let fragments = []
    let textPx = null // { left, right, top } in canvas-local px, or null

    // Deterministic per-cell "randomness" so neighboring dots don't shimmer
    // in sync — that correlation is exactly what would read as a wave.
    function hash(gx, gy) {
      const s = Math.sin(gx * 12.9898 + gy * 78.233) * 43758.5453
      return s - Math.floor(s)
    }

    // Sample the plate once per resize, at grid resolution, so the render
    // loop never touches image data.
    function samplePlate() {
      lum = new Float32Array(cols * rows)
      mask = new Float32Array(cols * rows)
      const img = plateRef.current
      if (!img) return

      const box = {
        x: portraitBox.x * w,
        y: portraitBox.y * h,
        w: portraitBox.w * w,
        h: portraitBox.h * h,
      }

      // contain the plate inside the box, preserving aspect
      const scale = Math.min(box.w / img.width, box.h / img.height)
      const pw = img.width * scale
      const ph = img.height * scale
      const px = box.x + (box.w - pw) / 2
      const py = box.y + (box.h - ph) / 2

      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const octx = off.getContext('2d', { willReadFrequently: true })
      // Fill with white, not black: this is a "contain"-fit box around a
      // photo, so any letterboxed gap outside the drawn image must read as
      // backdrop (high raw -> masked to ~0), not as the darkest possible
      // subject pixel. Filling black here is exactly the hard-edged seam
      // this whole approach exists to avoid.
      octx.fillStyle = '#fff'
      octx.fillRect(0, 0, cols, rows)
      octx.drawImage(
        img,
        px / spacing,
        py / spacing,
        pw / spacing,
        ph / spacing
      )

      const data = octx.getImageData(0, 0, cols, rows).data
      for (let i = 0; i < cols * rows; i++) {
        const raw = data[i * 4] / 255
        // Key the light backdrop out with a soft edge — a hard cutout is
        // the box-edge seam that kills the illusion.
        const m = 1 - smoothstep(bgThreshold - bgEdge, bgThreshold, raw)
        // Remap subject tones onto a lifted floor so dark hair/sweater
        // hold their silhouette while facial highlights stay brightest.
        const tone = floor + (1 - floor) * clamp01(raw / bgThreshold)
        mask[i] = m
        lum[i] = m * tone
      }
    }

    // A raindrop is a column index + a falling pixel-y, so it always lands
    // on-grid. `stagger` seeds it already mid-fall (used once, on init) so
    // the effect doesn't take several seconds to become visible.
    function spawnDrop(stagger) {
      return {
        gx: Math.floor(Math.random() * Math.max(cols, 1)),
        y: stagger ? Math.random() * h : -spacing * (2 + Math.random() * 6),
        speed: rainSpeed * (0.75 + Math.random() * 0.5),
        state: 'falling', // 'falling' -> 'splash' -> 'waiting' -> 'falling'...
        splashT: 0,
        waitT: 0,
      }
    }

    function initDrops() {
      drops = []
      for (let i = 0; i < rainDrops; i++) drops.push(spawnDrop(true))
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / spacing) + 1
      rows = Math.ceil(h / spacing) + 1

      phase = new Float32Array(cols * rows)
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          phase[gy * cols + gx] = hash(gx, gy)
        }
      }

      textPx = textBox
        ? { left: textBox.x * w, right: (textBox.x + textBox.w) * w, top: textBox.y * h }
        : null

      samplePlate()
      initDrops()
      fragments = []
    }

    function updateDrop(d, dt) {
      if (d.state === 'falling') {
        const dropX = d.gx * spacing
        if (textPx && d.y >= textPx.top && dropX >= textPx.left && dropX <= textPx.right) {
          // Splashes off the text's top edge rather than through it — the
          // drop itself is spent; 4 smaller fragments carry the moment on.
          spawnFragments(dropX, textPx.top)
          d.state = 'waiting'
          d.waitT = 1 + Math.random() * 3.5
          return
        }
        d.y += d.speed * dt
        if (d.y >= h) {
          d.state = 'splash'
          d.splashT = 0
        }
      } else if (d.state === 'splash') {
        d.splashT += dt
        if (d.splashT >= SPLASH_DURATION) {
          d.state = 'waiting'
          d.waitT = 1 + Math.random() * 3.5
        }
      } else {
        d.waitT -= dt
        if (d.waitT <= 0) Object.assign(d, spawnDrop(false), { state: 'falling' })
      }
    }

    // Four fragments fan out and slightly up from the impact point, arc
    // back down under a light gravity, and fade — a splash, not a bounce.
    function spawnFragments(px, py) {
      const count = 4
      for (let i = 0; i < count; i++) {
        const spread = (i - (count - 1) / 2) / count
        const angle = -Math.PI / 2 + spread * Math.PI * 1.1
        const speed = 65 + Math.random() * 40
        fragments.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 0.45 + Math.random() * 0.25,
        })
      }
    }

    function updateFragments(dt) {
      for (let i = fragments.length - 1; i >= 0; i--) {
        const f = fragments[i]
        f.vy += FRAGMENT_GRAVITY * dt
        f.x += f.vx * dt
        f.y += f.vy * dt
        f.life += dt
        if (f.life >= f.maxLife || f.y > h + spacing) fragments.splice(i, 1)
      }
    }

    function addDropLight(map, idx, val) {
      map.set(idx, (map.get(idx) || 0) + val)
    }

    // Falling drops light a short streak in their own column; a landed
    // drop blooms into a brief expanding ring along the bottom row.
    function buildRainMap() {
      const map = new Map()
      const rCeil = Math.ceil(MAX_SPLASH_RADIUS) + 1
      for (const d of drops) {
        if (d.state === 'falling') {
          const gy = Math.min(rows - 1, Math.max(0, Math.round(d.y / spacing)))
          addDropLight(map, gy * cols + d.gx, 0.75)
          if (gy - 1 >= 0) addDropLight(map, (gy - 1) * cols + d.gx, 0.35)
          if (gy - 2 >= 0) addDropLight(map, (gy - 2) * cols + d.gx, 0.15)
        } else if (d.state === 'splash') {
          const t = d.splashT / SPLASH_DURATION
          const ringR = t * MAX_SPLASH_RADIUS
          const fade = 1 - t
          const cy0 = rows - 1
          for (let ddy = -rCeil; ddy <= 0; ddy++) {
            for (let ddx = -rCeil; ddx <= rCeil; ddx++) {
              const gx2 = d.gx + ddx
              const gy2 = cy0 + ddy
              if (gx2 < 0 || gx2 >= cols || gy2 < 0 || gy2 >= rows) continue
              const dist = Math.sqrt(ddx * ddx + ddy * ddy)
              const ring = Math.exp(-((dist - ringR) ** 2) / (2 * 0.6 * 0.6))
              const add = ring * fade * 0.55
              if (add > 0.02) addDropLight(map, gy2 * cols + gx2, add)
            }
          }
        }
      }
      for (const f of fragments) {
        const gx2 = Math.round(f.x / spacing)
        const gy2 = Math.round(f.y / spacing)
        if (gx2 < 0 || gx2 >= cols || gy2 < 0 || gy2 >= rows) continue
        const fade = 1 - f.life / f.maxLife
        addDropLight(map, gy2 * cols + gx2, FRAGMENT_LIGHT * fade)
      }
      return map
    }

    // ---- render -------------------------------------------------------
    const BUCKETS = 6
    const rMax = spacing * dotScale

    function frame(now) {
      rafRef.current = requestAnimationFrame(frame)
      if (!visible) return

      const dt = Math.min((now - lastT) / 1000, 0.05)
      lastT = now

      const reveal = reduced
        ? 1
        : easeOutCubic(Math.min((now - start) / revealMs, 1))

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, w, h)

      let rainMap = null
      if (!reduced) {
        for (const d of drops) updateDrop(d, dt)
        updateFragments(dt)
        rainMap = buildRainMap()
      }

      // Bucket dots by brightness so the whole field costs a handful of
      // fill() calls instead of one per dot.
      const paths = []
      for (let b = 0; b < BUCKETS; b++) paths.push(new Path2D())

      for (let gy = 0; gy < rows; gy++) {
        const cy = gy * spacing
        for (let gx = 0; gx < cols; gx++) {
          const cx = gx * spacing
          const idx = gy * cols + gx

          let v = ambient + lum[idx] * reveal
          if (rainMap) {
            const extra = rainMap.get(idx)
            if (extra) v += extra
          }

          // Extremely faint, per-cell-random ambient flicker — faded out
          // over the portrait via the same mask, so it only ever touches
          // the "empty" parts of the field.
          if (!reduced) {
            v += Math.sin(now * 0.0009 + phase[idx] * Math.PI * 2) * ambientShimmer * (1 - mask[idx])
          }

          if (v <= 0.035) continue
          v = Math.min(v, 1)

          // Dots read smaller over the portrait (blended by the same soft
          // mask that keys the backdrop) for more apparent facial detail.
          const sizeScale = 1 - mask[idx] * (1 - portraitDotScale)
          const r = rMax * sizeScale * Math.pow(v, 0.72)
          if (r < 0.28) continue

          const b = Math.min(BUCKETS - 1, Math.floor(v * BUCKETS))
          const path = paths[b]
          path.moveTo(cx + r, cy)
          path.arc(cx, cy, r, 0, Math.PI * 2)
        }
      }

      for (let b = 0; b < BUCKETS; b++) {
        ctx.fillStyle = `rgba(255,255,255,${(0.34 + (b / (BUCKETS - 1)) * 0.66).toFixed(3)})`
        ctx.fill(paths[b])
      }
    }

    // ---- wiring -------------------------------------------------------
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    // re-sample once the plate finishes decoding
    const poll = setInterval(() => {
      if (plateRef.current) {
        samplePlate()
        clearInterval(poll)
      }
    }, 60)

    start = performance.now()
    lastT = start
    rafRef.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearInterval(poll)
      ro.disconnect()
      io.disconnect()
    }
  }, [spacing, ambient, ambientShimmer, dotScale, portraitDotScale, revealMs, bgThreshold, bgEdge, floor, portraitBox, textBox, rainDrops, rainSpeed])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3)
}
function clamp01(x) {
  return x < 0 ? 0 : x > 1 ? 1 : x
}
function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}
