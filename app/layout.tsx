import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import CursorTrail from '@/components/CursorTrail'
import SearchModal from '@/components/SearchModal'
import { buildSearchIndex } from '@/data/search-index'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL('https://devversus.com'),
  title: {
    default: 'DevVersus — Compare Developer Tools & Find Alternatives',
    template: '%s | DevVersus',
  },
  description: 'Compare the best developer tools and SaaS products side by side. Find alternatives to Vercel, Stripe, Supabase, and 350+ more tools used by developers.',
  openGraph: { siteName: 'DevVersus', type: 'website' },
  twitter:   { card: 'summary_large_image' },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'DevVersus',
      url: 'https://devversus.com',
      description: 'Independent comparisons of developer tools and SaaS products. No vendor bias.',
      foundingDate: '2025',
    },
    {
      '@type': 'WebSite',
      name: 'DevVersus',
      url: 'https://devversus.com',
      description: 'Compare developer tools side by side. Pricing, features, pros & cons.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://devversus.com/compare/{search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchItems = buildSearchIndex()
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        {/* Ambient background blobs */}
        <div aria-hidden="true">
          <div className="ambient-blob ambient-blob-1" />
          <div className="ambient-blob ambient-blob-2" />
          <div className="ambient-blob ambient-blob-3" />
        </div>

        {/* Custom cursor */}
        <CursorTrail />

        {/* Glassmorphism header */}
        <header className="glass-header sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Logo mark */}
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.5)]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h3M7 2v3M7 9v3M9 7h3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-bold text-[15px] text-white tracking-tight">
                Dev<span style={{ color: '#818cf8' }}>Versus</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/categories"          className="nav-link">Categories</Link>
              <Link href="/comparisons"         className="nav-link">Comparisons</Link>
              <Link href="/category/ai-api"     className="nav-link">AI APIs</Link>
              <Link href="/category/hosting"    className="nav-link">Hosting</Link>
            </nav>

            <SearchModal items={searchItems} />
          </div>
        </header>

        <main className="relative z-10">{children}</main>

        <footer className="relative z-10 mt-32 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-6xl mx-auto px-5 py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7h3M7 2v3M7 9v3M9 7h3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="font-bold text-white text-sm">DevVersus</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  Helping developers choose the right tools since 2025.
                </p>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm" style={{ color: 'var(--foreground-muted)' }}>
                <Link href="/"                         className="nav-link">Home</Link>
                <Link href="/categories"               className="nav-link">All Categories</Link>
                <Link href="/comparisons"              className="nav-link">All Comparisons</Link>
                <Link href="/category/hosting"         className="nav-link">Hosting</Link>
                <Link href="/category/payments"        className="nav-link">Payments</Link>
                <Link href="/category/database"        className="nav-link">Databases</Link>
                <Link href="/category/ai-api"          className="nav-link">AI APIs</Link>
              </div>
            </div>

            <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--foreground-muted)' }}>
              <p>© {new Date().getFullYear()} DevVersus. Operated by Bikram, Pune, India. Independent tool comparisons — no vendor bias.</p>
              <div className="flex items-center gap-4">
                <Link href="/about"   className="nav-link">About</Link>
                <Link href="/privacy" className="nav-link">Privacy</Link>
                <Link href="/terms"   className="nav-link">Terms</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
