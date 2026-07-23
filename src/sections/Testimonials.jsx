// Real past clients — but these quotes are DRAFTS, written to sound like
// what each of them would plausibly say based on the actual project
// outcomes. Confirm the wording with each client (or get a real quote from
// them directly) before this goes live — a testimonial attributed to a
// named person should be something they actually said, not just something
// they'd probably agree with.
const TESTIMONIALS = [
  {
    quote: '“Drake understood exactly what we needed before we had to explain it — a site that feels as premium as the systems we install. He owned the whole thing, start to finish.”',
    name: 'Bruce Gartley, CEO',
    company: 'Central Florida Automation Services',
  },
  {
    quote: '“Our old site wasn’t doing us any favors. Since the redesign, traffic is up roughly 400% and the quote requests haven’t slowed down. Drake made the whole process easy.”',
    name: 'Robert Mandel, Founder & CEO',
    company: 'Mandel Moving',
  },
  {
    quote: '“Drake took the time to actually understand our business and who we’re trying to reach. The site gives us a credibility we didn’t have before — people notice from the first click.”',
    name: 'Constance, President of Perm Placement',
    company: 'GPP Partners Group',
  },
]

const WORDMARKS = ['Central Florida Automation', 'Mandel Moving', 'GPP Partners Group']

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="shell">
        <span className="eyebrow testimonials__eyebrow">What clients say</span>

        <div className="testimonials__grid">
          {TESTIMONIALS.map((t) => (
            <figure className="testimonials__item" key={t.company}>
              <blockquote className="display display-italic">{t.quote}</blockquote>
              <figcaption className="eyebrow">
                {t.name} &middot; {t.company}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="testimonials__logos">
          {WORDMARKS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
