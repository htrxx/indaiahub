'use client'

import { useEffect, useRef } from 'react'

const ROW1: { name: string; color: string; size: 'lg' | 'md' | 'sm' }[] = [
  { name: 'Petrobras', color: '#009B3A', size: 'lg' },
  { name: 'Vale',      color: '#009A44', size: 'lg' },
  { name: 'Ambev',     color: '#E30613', size: 'lg' },
  { name: 'Embraer',   color: '#003087', size: 'md' },
  { name: 'Braskem',   color: '#E4002B', size: 'md' },
  { name: 'WEG',       color: '#003087', size: 'md' },
  { name: 'Natura',    color: '#00A74A', size: 'md' },
  { name: 'Gerdau',    color: '#E4002B', size: 'sm' },
  { name: 'Suzano',    color: '#006341', size: 'sm' },
  { name: 'Ultrapar',  color: '#003087', size: 'sm' },
]

const ROW2: { name: string; color: string; size: 'lg' | 'md' | 'sm' }[] = [
  { name: 'Mahle',     color: '#E4002B', size: 'md' },
  { name: 'Eaton',     color: '#003087', size: 'md' },
  { name: 'Parker',    color: '#FFCC00', size: 'md' },
  { name: 'BRF',       color: '#E4002B', size: 'md' },
  { name: 'Marcopolo', color: '#003087', size: 'sm' },
  { name: 'Randon',    color: '#E4002B', size: 'sm' },
  { name: 'Dana',      color: '#003087', size: 'sm' },
  { name: 'Tupy',      color: '#009B3A', size: 'sm' },
  { name: 'Fras-le',   color: '#E4002B', size: 'sm' },
  { name: 'Schulz',    color: '#003087', size: 'sm' },
]

const SIZE_CONFIG = {
  lg: { w: 200, px: 24, py: 16, dotSize: 12, fontSize: 14, fontWeight: 700, height: 68 },
  md: { w: 172, px: 18, py: 13, dotSize: 10, fontSize: 13, fontWeight: 700, height: 58 },
  sm: { w: 148, px: 14, py: 10, dotSize:  8, fontSize: 11, fontWeight: 600, height: 50 },
}

const ITEM_GAP = 12

function totalWidth(row: { size: 'lg' | 'md' | 'sm' }[]) {
  return row.reduce((acc, item) => acc + SIZE_CONFIG[item.size].w + ITEM_GAP, 0)
}

const TOTAL_W1 = totalWidth(ROW1)
const TOTAL_W2 = totalWidth(ROW2)

function CarouselRow({
  logos,
  totalW,
  speed,
  reverse = false,
  pausedRef,
}: {
  logos: { name: string; color: string; size: 'lg' | 'md' | 'sm' }[]
  totalW: number
  speed: number
  reverse?: boolean
  pausedRef: React.MutableRefObject<boolean>
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef   = useRef(reverse ? totalW : 0)

  useEffect(() => {
    let last = performance.now()
    let raf: number
    function tick(now: number) {
      const dt = now - last; last = now
      if (!pausedRef.current) {
        if (reverse) {
          posRef.current -= speed * (dt / 16)
          if (posRef.current <= 0) posRef.current += totalW
        } else {
          posRef.current += speed * (dt / 16)
          if (posRef.current >= totalW) posRef.current -= totalW
        }
        if (trackRef.current)
          trackRef.current.style.transform = `translateX(-${posRef.current}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [totalW, speed, reverse, pausedRef])

  return (
    <div
      ref={trackRef}
      style={{ display: 'flex', gap: ITEM_GAP, width: 'max-content', willChange: 'transform', paddingLeft: 48, alignItems: 'center' }}
    >
      {[...logos, ...logos].map((logo, i) => {
        const cfg = SIZE_CONFIG[logo.size]
        return (
          <div
            key={i}
            title={logo.name}
            style={{
              width: cfg.w, height: cfg.height, flexShrink: 0,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 12, padding: `${cfg.py}px ${cfg.px}px`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 9, transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
              cursor: 'default', boxSizing: 'border-box',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--brand-pale)'
              el.style.background  = 'var(--brand-frost)'
              el.style.transform   = 'scale(1.05)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--border)'
              el.style.background  = 'var(--bg-card)'
              el.style.transform   = 'scale(1)'
            }}
          >
            {/* Color dot */}
            <span style={{
              width: cfg.dotSize, height: cfg.dotSize,
              borderRadius: '50%', flexShrink: 0,
              background: logo.color,
              display: 'inline-block',
            }} />
            {/* Name */}
            <span style={{
              fontSize: cfg.fontSize, fontWeight: cfg.fontWeight,
              color: 'var(--text-2)', fontFamily: 'Plus Jakarta Sans, sans-serif',
              letterSpacing: '0.03em', whiteSpace: 'nowrap',
            }}>
              {logo.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function ClientLogos() {
  const pausedRef = useRef(false)

  return (
    <section style={{
      background: 'var(--bg-alt)', borderTop: '1px solid var(--border)',
      padding: 'clamp(48px,7vw,80px) 0', overflow: 'hidden',
    }}>
      <div className="wrap" style={{ marginBottom: 44 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="sec-eye" style={{ justifyContent: 'center' }}>Nossos Clientes</div>
          <h2 className="sec-h" style={{ textAlign: 'center' }}>
            Empresas que confiam na <span>INDAIA</span>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-3)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Mais de 340 empresas ativas em todo o Brasil.
          </p>
        </div>
      </div>

      <div
        style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to right, var(--bg-alt), transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to left, var(--bg-alt), transparent)', zIndex: 2, pointerEvents: 'none' }} />

        <div style={{ overflow: 'hidden' }}>
          <CarouselRow logos={ROW1} totalW={TOTAL_W1} speed={0.42} reverse={false} pausedRef={pausedRef} />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <CarouselRow logos={ROW2} totalW={TOTAL_W2} speed={0.36} reverse={true} pausedRef={pausedRef} />
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-3)' }}>
        +340 parceiros em todo o Brasil
      </p>
    </section>
  )
}
