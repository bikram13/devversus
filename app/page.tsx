import Link from 'next/link'
import { CATEGORIES, TOOLS, getAllComparisons, getAllAlternativePages } from '@/data/tools'

export default function HomePage() {
  const comparisons  = getAllComparisons()
  const alternatives = getAllAlternativePages()

  const featuredCategories = CATEGORIES.slice(0, 16)
  const featuredComparisons = comparisons.slice(0, 9)
  const featuredAlts = alternatives.slice(0, 6)

  return (
    <div className="relative">

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 pt-24 pb-20 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-7">
          <span className="glow-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
            {TOOLS.length}+ tools · {comparisons.length} comparisons
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.06] mb-6">
          <span className="gradient-text">Compare Dev Tools.</span>
          <br />
          <span style={{ color: 'var(--foreground-muted)', fontSize: '0.88em', fontWeight: 700 }}>
            Make the right call.
          </span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
          Side-by-side comparisons of {TOOLS.length}+ developer tools — pricing, features,
          pros & cons, and honest trade-offs. No vendor spin.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-10 mb-14">
          {[
            { value: `${TOOLS.length}+`, label: 'Tools covered' },
            { value: comparisons.length, label: 'Comparisons' },
            { value: CATEGORIES.length, label: 'Categories' },
            { value: 'Free', label: 'Forever' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="stat-number">{s.value}</div>
              <div className="text-xs mt-1 font-medium uppercase tracking-widest" style={{ color: 'var(--foreground-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/category/hosting"
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200"
            style={{ background: 'var(--accent)', boxShadow: '0 0 28px rgba(99,102,241,0.45)' }}
          >
            Browse Categories →
          </Link>
          <Link
            href="/compare/vercel-vs-netlify"
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            Try a comparison
          </Link>
        </div>
      </section>

      {/* ── CATEGORIES GRID ────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 mb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--accent)' }}>Browse</p>
            <h2 className="text-2xl font-bold text-white">Categories</h2>
          </div>
          <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>{CATEGORIES.length} total</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {featuredCategories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="card group p-4 cursor-pointer"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                >
                  {cat.name.charAt(0)}
                </span>
                <svg
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: 'var(--accent)' }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
                </svg>
              </div>
              <p className="font-semibold text-white text-sm leading-tight mb-1 group-hover:text-indigo-300 transition-colors duration-200">
                {cat.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                {cat.toolSlugs.length} tools
              </p>
            </Link>
          ))}
        </div>

        {CATEGORIES.length > 16 && (
          <div className="mt-5 text-center">
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              +{CATEGORIES.length - 16} more categories available
            </p>
          </div>
        )}
      </section>

      {/* ── POPULAR COMPARISONS ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 mb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--accent)' }}>Head-to-head</p>
            <h2 className="text-2xl font-bold text-white">Popular Comparisons</h2>
          </div>
          <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
            {comparisons.length} total
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuredComparisons.map(({ tool1, tool2, slug }) => (
            <Link
              key={slug}
              href={`/compare/${slug}`}
              className="card group p-4 cursor-pointer flex items-center gap-4"
            >
              {/* Tool name badges */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}
                >
                  {tool1.name.charAt(0)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate group-hover:text-indigo-300 transition-colors">
                    {tool1.name} <span style={{ color: 'var(--foreground-muted)' }}>vs</span> {tool2.name}
                  </p>
                  <p className="text-xs capitalize mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
                    {tool1.category.replace(/-/g, ' ')}
                  </p>
                </div>
              </div>
              <svg
                className="w-4 h-4 shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
                style={{ color: 'var(--accent)' }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        <div className="mt-5 text-center">
          <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
            +{comparisons.length - featuredComparisons.length} more comparisons across all categories
          </p>
        </div>
      </section>

      {/* ── FIND ALTERNATIVES ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 mb-24">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--accent)' }}>Explore</p>
          <h2 className="text-2xl font-bold text-white">Find Alternatives</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuredAlts.map(({ tool }) => (
            <Link
              key={tool.slug}
              href={`/alternatives/${tool.slug}`}
              className="card group p-4 cursor-pointer flex items-center gap-4"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                style={{ background: 'rgba(139,92,246,0.15)', color: '#c084fc' }}>
                {tool.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm group-hover:text-purple-300 transition-colors">
                  Alternatives to {tool.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
                  {tool.alternatives.length} alternatives listed
                </p>
              </div>
              <svg
                className="w-4 h-4 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-200"
                style={{ color: '#c084fc' }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TRUST / WHY DEVVERSUS ──────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 mb-24">
        <div
          className="rounded-2xl p-10 md:p-14 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.08) 50%, rgba(59,130,246,0.06) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            boxShadow: '0 0 80px rgba(99,102,241,0.1)',
          }}
        >
          {/* Decorative glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.12), transparent)',
            }}
          />

          <div className="relative z-10">
            <span className="glow-badge mb-6 inline-flex">Why DevVersus?</span>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              Stop reading marketing pages.
            </h2>
            <p className="text-base max-w-xl mx-auto mb-10" style={{ color: 'var(--foreground-muted)', lineHeight: 1.7 }}>
              We cover real pricing, honest trade-offs, and actual feature differences —
              so you can pick the right tool in 5 minutes instead of 5 hours.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: `${TOOLS.length}+`, label: 'Tools' },
                { value: comparisons.length, label: 'Comparisons' },
                { value: CATEGORIES.length, label: 'Categories' },
                { value: 'Free', label: 'Always' },
              ].map(s => (
                <div key={s.label}>
                  <div className="stat-number">{s.value}</div>
                  <div className="text-xs mt-1 uppercase tracking-widest font-medium" style={{ color: 'var(--foreground-muted)' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
