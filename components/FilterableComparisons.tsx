'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface ComparisonItem {
  slug: string
  tool1Name: string
  tool2Name: string
  category: string
  categorySlug: string
}

interface GroupedComparisons {
  category: string
  categorySlug: string
  items: ComparisonItem[]
}

export default function FilterableComparisons({
  comparisons,
}: {
  comparisons: ComparisonItem[]
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return comparisons
    return comparisons.filter(
      c =>
        c.tool1Name.toLowerCase().includes(q) ||
        c.tool2Name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    )
  }, [query, comparisons])

  // Group by category
  const grouped = useMemo<GroupedComparisons[]>(() => {
    const map = new Map<string, GroupedComparisons>()
    for (const item of filtered) {
      const key = item.categorySlug
      if (!map.has(key)) {
        map.set(key, { category: item.category, categorySlug: item.categorySlug, items: [] })
      }
      map.get(key)!.items.push(item)
    }
    return Array.from(map.values()).sort((a, b) => b.items.length - a.items.length)
  }, [filtered])

  const isSearching = query.trim().length > 0

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-8">
        <svg
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
          placeholder="Search by tool name or category…"
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
      <p className="text-xs mb-6" style={{ color: 'var(--foreground-muted)' }}>
        {isSearching
          ? `${filtered.length} of ${comparisons.length} comparisons`
          : `${comparisons.length} comparisons across ${grouped.length} categories`}
      </p>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--foreground-muted)' }}>
          <p className="text-lg font-semibold text-white mb-2">No comparisons found</p>
          <p className="text-sm">Try searching for a tool name like &ldquo;Vercel&rdquo; or &ldquo;Stripe&rdquo;</p>
        </div>
      )}

      {/* Grouped results */}
      <div className="space-y-10">
        {grouped.map(group => (
          <section key={group.categorySlug}>
            {/* Category header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span
                  className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                >
                  {group.category.charAt(0)}
                </span>
                <h2 className="font-semibold text-white text-sm">{group.category}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface)', color: 'var(--foreground-muted)', border: '1px solid var(--border)' }}>
                  {group.items.length}
                </span>
              </div>
              <Link
                href={`/category/${group.categorySlug}`}
                className="text-xs transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                Browse category →
              </Link>
            </div>

            {/* Comparisons grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {group.items.map(item => (
                <Link
                  key={item.slug}
                  href={`/compare/${item.slug}`}
                  className="card group p-3.5 flex items-center justify-between cursor-pointer"
                >
                  <span className="text-sm text-white group-hover:text-indigo-300 transition-colors truncate mr-2">
                    {item.tool1Name} vs {item.tool2Name}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--accent)' }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
