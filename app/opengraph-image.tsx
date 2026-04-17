import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'DevVersus — Compare Developer Tools'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #05050a 0%, #080810 60%, #0d0d1a 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(99,102,241,0.15) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40, zIndex: 1 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: '#4f46e5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 28px rgba(99,102,241,0.6)',
          }}>
            <svg width="24" height="24" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h3M7 2v3M7 9v3M9 7h3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 32, fontWeight: 800, color: 'white', letterSpacing: -1 }}>
            Dev<span style={{ color: '#818cf8' }}>Versus</span>
          </span>
        </div>
        {/* Headline */}
        <div style={{ fontSize: 64, fontWeight: 900, color: 'white', textAlign: 'center', lineHeight: 1.1, zIndex: 1, marginBottom: 20, letterSpacing: -2 }}>
          Compare Developer Tools.
        </div>
        <div style={{ fontSize: 28, color: '#6366f1', fontWeight: 600, textAlign: 'center', zIndex: 1, marginBottom: 48 }}>
          Pricing · Features · Honest Trade-offs
        </div>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 40, zIndex: 1 }}>
          {[['363+', 'Tools'], ['1,093', 'Comparisons'], ['52', 'Categories']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#6366f1' }}>{v}</div>
              <div style={{ fontSize: 14, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
