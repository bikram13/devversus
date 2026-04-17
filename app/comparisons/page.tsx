import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllComparisons, getCategoryForTool } from '@/data/tools'
import FilterableComparisons from '@/components/FilterableComparisons'

export const metadata: Metadata = {
  title: 'Browse All Developer Tool Comparisons',
  description: 'Browse 1,000+ side-by-side comparisons of developer tools. Pricing, features, pros & cons for every major tool pair.',
  alternates: { canonical: 'https://devversus.com/comparisons' },
}

export default function ComparisonsPage() {
  const comparisons = getAllComparisons().map(({ slug, tool1, tool2 }) => {
    const category = getCategoryForTool(tool1.slug)
    return {
      slug,
      tool1Name: tool1.name,
      tool2Name: tool2.name,
      category: category?.name ?? tool1.category.replace(/-/g, ' '),
      categorySlug: category?.slug ?? tool1.category,
    }
  })

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--foreground-muted)' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span className="text-white">Comparisons</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="glow-badge">{comparisons.length} comparisons</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
          All Tool Comparisons
        </h1>
        <p className="text-base max-w-2xl" style={{ color: 'var(--foreground-muted)', lineHeight: 1.7 }}>
          Every head-to-head comparison on DevVersus. Search by tool name or browse by category.
        </p>
      </div>

      <FilterableComparisons comparisons={comparisons} />
    </div>
  )
}
