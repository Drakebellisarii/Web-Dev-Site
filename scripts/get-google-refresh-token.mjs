#!/usr/bin/env node
// One-time setup script — run this once locally after creating a Google
// Cloud OAuth "Desktop app" client, to mint the long-lived refresh token
// the deployed site uses to read/write your Google Calendar. Doesn't touch
// anything in production; just prints a value for you to save as an env var.
//
// Usage:
//   GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/get-google-refresh-token.mjs
//
// What it does:
//   1. Starts a throwaway local server on http://127.0.0.1:53682
//   2. Prints a Google consent URL for you to open in a browser
//   3. You sign in and approve calendar access
//   4. Google redirects back to the local server with a one-time code
//   5. The script exchanges that code for a refresh token and prints it
//
// (Uses a loopback redirect, not the old "copy/paste code" flow — Google
// retired that for new OAuth clients, this is the current supported path
// for installed/desktop apps.)

import http from 'node:http'
import { exec } from 'node:child_process'

const PORT = 53682
const REDIRECT_URI = `http://127.0.0.1:${PORT}`
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your shell first, then re-run this script.')
  console.error('(From the OAuth client you created in Google Cloud Console — see SCHEDULER_SETUP.md.)')
  process.exit(1)
}

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
authUrl.searchParams.set('client_id', CLIENT_ID)
authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
authUrl.searchParams.set('response_type', 'code')
authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/calendar')
authUrl.searchParams.set('access_type', 'offline')
authUrl.searchParams.set('prompt', 'consent') // force a refresh_token even on repeat runs

console.log('\nOpen this URL and approve calendar access with the Google account\nwhose calendar you want the site to book against:\n')
console.log(authUrl.toString())
console.log('\nWaiting for you to finish in the browser...\n')

// Best-effort auto-open on macOS; harmless no-op elsewhere if it fails.
exec(`open "${authUrl.toString()}"`, () => {})

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error) {
    res.end(`Authorization failed: ${error}. You can close this tab.`)
    console.error('Authorization failed:', error)
    server.close()
    process.exit(1)
  }
  if (!code) {
    res.end('Waiting for authorization...')
    return
  }

  res.end('Got it — you can close this tab and go back to the terminal.')
  server.close()

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    })
    const data = await tokenRes.json()
    if (!tokenRes.ok || !data.refresh_token) {
      console.error('\nToken exchange failed:', JSON.stringify(data, null, 2))
      console.error('\nIf there\'s no refresh_token in there, you may have already authorized this app before — revoke access at https://myaccount.google.com/permissions and run this script again.')
      process.exit(1)
    }
    console.log('\nSuccess. Add these to .env.local (and to your Vercel project\'s env vars for production):\n')
    console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`)
    console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`)
    console.log(`GOOGLE_REFRESH_TOKEN=${data.refresh_token}`)
    console.log(`GOOGLE_CALENDAR_ID=primary\n`)
  } catch (err) {
    console.error('\nToken exchange request failed:', err)
    process.exit(1)
  }
})

server.listen(PORT)
