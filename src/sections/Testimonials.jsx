// Quotes are real past clients with placeholder copy — drop in their actual
// words when you have them. The wordmark row below is plain text standing
// in for real client logos until you have SVGs to swap in.
const TESTIMONIALS = [
  {
    quote: '“Add a client quote here — a sentence or two on what it was like working together.”',
    name: 'Client name, title',
    company: 'Central Florida Automation Services',
  },
  {
    quote: '“Add a client quote here — a sentence or two on what it was like working together.”',
    name: 'Client name, title',
    company: 'Mandel Moving',
  },
  {
    quote: '“Add a client quote here — a sentence or two on what it was like working together.”',
    name: 'Client name, title',
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
