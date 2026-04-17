'use client'

import { useEffect, useRef } from 'react'

export default function CursorTrail() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX  = 0, ringY  = 0
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = `${mouseX}px`
      dot.style.top  = `${mouseY}px`
    }

    // Ring lags behind for fluid trailing feel
    const tick = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = `${ringX}px`
      ring.style.top  = `${ringY}px`
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    // Hover state on interactive elements
    const onEnter = () => {
      dot.classList.add('hovering')
      ring.classList.add('hovering')
    }
    const onLeave = () => {
      dot.classList.remove('hovering')
      ring.classList.remove('hovering')
    }

    const attachHover = () => {
      document
        .querySelectorAll<HTMLElement>('a, button, [role="button"], input, select, textarea')
        .forEach(el => {
          el.addEventListener('mouseenter', onEnter)
          el.addEventListener('mouseleave', onLeave)
        })
    }

    document.addEventListener('mousemove', onMove)
    attachHover()

    // Re-attach on DOM changes (Next.js navigation)
    const observer = new MutationObserver(attachHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
