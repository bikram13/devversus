import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllComparisons, getToolBySlug, getCategoryForTool } from '@/data/tools'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllComparisons().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [slug1, ...rest] = slug.split('-vs-')
  const slug2 = rest.join('-vs-')
  const tool1 = getToolBySlug(slug1)
  const tool2 = getToolBySlug(slug2)
  if (!tool1 || !tool2) return {}
  return {
    title: `${tool1.name} vs ${tool2.name} (${new Date().getFullYear()}) — Features, Pricing & Differences`,
    description: `Compare ${tool1.name} and ${tool2.name} side by side. See pricing, features, pros & cons to decide which is right for your project.`,
  }
}

function Badge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    free: 'bg-green-500/10 text-green-400 border-green-500/20',
    freemium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    paid: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'open-source': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }
  return (
    <span className={`text-xs border px-2 py-0.5 rounded-full font-medium capitalize ${colors[label] ?? 'bg-gray-800 text-gray-400 border-gray-700'}`}>
      {label}
    </span>
  )
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params
  const vsIndex = slug.indexOf('-vs-')
  if (vsIndex === -1) notFound()

  const slug1 = slug.substring(0, vsIndex)
  const slug2 = slug.substring(vsIndex + 4)

  const tool1 = getToolBySlug(slug1)
  const tool2 = getToolBySlug(slug2)
  if (!tool1 || !tool2) notFound()

  const category = getCategoryForTool(slug1)
  const year = new Date().getFullYear()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-300 transition">Home</Link>
        <span>/</span>
        {category && <Link href={`/category/${category.slug}`} className="hover:text-gray-300 transition capitalize">{category.name}</Link>}
        {category && <span>/</span>}
        <span className="text-gray-300">{tool1.name} vs {tool2.name}</span>
      </nav>

      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
        {tool1.name} vs {tool2.name} ({year})
      </h1>
      <p className="text-gray-400 mb-10 max-w-2xl">
        A detailed comparison of {tool1.name} and {tool2.name} — pricing, features, pros & cons, and which one to pick for your use case.
      </p>

      {/* Quick Verdict */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="border border-gray-800 rounded-2xl p-6 bg-gray-900/40">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white">{tool1.name}</h2>
            <Badge label={tool1.pricing} />
          </div>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">{tool1.description}</p>
          {tool1.startingPrice && (
            <p className="text-sm text-gray-300 mb-4">
              <span className="text-gray-500">Starting at </span>
              <span className="font-semibold">{tool1.startingPrice}</span>
            </p>
          )}
          <a
            href={tool1.affiliateUrl ?? tool1.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition font-medium"
          >
            Visit {tool1.name} →
          </a>
        </div>

        <div className="border border-gray-800 rounded-2xl p-6 bg-gray-900/40">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white">{tool2.name}</h2>
            <Badge label={tool2.pricing} />
          </div>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">{tool2.description}</p>
          {tool2.startingPrice && (
            <p className="text-sm text-gray-300 mb-4">
              <span className="text-gray-500">Starting at </span>
              <span className="font-semibold">{tool2.startingPrice}</span>
            </p>
          )}
          <a
            href={tool2.affiliateUrl ?? tool2.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition font-medium"
          >
            Visit {tool2.name} →
          </a>
        </div>
      </div>

      {/* Features Comparison Table */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-5">Feature Comparison</h2>
        <div className="border border-gray-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-900/60 px-6 py-3 text-sm font-semibold text-gray-400">
            <span>Feature</span>
            <span className="text-center">{tool1.name}</span>
            <span className="text-center">{tool2.name}</span>
          </div>
          {/* Pricing row */}
          <div className="grid grid-cols-3 px-6 py-4 border-t border-gray-800/60 text-sm">
            <span className="text-gray-400 font-medium">Pricing model</span>
            <span className="text-center text-white capitalize">{tool1.pricing}</span>
            <span className="text-center text-white capitalize">{tool2.pricing}</span>
          </div>
          {/* Starting price row */}
          <div className="grid grid-cols-3 px-6 py-4 border-t border-gray-800/60 text-sm bg-gray-900/20">
            <span className="text-gray-400 font-medium">Starting price</span>
            <span className="text-center text-white">{tool1.startingPrice ?? 'Free'}</span>
            <span className="text-center text-white">{tool2.startingPrice ?? 'Free'}</span>
          </div>
          {/* Feature rows from union */}
          {Array.from(new Set([...tool1.features, ...tool2.features])).map((feat, i) => {
            const t1Has = tool1.features.includes(feat)
            const t2Has = tool2.features.includes(feat)
            return (
              <div key={feat} className={`grid grid-cols-3 px-6 py-4 border-t border-gray-800/60 text-sm ${i % 2 === 0 ? '' : 'bg-gray-900/20'}`}>
                <span className="text-gray-400">{feat}</span>
                <span className="text-center">{t1Has ? '✓' : '—'}</span>
                <span className="text-center">{t2Has ? '✓' : '—'}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Pros & Cons */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-5">Pros & Cons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">{tool1.name}</h3>
            <div className="space-y-2 mb-4">
              {tool1.pros.map(p => (
                <div key={p} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-green-400 mt-0.5 shrink-0">+</span>{p}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {tool1.cons.map(c => (
                <div key={c} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-red-400 mt-0.5 shrink-0">−</span>{c}
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">{tool2.name}</h3>
            <div className="space-y-2 mb-4">
              {tool2.pros.map(p => (
                <div key={p} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-green-400 mt-0.5 shrink-0">+</span>{p}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {tool2.cons.map(c => (
                <div key={c} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-red-400 mt-0.5 shrink-0">−</span>{c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* When to choose */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-5">When to Choose Each</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-indigo-500/30 bg-indigo-500/5 rounded-2xl p-6">
            <h3 className="font-bold text-indigo-300 mb-3">Choose {tool1.name} if…</h3>
            <ul className="space-y-2">
              {tool1.pros.slice(0, 3).map(p => (
                <li key={p} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-indigo-400 shrink-0">•</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-purple-500/30 bg-purple-500/5 rounded-2xl p-6">
            <h3 className="font-bold text-purple-300 mb-3">Choose {tool2.name} if…</h3>
            <ul className="space-y-2">
              {tool2.pros.slice(0, 3).map(p => (
                <li key={p} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-purple-400 shrink-0">•</span>{p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Related comparisons */}
      {category && (
        <section>
          <h2 className="text-xl font-bold text-white mb-5">More {category.name} Comparisons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getAllComparisons()
              .filter(c => (c.tool1.category === category.slug || c.tool2.category === category.slug) && c.slug !== slug)
              .slice(0, 6)
              .map(c => (
                <Link key={c.slug} href={`/compare/${c.slug}`}
                  className="border border-gray-800 rounded-xl px-4 py-3 text-sm hover:border-indigo-500/40 hover:text-indigo-300 text-gray-300 transition">
                  {c.tool1.name} vs {c.tool2.name}
                </Link>
              ))}
          </div>
        </section>
      )}
    </div>
  )
}
