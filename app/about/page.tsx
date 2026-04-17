import Link from 'next/link'
import type { Metadata } from 'next'
import { TOOLS, getAllComparisons, CATEGORIES } from '@/data/tools'

export const metadata: Metadata = {
  title: 'About DevVersus — Independent Developer Tool Comparisons',
  description: 'DevVersus is an independent resource for comparing developer tools. No vendor sponsorships, no paid placements. Just honest trade-offs.',
  alternates: { canonical: 'https://devversus.com/about' },
}

export default function AboutPage() {
  const comparisons = getAllComparisons()

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--foreground-muted)' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span className="text-white">About</span>
      </nav>

      <div className="mb-12">
        <span className="glow-badge mb-5 inline-flex">About DevVersus</span>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
          Stop reading marketing pages.
        </h1>
        <p className="text-base" style={{ color: 'var(--foreground-muted)', lineHeight: 1.8 }}>
          DevVersus exists because choosing a developer tool shouldn&apos;t take 5 hours of reading vendor docs, comparing pricing pages, and watching YouTube reviews from people with sponsorships. We do that work once, clearly, so you can decide in 5 minutes.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-14">
        {[
          { value: `${TOOLS.length}+`, label: 'Tools covered' },
          { value: comparisons.length, label: 'Comparisons' },
          { value: CATEGORIES.length, label: 'Categories' },
        ].map(s => (
          <div key={s.label} className="card p-5 text-center">
            <div className="stat-number mb-1">{s.value}</div>
            <div className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--foreground-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-10" style={{ color: 'var(--foreground-muted)', lineHeight: 1.8 }}>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Our Editorial Standards</h2>
          <ul className="space-y-3">
            {[
              'All tool data is sourced from official product documentation and publicly available pricing pages.',
              'Affiliate relationships do not influence rankings, scores, or comparison outcomes. Tools are listed and ranked by objective criteria.',
              'Pricing data is reviewed regularly. If you spot an error, email us and we will fix it within 48 hours.',
              'We do not accept paid placements, sponsored content, or &quot;partnership packages&quot; that affect how tools are presented.',
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-green-400 font-bold shrink-0 mt-0.5">✓</span>
                <span dangerouslySetInnerHTML={{ __html: point }} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">How Comparisons Are Built</h2>
          <p className="text-sm">Each comparison page is built from a structured data model that captures: pricing model, starting price, key features, honest pros and cons, and common reasons developers switch. This data is the same across every page — no cherry-picking for or against a tool.</p>
          <p className="text-sm mt-3">The &ldquo;When to Choose&rdquo; sections are derived directly from each tool&apos;s strengths — not from vendor positioning. If a tool&apos;s biggest pro is &ldquo;free tier is generous,&rdquo; that&apos;s what we say, even if the vendor would prefer we lead with something else.</p>
        </section>

        <section id="affiliate">
          <h2 className="text-xl font-bold text-white mb-4">Affiliate Links</h2>
          <p className="text-sm">Some &ldquo;Visit →&rdquo; links are affiliate links. We earn a small commission if you sign up through them, at no extra cost to you. This revenue helps keep the site free and updated. It does not affect which tools we feature or how we compare them.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Who Runs This</h2>
          <p className="text-sm">DevVersus is built and maintained by Bikram, a developer and founder based in Pune, India. It launched in 2025 as a resource for the developer community.</p>
          <p className="text-sm mt-3">Questions, corrections, or partnership enquiries: <a href="mailto:31nathbikram@gmail.com" className="text-indigo-400 hover:text-indigo-300">31nathbikram@gmail.com</a></p>
        </section>

      </div>

      {/* CTA */}
      <div className="mt-14 pt-10 border-t flex flex-wrap gap-3" style={{ borderColor: 'var(--border)' }}>
        <Link
          href="/categories"
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200"
          style={{ background: 'var(--accent)', boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}
        >
          Browse Categories →
        </Link>
        <Link
          href="/privacy"
          className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground-muted)' }}
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground-muted)' }}
        >
          Terms of Service
        </Link>
      </div>
    </div>
  )
}
