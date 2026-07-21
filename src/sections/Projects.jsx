import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import BrowserFrame from '../components/BrowserFrame'

const PROJECTS = [
{
no: '01',
name: 'Central Florida Automation Services',
url: 'https://central-florida-alarm.vercel.app',
domain: 'central-florida-alarm.vercel.app',
role: 'Smart Home & Security',
year: '2026',
description:
'A full website build for Central Florida\'s premier smart home and security integration company, an Atlantic Companies brand serving the luxury residential market since 1968. The design mirrors the sophistication of the systems they install, using clean architecture and confident typography to guide high-end clients from first impression to a booked consultation.',
problem:
'Despite decades of expertise and a reputation built on trust, CFAS lacked a digital presence that reflected the premium, high-end nature of their work. Prospective clients in luxury communities like Windermere and Winter Park expected a first impression that matched the quality of a whole-home Lutron and Control4 integration.',
approach:
'Designed around the company\'s core philosophy: the systems disappear into the house. The site was built to feel just as invisible and refined — letting the work speak through clean architecture, confident typography, and purposeful restraint. Every section guides visitors from discovery to inquiry without friction.',
solution:
'The result is a digital flagship that commands the premium positioning CFAS has earned over 55 years in the market. Visitors immediately understand the breadth of services — from smart glass and motorized shades to enterprise networking and fire safety — and are guided naturally toward booking a consultation.',
tags: ['Smart Home', 'Luxury Residential', 'Full Build'],
video: '/CFAS-Hero.mp4',
videoPosition: 'center top',
frameRatio: '1280 / 598',
},
{
no: '02',
name: 'Mandel Moving',
url: 'https://www.mandelmoving.com',
domain: 'mandelmoving.com',
role: 'Local Moving Company',
year: '2026',
description:
'A complete redesign for an established local moving company whose online presence no longer reflected the quality of its service. The new site reorganizes service areas, customer reviews, and quote requests into a cleaner, more professional experience, and has driven a major lift in organic traffic and inbound leads since launch.',
problem:
"The existing website did not effectively communicate the company's experience, service areas, or customer reviews. The overall presentation felt outdated compared to the competitiors in the area.",
approach:
'Focused on making the customer journey as straightforward as possible. Service areas, quote requests, customer reviews, and company information were reorganized into a cleaner structure supported by updated visuals and improved usability.',
solution:
'The redesign provides a more professional first impression and makes it easier for prospective customers to learn about the company, request a quote, and determine whether Mandel serves their area. After the reddesign Mandel Moving has seen around a 400% increase in month over month web traffic and a significant boost in quote requests through the site.',
tags: ['Local Business', 'Website Redesign', 'SEO'],
screenshot: '/screenshots/mandel-moving.jpg',
videoPosition: 'center top',
},
{
no: '03',
name: 'GPP Partners Group',
url: 'https://www.gpppartnersgroup.com',
domain: 'gpppartnersgroup.com',
role: 'Recruiting Firm',
year: '2025',
description:
'A new site for a boutique recruiting firm built on close relationships with both candidates and employers. The design reflects that professionalism through clear messaging, professional photography, and simple navigation, helping job seekers and hiring companies alike quickly understand who they are and what they offer.',
problem:
'The company had little online presence, making it difficult for potential clients and candidates to learn about the firm before reaching out. They needed a website that established credibility without feeling overly corporate.',
approach:
'Started by understanding their recruiting process, target audience, and brand personality. The site was built around clear messaging, professional photography, and simple navigation that guides both employers and job seekers to the information they need.',
solution:
'The finished site gives GPP a professional online presence that supports referrals, outreach efforts, and day-to-day business development. It provides visitors with a clear understanding of who they are and what they offer, without an overly corportate feel.',
tags: ['Recruiting', 'SEO', 'Professional Services'],
video: '/Connie-Hero.mp4',
videoPosition: 'center top',
},
{
no: '04',
name: 'Drake Bellisari',
url: 'https://www.drakebellisari.com',
domain: 'drakebellisari.com',
role: 'Personal Website',
year: '2025',
description:
'My personal site, and where most people first meet my work. It brings together software projects, web design, and professional experience, plus a bit of who I am beyond a resume. Built with React and Framer Motion for a fast, polished feel, every section is designed to make exploring the work effortless.',
problem:
'I wanted a single place where recruiters, potential clients, and other developers could quickly understand what I build and how I think. Most portfolios either feel generic or only show finished projects without much context behind them.',
approach:
'Designed the site in Figma and built it with React. The goal was to create something that felt polished without getting in the way of the content. Framer Motion handles the animations, Lenis keeps scrolling smooth, and every section was designed to make exploring projects feel natural.',
solution:
'The result is a fast, responsive site that serves as both a portfolio and a professional home base. It gives visitors a clear picture of my technical skills, design approach, and the kinds of projects I enjoy building.',
tags: ['Portfolio', 'Web Development', 'Personal Brand'],
image: '/Drake-Hero.webp',
videoPosition: 'center center',
frameRatio: '16 / 9',
},
]

export default function Projects() {
  const containerRef = useRef(null)

  return (
    <section className="work" id="work" ref={containerRef}>
      <div className="work__header shell">
        <span className="eyebrow">Selected Work</span>
        <h2 className="work__title display">
          A few things I&rsquo;ve <em className="display-italic">shipped</em>.
        </h2>
      </div>

      {PROJECTS.map((p, i) => (
        <ProjectPanel key={p.no} project={p} index={i} />
      ))}
    </section>
  )
}

function LazyVideo({ src, style, className, videoPosition }) {
  const ref = useRef(null)
  const [activeSrc, setActiveSrc] = useState(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSrc(src)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [src])

  useEffect(() => {
    if (activeSrc && ref.current) ref.current.play().catch(() => {})
  }, [activeSrc])

  return (
    <video
      ref={ref}
      className={className}
      style={{ objectPosition: videoPosition, ...style }}
      src={activeSrc || undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
    />
  )
}

function ProjectPanel({ project, index }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const captionY = useTransform(scrollYProgress, [0, 1], ['30px', '-30px'])
  const reverse = index % 2 === 1

  return (
    <article
      ref={ref}
      className={`project ${reverse ? 'project--reverse' : ''}`}
      data-index={project.no}
    >
      <div className="project__inner shell">
        <motion.div className="project__visual" style={{ y: imageY }}>
          <BrowserFrame url={project.domain} className="project__frame">
            <div className="project__media" style={project.frameRatio ? { aspectRatio: project.frameRatio } : undefined}>
              {project.video ? (
                <LazyVideo
                  src={project.video}
                  className="project__screenshot"
                  videoPosition={project.videoPosition}
                />
              ) : (
                <img
                  src={project.image || project.screenshot}
                  alt={`${project.name} website`}
                  className="project__screenshot"
                  style={{ objectPosition: project.videoPosition }}
                  loading="lazy"
                />
              )}
            </div>
            <a className="project__cover-link" href={project.url} target="_blank" rel="noreferrer" aria-label={`Visit ${project.name}`} />
          </BrowserFrame>
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
        </motion.div>
      </div>

    </article>
  )
}
