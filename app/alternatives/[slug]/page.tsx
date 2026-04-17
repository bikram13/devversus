import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getToolBySlug, getCategoryForTool, getAllAlternativePages } from '@/data/tools'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllAlternativePages().map(({ tool }) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return {}
  return {
    title: `Best Alternatives to ${tool.name} (${new Date().getFullYear()}) — Free & Paid Options`,
    description: `Looking for ${tool.name} alternatives? We compared ${tool.alternatives.length}+ options so you can find the best replacement for your use case and budget.`,
    alternates: {
      canonical: `https://devversus.com/alternatives/${slug}`,
    },
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

export default async function AlternativesPage({ params }: Props) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) notFound()

  const alternatives = tool.alternatives.map(s => getToolBySlug(s)).filter(Boolean)
  if (alternatives.length === 0) notFound()

  const category = getCategoryForTool(slug)
  const year = new Date().getFullYear()

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Alternatives to ${tool.name} (${year})`,
    description: `Looking for ${tool.name} alternatives? We compared ${alternatives.length}+ options so you can find the best replacement for your use case and budget.`,
    url: `https://devversus.com/alternatives/${slug}`,
    numberOfItems: alternatives.length,
    itemListElement: alternatives.map((alt, i) => ({
      '@type': 'SoftwareApplication',
      position: i + 1,
      name: alt!.name,
      url: alt!.website,
      description: alt!.description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
    })),
  }

  const freeAlt = alternatives.find(a => a!.pricing === 'free' || a!.pricing === 'freemium' || a!.pricing === 'open-source')
  const topAlt = alternatives[0]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the best alternative to ${tool.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: topAlt ? `${topAlt.name} is the top-rated alternative to ${tool.name}. It offers ${topAlt.pros.slice(0, 2).join(' and ')}, and is ${topAlt.pricing}${topAlt.startingPrice ? ` starting at ${topAlt.startingPrice}/month` : ''}.` : `See our full comparison of ${alternatives.length} alternatives above.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is there a free alternative to ${tool.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: freeAlt ? `Yes — ${freeAlt.name} is a ${freeAlt.pricing} alternative to ${tool.name}. ${freeAlt.pros[0] ?? ''}` : `Most alternatives to ${tool.name} are paid or freemium. Check our full list above for current pricing.`,
        },
      },
      {
        '@type': 'Question',
        name: `Why do developers switch from ${tool.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: tool.cons.length > 0 ? `Common reasons to switch from ${tool.name}: ${tool.cons.join('; ')}.` : `Developers look for ${tool.name} alternatives when their needs grow beyond what it offers. See our comparison for details.`,
        },
      },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devversus.com' },
      ...(category ? [{ '@type': 'ListItem', position: 2, name: category.name, item: `https://devversus.com/category/${category.slug}` }] : []),
      { '@type': 'ListItem', position: category ? 3 : 2, name: `Alternatives to ${tool.name}`, item: `https://devversus.com/alternatives/${slug}` },
    ],
  }

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <div className="max-w-4xl mx-auto px-5 py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--foreground-muted)' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-white transition-colors">
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-white">Alternatives to {tool.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
          Best {tool.name} Alternatives
          <span className="text-2xl font-bold ml-3" style={{ color: 'var(--foreground-muted)' }}>({year})</span>
        </h1>
        <p className="text-base max-w-2xl" style={{ color: 'var(--foreground-muted)', lineHeight: 1.7 }}>
          We compared {alternatives.length} alternatives to {tool.name} — so you can find the best
          option for your needs and budget.
        </p>
      </div>

      {/* Original tool card — "you're replacing" */}
      <div className="card p-6 mb-10" style={{ borderColor: 'rgba(251,146,60,0.25)', background: 'rgba(251,146,60,0.04)' }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#fb923c' }}>
              You&apos;re replacing
            </p>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-bold text-white">{tool.name}</h2>
              <PricingBadge label={tool.pricing} />
            </div>
            <p className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>{tool.tagline}</p>
            {tool.startingPrice && (
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                Starts at <span className="font-bold text-white">{tool.startingPrice}</span>
              </p>
            )}
          </div>
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground-muted)' }}
          >
            Visit site →
          </a>
        </div>

        {tool.cons.length > 0 && (
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--foreground-muted)' }}>
              Common reasons to switch
            </p>
            <div className="flex flex-wrap gap-2">
              {tool.cons.map(c => (
                <span key={c} className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(251,146,60,0.1)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.2)' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alternatives list */}
      <section className="space-y-4 mb-16">
        {alternatives.map((alt, i) => (
          <div key={alt!.slug} className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                >
                  {i + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-lg font-bold text-white">{alt!.name}</h3>
                    <PricingBadge label={alt!.pricing} />
                  </div>
                  {alt!.startingPrice && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
                      From <span className="text-white font-semibold">{alt!.startingPrice}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/compare/${tool.slug}-vs-${alt!.slug}`}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200 font-medium"
                  style={{ background: 'var(--accent-dim)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}
                >
                  Compare →
                </Link>
                <a
                  href={alt!.affiliateUrl ?? alt!.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground-muted)' }}
                >
                  Visit →
                </a>
              </div>
            </div>

            <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
              {alt!.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: 'var(--foreground-muted)' }}>Pros</p>
                <div className="space-y-1.5">
                  {alt!.pros.slice(0, 3).map(p => (
                    <div key={p} className="flex items-start gap-2 text-sm" style={{ color: 'var(--foreground)' }}>
                      <span className="text-green-400 shrink-0 mt-0.5 font-bold">+</span>{p}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: 'var(--foreground-muted)' }}>Cons</p>
                <div className="space-y-1.5">
                  {alt!.cons.slice(0, 3).map(c => (
                    <div key={c} className="flex items-start gap-2 text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      <span className="text-red-400 shrink-0 mt-0.5 font-bold">−</span>{c}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {alt!.features.slice(0, 5).map(f => (
                <span key={f} className="text-xs px-2.5 py-1 rounded-lg"
                  style={{ background: 'var(--surface)', color: 'var(--foreground-muted)', border: '1px solid var(--border)' }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Head-to-head links */}
      <section>
        <h2 className="text-xl font-bold text-white mb-5">Compare {tool.name} Head to Head</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alternatives.map(alt => (
            <Link
              key={alt!.slug}
              href={`/compare/${tool.slug}-vs-${alt!.slug}`}
              className="card group p-4 flex items-center justify-between cursor-pointer"
            >
              <span className="text-sm text-white group-hover:text-indigo-300 transition-colors">
                {tool.name} vs {alt!.name}
              </span>
              <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>
    </div>
    </>
  )
}
