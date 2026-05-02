import { NextRequest } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
const FROM_NAME = process.env.RESEND_FROM_NAME ?? 'devversus'

// Force the Node.js runtime so fs is available; default would be the Edge-
// compatible compute environment which can't write files.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Where we persist captured emails. Append-only JSONL is safer than rewriting
// a JSON array (no read-modify-write race), but the spec asks for a JSON
// file at data/email-subscribers.json so we keep that path and append a
// JSON-line per record. A simple parser can read this as one object per line.
const SUBSCRIBERS_PATH = path.join(
  process.cwd(),
  'data',
  'email-subscribers.json',
)

// In-memory rate-limit. Resets on every cold start, which is fine for v1.
// Map<ip, { windowStart: ms, count }>
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000
const RATE_LIMIT_MAX = 5
const ipHits: Map<string, { windowStart: number; count: number }> = (
  globalThis as unknown as { __subIpHits?: Map<string, { windowStart: number; count: number }> }
).__subIpHits ?? new Map()
;(globalThis as unknown as { __subIpHits?: typeof ipHits }).__subIpHits = ipHits

// Conservative server-side validation. RFC 5322 is more permissive than this
// but in practice almost every real address matches this shape and almost
// every typo / bot string fails it.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function isValidEmail(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length >= 5 &&
    value.length <= 254 &&
    EMAIL_RE.test(value.trim())
  )
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real.trim()
  return 'unknown'
}

function checkRateLimit(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now()
  const bucket = ipHits.get(ip)
  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipHits.set(ip, { windowStart: now, count: 1 })
    return { ok: true }
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil(
      (bucket.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000,
    )
    return { ok: false, retryAfter }
  }
  bucket.count += 1
  return { ok: true }
}

type SubscriberRecord = {
  email: string
  ip: string
  timestamp: string
  page: string
  userAgent: string
}

async function readExistingEmails(): Promise<Set<string>> {
  try {
    const raw = await fs.readFile(SUBSCRIBERS_PATH, 'utf8')
    const set = new Set<string>()
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed) continue
      try {
        const obj = JSON.parse(trimmed) as { email?: string }
        if (obj.email) set.add(obj.email.toLowerCase())
      } catch {
        // skip malformed lines
      }
    }
    return set
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return new Set()
    throw err
  }
}

async function appendRecord(rec: SubscriberRecord): Promise<void> {
  await fs.mkdir(path.dirname(SUBSCRIBERS_PATH), { recursive: true })
  await fs.appendFile(SUBSCRIBERS_PATH, JSON.stringify(rec) + '\n', 'utf8')
}

/**
 * The Better Auth quick-reference card, delivered inline as HTML.
 * Single page; covers the schema-diff table from Ch 4 §4.5 of the playbook.
 */
function quickReferenceCardHtml(): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0f172a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:8px;overflow:hidden;">
<tr><td style="padding:32px 32px 16px;background:#0f172a;color:#fff;">
  <div style="font-size:11px;letter-spacing:3px;color:#94a3b8;text-transform:uppercase;margin-bottom:8px;">The Migration Playbook</div>
  <h1 style="margin:0;font-size:24px;line-height:1.2;">Auth.js → Better Auth</h1>
  <div style="margin-top:6px;font-size:14px;color:#cbd5e1;">Quick reference · Chapter 4 §4.5 schema diff</div>
</td></tr>
<tr><td style="padding:24px 32px 8px;">
  <p style="margin:0 0 12px;font-size:15px;line-height:1.5;">Thanks for subscribing. Here's the quick-reference card — the column-by-column schema diff most teams hit first when migrating.</p>
</td></tr>
<tr><td style="padding:0 32px 16px;">
  <table role="presentation" width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:12px;">
    <tr style="background:#0f172a;color:#fff;text-align:left;">
      <th style="padding:8px 6px;">Auth.js</th><th style="padding:8px 6px;">→</th><th style="padding:8px 6px;">Better Auth</th><th style="padding:8px 6px;">Risk</th>
    </tr>
    <tr style="background:#f9fafb;"><td>user.id</td><td>→</td><td>user.id</td><td>identical</td></tr>
    <tr><td>user.emailVerified <em>(timestamp)</em></td><td>→</td><td>user.emailVerified <em>(boolean)</em></td><td><strong>type change</strong></td></tr>
    <tr style="background:#f9fafb;"><td><em>(new)</em></td><td>→</td><td>user.twoFactorEnabled</td><td>required if twoFactor()</td></tr>
    <tr><td>account.provider</td><td>→</td><td>account.providerId</td><td>renamed</td></tr>
    <tr style="background:#f9fafb;"><td>account.providerAccountId</td><td>→</td><td>account.accountId</td><td>renamed</td></tr>
    <tr><td>account.access_token</td><td>→</td><td>account.accessToken</td><td>snake → camel</td></tr>
    <tr style="background:#f9fafb;"><td>account.expires_at <em>(bigint)</em></td><td>→</td><td>account.accessTokenExpiresAt</td><td><strong>bigint → timestamp</strong></td></tr>
    <tr><td>account.id_token</td><td>→</td><td>account.idToken</td><td>preserve for Apple</td></tr>
    <tr style="background:#f9fafb;"><td>account.token_type</td><td>→</td><td><em>(dropped)</em></td><td>type derived from providerId</td></tr>
    <tr><td>session.sessionToken</td><td>→</td><td>session.token</td><td>renamed</td></tr>
    <tr style="background:#f9fafb;"><td>session.expires</td><td>→</td><td>session.expiresAt</td><td>renamed</td></tr>
    <tr><td>verificationToken.token</td><td>→</td><td>verification.value</td><td>renamed</td></tr>
  </table>
</td></tr>
<tr><td style="padding:8px 32px 24px;">
  <div style="background:#fee2e2;border-left:3px solid #dc2626;padding:12px 14px;border-radius:4px;font-size:13px;line-height:1.5;">
    <strong>The silent-failure trap →</strong> Better Auth session cookies must be HMAC-signed with <code>BETTER_AUTH_SECRET</code>. Set the raw token and <code>auth.api.getSession()</code> returns null with no error. Format: <code>\${token}.\${base64(HMAC-SHA256)}</code>. Don't pre-encode — Next does that.
  </div>
</td></tr>
<tr><td style="padding:0 32px 32px;">
  <p style="margin:0 0 12px;font-size:14px;line-height:1.5;">If you want the full 67-page playbook with the dual-validation middleware, organization plugin migration, the 8 corrections we caught during verification, and a runnable reference repo with 5/5 passing Playwright tests:</p>
  <a href="https://nathbikram.gumroad.com/l/auth-js-to-better-auth-migration-playbook?utm_source=email&utm_medium=quickref&utm_campaign=migration_card" style="display:inline-block;background:#3b82f6;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Get the playbook · $39</a>
  <div style="margin-top:8px;font-size:12px;color:#64748b;">14-day no-questions refund.</div>
</td></tr>
<tr><td style="padding:16px 32px 24px;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;line-height:1.5;">
  Bikram · <a href="https://devversus.com" style="color:#64748b;">devversus.com</a> · You subscribed to the Better Auth quick-reference card on devversus.com.
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

async function sendQuickReferenceCard(toEmail: string): Promise<void> {
  if (!resend) {
    console.warn('[/api/subscribe] RESEND_API_KEY not set; skipping email send')
    return
  }
  try {
    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: toEmail,
      subject: 'Your Auth.js → Better Auth quick-reference card',
      html: quickReferenceCardHtml(),
    })
  } catch (err) {
    // Don't fail the subscribe request if email send fails — the address is
    // still saved locally, and we can resend manually if needed.
    console.error('[/api/subscribe] Resend send failed', err)
  }
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  const rate = checkRateLimit(ip)
  if (!rate.ok) {
    return Response.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } },
    )
  }

  let body: { email?: unknown; page?: unknown } = {}
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (!isValidEmail(body.email)) {
    return Response.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    )
  }

  const email = body.email.trim().toLowerCase()
  const page = typeof body.page === 'string' ? body.page.slice(0, 256) : '/'
  const userAgent = (req.headers.get('user-agent') ?? '').slice(0, 512)

  // Silent dedupe by email — return 200 either way to avoid leaking which
  // emails are already subscribed.
  try {
    const existing = await readExistingEmails()
    const isNew = !existing.has(email)
    if (isNew) {
      await appendRecord({
        email,
        ip,
        timestamp: new Date().toISOString(),
        page,
        userAgent,
      })
    }
    // Send the quick-reference card. Awaited so reliability is observable in
    // logs but failure does NOT fail the user-facing request — see helper.
    if (isNew) {
      await sendQuickReferenceCard(email)
    }
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[/api/subscribe] write failed', err)
    return Response.json(
      { error: 'Could not save your subscription. Please try again.' },
      { status: 500 },
    )
  }
}
