import { useState } from 'react'
import Magnetic from '../components/Magnetic'
import { SCHEDULING_URL, CONTACT_EMAIL } from '../siteConfig'

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
    <section className="cta" id="contact">
      {/* ── Primary conversion moment: book a call, no imagery ── */}
      <div className="shell cta__top">
        <span className="eyebrow">Let&rsquo;s talk</span>
        <h2 className="cta__title display">
          Got a project worth<br />building well?
        </h2>

        <div className="cta__actions">
          <Magnetic>
            <a href={SCHEDULING_URL} target="_blank" rel="noreferrer" className="cta__book">
              Book a call
              <svg width="18" height="11" viewBox="0 0 18 11" fill="none" aria-hidden="true">
                <path d="M0 5.5h16M12 1l4.5 4.5L12 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Magnetic>
          <a href="#contact-form" className="cta__secondary">or send a message instead</a>
        </div>
      </div>

      {/* ── Quieter path: the actual form, minimal chrome ── */}
      <div className="shell">
        <div className="cta__panel" id="contact-form">
          <span className="eyebrow cta__panel-label">Send a message</span>

          {status === 'sent' ? (
            <div className="contact__sent">
              <span className="contact__sent-icon">&#10003;</span>
              <h3 className="display">Message sent.</h3>
              <p>I&rsquo;ll reply within 48 hours.</p>
              <button className="contact__sent-reset" onClick={() => { setStatus('idle'); setForm({ name: '', email: '', service: '', message: '' }) }}>
                Send another
              </button>
            </div>
          ) : status === 'error' ? (
            <div className="contact__sent">
              <span className="contact__sent-icon">&#10005;</span>
              <h3 className="display">Something went wrong.</h3>
              <p>Please try again or email me directly at {CONTACT_EMAIL}.</p>
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
                <textarea id="cf-message" rows={4} placeholder="What does your business do? What do you want the site to accomplish? Any timing in mind?" value={form.message} onChange={set('message')} required />
              </div>

              <button type="submit" className="contact__submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : (
                  <>
                    Send message
                    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                      <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="footer">
        <div className="shell footer__inner">
          <a href="#top" className="footer__wordmark">drake bellisari</a>
          <nav className="footer__links">
            <a href="#work">Projects</a>
            <a href="#contact">Contact</a>
            <a href="https://github.com/Drakebellisarii" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/drake-bellisari/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://www.instagram.com/dpbellisari" target="_blank" rel="noreferrer">Instagram</a>
          </nav>
          <span className="footer__copy">&copy; 2026 &middot; Hartford, CT</span>
        </div>
      </footer>
    </section>
  )
}
