'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Category {
  slug: string
  name: string
  description: string
  toolCount: number
}

export default function FilterableCategories({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? categories.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
      )
    : categories

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-8">
        <svg
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: 'var(--foreground-muted)' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search categories…"
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-[var(--foreground-muted)] outline-none transition-all"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded"
            style={{ color: 'var(--foreground-muted)', background: 'var(--surface)' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs mb-5" style={{ color: 'var(--foreground-muted)' }}>
        {query ? `${filtered.length} of ${categories.length} categories` : `${categories.length} categories`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--foreground-muted)' }}>
          <p className="text-lg font-semibold text-white mb-2">No categories found</p>
          <p className="text-sm">Try a different keyword</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(cat => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="card group p-4 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                >
                  {cat.name.charAt(0)}
                </span>
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: 'var(--accent)' }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
                </svg>
              </div>
              <p className="font-semibold text-white text-sm leading-tight mb-1 group-hover:text-indigo-300 transition-colors">
                {cat.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                {cat.toolCount} tools
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
