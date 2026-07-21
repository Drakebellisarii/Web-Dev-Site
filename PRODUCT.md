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
1. Strictly monochrome — black, white, and gray only. Every bit of hierarchy comes from type weight, size, spacing, and gray value.
2. Exactly two typefaces (Fraunces display, Inter Tight sans) everywhere, no exceptions.
3. No traditional nav bar — a corner-anchored mark expands into a fullscreen menu; a booking CTA is always reachable via `mix-blend-mode: difference`, independent of scroll/section theme.
4. Real imagery/video comes from Drake, dropped in after the fact — every media slot is built to the right aspect ratio, lazy-loaded, and clearly marked with where the real asset goes.
5. Every animation has a reason (orchestrated entrances, a pointer-reactive dot-grid establishing depth where there's no footage yet) — nothing decorative for its own sake.

## Key Sections (in order)
- **Hero** — Full-bleed, black, `DotField` "floor" motif + a video-background slot (placeholder until a real clip lands in `public/hero.mp4`).
- **About** — Photo placeholder (duotone-ready) + a short, voice-driven statement — not a resume.
- **Projects** — Real case studies in hairline browser-frame mockups, scroll parallax + hover lift.
- **Testimonials** — Real past clients, placeholder quote copy pending actual testimonials; text wordmark row standing in for real logos.
- **Process** — Discover / Design / Build / Launch, hand-drawn geometric line icons (`src/components/ProcessIcons.jsx`), no icon pack.
- **Tech strip** — Grayscale marquee of the actual tools used to build client sites.
- **Manifesto** — Full-width typographic statement, `DotField` "flat" texture, no imagery.
- **Closing CTA** — Primary: "Book a call" (`SCHEDULING_URL` in `src/siteConfig.js`). Secondary: quiet link down to the contact form, which posts to the existing `/api/contact` nodemailer endpoint.

## Constraints
- React + Vite + Framer Motion, hand-written CSS (no component library)
- Smooth scroll via Lenis (desktop/pointer devices only — native scroll on touch)
- `api/contact.js` (Vercel serverless + nodemailer) is unchanged by the redesign

## Known placeholders (drop-in points)
- `public/hero.mp4` — real hero video (streamed/preloaded by `Boot.jsx`)
- `About.jsx` — real portrait photo (replace the placeholder `<div>` with an `<img className="about__photo">`)
- `src/siteConfig.js` — real scheduling link (`SCHEDULING_URL`)
- `Testimonials.jsx` — real client quotes and, eventually, real logo SVGs in place of the text wordmarks
