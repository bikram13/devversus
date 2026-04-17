import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { TOOLS, getToolBySlug, getCategoryForTool, getAllAlternativePages } from '@/data/tools'

interface Props {
  params: Promise<{ slug: string }>
}

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
  }
}

export default async function AlternativesPage({ params }: Props) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) notFound()

  const alternatives = tool.alternatives
    .map(s => getToolBySlug(s))
    .filter(Boolean)

  if (alternatives.length === 0) notFound()

  const category = getCategoryForTool(slug)
  const year = new Date().getFullYear()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-300 transition">Home</Link>
        <span>/</span>
        {category && <Link href={`/category/${category.slug}`} className="hover:text-gray-300 transition">{category.name}</Link>}
        {category && <span>/</span>}
        <span className="text-gray-300">Alternatives to {tool.name}</span>
      </nav>

      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
        Best {tool.name} Alternatives ({year})
      </h1>
      <p className="text-gray-400 mb-4 max-w-2xl">
        We compared {alternatives.length} alternatives to {tool.name} so you can find the best option for your needs and budget.
        Whether you need a cheaper option, a different feature set, or just want to move away from {tool.name}, these are the best choices.
      </p>

      {/* Original tool card */}
      <div className="border border-gray-700 rounded-2xl p-5 mb-10 bg-gray-900/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">You&apos;re replacing</p>
            <h2 className="text-lg font-bold text-white">{tool.name}</h2>
            <p className="text-gray-400 text-sm mt-1">{tool.tagline}</p>
            {tool.startingPrice && (
              <p className="text-sm text-gray-400 mt-2">Starts at <span className="text-white font-medium">{tool.startingPrice}</span></p>
            )}
          </div>
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs text-gray-500 border border-gray-700 px-3 py-1.5 rounded-lg hover:border-gray-500 transition"
          >
            Visit site →
          </a>
        </div>
        {tool.cons.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Common reasons to switch</p>
            <div className="flex flex-wrap gap-2">
              {tool.cons.map(c => (
                <span key={c} className="text-xs text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alternatives list */}
      <section className="space-y-4 mb-16">
        {alternatives.map((alt, i) => (
          <div key={alt!.slug} className="border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/30 transition bg-gray-900/20">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <h3 className="text-lg font-bold text-white">{alt!.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize border ${
                  alt!.pricing === 'free' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  alt!.pricing === 'freemium' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  alt!.pricing === 'open-source' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                  'bg-orange-500/10 text-orange-400 border-orange-500/20'
                }`}>{alt!.pricing}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/compare/${tool.slug}-vs-${alt!.slug}`}
                  className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition">
                  Compare →
                </Link>
                <a href={alt!.affiliateUrl ?? alt!.website} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-gray-200 border border-gray-700 px-3 py-1.5 rounded-lg transition">
                  Visit →
                </a>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-4">{alt!.description}</p>

            {alt!.startingPrice && (
              <p className="text-sm text-gray-400 mb-4">
                Starting at <span className="text-white font-semibold">{alt!.startingPrice}</span>
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Pros</p>
                <div className="space-y-1">
                  {alt!.pros.slice(0, 3).map(p => (
                    <div key={p} className="flex items-start gap-1.5 text-xs text-gray-300">
                      <span className="text-green-400 shrink-0 mt-0.5">+</span>{p}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Cons</p>
                <div className="space-y-1">
                  {alt!.cons.slice(0, 3).map(c => (
                    <div key={c} className="flex items-start gap-1.5 text-xs text-gray-400">
                      <span className="text-red-400 shrink-0 mt-0.5">−</span>{c}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {alt!.features.slice(0, 5).map(f => (
                <span key={f} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{f}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Related searches */}
      <section>
        <h2 className="text-xl font-bold text-white mb-5">Compare {tool.name} Head to Head</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alternatives.map(alt => (
            <Link key={alt!.slug} href={`/compare/${tool.slug}-vs-${alt!.slug}`}
              className="border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300 hover:border-indigo-500/40 hover:text-indigo-300 transition">
              {tool.name} vs {alt!.name} →
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
