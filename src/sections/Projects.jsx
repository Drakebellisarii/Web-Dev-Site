import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const PROJECTS = [
 {
no: '01',
name: 'Drake Bellisari',
url: 'https://www.drakebellisari.com',
domain: 'drakebellisari.com',
role: 'Personal Website',
year: '2025',
description:
'My personal website and the place where most people get introduced to my work. It brings together software projects, web design work, professional experience, and a bit about who I am outside of a resume.',
problem:
'I wanted a single place where recruiters, potential clients, and other developers could quickly understand what I build and how I think. Most portfolios either feel generic or only show finished projects without much context behind them.',
approach:
'Designed the site in Figma and built it with React. The goal was to create something that felt polished without getting in the way of the content. Framer Motion handles the animations, Lenis keeps scrolling smooth, and every section was designed to make exploring projects feel natural.',
solution:
'The result is a fast, responsive site that serves as both a portfolio and a professional home base. It gives visitors a clear picture of my technical skills, design approach, and the kinds of projects I enjoy building.',
tags: ['Portfolio', 'Web Development', 'Personal Brand'],
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
'GPP Partners Group is a boutique recruiting firm focused on building strong relationships with both candidates and employers. The website was designed to reflect that professionalism while making it easier for visitors to learn about their services.',
problem:
'The company had little online presence, making it difficult for potential clients and candidates to learn about the firm before reaching out. They needed a website that established credibility without feeling overly corporate.',
approach:
'Started by understanding their recruiting process, target audience, and brand personality. The site was built around clear messaging, professional photography, and simple navigation that guides both employers and job seekers to the information they need.',
solution:
'The finished site gives GPP a professional online presence that supports referrals, outreach efforts, and day-to-day business development. It provides visitors with a clear understanding of who they are and what they offer.',
tags: ['Recruiting', 'Business Website', 'Professional Services'],
video: '/Connie-Hero.mov',
videoPosition: 'center top',
},
{
no: '03',
name: 'Marty B Solutions',
url: 'https://marty-b-solutions.vercel.app',
domain: 'marty-b-solutions.vercel.app',
role: 'Trades & Services',
year: '2026',
description:
'A straightforward website for a local trades business focused on showcasing completed work and making it easy for customers to get in touch.',
problem:
'Most of Marty’s business came through referrals, but potential customers often had no easy way to verify his work or learn about his services before making contact.',
approach:
'Built the site around a simple goal: help visitors quickly understand what services are offered and provide a clear path to reach out. Real project photos, concise service descriptions, and prominent contact information became the foundation of the experience.',
solution:
'The website gives referrals a place to learn more about the business before calling and provides a professional online presence that supports future growth.',
tags: ['Service Business', 'Lead Generation', 'Local Business'],
video: '/Marty-Hero.mov',
videoPosition: 'center top',
},
{
no: '04',
name: 'Mandel Moving',
url: 'https://www.mandelmoving.com',
domain: 'mandelmoving.com',
role: 'Local Moving Company',
year: '2026',
description:
'A complete website redesign for a moving company that needed its online presence to better reflect the quality of its services and reputation.',
problem:
'The existing website did not effectively communicate the company’s experience, service areas, or customer reviews. Important information was difficult to find and the overall presentation felt outdated.',
approach:
'Focused on making the customer journey as straightforward as possible. Service areas, quote requests, customer reviews, and company information were reorganized into a cleaner structure supported by updated visuals and improved usability.',
solution:
'The redesign provides a more professional first impression and makes it easier for prospective customers to learn about the company, request a quote, and determine whether Mandel serves their area.',
tags: ['Local Business', 'Website Redesign', 'Lead Generation'],
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
