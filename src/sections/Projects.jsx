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
      'This is the site you\'re looking at. Built as a slow-scrolling editorial magazine where every project gets its own spread, its own type, its own pace. No templates, no shortcuts.',
    problem: 'Every portfolio on the internet looks like the same portfolio. The goal was something that showed craft the second it loaded, not after clicking through three pages.',
    approach: 'Started in Figma, finished in React. Framer Motion handles the scroll animations, Lenis keeps everything smooth, and Fraunces does the heavy typographic lifting throughout.',
    solution: 'Loads under 1.5 seconds and scores 95+ on Lighthouse. The character-by-character title reveal and parallax project panels were the most commented-on details after launch.',
    tags: ['Brand', 'Portfolio', 'Editorial'],
    video: '/Drake-hero.mov',
    videoPosition: 'center center',
    frameRatio: '16 / 9',
  },
  {
    no: '02',
    name: 'GPP Partners Group',
    url: 'https://www.gpppartnersgroup.com',
    domain: 'gpppartnersgroup.com',
    role: 'Recruiting Firm',
    year: '2025',
    description:
      'GPP is a boutique recruiting firm that was essentially invisible online. Restrained typography, real photography, and the kind of quiet authority that holds up next to firms ten times their size.',
    problem: 'No web presence meant losing candidates and clients to bigger firms with better-looking sites. They needed to look established without going corporate.',
    approach: 'Started with a few calls to understand who they place and who they\'re trying to attract. Then built around trust signals: clean type, professional photography, and clear paths for both candidates and hiring managers.',
    solution: 'The site now drives consistent inbound from LinkedIn referrals and ranks for local recruiting keywords. The first-impression gap with larger competitors is essentially gone.',
    tags: ['Recruiting', 'Identity', 'Marketing site'],
    video: '/Connie-Hero.mov',
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
      'Marty runs a one-man trades operation and his work speaks for itself. We made sure strangers on the internet could figure that out without having to cold-call him first.',
    problem: 'All of his business came through word-of-mouth, but referrals kept falling through because people couldn\'t find him online to verify he was legit before calling.',
    approach: 'Built around one goal: get someone to call or fill out the form. Phone number above the fold, real job-site photos, a short service list, and a contact form that goes straight to his inbox.',
    solution: 'Marty saw a measurable jump in inbound inquiries in the first month. Cold referrals that used to go cold now convert because people can see the work before picking up the phone.',
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
      'Mandel had the trucks, the crew, and the reviews. What they didn\'t have was a site that showed any of it. We rebuilt from scratch around the things that actually make someone request a quote.',
    problem: 'The old site was losing customers before they ever reached the quote form. Newer competitors with cleaner sites were winning on first impression and Mandel had no way to fight back.',
    approach: 'Put the quote form front and center, added a route map so visitors immediately know if Mandel serves their area, brought in real fleet photography, and gave the reviews section a treatment that doesn\'t look like a generic widget.',
    solution: 'Quote form completions went up and the site now ranks organically for moving searches in their region, pulling in leads that weren\'t reachable before.',
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
        <h2 className="work__title display">
          Featured <em className="display-italic">Projects</em>.
        </h2>
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
          <div className="project__frame" style={project.frameRatio ? { aspectRatio: project.frameRatio } : undefined}>
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

          <div className="project__case">
            <div className="project__case-item">
              <span className="eyebrow project__case-label">Problem</span>
              <p>{project.problem}</p>
            </div>
            <div className="project__case-item">
              <span className="eyebrow project__case-label">Approach</span>
              <p>{project.approach}</p>
            </div>
            <div className="project__case-item">
              <span className="eyebrow project__case-label">Outcome</span>
              <p>{project.solution}</p>
            </div>
          </div>

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
