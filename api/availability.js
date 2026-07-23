import { DateTime } from 'luxon'
import { isConfigured, getAccessToken, getBusyIntervals } from './_google.js'
import { candidateSlots } from './_slots.js'
import { SCHEDULER } from '../src/siteConfig.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isConfigured()) {
    // Real, expected state until the one-time Google setup is done — not
    // an error, just "nothing to show yet."
    return res.status(200).json({ configured: false })
  }

  try {
    const days = candidateSlots()
    if (days.length === 0) {
      return res.status(200).json({ configured: true, timezone: SCHEDULER.timezone, days: [] })
    }

    const timeMin = days[0].slots[0].toUTC().toISO()
    const lastDay = days[days.length - 1]
    const timeMax = lastDay.slots[lastDay.slots.length - 1]
      .plus({ minutes: SCHEDULER.slotMinutes })
      .toUTC()
      .toISO()

    const accessToken = await getAccessToken()
    const busy = await getBusyIntervals(accessToken, timeMin, timeMax)
    const busyIntervals = busy.map((b) => ({
      start: DateTime.fromISO(b.start),
      end: DateTime.fromISO(b.end),
    }))

    const openDays = days.map(({ date, slots }) => {
      const open = slots.filter((slotStart) => {
        const slotEnd = slotStart.plus({ minutes: SCHEDULER.callMinutes })
        return !busyIntervals.some((b) => slotStart < b.end && slotEnd > b.start)
      })
      return { date, slots: open.map((s) => s.toFormat('HH:mm')) }
    }).filter((d) => d.slots.length > 0)

    return res.status(200).json({ configured: true, timezone: SCHEDULER.timezone, days: openDays })
  } catch (err) {
    console.error('Availability error:', err)
    return res.status(500).json({ error: 'Failed to load availability' })
  }
}
