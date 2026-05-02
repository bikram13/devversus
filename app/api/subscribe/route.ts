import { NextRequest } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'

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
    if (!existing.has(email)) {
      await appendRecord({
        email,
        ip,
        timestamp: new Date().toISOString(),
        page,
        userAgent,
      })
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
