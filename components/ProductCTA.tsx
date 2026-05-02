/**
 * ProductCTA — a tasteful in-page recommendation card linking to a Gumroad
 * digital product (ebook / starter kit / playbook). Designed to look like a
 * "if you're researching this, here's the deeper resource" suggestion rather
 * than a hard-sell ad.
 *
 * Placement convention: render once per page, immediately after the verdict
 * / TL;DR section so it's seen before the long comparison table. Never at the
 * page bottom — bottoms get scrolled past.
 *
 * Tracking: each CTA fires a Vercel Analytics custom event named
 * "product_cta_click" with the product slug + page slug as props, so the
 * funnel can be reconstructed later in the dashboard.
 */
'use client'

import { track } from '@vercel/analytics/react'

interface ProductCTAProps {
  /** Headline shown on the card, e.g. "Auth.js → Better Auth Migration Playbook" */
  title: string
  /** One-sentence subtitle explaining what's inside / who it's for */
  subtitle: string
  /** Display price string, e.g. "$29" or "Free" */
  price: string
  /** Gumroad URL — opens in new tab with rel="noopener" */
  url: string
  /** Small badge label above the title, e.g. "Companion playbook" or "Starter kit" */
  badge: string
  /**
   * Stable identifier for analytics, e.g. "auth-js-better-auth-playbook".
   * Used as the analytics event prop so we can group clicks by product.
   */
  productSlug: string
  /**
   * Page slug where the CTA lives, e.g. "nextauth-vs-better-auth".
   * Used as the analytics event prop so we can identify which page drove
   * the click — this is how we'll figure out the first-sale page.
   */
  pageSlug: string
}

export default function ProductCTA({
  title,
  subtitle,
  price,
  url,
  badge,
  productSlug,
  pageSlug,
}: ProductCTAProps) {
  const handleClick = () => {
    // Vercel Analytics is already wired in app/layout.tsx, so track() is safe.
    // If analytics is blocked (ad-blockers, no-JS), this is a no-op and the
    // anchor's default href navigation still works.
    try {
      track('product_cta_click', { product: productSlug, page: pageSlug })
    } catch {
      // never block navigation on a tracking failure
    }
  }

  return (
    <aside
      aria-label="Related resource"
      className="card mb-14 overflow-hidden"
      style={{
        // Subtle warm border so it reads as "editorial recommendation"
        // rather than the cool indigo of the comparison cards above.
        borderColor: 'rgba(251,191,36,0.18)',
        background:
          'linear-gradient(135deg, rgba(251,191,36,0.04) 0%, rgba(99,102,241,0.04) 100%)',
      }}
    >
      <div className="p-6 md:p-7 flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Left: book icon — visual anchor */}
        <div
          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: 'rgba(251,191,36,0.12)',
            border: '1px solid rgba(251,191,36,0.25)',
          }}
          aria-hidden="true"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fbbf24"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>

        {/* Middle: copy */}
        <div className="flex-1 min-w-0">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-1.5"
            style={{ color: '#fbbf24' }}
          >
            {badge}
          </p>
          <h3 className="text-base md:text-lg font-bold text-white mb-1.5 leading-snug">
            {title}
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--foreground-muted)' }}
          >
            {subtitle}
          </p>
        </div>

        {/* Right: price + CTA */}
        <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
          <span className="text-sm font-bold text-white whitespace-nowrap">
            {price}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap"
            style={{
              background: 'rgba(251,191,36,0.14)',
              border: '1px solid rgba(251,191,36,0.35)',
              color: '#fbbf24',
            }}
          >
            View on Gumroad
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M7 7h10v10"
              />
            </svg>
          </a>
        </div>
      </div>
    </aside>
  )
}
