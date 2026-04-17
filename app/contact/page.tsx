import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact DevVersus',
  description: 'Get in touch with the DevVersus team — corrections, partnership enquiries, or feedback.',
  alternates: { canonical: 'https://devversus.com/contact' },
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--foreground-muted)' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span className="text-white">Contact</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-3">Get in Touch</h1>
        <p className="text-base" style={{ color: 'var(--foreground-muted)', lineHeight: 1.8 }}>
          DevVersus is maintained by Bikram in Pune, India. Reach out for any of the following:
        </p>
      </div>

      <div className="space-y-4 mb-12">
        {[
          {
            label: 'Pricing or data corrections',
            desc: 'Spotted outdated or incorrect tool information? Email us and we\'ll update it within 48 hours.',
          },
          {
            label: 'Missing tool or comparison',
            desc: 'Want a tool added or a specific comparison built? Let us know.',
          },
          {
            label: 'Affiliate & partnership enquiries',
            desc: 'Interested in an affiliate partnership or integration? We\'d love to hear from you.',
          },
          {
            label: 'General feedback',
            desc: 'Found a bug, have a feature request, or just want to say something useful?',
          },
        ].map(item => (
          <div key={item.label} className="card p-5">
            <p className="font-semibold text-white text-sm mb-1">{item.label}</p>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <p className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>Email us at</p>
        <a
          href="mailto:31nathbikram@gmail.com"
          className="text-xl font-bold text-white hover:text-indigo-300 transition-colors"
        >
          31nathbikram@gmail.com
        </a>
        <p className="text-xs mt-3" style={{ color: 'var(--foreground-muted)' }}>
          Operated by Bikram · Pune, Maharashtra, India
        </p>
      </div>
    </div>
  )
}
