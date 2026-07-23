import nodemailer from 'nodemailer'
import { DateTime } from 'luxon'
import { isConfigured, getAccessToken, getBusyIntervals, createEvent } from './_google.js'
import { isAllowedSlot } from './_slots.js'
import { SCHEDULER, CONTACT_EMAIL } from '../src/siteConfig.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!isConfigured()) {
    return res.status(503).json({ error: 'Scheduler is not configured yet' })
  }

  const { date, time, name, email, notes } = req.body || {}

  if (!name || !email || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  // Never trust the client's chosen slot — recompute it server-side against
  // the same business-hours/notice rules availability.js used to offer it.
  const slot = isAllowedSlot(date, time)
  if (!slot) {
    return res.status(400).json({ error: 'That time is not available' })
  }

  try {
    const slotEnd = slot.plus({ minutes: SCHEDULER.callMinutes })
    const accessToken = await getAccessToken()

    // Re-check freshness right before booking — the slot could have been
    // taken between the client loading availability and submitting.
    const busy = await getBusyIntervals(accessToken, slot.toUTC().toISO(), slotEnd.toUTC().toISO())
    const stillOpen = !busy.some((b) => slot < DateTime.fromISO(b.end) && slotEnd > DateTime.fromISO(b.start))
    if (!stillOpen) {
      return res.status(409).json({ error: 'That time was just booked — pick another.' })
    }

    const event = await createEvent(accessToken, {
      summary: `Call with ${name}`,
      description: notes ? `${notes}\n\nBooked via drakebellisari.com` : 'Booked via drakebellisari.com',
      start: { dateTime: slot.toISO(), timeZone: SCHEDULER.timezone },
      end: { dateTime: slotEnd.toISO(), timeZone: SCHEDULER.timezone },
      attendees: [{ email }],
      conferenceData: {
        createRequest: {
          requestId: `${date}-${time}-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    })

    // Best-effort heads-up email — the calendar invite is the real record,
    // this just means Drake doesn't have to be staring at the calendar.
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: CONTACT_EMAIL, pass: process.env.GMAIL_APP_PASSWORD },
      })
      await transporter.sendMail({
        from: `"Drake Bellisari Site" <${CONTACT_EMAIL}>`,
        to: CONTACT_EMAIL,
        replyTo: email,
        subject: `New call booked — ${name}, ${date} ${time}`,
        text: `${name} (${email}) booked a call for ${date} at ${time} (${SCHEDULER.timezone}).\n\n${notes || ''}`,
      })
    } catch (mailErr) {
      console.error('Booking notification email failed (event was still created):', mailErr)
    }

    return res.status(200).json({
      ok: true,
      htmlLink: event.htmlLink,
      meetLink: event.hangoutLink || null,
    })
  } catch (err) {
    console.error('Booking error:', err)
    return res.status(500).json({ error: 'Failed to book — please try again' })
  }
}
