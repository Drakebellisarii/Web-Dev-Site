import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CONTACT_EMAIL } from '../siteConfig'

const SERVICE_OPTIONS = [
  'Marketing / Landing Page',
  'Portfolio / Personal Site',
  'Business Website',
  'Web App',
  'Redesign',
  'Other',
]

const EASE = [0.16, 1, 0.3, 1]

// The quieter path off the scheduler — "send a message instead" opens this
// instead of scrolling to a static section. Posts to the same /api/contact
// endpoint the old inline form used; nothing changed server-side.
export default function ContactModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' })
  const [status, setStatus] = useState('idle')
  const firstFieldRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => firstFieldRef.current?.focus(), 350)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [open, onClose])

  // Reset a beat after the close animation finishes, not immediately — an
  // instant reset would flash the empty form before the panel is gone.
  useEffect(() => {
    if (open) return
    const t = setTimeout(() => {
      setStatus('idle')
      setForm({ name: '', email: '', service: '', message: '' })
    }, 400)
    return () => clearTimeout(t)
  }, [open])

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
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            className="modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>

            <span className="eyebrow">Not ready to book?</span>
            <h2 id="modal-title" className="cta__panel-title display">Send a message.</h2>

            {status === 'sent' ? (
              <div className="contact__sent">
                <span className="contact__sent-icon">&#10003;</span>
                <h3 className="display">Message sent.</h3>
                <p>I&rsquo;ll reply within 48 hours.</p>
                <button className="contact__sent-reset" onClick={onClose}>
                  Close
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
                    <input ref={firstFieldRef} id="cf-name" type="text" placeholder="Jane Smith" value={form.name} onChange={set('name')} required />
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
