# Scheduler setup — one-time

The "Book a call" flow on the site (`src/sections/Scheduler.jsx`) talks to
two serverless functions (`api/availability.js`, `api/book.js`) that read
and write your own Google Calendar directly — no Calendly/Cal.com, no
embedded widget. Until you finish this setup, the site shows a graceful
fallback ("online booking is almost ready") that points people at the
message form instead — nothing is broken in the meantime.

This takes about 10 minutes and only touches your own Google account.

## 1. Create a Google Cloud project + enable the Calendar API

1. Go to <https://console.cloud.google.com/> and create a new project (any name — e.g. "drakebellisari-site").
2. In the search bar, find **Google Calendar API** and click **Enable**.

## 2. Configure the OAuth consent screen

1. Go to **APIs & Services → OAuth consent screen**.
2. User type: **External**. App name: anything (e.g. "Drake Bellisari Site Scheduler"). Your email for support/developer contact.
3. Scopes: skip, not needed here.
4. Test users: add your own Gmail address.
5. Leave it in **Testing** mode — that's fine, it never needs to go through Google's verification review since you're the only one ever authorizing it.

## 3. Create OAuth client credentials

1. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. Application type: **Desktop app**. Name: anything.
3. Save the **Client ID** and **Client Secret** it gives you.

## 4. Get a refresh token (run once, locally)

```bash
GOOGLE_CLIENT_ID=your-client-id GOOGLE_CLIENT_SECRET=your-client-secret \
  node scripts/get-google-refresh-token.mjs
```

This opens a Google consent screen in your browser (or prints a URL to
open manually) — sign in with the account whose calendar the site should
book against, approve calendar access, and the script prints your refresh
token in the terminal.

## 5. Set the environment variables

Add these four to `.env.local` (for `npm run dev` — though note `/api`
routes only actually run under Vercel, not plain `vite dev`) **and** to
your Vercel project's environment variables (Project → Settings →
Environment Variables) for production:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
GOOGLE_CALENDAR_ID=primary
```

`GOOGLE_CALENDAR_ID=primary` books against your main calendar. If you'd
rather use a dedicated calendar, create one in Google Calendar, open its
settings, and use the "Calendar ID" shown there instead.

Redeploy after adding the env vars — that's it, the fallback disappears
and real availability starts showing.

## Adjusting the schedule

Business hours, call length, timezone, how far ahead to offer, and the
minimum notice window all live in one place: the `SCHEDULER` object in
`src/siteConfig.js`. Both the frontend and the API routes read from it, so
changing it there is the only place you need to touch.

## If something looks wrong

- **Fallback never goes away after adding env vars**: double check they're
  set in the actual deployment environment (Vercel), not just locally —
  and that you redeployed after adding them.
- **"Token refresh failed" in the function logs**: the refresh token may
  have been revoked (e.g. you removed the app's access at
  <https://myaccount.google.com/permissions>) — run the script in step 4
  again to mint a new one.
- **No refresh token printed by the script**: Google only issues a
  refresh token on the *first* consent, or when you force it — the script
  already passes `prompt=consent` to force a fresh one every run, so this
  should be rare. If it happens, revoke the app's access at the link above
  and run the script again.
