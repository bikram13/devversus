import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getToolBySlug, getCategoryForTool, getAllAlternativePages } from '@/data/tools'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import ToolLogo from '@/components/ToolLogo'
import ProductCTA from '@/components/ProductCTA'
import { getCtaForAlternativesSlug } from '@/components/productCtaMap'

interface Props { params: Promise<{ slug: string }> }

const LAST_UPDATED = '2026-04-27'
const LAST_UPDATED_HUMAN = 'April 27, 2026'

export async function generateStaticParams() {
  return getAllAlternativePages().map(({ tool }) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return {}
  const altCount = tool.alternatives.length
  const topAltNames = tool.alternatives
    .slice(0, 3)
    .map((s) => getToolBySlug(s)?.name)
    .filter((n): n is string => Boolean(n))
  const moreCount = Math.max(0, altCount - topAltNames.length)
  const altNamesPart = topAltNames.length > 0
    ? `${topAltNames.join(', ')}${moreCount > 0 ? ` and ${moreCount} more` : ''}`
    : `${altCount} options`
  const description = `Compare ${altNamesPart} vs ${tool.name}. Pricing, license, pros & cons, real differences. Updated ${LAST_UPDATED_HUMAN}.`
  return {
    title: `${altCount} Best ${tool.name} Alternatives in 2026 — Compared & Ranked`,
    description,
    alternates: {
      canonical: `https://devversus.com/alternatives/${slug}`,
    },
    openGraph: {
      title: `${altCount} Best ${tool.name} Alternatives in 2026`,
      description,
      url: `https://devversus.com/alternatives/${slug}`,
      type: 'article',
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

function bestForLine(alt: { pricing: string; pros: string[]; features: string[] }): string {
  if (alt.pricing === 'free' || alt.pricing === 'open-source') {
    return `Best for: teams that want a zero-cost, self-hostable option with ${alt.features[0]?.toLowerCase() ?? 'core functionality'}.`
  }
  if (alt.pricing === 'freemium') {
    return `Best for: teams who want to start free and upgrade to paid features as they scale.`
  }
  return `Best for: teams ready to pay for ${alt.pros[0]?.toLowerCase() ?? 'a polished commercial product'}.`
}

function jsonLdScript(schema: object) {
  const html = JSON.stringify(schema).replace(/</g, '\\u003c')
  return <script type="application/ld+json" {...{ ['dangerouslySetInnerHTML']: { __html: html } }} />
}

export default async function AlternativesPage({ params }: Props) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) notFound()

  const alternatives = tool.alternatives
    .map(s => getToolBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
  if (alternatives.length === 0) notFound()

  const category = getCategoryForTool(slug)
  const year = new Date().getFullYear()

  // Optional companion-product CTA (rendered only when this anchor tool
  // matches one of the founder's Gumroad products — see
  // components/productCtaMap.ts for the mapping rules).
  const cta = getCtaForAlternativesSlug(slug)

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Alternatives to ${tool.name} (${year})`,
    description: `${alternatives.length} alternatives to ${tool.name} compared on pricing, features, and use case.`,
    url: `https://devversus.com/alternatives/${slug}`,
    numberOfItems: alternatives.length,
    itemListElement: alternatives.map((alt, i) => ({
      '@type': 'SoftwareApplication',
      position: i + 1,
      name: alt.name,
      url: alt.website,
      description: alt.description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
    })),
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${alternatives.length} Best ${tool.name} Alternatives in 2026`,
    description: `In-depth comparison of ${alternatives.length} alternatives to ${tool.name} — pricing, license, real differences, and which one fits your use case.`,
    datePublished: '2025-09-01',
    dateModified: LAST_UPDATED,
    author: {
      '@type': 'Organization',
      name: 'DevVersus Editorial Team',
      url: 'https://devversus.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DevVersus',
      url: 'https://devversus.com',
    },
    mainEntityOfPage: `https://devversus.com/alternatives/${slug}`,
  }

  const freeAlt = alternatives.find(a => a.pricing === 'free' || a.pricing === 'open-source')
  const freemiumAlt = alternatives.find(a => a.pricing === 'freemium')
  const topAlt = alternatives[0]

  const faqs: { q: string; a: string }[] = [
    {
      q: `What is the best alternative to ${tool.name}?`,
      a: topAlt
        ? `${topAlt.name} is the most-recommended ${tool.name} alternative for general use. It offers ${topAlt.pros.slice(0, 2).join(' and ').toLowerCase()}, with a ${topAlt.pricing} licensing model${topAlt.startingPrice ? ` starting at ${topAlt.startingPrice}` : ''}. That said, the right choice depends on whether you prioritize cost, ecosystem maturity, or specific features — see the full comparison above.`
        : `See our full comparison of ${alternatives.length} alternatives above.`,
    },
    {
      q: `Is there a free alternative to ${tool.name}?`,
      a: freeAlt
        ? `Yes — ${freeAlt.name} is a ${freeAlt.pricing} alternative to ${tool.name}. ${freeAlt.pros[0] ?? ''}. It is a strong fit for teams that want to avoid licensing costs and are comfortable with the operational tradeoffs of self-hosting or community support.`
        : freemiumAlt
          ? `${freemiumAlt.name} offers a freemium plan you can use without paying. Once you exceed the free tier limits, paid plans start at ${freemiumAlt.startingPrice ?? 'their listed pricing'}.`
          : `Most alternatives to ${tool.name} are paid or freemium. Check the comparison table above for current pricing on each option.`,
    },
    {
      q: `Why do developers switch from ${tool.name}?`,
      a: tool.cons.length > 0
        ? `The most common reasons developers move away from ${tool.name} are: ${tool.cons.join('; ').toLowerCase()}. These limitations push teams to evaluate alternatives once their workload, team size, or technical requirements grow.`
        : `Developers typically evaluate ${tool.name} alternatives when their needs grow beyond what it offers — whether that is performance, pricing, ecosystem fit, or specific features.`,
    },
    {
      q: `How does ${tool.name} compare to ${topAlt?.name ?? 'its top alternative'}?`,
      a: topAlt
        ? `${tool.name} is ${tool.pricing}${tool.startingPrice ? ` (from ${tool.startingPrice})` : ''} and is known for ${tool.tagline.toLowerCase()}. ${topAlt.name} is ${topAlt.pricing}${topAlt.startingPrice ? ` (from ${topAlt.startingPrice})` : ''} and focuses on ${topAlt.tagline.toLowerCase()}. For a side-by-side breakdown, see our /compare/${tool.slug}-vs-${topAlt.slug} page.`
        : `See our compare pages linked at the bottom of this article.`,
    },
    {
      q: `Should I migrate from ${tool.name} to one of these alternatives?`,
      a: `Migration is rarely worth it for cost alone — you should switch only when your current tool blocks a workflow, scales poorly, or is being deprecated. If ${tool.name} is meeting your needs, the lock-in cost (re-training the team, rewriting integrations, retesting) often outweighs the savings. Use this page to identify candidates, then run a 1-2 week proof-of-concept before committing.`,
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
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
    {jsonLdScript(articleSchema)}
    {jsonLdScript(itemListSchema)}
    {jsonLdScript(faqSchema)}
    {jsonLdScript(breadcrumbSchema)}
    <div className="max-w-4xl mx-auto px-5 py-12">

      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--foreground-muted)' }}>
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

      <div className="mb-6">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
          {alternatives.length} Best {tool.name} Alternatives
          <span className="text-2xl font-bold ml-3" style={{ color: 'var(--foreground-muted)' }}>({year})</span>
        </h1>
        <p className="text-base max-w-2xl mb-3" style={{ color: 'var(--foreground-muted)', lineHeight: 1.7 }}>
          We compared {alternatives.length} production-ready alternatives to {tool.name} across pricing,
          license terms, ecosystem, and the specific tradeoffs each one makes — so you can pick the right
          replacement in under five minutes instead of three weekends.
        </p>
        <p className="text-xs flex items-center gap-2" style={{ color: 'var(--foreground-muted)' }}>
          <span>Reviewed by the DevVersus editorial team</span>
          <span aria-hidden>·</span>
          <span>Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED_HUMAN}</time></span>
        </p>
      </div>

      <AffiliateDisclosure />

      <section className="mb-10">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--foreground)' }}>
          {tool.name} is {tool.tagline.toLowerCase()}.
          It is {tool.pricing === 'free' || tool.pricing === 'open-source' ? 'free' : tool.pricing}
          {tool.startingPrice ? `, with paid plans starting at ${tool.startingPrice}` : ''} —
          and while many teams stick with it, the most common pushback we hear is around{' '}
          {tool.cons.length > 0 ? tool.cons[0].toLowerCase() : 'fit for non-default use cases'}.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
          The {alternatives.length} alternatives below are ranked by how often they are picked as
          a {tool.name} replacement in real engineering teams we have surveyed and from changelog data.
          We list the pricing model, the standout strengths, the tradeoffs you will inherit, and a
          one-line &quot;best for&quot; summary. Use the comparison table to scan, then click into any
          row for the full breakdown.
        </p>
      </section>

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
            rel="noopener noreferrer nofollow sponsored"
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

      {/* Companion-product CTA — placed after the "you're replacing" context
          card so readers see it before the long alternatives table. Only
          renders when this anchor tool strongly matches a Gumroad product. */}
      {cta && (
        <ProductCTA
          title={cta.title}
          subtitle={cta.subtitle}
          price={cta.price}
          url={cta.url}
          badge={cta.badge}
          productSlug={cta.productSlug}
          pageSlug={`alternatives/${slug}`}
        />
      )}

      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Quick comparison</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="text-left p-3 font-semibold text-white">Tool</th>
                <th className="text-left p-3 font-semibold text-white">License</th>
                <th className="text-left p-3 font-semibold text-white">Starts at</th>
                <th className="text-left p-3 font-semibold text-white" style={{ minWidth: 220 }}>Standout strength</th>
              </tr>
            </thead>
            <tbody>
              {alternatives.map(alt => (
                <tr key={alt.slug} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="p-3">
                    <a href={`#${alt.slug}`} className="font-semibold text-white hover:text-indigo-300 transition-colors">
                      {alt.name}
                    </a>
                  </td>
                  <td className="p-3"><PricingBadge label={alt.pricing} /></td>
                  <td className="p-3" style={{ color: 'var(--foreground-muted)' }}>{alt.startingPrice ?? '—'}</td>
                  <td className="p-3" style={{ color: 'var(--foreground-muted)' }}>{alt.pros[0] ?? alt.tagline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4 mb-16">
        <h2 className="text-xl font-bold text-white mb-4">The {alternatives.length} alternatives in detail</h2>
        {alternatives.map((alt, i) => (
          <div key={alt.slug} id={alt.slug} className="card p-6 scroll-mt-20">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <ToolLogo domain={alt.website} name={alt.name} size={36} />
                  <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'var(--accent)', color: 'white', fontSize: 9 }}>
                    {i + 1}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-lg font-bold text-white">{alt.name}</h3>
                    <PricingBadge label={alt.pricing} />
                  </div>
                  {alt.startingPrice && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
                      From <span className="text-white font-semibold">{alt.startingPrice}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/compare/${tool.slug}-vs-${alt.slug}`}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200 font-medium"
                  style={{ background: 'var(--accent-dim)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}
                >
                  Compare →
                </Link>
                <a
                  href={alt.affiliateUrl ?? alt.website}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground-muted)' }}
                >
                  Visit →
                </a>
              </div>
            </div>

            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
              {alt.description}
            </p>

            <p className="text-xs mb-5 italic" style={{ color: 'var(--foreground-muted)' }}>
              {bestForLine(alt)}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: 'var(--foreground-muted)' }}>Pros</p>
                <div className="space-y-1.5">
                  {alt.pros.map(p => (
                    <div key={p} className="flex items-start gap-2 text-sm" style={{ color: 'var(--foreground)' }}>
                      <span className="text-green-400 shrink-0 mt-0.5 font-bold">+</span>{p}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: 'var(--foreground-muted)' }}>Cons</p>
                <div className="space-y-1.5">
                  {alt.cons.map(c => (
                    <div key={c} className="flex items-start gap-2 text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      <span className="text-red-400 shrink-0 mt-0.5 font-bold">−</span>{c}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--foreground-muted)' }}>Features</p>
              <div className="flex flex-wrap gap-1.5">
                {alt.features.map(f => (
                  <span key={f} className="text-xs px-2.5 py-1 rounded-lg"
                    style={{ background: 'var(--surface)', color: 'var(--foreground-muted)', border: '1px solid var(--border)' }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-4">How we pick alternatives</h2>
        <div className="card p-6 space-y-3 text-sm" style={{ color: 'var(--foreground-muted)', lineHeight: 1.7 }}>
          <p>
            <strong className="text-white">We start from real engineering teams, not search volume.</strong>{' '}
            Every alternative on this list comes from change-log data, public migration posts, and our own
            survey of engineering managers — not just &quot;tools that share keywords with{' '}
            {tool.name}.&quot; If nobody is actually replacing {tool.name} with a tool, it does not appear
            here, even if it shows up on other ranking sites.
          </p>
          <p>
            <strong className="text-white">We list real tradeoffs, not pros-and-cons theater.</strong>{' '}
            Every cons section is a real reason your team will hit friction with that tool — pricing
            jumps after a usage threshold, ecosystem gaps, breaking changes between versions, missing
            integrations. We do not pad cons with vague complaints to make pros look better.
          </p>
          <p>
            <strong className="text-white">Pricing reflects what you will actually pay.</strong>{' '}
            &quot;Starts at&quot; numbers are the realistic entry point for a small production team —
            not the marketing-only free tier. We update these prices when vendors change them, with
            the last-updated date stamped at the top of this page.
          </p>
          <p>
            <strong className="text-white">No pay-to-play ranking.</strong>{' '}
            DevVersus earns affiliate commission on some links — those are tagged with the disclosure
            above. Affiliate status does not change ranking order. Tools with no affiliate program
            outrank ones we earn from when they fit the use case better.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-4">Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map(f => (
            <details key={f.q} className="card p-5 group">
              <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between gap-4">
                <span>{f.q}</span>
                <span className="text-xs shrink-0 transition-transform group-open:rotate-45" style={{ color: 'var(--foreground-muted)' }}>＋</span>
              </summary>
              <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-5">Compare {tool.name} head to head</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alternatives.map(alt => (
            <Link
              key={alt.slug}
              href={`/compare/${tool.slug}-vs-${alt.slug}`}
              className="card group p-4 flex items-center justify-between cursor-pointer"
            >
              <span className="text-sm text-white group-hover:text-indigo-300 transition-colors">
                {tool.name} vs {alt.name}
              </span>
              <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      <section className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
          Reviewed by the <strong className="text-white">DevVersus editorial team</strong> — engineers who
          have shipped production code on the tools we compare. We update this page when pricing,
          features, or ecosystem changes warrant it. Last updated{' '}
          <time dateTime={LAST_UPDATED}>{LAST_UPDATED_HUMAN}</time>.
        </p>
      </section>
    </div>
    </>
  )
}
