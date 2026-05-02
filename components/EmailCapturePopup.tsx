'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'email-capture-popup-state'
const SHOW_DELAY_MS = 30_000
const SCROLL_TRIGGER_PCT = 0.7
const SUPPRESS_DAYS = 7

type StoredState = {
  // millis when popup should next be allowed to show again
  nextAllowedAt: number
  // last action: 'dismissed' | 'subscribed'
  lastAction?: 'dismissed' | 'subscribed'
}

type FormState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string }

function readState(): StoredState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredState
    if (typeof parsed?.nextAllowedAt !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

function writeState(state: StoredState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* swallow quota errors silently */
  }
}

function isCurrentlySuppressed(): boolean {
  const state = readState()
  if (!state) return false
  return Date.now() < state.nextAllowedAt
}

function suppressFor(days: number, action: 'dismissed' | 'subscribed') {
  const ms = days * 24 * 60 * 60 * 1000
  writeState({ nextAllowedAt: Date.now() + ms, lastAction: action })
}

function isValidEmail(value: string): boolean {
  // Pragmatic client-side check; real validation happens server-side.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

export default function EmailCapturePopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [form, setForm] = useState<FormState>({ kind: 'idle' })

  const dismiss = useCallback(() => {
    suppressFor(SUPPRESS_DAYS, 'dismissed')
    setVisible(false)
  }, [])

  // Mount: decide whether to arm the triggers at all.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isCurrentlySuppressed()) return

    let shown = false
    const showOnce = () => {
      if (shown) return
      shown = true
      setVisible(true)
    }

    const timer = window.setTimeout(showOnce, SHOW_DELAY_MS)

    const onScroll = () => {
      const doc = document.documentElement
      const scrollTop = window.scrollY || doc.scrollTop
      const max = doc.scrollHeight - window.innerHeight
      if (max <= 0) return
      const pct = scrollTop / max
      if (pct >= SCROLL_TRIGGER_PCT) showOnce()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Esc closes the popup.
  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, dismiss])

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (form.kind === 'submitting') return

    const trimmed = email.trim()
    if (!isValidEmail(trimmed)) {
      setForm({ kind: 'error', message: 'Please enter a valid email address.' })
      return
    }

    setForm({ kind: 'submitting' })
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          page: typeof window !== 'undefined' ? window.location.pathname : '/',
        }),
      })
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
      }
      if (!res.ok || !json.ok) {
        setForm({
          kind: 'error',
          message: json.error || 'Something went wrong. Try again in a moment.',
        })
        return
      }
      setForm({ kind: 'success' })
      suppressFor(SUPPRESS_DAYS, 'subscribed')
    } catch {
      setForm({
        kind: 'error',
        message: 'Network error. Check your connection and try again.',
      })
    }
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-capture-title"
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-4 pb-4 sm:p-4"
      style={{ background: 'rgba(5,5,10,0.66)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        // Click backdrop to dismiss; ignore clicks inside the panel.
        if (e.target === e.currentTarget) dismiss()
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-6 sm:p-7"
        style={{
          background: 'rgba(13,13,26,0.96)',
          border: '1px solid var(--border-hover)',
          boxShadow:
            '0 0 0 1px rgba(99,102,241,0.18), 0 24px 60px rgba(0,0,0,0.55), 0 0 80px rgba(99,102,241,0.18)',
        }}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ color: 'var(--foreground-muted)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {form.kind === 'success' ? (
          <div className="text-center py-2">
            <div
              className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.3)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path
                  d="M5 11l4 4 8-8"
                  stroke="#4ade80"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2
              id="email-capture-title"
              className="text-lg font-semibold text-white mb-2"
            >
              You&rsquo;re on the list
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--foreground-muted)' }}
            >
              Your Better Auth quick-reference card is on its way to your
              inbox. If you don&rsquo;t see it in a minute, check your spam
              folder.
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="mt-5 text-xs px-4 py-2 rounded-lg font-medium transition-colors"
              style={{ background: 'var(--surface-hover)', color: 'white' }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <span
              className="glow-badge"
              style={{ marginBottom: 14, display: 'inline-flex' }}
            >
              Free PDF
            </span>
            <h2
              id="email-capture-title"
              className="text-xl font-semibold text-white mb-2 mt-3"
              style={{ lineHeight: 1.25 }}
            >
              Get the Better Auth migration{' '}
              <span className="gradient-text-accent">quick-reference card</span>
            </h2>
            <p
              className="text-sm mb-5 leading-relaxed"
              style={{ color: 'var(--foreground-muted)' }}
            >
              A 1-page PDF with the exact steps to migrate from NextAuth, Clerk,
              or Auth.js to Better Auth. Free. No spam — unsubscribe in one
              click.
            </p>

            <form onSubmit={submit} noValidate>
              <label htmlFor="email-capture-input" className="sr-only">
                Email address
              </label>
              <input
                id="email-capture-input"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (form.kind === 'error') setForm({ kind: 'idle' })
                }}
                disabled={form.kind === 'submitting'}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-hover)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
              />

              {form.kind === 'error' ? (
                <p
                  className="mt-2 text-xs"
                  style={{ color: '#fb923c' }}
                  role="alert"
                >
                  {form.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={form.kind === 'submitting'}
                className="mt-4 w-full px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200"
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  opacity: form.kind === 'submitting' ? 0.7 : 1,
                  cursor: form.kind === 'submitting' ? 'wait' : 'pointer',
                  boxShadow: '0 0 24px rgba(99,102,241,0.35)',
                }}
              >
                {form.kind === 'submitting' ? 'Sending…' : 'Send me the PDF'}
              </button>
            </form>

            <p
              className="mt-4 text-[11px] text-center"
              style={{ color: 'var(--foreground-muted)' }}
            >
              We email comparison guides + 1 product update per month. No
              tracking, no resold lists.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
