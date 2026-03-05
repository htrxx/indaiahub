'use client'

import { useState, useEffect, useRef } from 'react'

const SERVICES = [
  {
    id: 'gerenciamento',
    label: 'Gerenciamento de Processos',
   
    image: '/services/gerenciamento.jpg', // substitua pelo caminho da sua imagem
    desc: 'Gestão completa dos pedidos de importação e embarques de exportação com visibilidade em tempo real.',
    details: [
      'Acompanhamento de DI, DUE e demais documentos aduaneiros',
      'Visibilidade em tempo real via MyINDAIA & Power BI',
      'Integração com sistemas ERP do cliente',
      'Relatórios gerenciais e KPIs de operação',
    ],
  },
  {
    id: 'desembaraco',
    label: 'Desembaraço Aduaneiro',
    
    image: '/services/desembaraco.jpg',
    desc: '58 anos de experiência no desembaraço de grandes empresas em todos os portos e aeroportos do Brasil.',
    details: [
      'Desembaraço em todos os portos e aeroportos do Brasil',
      'Parametrização e gestão de canais (verde, amarelo, vermelho)',
      'Consultoria em classificação fiscal NCM',
      'Licenciamento de importação (LI) e anuências especiais',
    ],
  },
  {
    id: 'logistica',
    label: 'Logística Internacional',
    
    image: '/services/logistica.jpg',
    desc: 'Agenciamento de cargas, door-to-door internacional, transporte e coletas nacionais.',
    details: [
      'Frete marítimo, aéreo e rodoviário internacional',
      'Operações door-to-door e port-to-port',
      'Gestão de seguros de carga',
      'Consolidação e desconsolidação de cargas (LCL/FCL)',
    ],
  },
  {
    id: 'transportation',
    label: 'Transportation Management',
   
    image: '/services/transportation.jpg',
    desc: 'Time dedicado ao gerenciamento de transporte e logística de entrada e saída das operações.',
    details: [
      'Gestão de transportadoras homologadas',
      'Rastreamento de cargas em tempo real',
      'Otimização de rotas e custos logísticos',
      'Controle de SLA e indicadores de entrega',
    ],
  },
  {
    id: 'drawback',
    label: 'Drawback & OEA',
    
    image: '/services/drawback.jpg',
    desc: 'Consultoria em regimes especiais, gestão de drawback e suporte aos processos de OEA dos clientes.',
    details: [
      'Habilitação e gestão de Drawback Suspensão e Isenção',
      'Assessoria para certificação OEA (Operador Econômico Autorizado)',
      'Regimes aduaneiros especiais (Recof, Entreposto, etc.)',
      'Planejamento tributário em operações de comércio exterior',
    ],
  },
  {
    id: 'radar',
    label: 'Habilitação RADAR',
    
    image: '/services/radar.jpg',
    desc: 'Habilitação de pessoa física e jurídica junto à Receita Federal para iniciar importações e exportações.',
    details: [
      'Habilitação RADAR Limitado, Ilimitado e Expresso',
      'Análise de capacidade financeira e documentação',
      'Alterações cadastrais e atualização de limites',
      'Suporte em caso de suspensão ou cancelamento',
    ],
  },
]

export function ServicesExplorer() {
  const [active, setActive] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const svc = SERVICES[active]

  function handleSelect(i: number) {
    setActive(i)
    setAnimKey(k => k + 1)
  }

  return (
    <section style={{
      background: 'var(--brand-deep)',
      padding: '96px 64px',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--brand-sky)',
            marginBottom: 14,
          }}>
            <span style={{ display: 'block', width: 18, height: 1.5, background: 'var(--brand-sky)' }} />
            Serviços
          </div>
          <h2 style={{
            fontSize: 'clamp(30px, 3.2vw, 48px)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em', color: 'white',
          }}>
            Explore os nossos <span style={{ color: 'var(--brand-sky)' }}>serviços</span>
          </h2>
        </div>

        {/* Main layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: 28,
          alignItems: 'start',
        }}>

          {/* Left: topic list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SERVICES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => handleSelect(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 18px',
                  borderRadius: 12,
                  border: `1px solid ${active === i ? 'rgba(66,165,245,0.35)' : 'rgba(255,255,255,0.06)'}`,
                  background: active === i ? 'rgba(66,165,245,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  width: '100%',
                }}
                onMouseEnter={e => {
                  if (active !== i) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'
                  }
                }}
                onMouseLeave={e => {
                  if (active !== i) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.02)'
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)'
                  }
                }}
              >
                {/* + / − icon */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  border: `1.5px solid ${active === i ? 'var(--brand-sky)' : 'rgba(255,255,255,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, color: active === i ? 'var(--brand-sky)' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.2s',
                }}>
                  {active === i ? '−' : '+'}
                </div>
                <span style={{
                  fontSize: 14, fontWeight: active === i ? 700 : 500,
                  color: active === i ? 'white' : 'rgba(255,255,255,0.55)',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  transition: 'all 0.2s',
                }}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>

          {/* Right: detail card */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            minHeight: 560,
          }}>

            {/* Text side */}
            <div
              key={animKey}
              style={{
                padding: '40px 36px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                animation: 'fadeSlideIn 0.45s cubic-bezier(0.22,1,0.36,1) both',
              }}
            >
              <div>
                <div style={{ fontSize: 32, marginBottom: 16 }}></div>
                <h3 style={{
                  fontSize: 22, fontWeight: 800, color: 'white',
                  letterSpacing: '-0.02em', marginBottom: 12,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}>
                  {svc.label}
                </h3>
                <p style={{
                  fontSize: 14, color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.75, marginBottom: 28,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}>
                  {svc.desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {svc.details.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                        background: 'rgba(66,165,245,0.15)',
                        border: '1px solid rgba(66,165,245,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, color: 'var(--brand-sky)',
                      }}>✓</span>
                      <span style={{
                        fontSize: 13, color: 'rgba(255,255,255,0.65)',
                        lineHeight: 1.6, fontFamily: 'Plus Jakarta Sans, sans-serif',
                      }}>
                        {d}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 32 }}>
                <a href="/contato" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  fontSize: 13, fontWeight: 700, color: 'var(--brand-sky)',
                  textDecoration: 'none',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}>
                  Solicitar cotação →
                </a>
              </div>
            </div>

            {/* Image side */}
           <div
  style={{
    background: 'rgba(255,255,255,0.03)',
    borderLeft: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minHeight: 420,
    position: 'relative',
    overflow: 'hidden',
  }}
>
  <img
    key={svc.image}
    src={svc.image}
    alt={svc.label}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: 12,
      transform: 'scale(1.08)',
      animation: 'imageZoom 1.2s ease forwards',
      transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
    }}
    className="serviceImage"
  />

  {/* Overlay glass gradient */}
  <div
    style={{
      position: 'absolute',
      inset: 0,
      borderRadius: 12,
      background: `
        linear-gradient(
          to top,
          rgba(0,0,0,0.45),
          rgba(0,0,0,0.15) 40%,
          rgba(0,0,0,0) 70%
        )
      `,
      pointerEvents: 'none'
    }}
  />
</div>
          </div>
        </div>
      </div>
    </section>
  )
}
