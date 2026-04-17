export default function AffiliateDisclosure() {
  return (
    <p className="text-xs mb-6 px-3 py-2 rounded-lg" style={{
      background: 'rgba(99,102,241,0.06)',
      border: '1px solid rgba(99,102,241,0.15)',
      color: 'var(--foreground-muted)',
    }}>
      <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Affiliate disclosure:</span>{' '}
      Some &ldquo;Visit&rdquo; links on this page are affiliate links. We may earn a commission if you sign up — at no extra cost to you. It does not affect our rankings or editorial coverage.{' '}
      <a href="/about#affiliate" className="underline hover:text-white transition-colors">Learn more.</a>
    </p>
  )
}
