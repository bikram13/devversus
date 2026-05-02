/**
 * Product CTA mapping.
 *
 * Maps a comparison page (compare/<slug>) or alternatives page
 * (alternatives/<slug>) to the most relevant Gumroad digital product.
 *
 * Why this lives in components/ instead of data/:
 * - The CTA banner project is intentionally scoped — we are NOT adding
 *   new fields to the Tool/Category data model.
 * - This mapping is consumed only by ProductCTA-rendering components,
 *   so it lives next to them.
 *
 * Truthful copy — every line below describes what the founder's actual
 * Gumroad product delivers. No fabricated chapter counts, no exaggerated
 * promises. If a product is rewritten or expanded, update the subtitles
 * here.
 */

export interface CtaProduct {
  productSlug: string // analytics id — never change once shipped
  badge: string
  title: string
  subtitle: string
  price: string
  url: string
}

/* ── Products ───────────────────────────────────────────── */

export const PRODUCTS = {
  authMigration: {
    productSlug: 'auth-js-better-auth-playbook',
    badge: 'Companion playbook',
    title: 'Auth.js → Better Auth Migration Playbook',
    subtitle:
      'A step-by-step guide for moving a production Next.js app from NextAuth (Auth.js) to Better Auth — schema changes, session handling, and the gotchas the docs skip.',
    price: '$39',
    url: 'https://nathbikram.gumroad.com/l/auth-js-to-better-auth-migration-playbook',
  },
  docsmith: {
    productSlug: 'docsmith-pro',
    badge: 'Companion toolkit',
    title: 'Docsmith Pro — generate API docs from your codebase',
    subtitle:
      'A self-hosted toolkit for turning a TypeScript or Python codebase into Mintlify-style API documentation. Pairs well with whichever doc platform you pick below.',
    price: '$19',
    url: 'https://nathbikram.gumroad.com/l/szdwyz',
  },
  nextStarter: {
    productSlug: 'nextjs-affiliate-starter',
    badge: 'Starter kit',
    title: 'Next.js Affiliate Site Starter',
    subtitle:
      'Production Next.js 16 starter for building affiliate / comparison sites — programmatic routing, JSON-LD schema, sitemap generation, and Vercel analytics already wired up.',
    price: '$39',
    url: 'https://nathbikram.gumroad.com/l/qbxouj',
  },
  claudeCode: {
    productSlug: 'claude-code-starter-kit',
    badge: 'Starter kit',
    title: 'Claude Code Starter Kit',
    subtitle:
      'Pre-configured CLAUDE.md, slash commands, and project templates so you can start shipping with Claude Code on day one — not week three.',
    price: '$19',
    url: 'https://nathbikram.gumroad.com/l/bprwbw',
  },
} as const satisfies Record<string, CtaProduct>

/* ── Page → Product mapping ─────────────────────────────── */

/**
 * Auth tool slugs — every comparison or alternatives page involving any of
 * these gets the Better Auth migration playbook CTA. The book is most
 * directly relevant to NextAuth and Better Auth, but auth shoppers in
 * general are the buyer persona, so we keep it broad.
 */
const AUTH_TOOL_SLUGS = new Set([
  'nextauth',
  'better-auth',
  'clerk',
  'auth0',
  'workos',
  'kinde',
  'stytch',
])

/**
 * Documentation tool slugs — Docsmith Pro is positioned as a companion
 * toolkit, not a competitor, so we link it from doc-tool comparison pages
 * where someone is actively shopping for a doc platform.
 *
 * IMPORTANT: we exclude pages that contain "docsmith" itself, because
 * that would be self-promotion on Docsmith's own comparison page (and
 * `compare/docsmith-vs-mintlify` already has Docsmith's own visit button).
 */
const DOCS_TOOL_SLUGS = new Set([
  'mintlify',
  'gitbook',
  'readme-io',
  'docusaurus',
  'nextra',
  'stoplight',
  'redocly',
  'apidog',
])

/**
 * Anthropic / Claude API: the Claude Code Starter Kit is most directly
 * relevant to people who chose Anthropic for their stack.
 */
const CLAUDE_API_TOOL_SLUGS = new Set(['anthropic'])

/**
 * AI coding tool slugs — these comparisons reach developers actively
 * picking an AI coding workflow. The Claude Code Starter Kit is the
 * relevant resource here.
 */
const AI_CODING_TOOL_SLUGS = new Set([
  'cursor-ai',
  'github-copilot',
  'codeium',
  'tabnine',
  'continue-dev',
  'supermaven',
  'aider',
])

/**
 * For a `/compare/<slug>` page (e.g. "nextauth-vs-better-auth"), return
 * the matching CtaProduct or null if no strong match exists.
 *
 * Rule: skip force-fitting. If the topic isn't a clean match, return
 * null and the page renders without a CTA.
 */
export function getCtaForComparisonSlug(slug: string): CtaProduct | null {
  const vsIdx = slug.indexOf('-vs-')
  if (vsIdx === -1) return null
  const a = slug.substring(0, vsIdx)
  const b = slug.substring(vsIdx + 4)

  // Auth comparisons → migration playbook
  if (AUTH_TOOL_SLUGS.has(a) && AUTH_TOOL_SLUGS.has(b)) {
    return PRODUCTS.authMigration
  }

  // Docs comparisons → Docsmith Pro (skip if the page is already about Docsmith)
  if (a !== 'docsmith' && b !== 'docsmith') {
    if (DOCS_TOOL_SLUGS.has(a) && DOCS_TOOL_SLUGS.has(b)) {
      return PRODUCTS.docsmith
    }
  }

  // Claude API comparisons → Claude Code Starter Kit
  if (CLAUDE_API_TOOL_SLUGS.has(a) || CLAUDE_API_TOOL_SLUGS.has(b)) {
    return PRODUCTS.claudeCode
  }

  // AI coding tool comparisons → Claude Code Starter Kit
  if (AI_CODING_TOOL_SLUGS.has(a) && AI_CODING_TOOL_SLUGS.has(b)) {
    return PRODUCTS.claudeCode
  }

  return null
}

/**
 * For an `/alternatives/<toolSlug>` page, return the matching CtaProduct
 * or null. The match is per-tool because alternatives pages are about a
 * single anchor tool (e.g. "alternatives to NextAuth").
 */
export function getCtaForAlternativesSlug(slug: string): CtaProduct | null {
  // Auth tools → migration playbook
  if (AUTH_TOOL_SLUGS.has(slug)) {
    return PRODUCTS.authMigration
  }

  // Docs tools → Docsmith Pro (skip Docsmith itself)
  if (slug !== 'docsmith' && DOCS_TOOL_SLUGS.has(slug)) {
    return PRODUCTS.docsmith
  }

  // Anthropic / AI coding → Claude Code Starter Kit
  if (CLAUDE_API_TOOL_SLUGS.has(slug)) {
    return PRODUCTS.claudeCode
  }
  if (AI_CODING_TOOL_SLUGS.has(slug)) {
    return PRODUCTS.claudeCode
  }

  // Next.js → Affiliate Site Starter
  // (only on the alternatives page, where the user is clearly committed to
  // Next.js — too weak a match on raw framework comparisons like
  // nextjs-vs-remix where the reader is still shopping for a framework.)
  if (slug === 'nextjs') {
    return PRODUCTS.nextStarter
  }

  return null
}
