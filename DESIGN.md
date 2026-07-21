# DESIGN.md — DPBellisari WebDev

## Color System
Strict grayscale. No accent color — hierarchy comes from weight, size, spacing, and gray value only.
```
--black:      #0a0a0a   primary ink / dark section bg
--gray-950:   #131313
--gray-900:   #1b1b1b
--gray-800:   #2a2a2a
--gray-700:   #3d3d3d
--gray-600:   #565656
--gray-500:   #767676
--gray-400:   #9a9a9a
--gray-300:   #bcbcbc
--gray-200:   #dcdcdc
--gray-100:   #ececec
--gray-50:    #f6f6f6
--white:      #ffffff

--surface / --surface-alt          light section backgrounds (white / gray-50)
--surface-dark / --surface-dark-alt  dark section backgrounds (black / gray-950)
--ink / --ink-soft / --ink-faint   text on light surfaces
--ink-on-dark / -soft / -faint     text on dark surfaces
--line / --line-soft               hairlines on light surfaces
--line-dark / --line-dark-soft     hairlines on dark surfaces
```

## Typography
Exactly two families, no exceptions.
- **Display — Fraunces** (variable: `opsz` 9–144, `wght` 300–900). Weight 600–700, `opsz` 144, no italic softness axis — pushed heavy and confident, not literary. Used for headlines, section titles, project names, the manifesto statement, numerals.
- **Sans — Inter Tight.** All body copy, UI chrome, labels, eyebrows, buttons, nav. Eyebrows are Inter Tight (11px, uppercase, 0.2em tracking, weight 600) — there is no separate mono face.

## Utility Classes
- `.display` — Fraunces, weight 700, letter-spacing -0.02em, line-height 0.98
- `.display-italic` — italic, weight 500
- `.eyebrow` — Inter Tight, 11px, 0.2em tracking, uppercase, weight 600
- `.shell` — max-width 1440px, margin auto, padding 0 48px (0 24px mobile)
- `--radius: 3px` — the one corner radius used everywhere (browser frames, pills use 999px for true pills; everything else uses this)

## Header
No top bar. Two fixed, corner-anchored elements:
- `.corner-mark` (top-left) — a +/× toggle that expands into `.site-menu`, a fullscreen black overlay with stacked Fraunces links.
- `.corner-cta` (top-right) — an always-visible "Book a call" pill linking straight to `SCHEDULING_URL` (see `src/siteConfig.js`).

Both use `mix-blend-mode: difference` in white, so they read correctly over every section — black or white — with zero scroll-based theme-detection JS.

## Motion Principles
- Framer Motion for orchestrated entrances: opacity 0→1 + y offset, staggered via `custom` index, ease `[0.16, 1, 0.3, 1]`.
- `AnimatePresence` for the fullscreen menu and status transitions.
- Springs (Magnetic hover, cursor-free) use the existing spring configs in `Magnetic.jsx` / `Scrollbar.jsx`.
- `DotField` (`src/components/DotField.jsx`) — the one recurring visual motif. `variant="floor"` (hero) is a perspective-tilted, pointer-reactive dot plane with a slow drift loop. `variant="flat"` (manifesto) is a static, near-invisible texture. No image/canvas assets — pure CSS radial-gradient + mask.
- No bounce/elastic easing. No CSS layout-property animation.

## Section Backgrounds (black/white alternation carries the rhythm)
- Hero: `--black` + `DotField` floor + video placeholder slot
- About: `--surface`
- Projects: `--surface`
- Testimonials: `--black`
- Process: `--surface`
- Tech strip: `--surface-alt`
- Manifesto: `--black` + `DotField` flat
- Closing CTA / Contact: `--black`

## Spacing Rhythm
- Section vertical padding: `clamp(96px, 14vh, 176px)` on the large sections, tighter (`clamp(28–48px, …)`) on strips.
- Shell horizontal padding: 48px desktop, 24px mobile.
- Component gap baseline: 8, 12, 16, 24, 32, 48, 64, 80px via `clamp()`.

## Component Patterns
- **Eyebrow rows:** small-caps-style uppercase Inter Tight labels, no icon prefix.
- **Rules/dividers:** 1px solid `--line` / `--line-dark`, used to separate stacked list items (testimonials, process) instead of cards.
- **Tags/pills:** Inter Tight, 10.5px, uppercase, 999px radius, 1px `--line` border.
- **Buttons:** `--radius: 999px` (pill), solid white-on-black or black-on-white fill for primary actions (`.cta__book`, `.contact__submit`); text-plus-underline for secondary/ghost actions (`.cta__secondary`, `.hero__cta`).
- **Cards:** Not used — layout stays editorial/section-based. The one exception is `.browser-frame` (hairline device chrome for project mockups).
- **Placeholders:** photo (`About`) and video (`Hero`) slots are built to the real asset's aspect ratio and drop-in path — see the comments in `About.jsx` and `Boot.jsx` for exactly what file/prop to swap.
