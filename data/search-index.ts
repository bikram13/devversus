import { CATEGORIES, TOOLS, getAllComparisons, getCategoryForTool } from './tools'

export interface SearchItem {
  type: 'comparison' | 'tool' | 'category'
  title: string
  subtitle: string
  url: string
}

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = []

  // Categories
  for (const cat of CATEGORIES) {
    items.push({
      type: 'category',
      title: cat.name,
      subtitle: cat.description,
      url: `/category/${cat.slug}`,
    })
  }

  // Tools (alternatives pages)
  for (const tool of TOOLS) {
    if (tool.alternatives.length > 0) {
      items.push({
        type: 'tool',
        title: `Alternatives to ${tool.name}`,
        subtitle: tool.tagline,
        url: `/alternatives/${tool.slug}`,
      })
    }
  }

  // Comparisons
  for (const { slug, tool1, tool2 } of getAllComparisons()) {
    const category = getCategoryForTool(tool1.slug)
    items.push({
      type: 'comparison',
      title: `${tool1.name} vs ${tool2.name}`,
      subtitle: category?.name ?? tool1.category.replace(/-/g, ' '),
      url: `/compare/${slug}`,
    })
  }

  return items
}
