'use client'

import { useState } from 'react'

interface Props {
  domain: string
  name: string
  size?: number
  className?: string
}

// Extract root domain for Clearbit API
function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export default function ToolLogo({ domain, name, size = 32, className = '' }: Props) {
  const [failed, setFailed] = useState(false)
  const rootDomain = extractDomain(domain)
  const initial = name.charAt(0).toUpperCase()

  if (failed) {
    return (
      <span
        className={`flex items-center justify-center rounded-xl font-bold text-sm shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          background: 'var(--accent-dim)',
          color: 'var(--accent)',
        }}
      >
        {initial}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://logo.clearbit.com/${rootDomain}`}
      alt={`${name} logo`}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={`rounded-xl object-contain shrink-0 bg-white ${className}`}
      style={{ width: size, height: size, padding: 3 }}
    />
  )
}
