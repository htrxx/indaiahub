'use client'
// ═══════════════════════════════════════════════════
// StatsBand Component
// ═══════════════════════════════════════════════════
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { STATS, SERVICES, NEWS, CLIENT_LOGOS } from '@/lib/constants'

function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const duration = 1400
    const step = () => {
      start += 1000 / 60
      const progress = Math.min(start / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, active])
  return count
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const count = useCountUp(value, active)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ padding: '0 40px', borderRight: '1px solid rgba(255,255,255,0.08)' }}
      className="stat-item">
      <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.04em', color: 'white', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <span>{count}</span>
        <span style={{ fontSize: 22, marginTop: 8, color: 'var(--brand-sky)', fontWeight: 700 }}>{suffix}</span>
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>{label}</div>
    </div>
  )
}

export function StatsBand() {
  return (
    <div style={{
      background: 'var(--brand-deep)',
      padding: '52px 48px',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{
        maxWidth: 1160,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
      }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ paddingLeft: i === 0 ? 0 : undefined, borderRight: i === STATS.length-1 ? 'none' : undefined }}>
            <StatItem value={s.value} suffix={s.suffix} label={s.label} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// Services Component
// ═══════════════════════════════════════════════════
export function Services() {
  return (
    <section className="sec sec-services" id="servicos" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        <div className="sec-eye">Serviços</div>
        <h2 className="sec-h">Tudo que seu COMEX<br /><span>precisa em um só lugar</span></h2>
        <p className="sec-p">Do habilitação RADAR ao desembaraço final, equipes especializadas por segmento e NCM.</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginTop: 52,
        }}>
          {SERVICES.map(svc => (
            <div key={svc.name} style={{
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: '32px 28px',
              background: 'var(--bg-card)',
              transition: 'all 0.3s',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'var(--brand-pale)'
                el.style.boxShadow = 'var(--shd)'
                el.style.transform = 'translateY(-5px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'var(--border)'
                el.style.boxShadow = 'none'
                el.style.transform = 'none'
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'var(--brand-frost)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, marginBottom: 20,
              }}>
                {svc.icon}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{svc.name}</div>
              <p style={{ fontSize: 13.5, color: 'var(--text-3)', lineHeight: 1.7 }}>{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════
// NewsSection Component
// ═══════════════════════════════════════════════════
const NEWS_THEME = {
  blue:   'linear-gradient(135deg, var(--brand-frost), #C5D5F5)',
  green:  'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
  yellow: 'linear-gradient(135deg, #FFF8E1, #FFE0B2)',
}

export function NewsSection() {
  return (
    <section className="sec" style={{ background: 'var(--bg)' }} id="noticias">
      <div className="wrap">
        <div className="sec-eye">INDAIA News</div>
        <h2 className="sec-h">Fique por dentro das<br /><span>novidades do COMEX</span></h2>
        <p className="sec-p">Alertas regulatórios, análises executivas e as principais movimentações da semana.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 20, marginTop: 52 }}>
          {NEWS.map((n, i) => (
            <div key={n.id} style={{
              border: '1px solid var(--border)',
              borderRadius: 20,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = 'var(--shd)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'none'; el.style.boxShadow = 'none'; }}
            >
              <div style={{
                padding: i === 0 ? 48 : 36,
                background: NEWS_THEME[n.theme],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: i === 0 ? 60 : 44,
              }}>
                {n.icon}
              </div>
              <div style={{ padding: '20px 22px', background: 'var(--bg-card)' }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand-core)', marginBottom: 8, display: 'block' }}>{n.category}</span>
                <div style={{ fontSize: i === 0 ? 18 : 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.45, marginBottom: 8 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{n.date} · {n.readTime}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <Link href="/noticias" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 14, fontWeight: 700, color: 'var(--brand-core)',
            textDecoration: 'none', border: '1.5px solid var(--brand-pale)',
            padding: '11px 26px', borderRadius: 10, transition: 'all 0.2s',
          }}>
            Ver todas as notícias →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════
// QuoteForm Component
// ═══════════════════════════════════════════════════
export function QuoteForm() {
  const [tab, setTab] = useState<'imp' | 'exp'>('imp')
  const [sent, setSent] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <section className="sec" style={{ background: 'var(--bg-alt)' }} id="cotacao-form">
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 64, alignItems: 'start' }}>
          {/* Left: form */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 20, padding: 36, boxShadow: 'var(--sh)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--brand-core), var(--brand-sky))' }} />
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 20, color: 'var(--text)' }}>
              Solicitar Cotação
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              {(['imp', 'exp'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1, padding: 9, borderRadius: 9,
                  border: `1.5px solid ${tab === t ? 'var(--brand-core)' : 'var(--border)'}`,
                  background: tab === t ? 'var(--brand-frost)' : 'var(--bg-card)',
                  color: tab === t ? 'var(--brand-core)' : 'var(--text-3)',
                  fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                }}>
                  {t === 'imp' ? '📦 Importação' : '✈️ Exportação'}
                </button>
              ))}
            </div>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="fg">
                  <label>Nome</label>
                  <input type="text" placeholder="Seu nome" required />
                </div>
                <div className="fg">
                  <label>Empresa</label>
                  <input type="text" placeholder="Empresa" required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="fg">
                  <label>E-mail</label>
                  <input type="email" placeholder="email@empresa.com" required />
                </div>
                <div className="fg">
                  <label>Telefone</label>
                  <input type="tel" placeholder="+55 (13) 9..." />
                </div>
              </div>
              <div className="fg">
                <label>NCM / Produto</label>
                <input type="text" placeholder="ex: 8471.30.19 — Notebook" />
              </div>
              <div className="fg">
                <label>Mensagem</label>
                <textarea placeholder="Descreva sua operação..." rows={3} />
              </div>
              <button type="submit" style={{
                padding: '13px 28px', borderRadius: 10,
                background: 'var(--brand-core)', border: 'none',
                fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700,
                color: 'white', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(21,101,192,0.35)',
                transition: 'all 0.2s',
              }}>
                {sent ? '✓ Enviado com sucesso!' : 'Enviar Solicitação →'}
              </button>
            </form>
          </div>

          {/* Right: benefits */}
          <div>
            <div className="sec-eye">Por que a INDAIA?</div>
            <h2 className="sec-h">Retorno em <span>até 4h úteis</span></h2>
            <p className="sec-p">Nossa equipe especializada analisa sua operação e retorna com uma proposta detalhada.</p>

            <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { n: '01', title: 'Análise técnica gratuita', desc: 'Classificação NCM, alíquotas e viabilidade operacional sem custo.' },
                { n: '02', title: 'Time especializado por segmento', desc: 'Equipes dedicadas a cada setor: tecnologia, alimentos, químicos, têxteis.' },
                { n: '03', title: 'Transparência total no processo', desc: 'Acompanhamento em tempo real via MyINDAIA e Power BI.' },
                { n: '04', title: '58 anos de experiência', desc: 'Histórico comprovado com mais de 340 clientes ativos e 18K processos/ano.' },
              ].map(b => (
                <div key={b.n} style={{
                  display: 'flex', gap: 20, padding: '20px 0',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{
                    fontSize: 28, fontWeight: 800, color: 'var(--brand-pale)',
                    fontFamily: 'DM Mono', lineHeight: 1, flexShrink: 0, marginTop: 2,
                    minWidth: 36,
                  }}>
                    {b.n}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{b.title}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--text-3)', lineHeight: 1.6 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════
// ClientLogos Component
// ═══════════════════════════════════════════════════
export function ClientLogos() {
  const names = [
    'Ambev', 'Vale', 'Braskem', 'Embraer', 'Natura',
    'Gerdau', 'Suzano', 'Ultrapar', 'WEG', 'Marcopolo',
    'Tupy', 'Randon', 'Iochpe', 'Fras-le', 'Schulz',
    'Metal Leve', 'Mahle', 'Dana', 'Eaton', 'Parker',
  ]

  return (
    <section style={{ padding: '64px 48px', background: 'var(--bg-alt)', borderTop: '1px solid var(--border)' }}>
      <div className="wrap">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="sec-eye" style={{ justifyContent: 'center' }}>Nossos Clientes</div>
          <h2 className="sec-h" style={{ textAlign: 'center' }}>Empresas que confiam na <span>INDAIA</span></h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 12,
        }}>
          {names.map(name => (
            <div key={name} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '20px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-3)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--brand-pale)'; el.style.color = 'var(--brand-core)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-3)'; }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
