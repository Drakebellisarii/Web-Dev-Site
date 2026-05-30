# DESIGN.md — DPBellisari WebDev

## Color System
```
--paper:      #efe8d8   warm parchment — primary light surface
--paper-2:    #e6dec9   slightly deeper parchment
--char:       #14160f   near-black with green undertone — dark sections
--moss-deep:  #1a1f1a   deep forest — Process section bg
--ink:        #1e221b   body text on light
--ink-2:      #3a3f33   secondary text
--ink-mute:   #6c6f5e   tertiary / labels
--ember:      #c04a18   THE accent — burnt orange, used sparingly
--ember-deep: #9a3a13   hover/active ember
--ember-glow: #d8632a   lighter ember for dark backgrounds
--lichen:     #b6b393   warm taupe — muted labels on dark
--rule:       rgba(30,34,27,0.18)
--rule-soft:  rgba(30,34,27,0.08)
--rule-light: rgba(239,232,216,0.18)
```

## Typography
- **Display:** Fraunces (variable — SOFT, WONK, opsz axes) — headings, project names, numbers
  - `font-variation-settings: "SOFT" 50, "WONK" 0, "opsz" 144` — default display
  - `font-variation-settings: "SOFT" 100, "WONK" 1, "opsz" 144` — italic/expressive variant
  - `font-weight: 350` — intentionally light
  - `letter-spacing: -0.035em`
  - `line-height: 0.92`
- **Body:** Inter Tight — all running text, 16px/1.55
- **Mono:** JetBrains Mono — eyebrows, labels, metadata, tags
  - Eyebrow: 11px, `letter-spacing: 0.22em`, uppercase, weight 500

## Utility Classes
- `.display` — Fraunces, weight 350, SOFT 50, letter-spacing -0.035em
- `.display-italic` — italic + SOFT 100, WONK 1
- `.eyebrow` — mono, 11px, 0.22em tracking, uppercase
- `.eyebrow--ember` — ember accent color
- `.eyebrow-dot` — 6px ember circle, precedes eyebrow text
- `.shell` — max-width 1440px, margin auto, padding 0 48px (0 24px mobile)

## Motion Principles
- Scroll-driven: `useScroll` + `useTransform` for parallax and reveals
- Spring physics for cursor and scrollbar
- `AnimatePresence` with `mode="wait"` for step transitions
- Entrance: opacity 0→1 + x/y offset, ease [0.16, 1, 0.3, 1]
- No bounce, no elastic, no CSS layout property animation
- Floating SVG paths in Process section — subtle, very low opacity

## Section Backgrounds
- Hero: `--char` + video
- Manifesto: `--paper`
- Steps (approach): `#000` / near-black
- Process (skills): `--moss-deep` (#1a1f1a)
- Projects: `--paper-2`
- Contact: `--char`

## Spacing Rhythm
- Section vertical padding: 140–180px desktop, 72–80px mobile
- Shell horizontal padding: 48px desktop, 24px mobile
- Component gap baseline: 8px, 12px, 16px, 24px, 32px, 48px, 64px, 80px

## Component Patterns
- **Eyebrow rows:** `§XX — Label` in ember, with 6px dot prefix
- **Rules/dividers:** 1px solid `--rule` or `--rule-light`, sometimes with ember fill animation
- **Tags/pills:** mono, 10px, 0.16em tracking, uppercase, border-radius 999px, border 1px `--rule`
- **Buttons:** No border-radius (`.btn`), ember fill or ghost, mono uppercase
- **Cards:** Not used — layout is editorial, section-based, not card-grid
