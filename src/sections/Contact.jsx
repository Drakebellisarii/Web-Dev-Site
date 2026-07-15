import { useState } from 'react'
import Magnetic from '../components/Magnetic'

const SERVICE_OPTIONS = [
  'Marketing / Landing Page',
  'Portfolio / Personal Site',
  'Business Website',
  'Web App',
  'Redesign',
  'Other',
]

export default function Contact() {
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
    <section className="contact" id="contact">
      <div className="shell">
        <div className="contact__grid">
          <div className="contact__intro">
            <h2 className="contact__title display">Let&rsquo;s connect.</h2>
          </div>

          <div className="contact__monitor">
            <div className="contact__screen">
              <div className="contact__screen-bar">
                <span className="contact__screen-led" aria-hidden="true" />
                <span className="contact__screen-barlabel">Contact Me</span>
              </div>

              <div className="contact__screen-body">
                {status === 'sent' ? (
                  <div className="contact__sent">
                    <span className="contact__sent-icon">✓</span>
                    <h3 className="display">Message sent.</h3>
                    <p>I&rsquo;ll reply within 48 hours.</p>
                    <Magnetic>
                      <button className="contact__sent-reset" onClick={() => { setStatus('idle'); setForm({ name: '', email: '', service: '', message: '' }) }}>
                        Send another
                      </button>
                    </Magnetic>
                  </div>
                ) : status === 'error' ? (
                  <div className="contact__sent">
                    <span className="contact__sent-icon contact__sent-icon--error">✗</span>
                    <h3 className="display">Something went wrong.</h3>
                    <p>Please try again or email me directly at dpbellisari@gmail.com.</p>
                    <Magnetic>
                      <button className="contact__sent-reset" onClick={() => setStatus('idle')}>
                        Try again
                      </button>
                    </Magnetic>
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
                      <textarea id="cf-message" rows={4} placeholder="What does your business do? What do you want the site to accomplish? Any timing in mind?" value={form.message} onChange={set('message')} required />
                    </div>

                    <Magnetic block strength={0.12}>
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
                    </Magnetic>
                  </form>
                )}
              </div>
            </div>

            <div className="contact__monitor-base" aria-hidden="true" />
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="shell footer__inner">
          <a href="#top" className="footer__wordmark">
            drake bellisari<span className="footer__wordmark-dot">.</span>
          </a>
          <nav className="footer__links">
            <a href="#work">Projects</a>
            <a href="#contact">Contact</a>
            <a href="https://github.com/Drakebellisarii" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/drake-bellisari/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://www.instagram.com/dpbellisari" target="_blank" rel="noreferrer">Instagram</a>
          </nav>
          <span className="footer__copy">© 2026 · Hartford, CT</span>
        </div>
      </footer>
    </section>
  )
}
