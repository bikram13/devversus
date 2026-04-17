import Link from 'next/link'
import type { Metadata } from 'next'
import { CATEGORIES, getToolsByCategory } from '@/data/tools'
import FilterableCategories from '@/components/FilterableCategories'

export const metadata: Metadata = {
  title: 'Browse All Developer Tool Categories',
  description: `Browse ${CATEGORIES.length} categories of developer tools — hosting, payments, databases, auth, AI APIs, and more. Find the right tool for any use case.`,
  alternates: { canonical: 'https://devversus.com/categories' },
}

export default function CategoriesPage() {
  const categories = CATEGORIES.map(cat => ({
    slug: cat.slug,
    name: cat.name,
    description: cat.description,
    toolCount: getToolsByCategory(cat.slug).length,
  }))

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--foreground-muted)' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span className="text-white">Categories</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="glow-badge">{CATEGORIES.length} categories</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
          Browse All Categories
        </h1>
        <p className="text-base max-w-2xl" style={{ color: 'var(--foreground-muted)', lineHeight: 1.7 }}>
          Every major developer tool category, compared and ranked. Find the right tool for hosting, payments, databases, auth, AI, and 46 more areas.
        </p>
      </div>

      <FilterableCategories categories={categories} />
    </div>
  )
}
