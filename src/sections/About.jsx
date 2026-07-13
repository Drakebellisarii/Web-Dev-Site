// The film's studio backdrop is a vertical gray gradient, not a flat color —
// the section repeats that gradient and the video's edges are feathered with
// a mask so the frame melts into the page with no visible rectangle.
export default function About() {
  return (
    <section className="about" id="about">
      <div className="shell">
        <div className="about__head">
          <span className="eyebrow eyebrow--ember">
            <span className="eyebrow-dot" />
            About
          </span>
        </div>
      </div>

      <div className="about__stage">
        <video
          className="about__video"
          src="/About-me.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Animated portrait of Drake Bellisari"
        />
      </div>
    </section>
  )
}
