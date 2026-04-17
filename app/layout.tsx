import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import CursorTrail from '@/components/CursorTrail'

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

            <nav className="hidden md:flex items-center gap-7">
              <Link href="/category/hosting"    className="nav-link">Hosting</Link>
              <Link href="/category/payments"   className="nav-link">Payments</Link>
              <Link href="/category/database"   className="nav-link">Databases</Link>
              <Link href="/category/auth"       className="nav-link">Auth</Link>
              <Link href="/category/ai-api"     className="nav-link">AI APIs</Link>
              <Link href="/category/vector-db"  className="nav-link">Vector DB</Link>
            </nav>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-lg border transition-all duration-200"
              style={{
                background: 'rgba(99,102,241,0.12)',
                borderColor: 'rgba(99,102,241,0.35)',
                color: '#a5b4fc',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
              </svg>
              GitHub
            </a>
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
                <Link href="/category/hosting"         className="nav-link">Hosting</Link>
                <Link href="/category/payments"        className="nav-link">Payments</Link>
                <Link href="/category/database"        className="nav-link">Databases</Link>
                <Link href="/category/ai-api"          className="nav-link">AI APIs</Link>
                <Link href="/category/vector-db"       className="nav-link">Vector DB</Link>
                <Link href="/category/llm-framework"   className="nav-link">LLM Frameworks</Link>
              </div>
            </div>

            <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--foreground-muted)' }}>
              <p>© {new Date().getFullYear()} DevVersus. Independent tool comparisons — no vendor bias.</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
