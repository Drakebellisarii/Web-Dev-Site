// No frame, no box — the section background matches the animation's own
// white background exactly, so the video's edges disappear into the page.
export default function About() {
  return (
    <section className="about" id="about">
      <div className="shell about__grid">
        <div className="about__portrait">
          <video
            className="about__video"
            src="/Drake-animate-web.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Animated illustration of Drake Bellisari working at his laptop"
          />
        </div>

        <div className="about__content">
          <span className="eyebrow">About.ME</span>

          <h2 className="about__title display">
            One person, start to finish
          </h2>

          <div className="about__body">
            <p>
              I&rsquo;m Drake. A recent Computer Science graduate from Trinity College, where I spent four years playing football and becoming fascinated by how great software is built. I&rsquo;m drawn to the intersection of engineering and design, where thoughtful code, performance, and user experience come together to create products that people genuinely enjoy using. Whether I&rsquo;m building a marketing website or a full web application, my goal is always the same. Build software that feels fast, intuitive, and made with intention.
            </p>
            <p>
              I&rsquo;m not a large agency, and I think that&rsquo;s a strength. You won&rsquo;t have a dedicated project manager, a sales team, or layers of people between us. It&rsquo;s me on the call, me designing, me writing the code, and me shipping the final product. The tradeoff is simple. I can only take on a limited number of projects at a time. In return, every decision, every line of code, and every interaction gets my full attention. I care about the parts most people skip. The loading state, the hover that feels considered, the polish that makes something feel crafted instead of assembled.
            </p>
          </div>

          <p className="about__meta eyebrow">Columbus, OH &middot; Hartford, CT &middot; New York, NY</p>
        </div>
      </div>
    </section>
  )
}