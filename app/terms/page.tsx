import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for DevVersus.',
  alternates: { canonical: 'https://devversus.com/terms' },
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--foreground-muted)' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span className="text-white">Terms of Service</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-3">Terms of Service</h1>
        <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Last updated: April 2026</p>
      </div>

      <div className="space-y-8" style={{ color: 'var(--foreground-muted)', lineHeight: 1.8 }}>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using DevVersus (<strong className="text-white">devversus.com</strong>), you agree to be bound by these Terms of Service. If you do not agree, please do not use the site. DevVersus is operated by Bikram, Pune, Maharashtra, India.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">2. Nature of the Service</h2>
          <p>DevVersus is an independent information resource that compares developer tools, SaaS products, and software services. All content is provided for informational purposes only. We are not affiliated with, endorsed by, or sponsored by any of the tools we compare unless explicitly stated.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">3. Accuracy of Information</h2>
          <p>We make reasonable efforts to keep pricing, feature, and other product data accurate and up to date. However:</p>
          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>Pricing and features of third-party tools change frequently. Always verify current information on the tool&apos;s official website before making purchasing decisions.</li>
            <li>DevVersus does not guarantee the accuracy, completeness, or timeliness of any information on the site.</li>
            <li>Nothing on DevVersus constitutes professional advice (legal, financial, technical, or otherwise).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">4. Affiliate Disclosure</h2>
          <p>DevVersus participates in affiliate programmes. Some &ldquo;Visit →&rdquo; links may be affiliate links, meaning we earn a commission if you purchase through them, at no additional cost to you. This does not influence our editorial coverage or rankings.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">5. Intellectual Property</h2>
          <p>All content on DevVersus — including comparison text, page structure, design, and code — is the property of DevVersus and protected by applicable copyright laws. You may not reproduce, scrape, or republish DevVersus content without written permission. Personal, non-commercial use (such as sharing a comparison link) is permitted.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">6. Third-Party Links</h2>
          <p>DevVersus links to third-party websites (tool homepages, documentation, etc.). We have no control over and take no responsibility for the content, privacy practices, or availability of those sites. Linking does not imply endorsement.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">7. Limitation of Liability</h2>
          <p>To the maximum extent permitted by applicable law, DevVersus and its operator shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the site or reliance on any information provided. Your use of the site is at your sole risk.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">8. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>Scrape or bulk-download the site&apos;s content using automated tools without permission</li>
            <li>Attempt to reverse-engineer or interfere with the site&apos;s operation</li>
            <li>Use the site for any unlawful purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">9. Governing Law</h2>
          <p>These Terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra, India.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">10. Changes to These Terms</h2>
          <p>We may modify these Terms at any time. Changes take effect when posted on this page with an updated date. Continued use of DevVersus after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">11. Contact</h2>
          <p>Questions about these Terms: <a href="mailto:31nathbikram@gmail.com" className="text-indigo-400 hover:text-indigo-300">31nathbikram@gmail.com</a><br />
          Operated by Bikram, Pune, Maharashtra, India.</p>
        </section>

      </div>
    </div>
  )
}
