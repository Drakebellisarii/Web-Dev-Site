import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const SERVICE_OPTIONS = [
  'Marketing / Landing Page',
  'Portfolio / Personal Site',
  'Business Website',
  'Web App',
  'Redesign',
  'Other',
]

export default function Contact() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yLeft = useTransform(scrollYProgress, [0, 1], ['40px', '-20px'])
  const yRight = useTransform(scrollYProgress, [0, 1], ['60px', '-10px'])

  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' })
  const [status, setStatus] = useState('idle')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Send failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="shell">

        <h2 className="contact__title display">
          Let's build something<br />
          <em className="display-italic">worth&nbsp;sharing</em>.
        </h2>

        <div className="contact__grid">
          <motion.div className="contact__left" style={{ y: yLeft }}>
            <div className="contact__channels">
              <a className="contact__channel" href="mailto:dpbellisari@gmail.com">
                <span className="contact__channel-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12v9H2V4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M2 4l6 5 6-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <span className="eyebrow">Email</span>
                  <span className="contact__channel-val">dpbellisari@gmail.com</span>
                </div>
              </a>
              <a className="contact__channel" href="https://www.linkedin.com/in/drake-bellisari/" target="_blank" rel="noreferrer">
                <span className="contact__channel-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M5 7v4M5 5.5v.01M8 11V8.5c0-1 .5-1.5 1.5-1.5S11 8 11 9v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <span className="eyebrow">LinkedIn</span>
                  <span className="contact__channel-val">Connect with me →</span>
                </div>
              </a>
              <a className="contact__channel" href="https://github.com/Drakebellisarii" target="_blank" rel="noreferrer">
                <span className="contact__channel-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2C4.69 2 2 4.69 2 8c0 2.65 1.72 4.9 4.1 5.69.3.06.41-.13.41-.29v-1.02c-1.67.36-2.02-.8-2.02-.8-.27-.69-.67-.87-.67-.87-.55-.37.04-.36.04-.36.6.04.92.62.92.62.54.92 1.41.66 1.75.5.06-.39.21-.66.38-.81-1.34-.15-2.74-.67-2.74-2.97 0-.66.23-1.2.62-1.62-.06-.15-.27-.77.06-1.6 0 0 .51-.16 1.67.62.48-.14.1-.28 1.5-.28s1.02.14 1.5.28c1.16-.78 1.67-.62 1.67-.62.33.83.12 1.45.06 1.6.39.42.62.96.62 1.62 0 2.31-1.41 2.82-2.75 2.97.22.19.41.56.41 1.13v1.68c0 .16.11.35.41.29C12.28 12.9 14 10.65 14 8c0-3.31-2.69-6-6-6z" fill="currentColor" />
                  </svg>
                </span>
                <div>
                  <span className="eyebrow">GitHub</span>
                  <span className="contact__channel-val">View my code →</span>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.div className="contact__form-wrap" style={{ y: yRight }}>
            {status === 'sent' ? (
              <div className="contact__sent">
                <span className="contact__sent-icon">✓</span>
                <h3 className="display">Message sent.</h3>
                <p>I'll reply within 48 hours.</p>
                <button className="contact__sent-reset" onClick={() => { setStatus('idle'); setForm({ name: '', email: '', service: '', message: '' }) }}>
                  Send another
                </button>
              </div>
            ) : status === 'error' ? (
              <div className="contact__sent">
                <span className="contact__sent-icon">✗</span>
                <h3 className="display">Something went wrong.</h3>
                <p>Please try again or email me directly at dpbellisari@gmail.com.</p>
                <button className="contact__sent-reset" onClick={() => setStatus('idle')}>
                  Try again
                </button>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} noValidate>
                <div className="contact__form-row">
                  <div className="contact__field">
                    <label className="eyebrow" htmlFor="cf-name">Your name</label>
                    <input id="cf-name" type="text" placeholder="Jane Smith" value={form.name} onChange={set('name')} required />
                  </div>
                  <div className="contact__field">
                    <label className="eyebrow" htmlFor="cf-email">Email address</label>
                    <input id="cf-email" type="email" placeholder="jane@company.com" value={form.email} onChange={set('email')} required />
                  </div>
                </div>

                <div className="contact__field">
                  <label className="eyebrow" htmlFor="cf-service">What are you looking for?</label>
                  <select id="cf-service" value={form.service} onChange={set('service')}>
                    <option value="">Select a service…</option>
                    {SERVICE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div className="contact__field">
                  <label className="eyebrow" htmlFor="cf-message">Tell me about your project</label>
                  <textarea id="cf-message" rows={5} placeholder="What does your business do? What do you want the site to accomplish? Any timing in mind?" value={form.message} onChange={set('message')} required />
                </div>

                <button type="submit" className="contact__submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : (
                    <>
                      Send message
                      <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                        <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        <footer className="footer">
          <div className="footer__brand">
            <a href="#top" className="footer__wordmark">
              drake bellisari<span className="footer__wordmark-dot">.</span>
            </a>
            <span className="eyebrow">© 2026 · Hartford, CT</span>
          </div>
          <div className="footer__cols">
            <div>
              <span className="eyebrow">Navigation</span>
              <a href="#work">Projects</a>
              <a href="#contact">Contact</a>
            </div>
            <div>
              <span className="eyebrow">Elsewhere</span>
              <a href="https://github.com/Drakebellisarii" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/drake-bellisari/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://www.instagram.com/dpbellisari" target="_blank" rel="noreferrer">Instagram</a>
            </div>
            <div>
              <span className="eyebrow">Contact</span>
              <a href="mailto:dpbellisari@gmail.com">dpbellisari@gmail.com</a>
              <span>Hartford, CT</span>
              <span>Columbus, OH</span>
            </div>
          </div>
        </footer>
      </div>
    </section>
  )
}
