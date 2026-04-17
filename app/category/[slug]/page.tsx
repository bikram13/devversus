import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { CATEGORIES, getCategoryBySlug, getToolsByCategory, getAllComparisons } from '@/data/tools'

interface Props {
  params: Promise<{ slug: string }>
}

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

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const tools = getToolsByCategory(slug)
  const comparisons = getAllComparisons().filter(
    c => c.tool1.category === slug || c.tool2.category === slug
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-300 transition">Home</Link>
        <span>/</span>
        <span className="text-gray-300">{category.name}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
        Best {category.name} Tools ({new Date().getFullYear()})
      </h1>
      <p className="text-gray-400 mb-10 max-w-2xl">
        {category.description} We compared {tools.length} tools so you don&apos;t have to.
      </p>

      {/* Tools grid */}
      <section className="mb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map(tool => (
            <div key={tool.slug} className="border border-gray-800 rounded-2xl p-5 bg-gray-900/30 hover:border-gray-700 transition">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-lg font-bold text-white">{tool.name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize border ${
                  tool.pricing === 'free' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  tool.pricing === 'freemium' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  tool.pricing === 'open-source' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                  'bg-orange-500/10 text-orange-400 border-orange-500/20'
                }`}>{tool.pricing}</span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{tool.tagline}</p>
              {tool.startingPrice && (
                <p className="text-sm text-gray-400 mb-4">From <span className="text-white font-medium">{tool.startingPrice}</span></p>
              )}
              <div className="flex gap-2 flex-wrap">
                <Link href={`/alternatives/${tool.slug}`}
                  className="text-xs text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition">
                  Alternatives →
                </Link>
                <a href={tool.website} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-400 border border-gray-700 px-3 py-1.5 rounded-lg hover:border-gray-500 transition">
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
          <h2 className="text-xl font-bold text-white mb-5">{category.name} Comparisons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {comparisons.map(c => (
              <Link key={c.slug} href={`/compare/${c.slug}`}
                className="border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300 hover:border-indigo-500/40 hover:text-indigo-300 transition">
                {c.tool1.name} vs {c.tool2.name} →
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
