import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://devvs.io'),
  title: {
    default: 'DevVs.io — Compare Developer Tools & Find Alternatives',
    template: '%s | DevVs.io',
  },
  description: 'Compare the best developer tools and SaaS products side by side. Find alternatives to Vercel, Stripe, Supabase, and 200+ more tools used by developers.',
  openGraph: {
    siteName: 'DevVs.io',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <header className="border-b border-gray-800 sticky top-0 z-50 bg-gray-950/95 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-white font-bold text-lg tracking-tight">
              DevVs<span className="text-indigo-400">.io</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/category/hosting" className="hover:text-white transition">Hosting</Link>
              <Link href="/category/payments" className="hover:text-white transition">Payments</Link>
              <Link href="/category/database" className="hover:text-white transition">Databases</Link>
              <Link href="/category/auth" className="hover:text-white transition">Auth</Link>
              <Link href="/category/ai-api" className="hover:text-white transition">AI APIs</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-gray-800 mt-24 py-10 text-sm text-gray-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-300 mb-1">DevVs.io</p>
              <p>Helping developers choose the right tools since 2025.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-gray-300 transition">Home</Link>
              <Link href="/category/hosting" className="hover:text-gray-300 transition">Hosting</Link>
              <Link href="/category/payments" className="hover:text-gray-300 transition">Payments</Link>
              <Link href="/category/database" className="hover:text-gray-300 transition">Databases</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
