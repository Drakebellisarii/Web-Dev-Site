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
Two core families, plus one deliberate exception for the single biggest moment on the page.
- **Display — Baskerville** (`--display`, native on Mac/iOS; `Libre Baskerville` webfont fallback for everyone else). Weight 700 for headlines, 400 italic for pull-quotes/emphasis/signature moments (e.g. the "Drake Bellisari" name in the header). Used for section titles, project names, process steps, nav-menu links, the boot loader's percentage counter — every header *except* the hero headline.
- **Sans — Inter Tight** (`--sans`). All body copy, UI chrome, labels, eyebrows, buttons, nav. Eyebrows are Inter Tight (11px, uppercase, 0.2em tracking, weight 600) — there is no separate mono face.
- **Display-huge — Climate Crisis** (`--display-huge`). A single-weight, deliberately blocky third face, scoped *only* to the hero headline ("I build Premium Software") — the one moment meant to hit hardest. Not used anywhere else.

## Utility Classes
- `.display` — Baskerville, weight 700, letter-spacing -0.02em, line-height 0.98
- `.display-italic` — italic, weight 400 (Libre Baskerville only ships 400/400-italic/700)
- `.eyebrow` — Inter Tight, 11px, 0.2em tracking, uppercase, weight 600
- `.shell` — max-width 1440px, margin auto, padding 0 48px (0 24px mobile)
- `--radius: 3px` — the one corner radius used everywhere (browser frames, pills use 999px for true pills; everything else uses this)

## Header
No top bar. Two fixed, corner-anchored clusters:
- `.corner-brand` (top-left) — a standard inline logo-plus-wordmark lockup: `.corner-mark`, a +/× toggle that expands into `.site-menu` (a fullscreen black overlay with stacked Baskerville links), then `.corner-name` — "Drake Bellisari" in italic Baskerville, sized up (`clamp(22px, 2.6vw, 27px)`), fixed burnt orange (`#c04a18`). This is the one deliberate spot of color on the whole site.
- `.corner-cta` (top-right) — an always-visible "Book a call" pill linking to `#book`, the `Scheduler` block in the closing CTA section.

`.corner-mark` and `.corner-cta` use `mix-blend-mode: difference` in white, so they read correctly over every section — black or white — with zero scroll-based theme-detection JS. `.corner-name` deliberately does *not* blend — the burnt orange sits mid-tone enough to read on both black and white already, and inverting it per section would look like a glitch, not a flourish.

Gotcha worth knowing: `Magnetic.jsx`'s hover wrapper is a plain in-flow `<span>`. Wrapping an already-`position: fixed` child (like `.corner-cta`) in it leaves a phantom empty line-box sitting in the document flow, quietly pushing every section down by one line-height. Fixed via a `className` passthrough on `Magnetic` — see `.corner-cta-wrap { position: fixed; }`. Any future fixed-position element that gets wrapped in `Magnetic` needs the same treatment.

## Motion Principles
- Framer Motion for most orchestrated entrances: opacity 0→1 + y offset, staggered via `custom` index, ease `[0.16, 1, 0.3, 1]`. `AnimatePresence` for the fullscreen menu and status transitions.
- The hero's own text entrance is GSAP (`gsap.timeline`, `src/sections/Hero.jsx`) — a per-line `clip-path` wipe-up (`inset(0 0 100% 0)` -> `inset(0 0 0% 0)`) plus a small y-offset, `power3.out`, 0.08s stagger. `prefers-reduced-motion` skips straight to the resolved state via `gsap.set`.
- Springs (Magnetic hover, cursor-free) use the existing spring configs in `Magnetic.jsx` / `Scrollbar.jsx`.
- `DotField` (`src/components/DotField.jsx`) — a single `<canvas>` grid of white dots on black, used only in the hero. Cells inside a "portrait box" sample luminance from `public/Drake.webp` (background keyed out via a soft luminance mask, subject tones remapped onto a lifted floor) so the founder's portrait resolves out of the same field that fills the rest of the hero, rather than sitting on top of it as a pasted-in graphic. Portrait-region dots render smaller than the ambient field (`portraitDotScale`) for more apparent facial detail. Entrance is a one-time reveal (uniform grid -> resolved portrait).
- The main ongoing motion in the field is a small, sparse pool of raindrops (`rainDrops`, default 3): each falls straight down through its own grid column as a short bright streak, then blooms into a brief expanding ring where it lands on the bottom row, pauses, and respawns elsewhere. Deliberately slow (`rainSpeed`) and deliberately few — reads as atmosphere, not an effect. A drop whose column crosses `textBox` (the headline's measured bounding box, passed down from `Hero.jsx` and remeasured on resize) splashes off its top edge instead of falling through it — that impact seeds 4 fragments, dimmer/smaller than a normal drop, that scatter outward under a light gravity and fade within half a second.
- Everywhere else in the field carries an extremely faint, per-cell-random ambient shimmer (`ambientShimmer`, default 0.022 — deliberately barely-there) confined to non-portrait cells via the same mask that keys the backdrop. Each cell's phase is an independent hash, not a shared clock, so neighbors drift out of sync — that's what keeps it reading as noise rather than a sweep. Earlier iterations tried a *coordinated* wave and pointer-gravity displacement; both were cut for reading as a moving beam / competing with the raindrops. `prefers-reduced-motion` renders the field static and fully resolved — no rain, no shimmer, no fragments.
- `PhotoDepth` (`src/components/PhotoDepth.jsx`), used for the About portrait — a two-layer cutout parallax standing in for a depth map. Same live-in-browser luminance-mask approach as `DotField`, applied once on load to build a subject-silhouette mask (CSS `mask-image`) for a sharp foreground copy, layered over a softly blurred/scaled background copy of the same photo. Fine-pointer devices only: cursor offset from center drives spring-smoothed (`useSpring`, same shape as `Magnetic.jsx`) translate on each layer at different rates plus a subtle `perspective`/`rotateX`/`rotateY` tilt on the frame. `prefers-reduced-motion` and touch/coarse-pointer: static, both layers still render at rest so it looks like a normal considered photo either way. Accepts an optional `depthSrc` to use a real depth map instead of the computed one, same rendering pipeline.
- No bounce/elastic easing. No CSS layout-property animation.

## Section Backgrounds (black/white alternation carries the rhythm)
- Hero: `--black` + `DotField` portrait + video placeholder slot
- About: `--surface`
- Projects: `--surface`
- Testimonials: `--black`
- Process: `--surface`
- Tech strip: `--surface-alt`
- Closing CTA / Contact: `--black`

## Spacing Rhythm
- Section vertical padding: `clamp(96px, 14vh, 176px)` on the large sections, tighter (`clamp(28–48px, …)`) on strips.
- Shell horizontal padding: 48px desktop, 24px mobile.
- Component gap baseline: 8, 12, 16, 24, 32, 48, 64, 80px via `clamp()`.

## Component Patterns
- **Eyebrow rows:** small-caps-style uppercase Inter Tight labels, no icon prefix.
- **Rules/dividers:** 1px solid `--line` / `--line-dark`, used to separate stacked list items (testimonials, process) instead of cards.
- **Tags/pills:** Inter Tight, 10.5px, uppercase, 999px radius, 1px `--line` border.
- **Buttons:** `--radius: 999px` (pill/circle). Solid white fill for primary actions (`.contact__submit`, `.corner-cta`). The hero CTA (`.hero__cta`) is a quieter pattern instead — an uppercase label plus a circular arrow ring that fills white and rotates the arrow on hover.
- **Cards:** Not used — layout stays editorial/section-based. The one exception is `.browser-frame` (hairline device chrome for project mockups).
- **Placeholders:** the video (`Hero`) slot is built to the real asset's aspect ratio and drop-in path — see the comment in `Boot.jsx` for exactly what file to swap. `About`'s portrait is real (`public/Drake.webp`), rendered through `PhotoDepth` (`.photo-depth__bg`/`.photo-depth__fg`, both grayscale/contrast-treated) plus a multiplied vignette on `.about__photo::after`.
- **Scheduler** (`src/sections/Scheduler.jsx`, mounted in `Contact.jsx` at `#book`) — day-strip and time-slot pills reuse the same hairline-pill vocabulary as `.project__tags`/`.corner-cta` (border pill, fills white + inverts to black on select/hover). The name/email step reuses `.contact__field` input styling and the success state reuses `.contact__sent` — same visual language as the message form right below it, not a bolted-on widget. See `SCHEDULER_SETUP.md` for the Google Calendar wiring this depends on.
