import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { CATEGORIES, getCategoryBySlug, getToolsByCategory, getAllComparisons } from '@/data/tools'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = getCategoryBySlug(slug)
  if (!cat) return {}
  return {
    title: `Best ${cat.name} Tools (${new Date().getFullYear()}) — Compared & Ranked`,
    description: `Compare the best ${cat.name.toLowerCase()} tools side by side. Pricing, features, and honest reviews to help you pick the right tool.`,
  }
}

function PricingBadge({ label }: { label: string }) {
  const cls: Record<string, string> = {
    free:          'badge-free',
    freemium:      'badge-freemium',
    paid:          'badge-paid',
    'open-source': 'badge-open-source',
  }
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${cls[label] ?? 'badge-freemium'}`}>
      {label}
    </span>
  )
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const tools = getToolsByCategory(slug)
  const comparisons = getAllComparisons().filter(
    c => c.tool1.category === slug || c.tool2.category === slug
  )

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--foreground-muted)' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span className="text-white">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="glow-badge">{tools.length} tools</span>
          {comparisons.length > 0 && (
            <span className="glow-badge">{comparisons.length} comparisons</span>
          )}
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
          Best {category.name} Tools
          <span className="text-2xl font-bold ml-3" style={{ color: 'var(--foreground-muted)' }}>
            ({new Date().getFullYear()})
          </span>
        </h1>
        <p className="text-base max-w-2xl" style={{ color: 'var(--foreground-muted)', lineHeight: 1.7 }}>
          {category.description} We compared {tools.length} tools so you don&apos;t have to.
        </p>
      </div>

      {/* Tools grid */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map(tool => (
            <div key={tool.slug} className="card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                  >
                    {tool.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white leading-tight">{tool.name}</h2>
                    {tool.startingPrice && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
                        From <span className="text-white font-semibold">{tool.startingPrice}</span>
                      </p>
                    )}
                  </div>
                </div>
                <PricingBadge label={tool.pricing} />
              </div>

              <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                {tool.tagline}
              </p>

              {/* Top features */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tool.features.slice(0, 3).map(f => (
                  <span key={f} className="text-xs px-2 py-0.5 rounded-md"
                    style={{ background: 'var(--surface)', color: 'var(--foreground-muted)', border: '1px solid var(--border)' }}>
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/alternatives/${tool.slug}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                  style={{ background: 'var(--accent-dim)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}
                >
                  Alternatives →
                </Link>
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground-muted)' }}
                >
                  Visit site →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparisons in this category */}
      {comparisons.length > 0 && (
        <section>
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--accent)' }}>Head-to-head</p>
            <h2 className="text-xl font-bold text-white">{category.name} Comparisons</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {comparisons.map(c => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="card group p-4 flex items-center justify-between cursor-pointer"
              >
                <span className="text-sm text-white group-hover:text-indigo-300 transition-colors">
                  {c.tool1.name} vs {c.tool2.name}
                </span>
                <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
