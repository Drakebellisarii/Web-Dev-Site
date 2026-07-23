// Shared slot math for availability.js / book.js — both need to agree on
// exactly which slots are allowed to exist, so book.js can independently
// recompute and validate a client-submitted slot rather than trusting it.
import { DateTime } from 'luxon'
import { SCHEDULER } from '../src/siteConfig.js'

// All candidate business-hours slots for the next `daysAhead` business
// days, as Luxon DateTimes in the scheduler's timezone. Doesn't know about
// calendar conflicts — that's freeBusy's job, applied on top of this.
export function candidateSlots(now = DateTime.now().setZone(SCHEDULER.timezone)) {
  const { workDays, startHour, endHour, slotMinutes, noticeHours, daysAhead } = SCHEDULER
  const earliest = now.plus({ hours: noticeHours })

  const days = []
  let cursor = now.startOf('day')
  while (days.length < daysAhead) {
    cursor = cursor.plus({ days: 1 })
    if (workDays.includes(cursor.weekday % 7)) days.push(cursor)
  }

  return days.map((day) => {
    const slots = []
    let t = day.set({ hour: startHour, minute: 0, second: 0, millisecond: 0 })
    const end = day.set({ hour: endHour, minute: 0, second: 0, millisecond: 0 })
    while (t < end) {
      if (t >= earliest) slots.push(t)
      t = t.plus({ minutes: slotMinutes })
    }
    return { date: day.toFormat('yyyy-MM-dd'), slots }
  }).filter((d) => d.slots.length > 0)
}

// True if `date` + `time` (as submitted by the client, e.g. "2026-08-03" /
// "14:30") lands exactly on one of the currently-allowed candidate slots.
export function isAllowedSlot(date, time) {
  const dt = DateTime.fromFormat(`${date} ${time}`, 'yyyy-MM-dd HH:mm', { zone: SCHEDULER.timezone })
  if (!dt.isValid) return null
  const day = candidateSlots().find((d) => d.date === date)
  if (!day) return null
  const match = day.slots.find((s) => s.equals(dt))
  return match || null
}
