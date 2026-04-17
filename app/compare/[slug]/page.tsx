import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllComparisons, getToolBySlug, getCategoryForTool } from '@/data/tools'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllComparisons().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const vsIndex = slug.indexOf('-vs-')
  if (vsIndex === -1) return {}
  const tool1 = getToolBySlug(slug.substring(0, vsIndex))
  const tool2 = getToolBySlug(slug.substring(vsIndex + 4))
  if (!tool1 || !tool2) return {}
  return {
    title: `${tool1.name} vs ${tool2.name} (${new Date().getFullYear()}) — Features, Pricing & Differences`,
    description: `Compare ${tool1.name} and ${tool2.name} side by side. See pricing, features, pros & cons to decide which is right for your project.`,
    alternates: {
      canonical: `https://devversus.com/compare/${slug}`,
    },
  }
}

function PricingBadge({ label }: { label: string }) {
  const cls: Record<string, string> = {
    free:        'badge-free',
    freemium:    'badge-freemium',
    paid:        'badge-paid',
    'open-source': 'badge-open-source',
  }
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${cls[label] ?? 'badge-freemium'}`}>
      {label}
    </span>
  )
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params
  const vsIndex = slug.indexOf('-vs-')
  if (vsIndex === -1) notFound()

  const tool1 = getToolBySlug(slug.substring(0, vsIndex))
  const tool2 = getToolBySlug(slug.substring(vsIndex + 4))
  if (!tool1 || !tool2) notFound()

  const category = getCategoryForTool(tool1.slug)
  const year = new Date().getFullYear()
  const allFeatures = Array.from(new Set([...tool1.features, ...tool2.features]))

  // Helper: pricing string for schema
  const priceStr = (tool: typeof tool1) =>
    tool.startingPrice ? tool.startingPrice.replace(/[^0-9.]/g, '') || '0' : '0'

  // SoftwareApplication schema for each tool
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@graph': [tool1, tool2].map(tool => ({
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.description,
      url: tool.website,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: priceStr(tool),
        priceCurrency: 'USD',
        availability: 'https://schema.org/OnlineOnly',
      },
    })),
  }

  // FAQPage schema — answers generated from existing Tool data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the difference between ${tool1.name} and ${tool2.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${tool1.name} is known for ${tool1.pros.slice(0, 2).join(' and ')}. ${tool2.name} stands out for ${tool2.pros.slice(0, 2).join(' and ')}. The main trade-off: ${tool1.name} ${tool1.cons[0] ?? 'has fewer free tier options'}, while ${tool2.name} ${tool2.cons[0] ?? 'has a steeper learning curve'}.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much does ${tool1.name} cost compared to ${tool2.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${tool1.name} is ${tool1.pricing}${tool1.startingPrice ? `, starting at ${tool1.startingPrice}/month` : ''}. ${tool2.name} is ${tool2.pricing}${tool2.startingPrice ? `, starting at ${tool2.startingPrice}/month` : ''}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Should I use ${tool1.name} or ${tool2.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Choose ${tool1.name} if ${tool1.pros[0]?.toLowerCase() ?? 'it fits your workflow'}. Choose ${tool2.name} if ${tool2.pros[0]?.toLowerCase() ?? 'it better suits your stack'}. Both are strong choices — the best pick depends on your team size, budget, and specific use case.`,
        },
      },
    ],
  }

  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devversus.com' },
      ...(category ? [{ '@type': 'ListItem', position: 2, name: category.name, item: `https://devversus.com/category/${category.slug}` }] : []),
      { '@type': 'ListItem', position: category ? 3 : 2, name: `${tool1.name} vs ${tool2.name}`, item: `https://devversus.com/compare/${slug}` },
    ],
  }

  // TL;DR verdict text (used in both the UI and speakable schema)
  const verdict = `${tool1.name} is better for teams that need ${tool1.pros[0]?.toLowerCase() ?? 'advanced features'}. ${tool2.name} is the stronger choice if ${tool2.pros[0]?.toLowerCase() ?? 'simplicity matters'}. ${tool1.name} is ${tool1.pricing}${tool1.startingPrice ? ` (from ${tool1.startingPrice})` : ''} and ${tool2.name} is ${tool2.pricing}${tool2.startingPrice ? ` (from ${tool2.startingPrice})` : ''}.`

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <div className="max-w-5xl mx-auto px-5 py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--foreground-muted)' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-white transition-colors capitalize">
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-white">{tool1.name} vs {tool2.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
          {tool1.name} <span style={{ color: 'var(--foreground-muted)' }}>vs</span> {tool2.name}
          <span className="text-2xl font-bold ml-3" style={{ color: 'var(--foreground-muted)' }}>({year})</span>
        </h1>
        {/* TL;DR verdict — optimised for AI citation and featured snippets */}
        <p className="text-base max-w-2xl mb-3" style={{ color: 'var(--foreground)', lineHeight: 1.7 }}>
          {verdict}
        </p>
        <p className="text-sm max-w-2xl" style={{ color: 'var(--foreground-muted)', lineHeight: 1.7 }}>
          Full feature breakdown, pricing details, and pros & cons below.
        </p>
      </div>

      {/* Quick-verdict cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
        {[tool1, tool2].map((tool, idx) => (
          <div key={tool.slug} className="card p-7" style={{ borderColor: idx === 0 ? 'rgba(99,102,241,0.3)' : 'rgba(139,92,246,0.3)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                  style={{ background: idx === 0 ? 'rgba(99,102,241,0.15)' : 'rgba(139,92,246,0.15)', color: idx === 0 ? '#a5b4fc' : '#c084fc' }}>
                  {tool.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-white">{tool.name}</h2>
              </div>
              <PricingBadge label={tool.pricing} />
            </div>

            <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
              {tool.description}
            </p>

            {tool.startingPrice && (
              <p className="text-sm mb-5">
                <span style={{ color: 'var(--foreground-muted)' }}>Starting at </span>
                <span className="font-bold text-white">{tool.startingPrice}</span>
              </p>
            )}

            <a
              href={tool.affiliateUrl ?? tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: idx === 0 ? 'var(--accent)' : 'rgba(139,92,246,0.8)',
                color: 'white',
                boxShadow: idx === 0 ? '0 0 20px rgba(99,102,241,0.35)' : '0 0 20px rgba(139,92,246,0.25)',
              }}
            >
              Visit {tool.name}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          </div>
        ))}
      </div>

      {/* Feature comparison table */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-white mb-5">How Do {tool1.name} and {tool2.name} Compare on Features?</h2>
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {/* Header row */}
          <div
            className="grid grid-cols-3 px-6 py-3.5 text-sm font-semibold"
            style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)', color: 'var(--foreground-muted)' }}
          >
            <span>Feature</span>
            <span className="text-center text-white">{tool1.name}</span>
            <span className="text-center text-white">{tool2.name}</span>
          </div>

          {/* Pricing row */}
          {[
            { label: 'Pricing model', v1: <span className="capitalize text-white">{tool1.pricing}</span>, v2: <span className="capitalize text-white">{tool2.pricing}</span> },
            { label: 'Starting price', v1: <span className="text-white">{tool1.startingPrice ?? 'Free'}</span>, v2: <span className="text-white">{tool2.startingPrice ?? 'Free'}</span> },
          ].map(row => (
            <div key={row.label} className="grid grid-cols-3 px-6 py-4 text-sm" style={{ borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--foreground-muted)' }}>{row.label}</span>
              <span className="text-center">{row.v1}</span>
              <span className="text-center">{row.v2}</span>
            </div>
          ))}

          {/* Feature rows */}
          {allFeatures.map((feat, i) => {
            const t1Has = tool1.features.includes(feat)
            const t2Has = tool2.features.includes(feat)
            return (
              <div
                key={feat}
                className="grid grid-cols-3 px-6 py-3.5 text-sm"
                style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}
              >
                <span style={{ color: 'var(--foreground-muted)' }}>{feat}</span>
                <span className="text-center">
                  {t1Has
                    ? <span className="text-green-400 font-bold">✓</span>
                    : <span style={{ color: 'var(--foreground-muted)' }}>—</span>}
                </span>
                <span className="text-center">
                  {t2Has
                    ? <span className="text-green-400 font-bold">✓</span>
                    : <span style={{ color: 'var(--foreground-muted)' }}>—</span>}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Pros & Cons */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-white mb-5">{tool1.name} Pros and Cons vs {tool2.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[tool1, tool2].map((tool, idx) => (
            <div key={tool.slug} className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: idx === 0 ? 'rgba(99,102,241,0.15)' : 'rgba(139,92,246,0.15)', color: idx === 0 ? '#a5b4fc' : '#c084fc' }}>
                  {tool.name.charAt(0)}
                </div>
                <h3 className="font-bold text-white">{tool.name}</h3>
              </div>
              <div className="space-y-2.5 mb-4">
                {tool.pros.map(p => (
                  <div key={p} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--foreground)' }}>
                    <span className="text-green-400 mt-0.5 shrink-0 font-bold">+</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2.5">
                {tool.cons.map(c => (
                  <div key={c} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--foreground-muted)' }}>
                    <span className="text-red-400 mt-0.5 shrink-0 font-bold">−</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* When to choose */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-white mb-5">Should You Use {tool1.name} or {tool2.name}?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { tool: tool1, color: '#a5b4fc', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)' },
            { tool: tool2, color: '#c084fc', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)' },
          ].map(({ tool, color, bg, border }) => (
            <div key={tool.slug} className="rounded-2xl p-6" style={{ background: bg, border: `1px solid ${border}` }}>
              <h3 className="font-bold mb-4 text-sm" style={{ color }}>
                Choose {tool.name} if…
              </h3>
              <ul className="space-y-2.5">
                {tool.pros.slice(0, 3).map(p => (
                  <li key={p} className="text-sm flex items-start gap-2" style={{ color: 'var(--foreground)' }}>
                    <span className="shrink-0 mt-0.5" style={{ color }}>•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Related comparisons */}
      {category && (
        <section>
          <h2 className="text-xl font-bold text-white mb-5">More {category.name} Comparisons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getAllComparisons()
              .filter(c => (c.tool1.category === category.slug || c.tool2.category === category.slug) && c.slug !== slug)
              .slice(0, 6)
              .map(c => (
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
    </>
  )
}
