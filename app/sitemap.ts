import type { MetadataRoute } from 'next'
import { CATEGORIES, TOOLS, getAllComparisons, getAllAlternativePages } from '@/data/tools'

const BASE_URL = 'https://devversus.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Comparison pages
  const comparisonPages: MetadataRoute.Sitemap = getAllComparisons().map(({ slug }) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Alternatives pages
  const alternativePages: MetadataRoute.Sitemap = getAllAlternativePages().map(({ tool }) => ({
    url: `${BASE_URL}/alternatives/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...categoryPages,
    ...comparisonPages,
    ...alternativePages,
  ]
}
