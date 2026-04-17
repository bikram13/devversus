'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SearchItem {
  type: 'comparison' | 'tool' | 'category'
  title: string
  subtitle: string
  url: string
}

interface Props {
  items: SearchItem[]
}

export default function SearchModal({ items }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Open on Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const results = useMemo<SearchItem[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const matches = items.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
    )
    // Group: comparisons first, then tools, then categories
    const comparisons = matches.filter(m => m.type === 'comparison').slice(0, 5)
    const tools = matches.filter(m => m.type === 'tool').slice(0, 5)
    const categories = matches.filter(m => m.type === 'category').slice(0, 3)
    return [...comparisons, ...tools, ...categories].slice(0, 12)
  }, [query, items])

  useEffect(() => setActiveIndex(0), [results])

  const navigate = useCallback((url: string) => {
    setOpen(false)
    setQuery('')
    router.push(url)
  }, [router])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIndex]) {
      navigate(results[activeIndex].url)
    }
  }

  const typeLabel: Record<SearchItem['type'], string> = {
    comparison: 'Compare',
    tool: 'Tool',
    category: 'Category',
  }

  const typeColor: Record<SearchItem['type'], string> = {
    comparison: '#a5b4fc',
    tool: '#86efac',
    category: '#fbbf24',
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-all duration-200"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--foreground-muted)',
        }}
        aria-label="Search tools"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search</span>
        <kbd className="text-xs px-1.5 py-0.5 rounded ml-1" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--foreground-muted)', fontSize: '10px' }}>⌘K</kbd>
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/4 -translate-x-1/2 z-50 w-full max-w-lg"
        style={{ padding: '0 16px' }}
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-base)',
            border: '1px solid rgba(99,102,241,0.3)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
          }}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--foreground-muted)', flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Search tools, comparisons, categories…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[var(--foreground-muted)] outline-none"
            />
            <kbd
              className="text-xs px-1.5 py-0.5 rounded shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--foreground-muted)', fontSize: '10px' }}
            >
              ESC
            </kbd>
          </div>

          {/* Results */}
          {query.trim() === '' ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                Search 363+ tools, 1,093+ comparisons, and 52 categories
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                No results for &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : (
            <ul className="py-1.5 max-h-80 overflow-y-auto">
              {results.map((item, i) => (
                <li key={item.url}>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    style={{
                      background: i === activeIndex ? 'rgba(99,102,241,0.12)' : 'transparent',
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => navigate(item.url)}
                  >
                    <span
                      className="text-xs px-1.5 py-0.5 rounded shrink-0 font-medium"
                      style={{ background: 'rgba(255,255,255,0.06)', color: typeColor[item.type], minWidth: 56, textAlign: 'center' }}
                    >
                      {typeLabel[item.type]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.title}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--foreground-muted)' }}>{item.subtitle}</p>
                    </div>
                    {i === activeIndex && (
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--accent)', flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Footer hint */}
          <div
            className="px-4 py-2.5 flex items-center gap-4 text-xs"
            style={{ borderTop: '1px solid var(--border)', color: 'var(--foreground-muted)' }}
          >
            <span><kbd style={{ fontFamily: 'inherit' }}>↑↓</kbd> navigate</span>
            <span><kbd style={{ fontFamily: 'inherit' }}>↵</kbd> open</span>
            <span><kbd style={{ fontFamily: 'inherit' }}>ESC</kbd> close</span>
          </div>
        </div>
      </div>
    </>
  )
}
