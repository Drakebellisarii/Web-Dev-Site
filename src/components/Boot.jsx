import { useEffect, useRef, useState } from 'react'

// Real progress, not theater. Streams the hero film byte-by-byte (85%) and
// waits on the webfonts (15%), then fades to reveal the site. Hands the
// fetched film back as a blob URL so the hero never downloads it twice.
// Drop your real hero clip in public/hero.mp4 — until then this fetch 404s
// gracefully and the hero's dot-grid floor stands in as the background.
const FILM = '/hero.mp4'
const FILM_WEIGHT = 0.85
const FONT_WEIGHT = 0.15
const MIN_BOOT_MS = 1400 // don't flash even on a hot cache
const FAILSAFE_MS = 15000 // never trap a visitor on a broken connection

export default function Boot({ onReady, onGone }) {
  const [shown, setShown] = useState(0) // displayed % — eased toward target
  const [leaving, setLeaving] = useState(false)
  const target = useRef(0)
  const filmProgress = useRef(0)
  const fontProgress = useRef(0)
  const done = useRef(false)

  useEffect(() => {
    const startedAt = performance.now()
    let raf = 0
    let failsafe = 0
    let blobUrl = null

    const setTarget = () => {
      target.current = Math.min(
        1,
        filmProgress.current * FILM_WEIGHT + fontProgress.current * FONT_WEIGHT
      )
    }

    // Ease the visible counter toward the real target so it reads as a
    // boot sequence, not a nervous stat readout
    const tick = () => {
      setShown((prev) => {
        const next = prev + (target.current * 100 - prev) * 0.09
        return next > 99.6 ? 100 : next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const fetchFilm = async () => {
      try {
        const res = await fetch(FILM)
        if (!res.ok || !res.body) throw new Error('bad response')
        const total = +res.headers.get('content-length') || 9_000_000
        const reader = res.body.getReader()
        const chunks = []
        let received = 0
        for (;;) {
          const { done: eof, value } = await reader.read()
          if (eof) break
          chunks.push(value)
          received += value.length
          filmProgress.current = Math.min(1, received / total)
          setTarget()
        }
        filmProgress.current = 1
        setTarget()
        blobUrl = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }))
      } catch {
        // Offline/dev hiccup — let the hero fall back to the plain URL
        filmProgress.current = 1
        setTarget()
      }
    }

    const watchFonts = document.fonts.ready.then(() => {
      fontProgress.current = 1
      setTarget()
    })

    const finish = () => {
      if (done.current) return
      done.current = true
      onReady(blobUrl || FILM)
      setLeaving(true)
    }

    Promise.all([fetchFilm(), watchFonts]).then(() => {
      const wait = Math.max(0, MIN_BOOT_MS - (performance.now() - startedAt))
      // Small hold at 100 so the bar visibly completes before the CRT cuts
      setTimeout(finish, wait + 350)
    })
    failsafe = setTimeout(() => {
      filmProgress.current = 1
      fontProgress.current = 1
      setTarget()
      finish()
    }, FAILSAFE_MS)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(failsafe)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Lock scroll while booting
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const pct = Math.round(shown)

  return (
    <div
      className={`boot${leaving ? ' boot--off' : ''}`}
      role="status"
      aria-label={`Loading site, ${pct}%`}
      onTransitionEnd={(e) => {
        if (leaving && e.target === e.currentTarget && e.propertyName === 'opacity') onGone()
      }}
    >
      <div className="boot__core">
        <div className="boot__pct" aria-hidden>
          {pct}
          <span className="boot__pct-sign">%</span>
        </div>

        <div className="boot__bar" aria-hidden>
          <div className="boot__bar-fill" style={{ width: `${pct}%` }} />
        </div>

        <p className="boot__label eyebrow" aria-hidden>
          Loading
        </p>
      </div>
    </div>
  )
}
