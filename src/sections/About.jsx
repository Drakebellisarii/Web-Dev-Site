import PhotoDepth from '../components/PhotoDepth'

export default function About() {
  return (
    <section className="about" id="about">
      <div className="shell about__grid">
        <div className="about__portrait">
          <div className="about__photo">
            <PhotoDepth src="/Drake.webp" alt="Portrait of Drake Bellisari" />
          </div>
        </div>

        <div className="about__content">
          <span className="eyebrow">About</span>

          <h2 className="about__title display">One person, start to finish.</h2>

          <div className="about__body">
            <p>
              I&rsquo;m Drake — I design and build the whole thing myself: strategy, interface, code, deploy. I studied computer science at Trinity College, and played four years of football, which taught me more about shipping under pressure than any class did.
            </p>
            <p>
              No account managers, no handoff between a &ldquo;creative team&rdquo; and a &ldquo;dev team&rdquo; — just one person who reads every note and writes every line. The tradeoff is I only take on a few projects at a time. What you get in return is a site that feels considered down to the hover states nobody else would bother with.
            </p>
          </div>

          <p className="about__meta eyebrow">Columbus, OH &middot; Hartford, CT &middot; New York, NY</p>
        </div>
      </div>
    </section>
  )
}
