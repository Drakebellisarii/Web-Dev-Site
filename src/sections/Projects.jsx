import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const PROJECTS = [
  {
    no: '01',
    name: 'Drake Bellisari',
    url: 'https://www.drakebellisari.com',
    domain: 'drakebellisari.com',
    role: 'Personal Portfolio',
    year: '2025',
    description:
      'A living archive of design, code, and writing. Built as a slow-scrolling magazine. Each project gets its own spread, its own typography, its own pace.',
    tags: ['Brand', 'Portfolio', 'Editorial'],
    video: '/Drake-Bellisari-Hero.mov',
    videoPosition: 'left top',
  },
  {
    no: '02',
    name: 'GPP Partners Group',
    url: 'https://www.gpppartnersgroup.com',
    domain: 'gpppartnersgroup.com',
    role: 'Recruiuting Firm',
    year: '2025',
    description:
      'A composed identity for a boutique recruiting firm. Restrained typography, real-asset photography, and a quiet authority that holds up next to firms ten times the size.',
    tags: ['Recruiting', 'Identity', 'Marketing site'],
    video: '/GPP-Hero.mov',
    videoPosition: 'center top',
  },
  {
    no: '03',
    name: 'Marty B Solutions',
    url: 'https://marty-b-solutions.vercel.app',
    domain: 'marty-b-solutions.vercel.app',
    role: 'Trades & Services',
    year: '2025',
    description:
      'A handshake-on-the-internet site for a one-man trades operation: clear pricing, real photos, a phone number above the fold, and a request form that actually emails him.',
    tags: ['Service biz', 'Lead-gen', 'SEO'],
    video: '/Marty-Hero.mov',
    videoPosition: 'center top',
  },
  {
    no: '04',
    name: 'Mandel Moving',
    url: 'https://www.mandelmoving.com',
    domain: 'mandelmoving.com',
    role: 'Local Moving Co.',
    year: '2025',
    description:
      'A regional moving company rebuilt around trust signals: instant quote form, route map, fleet photography, and reviews that read like a column in a Sunday paper.',
    tags: ['Local biz', 'Lead capture', 'Quote engine'],
    screenshot: '/screenshots/mandel-moving.jpg',
    videoPosition: 'center top',
  },
]

export default function Projects() {
  const containerRef = useRef(null)

  return (
    <section className="work" id="work" ref={containerRef}>
      <div className="work__header shell">
        <div className="work__header-eyebrow">
          <span className="eyebrow eyebrow--ember">
            <span className="eyebrow-dot" />
            Selected Works
          </span>
          <span className="eyebrow">01 – 04</span>
        </div>
        <div className="work__header-title-row">
          <h2 className="work__title display">
            Featured <em className="display-italic">Projects</em>.
          </h2>
          <p className="work__sub">
            Complete builds covering strategy, design, development, and deployment.
            Click any project to visit the live site.
          </p>
        </div>
      </div>

      {PROJECTS.map((p, i) => (
        <ProjectPanel key={p.no} project={p} index={i} total={PROJECTS.length} />
      ))}
    </section>
  )
}

function ProjectPanel({ project, index, total }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const numberX = useTransform(scrollYProgress, [0, 1], ['-30%', '30%'])
  const numberOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const captionY = useTransform(scrollYProgress, [0, 1], ['30px', '-30px'])
  const reverse = index % 2 === 1

  return (
    <article
      ref={ref}
      className={`project ${reverse ? 'project--reverse' : ''}`}
      data-index={project.no}
    >
      <motion.div
        className="project__number display"
        style={{ x: numberX, opacity: numberOpacity }}
        aria-hidden
      >
        {project.no}
      </motion.div>

      <div className="project__inner shell">
        <motion.div className="project__visual" style={{ y: imageY }}>
          <div className="project__frame">
            {project.video ? (
              <video
                className="project__screenshot"
                style={{ objectPosition: project.videoPosition }}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                src={project.video}
              />
            ) : (
              <img
                src={project.screenshot}
                alt={`${project.name} website`}
                className="project__screenshot"
                style={{ objectPosition: project.videoPosition }}
              />
            )}
            <div className="project__frame-overlay">
              <span className="eyebrow">{project.domain}</span>
              <span className="project__visit">
                Live — visit
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 9 L9 2 M3 2 L9 2 L9 8" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </div>
            <span className="project__badge">
              <span className="project__badge-dot" />
              Live
            </span>
            <a className="project__cover-link" href={project.url} target="_blank" rel="noreferrer" aria-label={`Visit ${project.name}`} />
          </div>
        </motion.div>

        <motion.div className="project__caption" style={{ y: captionY }}>
          <div className="project__meta">
            <span className="eyebrow">{project.role}</span>
            <span className="project__dot" />
            <span className="eyebrow">{project.year}</span>
          </div>
          <h3 className="project__name display">{project.name}</h3>
          <p className="project__desc">{project.description}</p>

          <ul className="project__tags">
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          <dl className="project__data">
            <div><dt>Type</dt><dd>{project.role}</dd></div>
            <div><dt>Year</dt><dd>{project.year}</dd></div>
            <div>
              <dt>Status</dt>
              <dd><span className="project__live-dot" />Live</dd>
            </div>
          </dl>

          <a className="project__link" href={project.url} target="_blank" rel="noreferrer">
            <span>Visit {project.domain}</span>
            <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
              <path d="M0 6 L30 6 M24 1 L30 6 L24 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </div>

      {index < total - 1 && (
        <div className="project__rule" aria-hidden>
          <span>{project.no} / {String(total).padStart(2, '0')}</span>
          <div className="project__rule-line" />
          <span>{project.domain}</span>
        </div>
      )}
    </article>
  )
}
