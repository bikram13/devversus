import { ImageResponse } from 'next/og'
import { getToolBySlug } from '@/data/tools'

export const runtime = 'edge'
export const alt = 'DevVersus tool comparison'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image({ params }: { params: { slug: string } }) {
  const vsIndex = params.slug.indexOf('-vs-')
  const t1 = vsIndex !== -1 ? getToolBySlug(params.slug.substring(0, vsIndex)) : null
  const t2 = vsIndex !== -1 ? getToolBySlug(params.slug.substring(vsIndex + 4)) : null

  const name1 = t1?.name ?? params.slug.substring(0, vsIndex).replace(/-/g, ' ')
  const name2 = t2?.name ?? params.slug.substring(vsIndex + 4).replace(/-/g, ' ')
  const initial1 = name1.charAt(0).toUpperCase()
  const initial2 = name2.charAt(0).toUpperCase()

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #05050a 0%, #080810 60%, #0d0d1a 100%)',
        fontFamily: 'sans-serif', position: 'relative',
      }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(99,102,241,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 350,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        {/* DevVersus label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48, zIndex: 1 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h3M7 2v3M7 9v3M9 7h3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#818cf8' }}>DevVersus</span>
        </div>

        {/* Tool comparison row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, zIndex: 1, marginBottom: 40 }}>
          {/* Tool 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 96, height: 96, borderRadius: 24,
              background: 'rgba(99,102,241,0.2)',
              border: '2px solid rgba(99,102,241,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 42, fontWeight: 900, color: '#a5b4fc',
            }}>{initial1}</div>
            <span style={{ fontSize: 28, fontWeight: 800, color: 'white', maxWidth: 240, textAlign: 'center' }}>{name1}</span>
            {t1?.pricing && (
              <span style={{ fontSize: 14, color: '#6b7280', textTransform: 'capitalize', fontWeight: 600 }}>{t1.pricing}</span>
            )}
          </div>

          {/* VS */}
          <div style={{
            fontSize: 28, fontWeight: 900, color: '#374151',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '12px 20px',
          }}>vs</div>

          {/* Tool 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 96, height: 96, borderRadius: 24,
              background: 'rgba(139,92,246,0.2)',
              border: '2px solid rgba(139,92,246,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 42, fontWeight: 900, color: '#c084fc',
            }}>{initial2}</div>
            <span style={{ fontSize: 28, fontWeight: 800, color: 'white', maxWidth: 240, textAlign: 'center' }}>{name2}</span>
            {t2?.pricing && (
              <span style={{ fontSize: 14, color: '#6b7280', textTransform: 'capitalize', fontWeight: 600 }}>{t2.pricing}</span>
            )}
          </div>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 18, color: '#4b5563', zIndex: 1, fontWeight: 500 }}>
          Pricing · Features · Pros & Cons · devversus.com
        </div>
      </div>
    ),
    { ...size }
  )
}
