// Single source of truth for site-wide constants.
export const CONTACT_EMAIL = 'dpbellisari@gmail.com'

// Scheduler settings — shared between the frontend (Scheduler.jsx, for
// rendering) and the API routes (availability.js/book.js, for validation —
// the server always recomputes against these, it never trusts the client).
export const SCHEDULER = {
  timezone: 'America/New_York',
  // Work week, 24h clock, in the timezone above.
  workDays: [1, 2, 3, 4, 5], // Mon-Fri (0 = Sunday)
  startHour: 9,
  endHour: 17,
  slotMinutes: 30,
  callMinutes: 30,
  // Don't show/allow slots less than this far out.
  noticeHours: 12,
  // How many business days ahead to offer.
  daysAhead: 14,
}
