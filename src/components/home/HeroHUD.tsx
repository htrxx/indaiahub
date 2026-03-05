'use client'

import { useEffect, useState } from 'react'

const BENEFITS = [
  { icon: '⚡', text: 'Retorno em até 4h úteis', sub: 'Proposta técnica gratuita' },
  { icon: '🔍', text: 'Análise NCM sem custo', sub: 'Alíquotas e tributação' },
  { icon: '📊', text: 'Rastreamento em tempo real', sub: 'Via MyINDAIA & Power BI' },
  { icon: '🏆', text: '58 anos de experiência', sub: 'Santos, SP — desde 1966' },
]

const SERVICES_ICONS = [
  { label: 'Importação', icon: '📦' },
  { label: 'Exportação', icon: '✈️' },
  { label: 'Drawback', icon: '⚖️' },
  { label: 'Logística', icon: '🚛' },
  { label: 'OEA', icon: '🏛️' },
  { label: 'RADAR', icon: '📡' },
]

export function HeroHUD({ usd }: { usd: string }) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({ tipo: 'imp', nome: '', empresa: '', email: '' })
  const [sent, setSent] = useState(false)
  const [activeService, setActiveService] = useState<number | null>(null)

  /* Pulse animation for CTA */
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    const id = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 600) }, 4000)
    return () => clearInterval(id)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const proto = 'IND-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 9000 + 1000)
    setSent(true)
    setStep(0)
    setFormData({ tipo: 'imp', nome: '', empresa: '', email: '' })
    setTimeout(() => setSent(false), 6000)
  }

  return (
    <div style={{
      position: 'relative',
      zIndex: 2,
      width: 390,
      flexShrink: 0,
      animation: 'fadeLeft 0.9s 0.2s ease both',
    }}>
      {/* ── Main card ── */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24,
        overflow: 'hidden',
        backdropFilter: 'blur(32px)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '18px 20px 14px',
          background: 'linear-gradient(135deg, rgba(21,101,192,0.4) 0%, rgba(66,165,245,0.15) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Glow orb */}
          <div style={{
            position: 'absolute', top: -20, right: -20,
            width: 100, height: 100,
            background: 'radial-gradient(circle, rgba(66,165,245,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(66,165,245,0.2)', border: '1px solid rgba(66,165,245,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
              }}>🚢</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'white', letterSpacing: '0.05em' }}>INDAIA COMEX</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>Despachante Aduaneiro · Santos, SP</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: '#10B981' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'block', animation: 'blink 1.5s infinite' }} />
              58 anos
            </div>
          </div>

          {/* USD strip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '7px 12px',
          }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>USD/BRL</span>
            <span style={{ fontFamily: 'DM Mono', fontSize: 15, fontWeight: 500, color: 'white' }}>{usd}</span>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>BCB PTAX · ao vivo</span>
          </div>
        </div>

        {/* ── Services quick grid ── */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>
            Nossos serviços
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {SERVICES_ICONS.map((s, i) => (
              <div
                key={s.label}
                onMouseEnter={() => setActiveService(i)}
                onMouseLeave={() => setActiveService(null)}
                style={{
                  padding: '8px 6px',
                  borderRadius: 8,
                  border: `1px solid ${activeService === i ? 'rgba(66,165,245,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  background: activeService === i ? 'rgba(66,165,245,0.12)' : 'rgba(255,255,255,0.03)',
                  textAlign: 'center',
                  cursor: 'default',
                  transition: 'all 0.2s',
                }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 9.5, fontWeight: 600, color: activeService === i ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)', letterSpacing: '0.04em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Mini quote form ── */}
        <div style={{ padding: '16px 20px' }}>
          {sent ? (
            <div style={{
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 12, padding: '16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#10B981', marginBottom: 4 }}>Solicitação enviada!</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Retornamos em até 4h úteis</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>
                Cotação rápida
              </div>

              {/* Step indicators */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
                {[0, 1].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 2, borderRadius: 1,
                    background: step >= i ? 'var(--brand-sky)' : 'rgba(255,255,255,0.1)',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {step === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Tipo */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      {(['imp', 'exp'] as const).map(t => (
                        <button
                          key={t} type="button"
                          onClick={() => setFormData(f => ({ ...f, tipo: t }))}
                          style={{
                            padding: '8px 6px',
                            borderRadius: 8,
                            border: `1.5px solid ${formData.tipo === t ? 'var(--brand-sky)' : 'rgba(255,255,255,0.1)'}`,
                            background: formData.tipo === t ? 'rgba(66,165,245,0.15)' : 'rgba(255,255,255,0.04)',
                            color: formData.tipo === t ? 'white' : 'rgba(255,255,255,0.5)',
                            fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}>
                          {t === 'imp' ? '📦 Importação' : '✈️ Exportação'}
                        </button>
                      ))}
                    </div>
                    <input
                      value={formData.nome}
                      onChange={e => setFormData(f => ({ ...f, nome: e.target.value }))}
                      placeholder="Seu nome"
                      required
                      style={{
                        padding: '9px 12px', borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.06)',
                        fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'white',
                        outline: 'none', width: '100%',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => { if (formData.nome.trim()) setStep(1) }}
                      style={{
                        padding: '11px', borderRadius: 10,
                        background: `linear-gradient(135deg, var(--brand-core), var(--brand-bright))`,
                        border: 'none',
                        fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700,
                        color: 'white', cursor: 'pointer',
                        boxShadow: `0 4px 20px rgba(21,101,192,0.5)${pulse ? ', 0 0 0 4px rgba(66,165,245,0.15)' : ''}`,
                        transition: 'all 0.3s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      Iniciar cotação gratuita
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input
                      value={formData.empresa}
                      onChange={e => setFormData(f => ({ ...f, empresa: e.target.value }))}
                      placeholder="Empresa"
                      required
                      style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'white', outline: 'none', width: '100%' }}
                    />
                    <input
                      value={formData.email}
                      onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                      placeholder="E-mail corporativo"
                      type="email"
                      required
                      style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'white', outline: 'none', width: '100%' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 6 }}>
                      <button type="button" onClick={() => setStep(0)} style={{ padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                        ← Voltar
                      </button>
                      <button type="submit" style={{
                        padding: '10px', borderRadius: 8,
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        border: 'none',
                        fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700,
                        color: 'white', cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
                      }}>
                        Enviar solicitação ✓
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {/* Trust line */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>🔒 Sem compromisso · Retorno em 4h úteis</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Benefits strip below card ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
        {BENEFITS.map(b => (
          <div key={b.text} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
          }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{b.icon}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)', lineHeight: 1.2 }}>{b.text}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{b.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
