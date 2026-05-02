# EmailCapturePopup — wiring guide

This document describes how the email-capture popup is wired today, what gaps
exist, and the concrete next steps to turn the local JSON file into a real
list-growth channel.

## Components in this feature

| File | Role |
|------|------|
| `components/EmailCapturePopup.tsx` | Client-side popup. Trigger logic, form, success/error UI. |
| `app/api/subscribe/route.ts` | POST `/api/subscribe`. Validates, rate-limits, appends to JSON. |
| `app/layout.tsx` | Mounts `<EmailCapturePopup />` once globally. |
| `data/email-subscribers.json` | Append-only JSONL file. Created on first subscriber. **Gitignored.** |

## Trigger rules

- Shows after **30 seconds** OR when user scrolls past **70% of page**, whichever comes first.
- Dismissed (Esc, X button, backdrop click) → suppressed for **7 days** in localStorage (`email-capture-popup-state`).
- Successful submit → also suppressed for 7 days.
- SSR-safe: every `localStorage`/`window` access is gated on `typeof window !== 'undefined'`.

## API contract

`POST /api/subscribe`

Request body:
```json
{ "email": "user@example.com", "page": "/compare/foo-vs-bar" }
```

Responses:
- `200 { ok: true }` — captured (or silently deduped — same response either way to avoid leaking which addresses are already subscribed).
- `400 { error: "Please enter a valid email address." }` — bad email.
- `400 { error: "Invalid JSON body." }` — malformed body.
- `429 { error: "Too many requests. Try again later." }` — same IP exceeded 5 submits in 24h. Includes `Retry-After` header.
- `500 { error: "Could not save your subscription. Please try again." }` — disk write failed.

## Storage format

`data/email-subscribers.json` is **JSONL** — one record per line — not a JSON
array. This is intentional: appending one line is atomic on POSIX, while
read-modify-writing a JSON array would race under concurrent submits.

Each line:
```json
{"email":"foo@bar.com","ip":"1.2.3.4","timestamp":"2026-05-02T10:30:00.000Z","page":"/compare/foo-vs-bar","userAgent":"Mozilla/5.0 ..."}
```

Read it with:
```bash
jq -s '.' data/email-subscribers.json   # parse as array
wc -l data/email-subscribers.json       # count subscribers
```

## Honest gap (READ THIS)

The popup promises a **"Better Auth migration quick-reference card"** PDF.
Right now the system **does not deliver the PDF**. The success state says
*"We'll send your card within 24 hours"* — that promise is on the founder.

To honour it you need two things:

1. **The PDF itself.** Extract a 1-page reference from the existing Better
   Auth ebook on Gumroad, or write one from scratch. Save under
   `products/devtools-compare/public/` if you want to host it directly, or
   keep it in the email service.
2. **An email sender.** Pick one of the services below and ship within 24h
   of the first capture, otherwise the trust cost compounds.

## Recommended next step: wire an email service

### Recommendation: **Buttondown** (https://buttondown.com)

Why this one (in order of weight):

- Free tier: 100 subscribers, unlimited emails. Enough to validate the
  channel before paying.
- Indie-friendly. Built by a solo dev, runs profitably — won't disappear or
  pivot enterprise on you.
- API is one POST per subscribe. Welcome-email automation is built in (no
  Zapier needed) — this delivers the PDF on subscribe.
- Custom domain sending available on paid tier when you outgrow free.

Alternatives considered:

| Service | Free tier | Why not first pick |
|---------|-----------|--------------------|
| Loops | 1k subs | Better UI but free tier caps at 1k *contacts* total — fine, but Buttondown's welcome-email builder is simpler. |
| Resend Broadcasts | 3k subs / 100/day | Best deliverability, but broadcasts UI is newer; better as a *transactional* sender than a list manager. |
| ConvertKit (now Kit) | 10k subs free | Heaviest UI, slowest API. Overkill for v1. |
| Mailchimp | 500 subs | Avoid — pricing cliff at 500, and they will deactivate accounts that look "spammy" without warning. |

### Migration checklist (founder runs once)

1. Sign up at https://buttondown.com using `31nathbikram@gmail.com`.
2. Verify the sending domain `devversus.com` (DKIM/SPF records on Namecheap).
3. Create an automation: trigger = "subscriber added", action = send the PDF
   as an attachment or link to a hosted PDF on devversus.com.
4. Get the API key from Settings → Programming.
5. Add to Vercel env vars: `BUTTONDOWN_API_KEY=...` (for **devtools-compare**
   project only).
6. Swap `app/api/subscribe/route.ts` to forward to Buttondown after the
   local-file write — keep the local file as a backup. Pseudocode:

   ```ts
   await appendRecord(rec)               // existing
   await fetch('https://api.buttondown.com/v1/subscribers', {
     method: 'POST',
     headers: {
       Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ email_address: email, tags: ['devversus-popup'] }),
   })
   ```
   Wrap that in try/catch — if Buttondown 4xxs, **still** return `{ ok: true }`
   to the user (we already saved locally and dedupe is the goal).

7. Backfill: import `data/email-subscribers.json` into Buttondown via their
   CSV importer (one-off):
   ```bash
   jq -r '[.email] | @csv' data/email-subscribers.json > backfill.csv
   ```
8. Rotate (don't delete) the local file — keep a backup in case Buttondown
   ever loses data. Rename to `email-subscribers.backup.YYYY-MM-DD.json`.

### Switching to (b) instead — Gumroad as PDF delivery

The original task brief offered an alternative pattern: redirect successful
submits to a free $0 Gumroad listing that delivers the PDF instantly via
Gumroad's built-in mailing infrastructure. **This is not wired today** —
chosen pattern (a) instead — because the founder has 8 paid Gumroad ebooks
but no confirmed free $0 PDF listing for a Better Auth quick-reference card.
Creating one is a separate task.

If/when a free Gumroad listing exists, swap the success state in
`EmailCapturePopup.tsx` to:

```tsx
window.location.href = 'https://gumroad.com/l/<slug>?email=' + encodeURIComponent(trimmed)
```

…after the `/api/subscribe` POST completes. That gives instant delivery and
keeps the local capture for owned-list growth.

## Manual test plan

1. `npm run dev`
2. Open http://localhost:3000 in **incognito** (so localStorage starts clean).
3. Wait 30 seconds → popup appears.
4. Click X → popup closes.
5. Reload → popup does **not** reappear (suppressed 7 days).
6. `localStorage.removeItem('email-capture-popup-state')` in DevTools console.
7. Reload → popup eligible to reappear.
8. Scroll to 70%+ of any long page → popup appears immediately (no 30s wait).
9. Submit a bad email (`foo`) → red error message under the input.
10. Submit a good email → success state with green check.
11. `cat data/email-subscribers.json` → record present with email, ip,
    timestamp, page, userAgent.
12. Submit the same email again from another browser → still returns
    `{ ok: true }` but no duplicate line in the file.
13. Submit 6 times rapidly from the same IP → 6th returns 429.

## Operational notes

- **In-memory rate limit resets on cold start.** Acceptable for v1; if abuse
  appears in logs, swap to Vercel KV or Upstash.
- **JSONL file lives on the server's writable filesystem.** On Vercel, this
  is ephemeral — it survives within a single function instance but not
  across deploys. **Wire Buttondown before the first real launch push** or
  captured emails will be lost on the next deploy. (Local dev and any
  long-running host like Railway persist between requests.)
- The popup styling matches the existing Cinema Dark theme (indigo accent,
  glassmorphism, dot-grid). No new CSS classes were added — only inline
  styles using existing CSS custom properties (`var(--accent)` etc.) and
  reused utility classes (`.glow-badge`, `.gradient-text-accent`).
