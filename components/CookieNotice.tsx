'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show only if not already dismissed
    if (!localStorage.getItem('cookie-notice-dismissed')) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 px-4 py-3"
      style={{
        background: 'rgba(8,8,16,0.95)',
        borderTop: '1px solid rgba(99,102,241,0.2)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs" style={{ color: 'var(--foreground-muted)', lineHeight: 1.6 }}>
          <span className="font-semibold text-white">No tracking cookies.</span>{' '}
          DevVersus does not use advertising or tracking cookies. Some &ldquo;Visit&rdquo; links are affiliate links — we may earn a commission at no cost to you.{' '}
          <Link href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>
        </p>
        <button
          onClick={() => {
            localStorage.setItem('cookie-notice-dismissed', '1')
            setVisible(false)
          }}
          className="shrink-0 text-xs px-4 py-1.5 rounded-lg font-medium transition-all duration-200"
          style={{
            background: 'var(--accent)',
            color: 'white',
          }}
        >
          Got it
        </button>
      </div>
    </div>
  )
}
