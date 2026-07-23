// Shared Google Calendar helpers for availability.js / book.js. Leading
// underscore keeps Vercel from exposing this as its own route.
//
// Auth model: this is a personal Gmail account, not Workspace, so there's
// no service-account shortcut. GOOGLE_REFRESH_TOKEN was minted once via
// scripts/get-google-refresh-token.mjs and exchanged here for a short-lived
// access token on every request — nothing is cached across invocations
// since serverless functions don't reliably persist memory between calls.

export function isConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN
  )
}

export function calendarId() {
  return process.env.GOOGLE_CALENDAR_ID || 'primary'
}

export async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Google token refresh failed (${res.status}): ${body}`)
  }
  const data = await res.json()
  return data.access_token
}

// Returns an array of { start, end } busy intervals (ISO strings) for the
// calendar within [timeMin, timeMax].
export async function getBusyIntervals(accessToken, timeMin, timeMax) {
  const res = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      items: [{ id: calendarId() }],
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`freeBusy query failed (${res.status}): ${body}`)
  }
  const data = await res.json()
  const cal = data.calendars?.[calendarId()]
  if (cal?.errors?.length) {
    throw new Error(`freeBusy error: ${JSON.stringify(cal.errors)}`)
  }
  return cal?.busy || []
}

export async function createEvent(accessToken, event) {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId())}/events?sendUpdates=all&conferenceDataVersion=1`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`event creation failed (${res.status}): ${body}`)
  }
  return res.json()
}
