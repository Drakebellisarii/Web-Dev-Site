# PRODUCT.md — DPBellisari WebDev

## Product Purpose
Pure marketing/brand site for Drake Bellisari, a solo freelance web developer and designer — not a resume, not a portfolio-as-CV. The site's job is to convert visitors into booked calls while feeling premium, custom-built, and unmistakably designed by one person with a point of view.

## Users
- **Primary:** Potential clients (small business owners, startup founders, recruiting firms) deciding whether to hire Drake. They form a judgement fast.
- **Secondary:** Peers/collaborators assessing range.
- **Tertiary:** Anyone reviewing the work for its own sake.

## Register
Confident, personal, a little playful — "someone fun to work with," not a corporate studio and not a generic freelancer template.

Anti-references:
- Generic freelancer portfolio (skills list, circular headshot, plain "hire me" button)
- SaaS marketing page defaults (accent-color gradients, icon-pack graphics, identical metric cards)
- Any component-library look — every pattern in this site is hand-built
- Retro/novelty gimmicks that undercut "premium" (the previous CRT boot screen and System-6 window chrome were both retired for this reason)

## Strategic Principles
1. Strictly monochrome — black, white, and gray only, with one deliberate exception: the "Drake Bellisari" signature in the header is warm gold. Everywhere else, hierarchy comes from type weight, size, spacing, and gray value.
2. Two core typefaces (Baskerville display, Inter Tight sans) everywhere, plus one deliberate third face (Climate Crisis) reserved for the hero headline only.
3. No traditional nav bar — a corner-anchored mark expands into a fullscreen menu; a booking CTA is always reachable via `mix-blend-mode: difference`, independent of scroll/section theme.
4. Real imagery/video comes from Drake, dropped in after the fact — every media slot is built to the right aspect ratio, lazy-loaded, and clearly marked with where the real asset goes.
5. Every animation has a reason (orchestrated entrances, a pointer-reactive dot-grid establishing depth where there's no footage yet) — nothing decorative for its own sake.

## Key Sections (in order)
- **Hero** — Full-bleed, black. `DotField` renders the founder's portrait (`public/Drake.webp`) resolving out of a dot grid, with a sparse, slow rain of drops falling and blooming into a brief ring where they land — the only ongoing motion in the field. Headline, then a quiet "See the work" link (arrow-ring). Also a video-background slot (placeholder until a real clip lands in `public/hero.mp4`). The "Drake Bellisari" name now lives in the header (hanging off the corner mark, gold, italic Baskerville) rather than in the hero content, so it persists as you scroll. The always-visible corner "Book a call" pill is the site's actual primary booking CTA — the hero doesn't duplicate it.
- **About** — Real portrait (`public/Drake.webp`) rendered through `PhotoDepth` — a two-layer cutout parallax (sharp subject over a softly blurred duplicate, mask computed live in-browser) that tilts and shifts with the cursor, standing in for a real depth map. B&W treatment + vignette, same as before.
- **Projects** — Real case studies in hairline browser-frame mockups, scroll parallax + hover lift.
- **Testimonials** — Real past clients, placeholder quote copy pending actual testimonials; text wordmark row standing in for real logos.
- **Process** — Discover / Design / Build / Launch, hand-drawn geometric line icons (`src/components/ProcessIcons.jsx`), no icon pack.
- **Tech strip** — Grayscale marquee of the actual tools used to build client sites.
- **Contact** — Opens into `Scheduler` — a custom-built, on-page booking flow (day strip → time-slot grid → name/email → confirm) that reads/writes Drake's own Google Calendar directly, no 3rd-party embed. Falls back to a quiet message pointing at the form below until the one-time Google setup is done (see `SCHEDULER_SETUP.md`). The form itself still posts to the existing `/api/contact` nodemailer endpoint, unchanged.

## Constraints
- React + Vite + Framer Motion + GSAP (hero text entrance only), hand-written CSS (no component library)
- Smooth scroll via Lenis (desktop/pointer devices only — native scroll on touch)
- `api/contact.js` (Vercel serverless + nodemailer) is unchanged by the redesign
- `api/availability.js` / `api/book.js` (Vercel serverless) — plain `fetch` against the Google Calendar REST API, no `googleapis` SDK. `luxon` handles timezone-correct slot math server-side only (not bundled into the client). See `SCHEDULER_SETUP.md` for the one-time OAuth setup this depends on.

## Known placeholders (drop-in points)
- `public/hero.mp4` — real hero video (streamed/preloaded by `Boot.jsx`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REFRESH_TOKEN` / `GOOGLE_CALENDAR_ID` env vars — see `SCHEDULER_SETUP.md`. Until set, the scheduler shows a graceful fallback rather than breaking.
- `Testimonials.jsx` — real client quotes and, eventually, real logo SVGs in place of the text wordmarks
