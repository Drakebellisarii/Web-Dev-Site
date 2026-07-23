import { useState } from 'react'
import Scheduler from './Scheduler'
import ContactModal from '../components/ContactModal'

export default function Contact() {
  const [messageOpen, setMessageOpen] = useState(false)

  return (
    <section className="cta" id="contact">
      <div className="shell cta__book-block" id="book">
        <span className="eyebrow">Let&rsquo;s talk</span>
        <h2 className="cta__panel-title display">Book a call.</h2>
        <Scheduler onOpenMessage={() => setMessageOpen(true)} />
      </div>

      <ContactModal open={messageOpen} onClose={() => setMessageOpen(false)} />

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
