import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for DevVersus — how we handle your data.',
  alternates: { canonical: 'https://devversus.com/privacy' },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--foreground-muted)' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span className="text-white">Privacy Policy</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-3">Privacy Policy</h1>
        <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Last updated: April 2026</p>
      </div>

      <div className="prose-dark space-y-8" style={{ color: 'var(--foreground-muted)', lineHeight: 1.8 }}>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">1. Who We Are</h2>
          <p>DevVersus (<strong className="text-white">devversus.com</strong>) is operated by Bikram, an individual based in Pune, Maharashtra, India. For any privacy-related questions, contact us at <a href="mailto:31nathbikram@gmail.com" className="text-indigo-400 hover:text-indigo-300">31nathbikram@gmail.com</a>.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">2. What Data We Collect</h2>
          <p>DevVersus is a static content site. We do not require you to create an account and we do not collect or store any personally identifiable information (PII) directly.</p>
          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li><strong className="text-white">No registration required.</strong> You can browse all comparisons, categories, and alternatives without providing any personal data.</li>
            <li><strong className="text-white">Contact enquiries.</strong> If you email us directly, we will retain your email address only to respond to your enquiry.</li>
            <li><strong className="text-white">Analytics (if enabled).</strong> We may use privacy-respecting analytics (such as Vercel Analytics or Plausible) to understand aggregate traffic. These tools do not use cookies and do not track individuals across sites.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">3. Cookies</h2>
          <p>DevVersus does not use first-party tracking cookies. Third-party services linked from this site (tool websites, affiliate links) may set their own cookies when you visit them. We have no control over and take no responsibility for those cookies.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">4. Affiliate Links & Commercial Relationships</h2>
          <p>Some links on DevVersus are affiliate links. This means we may earn a commission if you click through and make a purchase, at no extra cost to you. Affiliate relationships do not influence our comparisons or rankings — all tool data is independently researched.</p>
          <p className="mt-2">Pages that contain affiliate links are marked with a &ldquo;Visit →&rdquo; button. We comply with FTC guidelines on affiliate disclosure.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">5. Third-Party Services</h2>
          <p>DevVersus is hosted on Vercel (San Francisco, USA). When you access the site, Vercel&apos;s servers process your request. Vercel&apos;s privacy policy applies: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">vercel.com/legal/privacy-policy</a>.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">6. Your Rights</h2>
          <p>Since we hold no personal data about you, there is typically nothing to access, correct, or delete. If you believe we hold data about you (e.g. from a direct email), you may request its deletion by emailing <a href="mailto:31nathbikram@gmail.com" className="text-indigo-400 hover:text-indigo-300">31nathbikram@gmail.com</a>. We will respond within 30 days.</p>
          <p className="mt-2">If you are in the European Economic Area, you have rights under GDPR including the right to access, rectification, erasure, and portability of your data.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">7. Data Retention</h2>
          <p>We retain email correspondence only as long as necessary to resolve the enquiry. We do not sell, rent, or share any personal data with third parties for marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">8. Children</h2>
          <p>DevVersus is intended for a developer audience of adults. We do not knowingly collect data from anyone under the age of 13.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">9. Changes to This Policy</h2>
          <p>We may update this policy from time to time. Changes will be reflected by updating the &ldquo;Last updated&rdquo; date above. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">10. Contact</h2>
          <p>Privacy questions: <a href="mailto:31nathbikram@gmail.com" className="text-indigo-400 hover:text-indigo-300">31nathbikram@gmail.com</a><br />
          Operated by Bikram, Pune, Maharashtra, India.</p>
        </section>

      </div>
    </div>
  )
}
