import Link from 'next/link'
import { CATEGORIES, TOOLS, getAllComparisons, getAllAlternativePages } from '@/data/tools'

export default function HomePage() {
  const comparisons = getAllComparisons()
  const alternatives = getAllAlternativePages()

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Compare Developer Tools.<br />
          <span className="text-indigo-400">Find the Right Stack.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Side-by-side comparisons and alternatives for {TOOLS.length}+ developer tools and SaaS products.
          No fluff — just features, pricing, and honest trade-offs.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full" />{comparisons.length} comparisons</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-indigo-500 rounded-full" />{alternatives.length} alternative pages</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-purple-500 rounded-full" />{CATEGORIES.length} categories</span>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group border border-gray-800 rounded-xl p-4 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition"
            >
              <p className="font-semibold text-white text-sm group-hover:text-indigo-300 transition">{cat.name}</p>
              <p className="text-gray-500 text-xs mt-1">{cat.toolSlugs.length} tools</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Comparisons */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6">Popular Comparisons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {comparisons.slice(0, 12).map(({ tool1, tool2, slug }) => (
            <Link
              key={slug}
              href={`/compare/${slug}`}
              className="group flex items-center gap-3 border border-gray-800 rounded-xl p-4 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition"
            >
              <div className="flex-1">
                <p className="font-medium text-white text-sm group-hover:text-indigo-300 transition">
                  {tool1.name} vs {tool2.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5 capitalize">{tool1.category}</p>
              </div>
              <span className="text-gray-600 group-hover:text-indigo-400 transition text-sm">→</span>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">+{comparisons.length - 12} more comparisons across all categories</p>
        </div>
      </section>

      {/* Popular Alternatives */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6">Find Alternatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {alternatives.slice(0, 12).map(({ tool }) => (
            <Link
              key={tool.slug}
              href={`/alternatives/${tool.slug}`}
              className="group flex items-center gap-3 border border-gray-800 rounded-xl p-4 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition"
            >
              <div className="flex-1">
                <p className="font-medium text-white text-sm group-hover:text-indigo-300 transition">
                  Alternatives to {tool.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{tool.alternatives.length} alternatives listed</p>
              </div>
              <span className="text-gray-600 group-hover:text-indigo-400 transition text-sm">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="border border-gray-800 rounded-2xl p-8 text-center bg-gray-900/30">
        <h2 className="text-lg font-bold text-white mb-2">Why DevVs.io?</h2>
        <p className="text-gray-400 text-sm max-w-xl mx-auto mb-6">
          We cover pricing, features, pros & cons, and alternatives for every tool — so you can stop wasting hours reading marketing pages and just pick the right tool.
        </p>
        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <div><p className="text-2xl font-black text-white">{TOOLS.length}+</p><p className="text-gray-500">Tools covered</p></div>
          <div><p className="text-2xl font-black text-white">{comparisons.length}</p><p className="text-gray-500">Comparisons</p></div>
          <div><p className="text-2xl font-black text-white">{CATEGORIES.length}</p><p className="text-gray-500">Categories</p></div>
          <div><p className="text-2xl font-black text-white">Free</p><p className="text-gray-500">Always free</p></div>
        </div>
      </section>
    </div>
  )
}
