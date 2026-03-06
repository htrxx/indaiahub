'use client'

import { useEffect, useRef } from 'react'

const LOGOS = [
  { name: 'Ambev',      mk: 'M', svg: 'AMBEV' },
  { name: 'Vale',       mk: 'V', svg: 'VALE' },
  { name: 'Braskem',    mk: 'B', svg: 'BRASKEM' },
  { name: 'Embraer',    mk: 'E', svg: 'EMBRAER' },
  { name: 'Natura',     mk: 'N', svg: 'NATURA' },
  { name: 'Gerdau',     mk: 'G', svg: 'GERDAU' },
  { name: 'Suzano',     mk: 'S', svg: 'SUZANO' },
  { name: 'Ultrapar',   mk: 'U', svg: 'ULTRAPAR' },
  { name: 'WEG',        mk: 'W', svg: 'WEG' },
  { name: 'Marcopolo',  mk: 'M', svg: 'MARCOPOLO' },
  { name: 'Tupy',       mk: 'T', svg: 'TUPY' },
  { name: 'Randon',     mk: 'R', svg: 'RANDON' },
  { name: 'Iochpe',     mk: 'I', svg: 'IOCHPE' },
  { name: 'Fras-le',    mk: 'F', svg: 'FRAS-LE' },
  { name: 'Schulz',     mk: 'S', svg: 'SCHULZ' },
  { name: 'Metal Leve', mk: 'ML',svg: 'METAL LEVE' },
  { name: 'Mahle',      mk: 'M', svg: 'MAHLE' },
  { name: 'Dana',       mk: 'D', svg: 'DANA' },
  { name: 'Eaton',      mk: 'E', svg: 'EATON' },
  { name: 'Parker',     mk: 'P', svg: 'PARKER' },
]

const DOUBLED = [...LOGOS, ...LOGOS]
const ITEM_W = 172
const ITEM_GAP = 12
const TOTAL_W = LOGOS.length * (ITEM_W + ITEM_GAP)

export function ClientLogos() {
  const trackRef  = useRef<HTMLDivElement>(null)
  const animRef   = useRef<number>()
  const posRef    = useRef(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    let last = performance.now()
    function tick(now: number) {
      const dt = now - last; last = now
      if (!pausedRef.current) {
        posRef.current += 0.45 * (dt / 16)
        if (posRef.current >= TOTAL_W) posRef.current -= TOTAL_W
        if (trackRef.current) trackRef.current.style.transform = `translateX(-${posRef.current}px)`
      }
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  return (
    <section style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)', padding: 'clamp(48px,7vw,80px) 0', overflow: 'hidden' }}>

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

      {/* Carousel */}
      <div
        style={{ position: 'relative', overflow: 'hidden' }}
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}
      >
        {/* Fade masks */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(to right, var(--bg-alt), transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(to left, var(--bg-alt), transparent)', zIndex: 2, pointerEvents: 'none' }} />

        <div ref={trackRef} style={{ display: 'flex', gap: ITEM_GAP, width: 'max-content', willChange: 'transform', paddingLeft: 48 }}>
          {DOUBLED.map((logo, i) => (
            <div
              key={i}
              title={logo.name}
              style={{
                width: ITEM_W, flexShrink: 0,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '16px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, transition: 'border-color 0.2s, background 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--brand-pale)'; el.style.background = 'var(--brand-frost)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.background = 'var(--bg-card)' }}
            >
              {/* Letter mark */}
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: 'var(--text-3)',
                fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '0.05em',
              }}>
                {logo.mk}
              </div>
              {/* Name */}
              <span style={{
                fontSize: 12, fontWeight: 700, color: 'var(--text-3)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                {logo.svg}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-3)' }}>
        Passe o mouse para pausar · +340 parceiros em todo o Brasil
      </p>
    </section>
  )
}
