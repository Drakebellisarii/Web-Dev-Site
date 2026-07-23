import { useEffect, useState } from 'react'
import { SCHEDULER } from '../siteConfig'

// Custom-built booking flow — no embedded 3rd-party widget. Talks to
// /api/availability and /api/book, which read/write Drake's own Google
// Calendar (see api/_google.js). Until that's configured (env vars set —
// see SCHEDULER_SETUP.md), availability.js returns { configured: false }
// and this renders a quiet fallback pointing at the message form instead
// of a broken picker.
const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

function formatDay(dateStr) {
  return dayFormatter.format(new Date(`${dateStr}T12:00:00`))
}

function formatSlot(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(d)
}

function zoneAbbrev() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short', timeZone: SCHEDULER.timezone }).formatToParts(new Date())
  return parts.find((p) => p.type === 'timeZoneName')?.value || SCHEDULER.timezone
}

export default function Scheduler({ onOpenMessage }) {
  const [phase, setPhase] = useState('loading') // loading | unconfigured | ready | error
  const [days, setDays] = useState([])
  const [dayIdx, setDayIdx] = useState(0)
  const [slot, setSlot] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [booked, setBooked] = useState(null)

  // Initial phase is already 'loading' (useState default above); this only
  // needs to flip it back on a post-409 refresh, and skipping that flash
  // there is the better UX anyway — the picker just quietly updates.
  const loadAvailability = () => {
    fetch('/api/availability')
      .then((res) => res.json())
      .then((data) => {
        if (!data.configured) {
          setPhase('unconfigured')
          return
        }
        setDays(data.days || [])
        setDayIdx(0)
        setSlot(null)
        setPhase('ready')
      })
      .catch(() => setPhase('error'))
  }

  useEffect(loadAvailability, [])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!slot) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: days[dayIdx].date, time: slot, ...form }),
      })
      const data = await res.json()
      if (res.status === 409) {
        setSubmitError(data.error)
        setSlot(null)
        loadAvailability()
        return
      }
      if (!res.ok) throw new Error(data.error || 'Failed to book')
      setBooked(data)
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (phase === 'loading') {
    return (
      <div className="scheduler">
        <p className="scheduler__status eyebrow">Loading availability&hellip;</p>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div className="scheduler">
        <p className="scheduler__status eyebrow">
          Couldn&rsquo;t load availability. <button type="button" onClick={onOpenMessage}>Send a message instead</button>.
        </p>
      </div>
    )
  }

  if (phase === 'unconfigured') {
    return (
      <div className="scheduler">
        <p className="scheduler__status eyebrow">
          Online booking is almost ready. <button type="button" onClick={onOpenMessage}>Send a message</button> for now and I&rsquo;ll reply directly.
        </p>
      </div>
    )
  }

  if (booked) {
    return (
      <div className="scheduler contact__sent">
        <span className="contact__sent-icon">&#10003;</span>
        <h3 className="display">You&rsquo;re booked.</h3>
        <p>
          {formatDay(days[dayIdx].date)} at {formatSlot(slot)} ({zoneAbbrev()}). A calendar invite is on its way to {form.email}.
        </p>
        {booked.meetLink && (
          <a href={booked.meetLink} target="_blank" rel="noreferrer" className="scheduler__meet-link">
            {booked.meetLink}
          </a>
        )}
      </div>
    )
  }

  const activeDay = days[dayIdx]

  return (
    <div className="scheduler">
      <div className="scheduler__days" role="tablist" aria-label="Choose a day">
        {days.map((d, i) => (
          <button
            key={d.date}
            type="button"
            role="tab"
            aria-selected={i === dayIdx}
            className={`scheduler__day${i === dayIdx ? ' is-active' : ''}`}
            onClick={() => { setDayIdx(i); setSlot(null); setSubmitError(null) }}
          >
            {formatDay(d.date)}
          </button>
        ))}
      </div>

      <div className="scheduler__slots">
        {activeDay.slots.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={slot === s}
            className={`scheduler__slot${slot === s ? ' is-selected' : ''}`}
            onClick={() => { setSlot(s); setSubmitError(null) }}
          >
            {formatSlot(s)}
          </button>
        ))}
      </div>

      {/* Lives outside the slot form on purpose — a 409 clears `slot` (so
          the now-taken time can't be resubmitted) but the explanation for
          why the picker just reset needs to survive that. */}
      {submitError && <p className="scheduler__error">{submitError}</p>}

      {slot && (
        <form className="contact__form scheduler__form" onSubmit={handleSubmit}>
          <div className="contact__form-row">
            <div className="contact__field">
              <label className="eyebrow" htmlFor="sched-name">Your name</label>
              <input id="sched-name" type="text" placeholder="Jane Smith" value={form.name} onChange={set('name')} required />
            </div>
            <div className="contact__field">
              <label className="eyebrow" htmlFor="sched-email">Email address</label>
              <input id="sched-email" type="email" placeholder="jane@company.com" value={form.email} onChange={set('email')} required />
            </div>
          </div>
          <div className="contact__field">
            <label className="eyebrow" htmlFor="sched-notes">Anything I should know? (optional)</label>
            <textarea id="sched-notes" rows={3} placeholder="What's the project?" value={form.notes} onChange={set('notes')} />
          </div>

          <button type="submit" className="contact__submit" disabled={submitting}>
            {submitting ? 'Booking…' : `Confirm ${formatDay(activeDay.date)} at ${formatSlot(slot)}`}
          </button>
        </form>
      )}

      <button type="button" onClick={onOpenMessage} className="cta__secondary">or send a message instead</button>
    </div>
  )
}
