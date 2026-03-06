'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface NcmItem { codigo: string; descricao: string; tipo: string; ii?: number | null }

const GLOBAL_STYLES = `
  @keyframes ncm-spin { to { transform: rotate(360deg); } }
  @keyframes ncm-fadeSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ncm-pulse-dot {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
  @keyframes ncm-rotateBorder {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to   { transform: translate(-50%, -50%) rotate(360deg); }
  }

  [data-ncm] .ncm-card-wrap {
    position: relative; border-radius: 20px; padding: 2px; overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
    background: rgba(56,189,248,0.1);
  }
  [data-ncm] .ncm-card-wrap::before {
    content: ''; position: absolute; top: 50%; left: 50%; width: 200%; height: 200%;
    background: conic-gradient(from 0deg, transparent 0deg, transparent 160deg,
      rgba(56,189,248,0.15) 180deg, #38bdf8 200deg, #bae6fd 210deg,
      #38bdf8 220deg, rgba(56,189,248,0.15) 240deg, transparent 260deg, transparent 360deg);
    transform: translate(-50%, -50%) rotate(0deg);
    animation: ncm-rotateBorder 3s linear infinite;
    opacity: 0; transition: opacity 0.35s ease; z-index: 0; pointer-events: none;
  }
  [data-ncm] .ncm-card-wrap:hover::before { opacity: 1; }
  [data-ncm] .ncm-card-wrap:hover {
    transform: scale(1.015);
    box-shadow: 0 24px 60px rgba(14,165,233,0.18), 0 8px 24px rgba(0,0,0,0.4);
  }
  [data-ncm] .ncm-card {
    position: relative; z-index: 1; border-radius: 18px;
    background: #0d1b2e; width: 100%; height: 100%;
  }
  [data-ncm] .ncm-card-inner { position: relative; z-index: 2; }

  [data-ncm] .ncm-result-row {
    transition: all 0.2s ease; cursor: pointer; border-radius: 10px;
    border: 1px solid rgba(56,189,248,0.12); background: rgba(255,255,255,0.02);
    animation: ncm-fadeSlideIn 0.25s ease both;
  }
  [data-ncm] .ncm-result-row:hover {
    border-color: rgba(56,189,248,0.45); background: rgba(56,189,248,0.06);
    transform: translateX(4px);
  }
  [data-ncm] .ncm-chip-btn {
    transition: all 0.2s ease; border: 1px solid rgba(56,189,248,0.2);
    background: rgba(56,189,248,0.05); color: #7dd3fc; border-radius: 100px;
    padding: 4px 12px; font-size: 11px; font-weight: 600;
    font-family: 'Syne', sans-serif; cursor: pointer; letter-spacing: 0.02em;
  }
  [data-ncm] .ncm-chip-btn:hover {
    border-color: #38bdf8; background: rgba(56,189,248,0.15); color: #e0f2fe;
  }
  [data-ncm] .ncm-input {
    background: rgba(255,255,255,0.04) !important;
    border: 1.5px solid rgba(56,189,248,0.2) !important;
    color: #e2e8f0 !important;
    transition: border-color 0.2s, box-shadow 0.2s !important;
  }
  [data-ncm] .ncm-input:focus {
    border-color: #38bdf8 !important;
    box-shadow: 0 0 0 3px rgba(56,189,248,0.12) !important;
    outline: none !important;
  }
  [data-ncm] .ncm-input::placeholder { color: #475569 !important; }
  [data-ncm] .ncm-btn-primary {
    background: linear-gradient(135deg, #0ea5e9, #1d4ed8); border: none; color: white;
    font-weight: 700; cursor: pointer; transition: all 0.2s ease;
    box-shadow: 0 4px 20px rgba(14,165,233,0.3);
  }
  [data-ncm] .ncm-btn-primary:hover {
    transform: translateY(-1px); box-shadow: 0 8px 28px rgba(14,165,233,0.45);
  }
  [data-ncm] .ncm-scrollbar::-webkit-scrollbar { width: 4px; }
  [data-ncm] .ncm-scrollbar::-webkit-scrollbar-track { background: transparent; }
  [data-ncm] .ncm-scrollbar::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.2); border-radius: 4px; }
  [data-ncm] .ncm-badge {
    font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 4px;
    letter-spacing: 0.05em; flex-shrink: 0; font-family: 'JetBrains Mono', monospace;
  }
`

function StyleInjector() {
  useEffect(() => {
    const ID = 'ncm-global-styles'
    // Evita duplicata em strict mode / hot reload
    if (document.getElementById(ID)) return
    const el = document.createElement('style')
    el.id = ID
    el.textContent = GLOBAL_STYLES
    document.head.appendChild(el)
    // Remove ao sair da página — impede vazamento para outras rotas
    return () => { document.getElementById(ID)?.remove() }
  }, [])
  return null
}

function IIBadge({ ii }: { ii?: number | null }) {
  if (ii === null || ii === undefined)
    return <span className="ncm-badge" style={{ color: '#64748b', background: 'rgba(100,116,139,0.1)' }}>II: —</span>
  const [color, bg] =
    ii === 0   ? ['#34d399', 'rgba(52,211,153,0.1)'] :
    ii <= 10   ? ['#38bdf8', 'rgba(56,189,248,0.1)'] :
    ii <= 20   ? ['#fbbf24', 'rgba(251,191,36,0.1)'] :
                 ['#f87171', 'rgba(248,113,113,0.1)']
  return <span className="ncm-badge" style={{ color, background: bg }}>II: {ii}%</span>
}

function NcmDetailPanel({ item, onClose }: { item: NcmItem; onClose: () => void }) {
  const cap = item.codigo.replace(/\D/g, '').slice(0, 2)
  const pis = 2.1
  const cofins = 9.65

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,8,20,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        maxWidth: 580, width: '100%', maxHeight: '90vh',
        background: '#0d1b2e', borderRadius: 20,
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        border: '1px solid rgba(56,189,248,0.15)',
      }}>
        <div style={{ padding: 32, overflowY: 'auto', maxHeight: '90vh' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 600, color: '#38bdf8', marginBottom: 6 }}>{item.codigo}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, maxWidth: 440 }}>{item.descricao}</div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#7dd3fc', cursor: 'pointer', flexShrink: 0, marginLeft: 16 }}>×</button>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24, padding: '5px 12px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.08em', fontFamily: "'Syne', sans-serif" }}>Portal Único Siscomex · TEC/NCM</span>
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#475569', marginBottom: 12, fontFamily: "'Syne', sans-serif" }}>Tributos na Importação</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'II — Imposto de Importação',       val: item.ii != null ? `${item.ii}%` : 'Consultar', sub: 'TEC/CAMEX',      color: item.ii === 0 ? '#34d399' : '#38bdf8' },
              { label: 'IPI — Imp. Prod. Industrializado', val: 'Variável',   sub: 'Consultar TIPI',  color: '#64748b' },
              { label: 'PIS/Importação',                   val: `${pis}%`,    sub: 'Lei 10.865/2004', color: '#818cf8' },
              { label: 'COFINS/Importação',                val: `${cofins}%`, sub: 'Lei 10.865/2004', color: '#818cf8' },
            ].map(t => (
              <div key={t.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(56,189,248,0.1)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginBottom: 8, fontFamily: "'Syne', sans-serif" }}>{t.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 600, color: t.color }}>{t.val}</div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>{t.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(56,189,248,0.1)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginBottom: 4, fontFamily: "'Syne', sans-serif" }}>Capítulo NCM</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', fontFamily: "'Syne', sans-serif" }}>Capítulo {cap}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginBottom: 4, fontFamily: "'Syne', sans-serif" }}>PIS + COFINS</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: '#818cf8', fontWeight: 600 }}>{pis + cofins}%</div>
            </div>
          </div>

          <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.7, background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: 10, padding: '10px 14px', margin: 0, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            <span>Alíquotas do II são referências pela TEC/CAMEX por capítulo. Para valores exatos consulte o{' '}
              <a href="https://portalunico.siscomex.gov.br/classif/?perfil=publico" target="_blank" rel="noopener" style={{ color: '#38bdf8' }}>Sistema Classif</a>.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export function NcmPage() {
  const [query,    setQuery]    = useState('')
  const [results,  setResults]  = useState<NcmItem[]>([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const [selected, setSelected] = useState<NcmItem | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setSearched(false); return }
    setLoading(true); setError(null)
    try {
      const res  = await fetch(`/api/ncm?q=${encodeURIComponent(q.trim())}`)
      const data = await res.json()
      if (!data.ok) throw new Error(data.error ?? 'Erro na consulta')
      setResults(data.items); setSearched(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido'); setResults([])
    } finally { setLoading(false) }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value; setQuery(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(v), 500)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { if (debounceRef.current) clearTimeout(debounceRef.current); search(query) }
  }

  // Carrega as fontes NCM apenas nesta página e reseta o body ao sair
  useEffect(() => {
    const prevBg = document.body.style.background
    const prevColor = document.body.style.color

    // Adiciona link das fontes se ainda não existe
    const FONT_ID = 'ncm-fonts'
    if (!document.getElementById(FONT_ID)) {
      const link = document.createElement('link')
      link.id = FONT_ID
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&family=Space+Grotesk:wght@700&display=swap'
      document.head.appendChild(link)
    }

    return () => {
      // Restaura o body ao estado original ao sair da página NCM
      document.body.style.background = prevBg
      document.body.style.color = prevColor
    }
  }, [])

  const suggestions = ['smartphone','calçados','soja','automóvel','8471','6109','0901','8517','3004']

  return (
    <>
      <StyleInjector />
      {selected && <NcmDetailPanel item={selected} onClose={() => setSelected(null)} />}

      <section data-ncm style={{ padding: '40px 24px', fontFamily: "'Syne', sans-serif", background: 'linear-gradient(135deg, #020b18 0%, #061526 50%, #040f1f 100%)', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 36, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 100, marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', display: 'inline-block', animation: 'ncm-pulse-dot 1.5s ease-in-out infinite' }} />
              <span style={{ fontFamily: "'Space Grotesk', 'Syne', sans-serif", fontSize: 11, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>NCM — Nomenclatura Comum do Mercosul</span>
            </div>
            <h1 style={{ fontSize: 56, fontWeight: 800, color: '#f0f9ff', margin: 0, lineHeight: 1.15, letterSpacing: '-0.03em', fontFamily: "'Space Grotesk', 'Syne', sans-serif" }}>
              Consulta <span style={{ color: '#38bdf8' }}>NCM</span>
            </h1>
            <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 10, fontWeight: 400 }}>
              Pesquise códigos NCM com alíquotas de II, IPI, PIS e COFINS via Portal Único Siscomex.
            </p>
          </div>

          {/* Two-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 24, alignItems: 'start' }}>

            {/* ── LEFT: Search ── */}
            <div className="ncm-card-wrap">
            <div className="ncm-card">
              <div className="ncm-card-inner" style={{ padding: 28 }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0ea5e9, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>Pesquisa</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Código ou descrição</div>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20, lineHeight: 1.7 }}>
                  Pesquise por <strong style={{ color: '#e2e8f0' }}>código NCM</strong>{' '}
                  (ex: <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, background: 'rgba(56,189,248,0.08)', color: '#38bdf8', padding: '1px 6px', borderRadius: 4 }}>8471.30</code>) ou{' '}
                  <strong style={{ color: '#e2e8f0' }}>descrição</strong>{' '}
                  (ex: <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, background: 'rgba(56,189,248,0.08)', color: '#38bdf8', padding: '1px 6px', borderRadius: 4 }}>smartphone</code>).
                </p>

                <div style={{ position: 'relative', marginBottom: 12 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    className="ncm-input"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    placeholder="Ex: 8471.30 ou computador portátil"
                    style={{ width: '100%', padding: '13px 16px 13px 42px', borderRadius: 12, fontFamily: "'Syne', sans-serif", fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ borderTop: '1px solid rgba(56,189,248,0.08)', marginBottom: 16 }} />

                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7dd3fc', marginBottom: 10 }}>Sugestões</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
                  {suggestions.map(s => (
                    <button key={s} className="ncm-chip-btn" onClick={() => { setQuery(s); search(s) }}>{s}</button>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(56,189,248,0.08)', marginBottom: 16 }} />

                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7dd3fc', marginBottom: 10 }}>Fonte dos Dados</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>, label: 'Portal Único Siscomex' },
                    { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>, label: 'TEC/CAMEX' },
                    { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>, label: 'Cache 24h' },
                  ].map(c => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#cbd5e1' }}>
                      {c.icon} {c.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>

            {/* ── RIGHT: Results ── */}
            <div className="ncm-card-wrap">
            <div className="ncm-card" style={{ minHeight: 500 }}>
              <div className="ncm-card-inner ncm-scrollbar" style={{ padding: 28, maxHeight: '80vh', overflowY: 'auto' }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>Resultados</div>
                      <div style={{ fontSize: 11, color: '#475569' }}>
                        {loading ? 'Buscando…' : results.length > 0 ? `${results.length} item${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}` : 'Aguardando pesquisa'}
                      </div>
                    </div>
                  </div>
                  {results.length > 0 && !loading && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', padding: '3px 10px', borderRadius: 100, letterSpacing: '0.05em' }}>
                      Clique para ver tributos →
                    </span>
                  )}
                </div>

                {loading && (
                  <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"
                      style={{ animation: 'ncm-spin 0.8s linear infinite', display: 'block', margin: '0 auto 16px' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    <div style={{ fontSize: 14, color: '#64748b' }}>Consultando Portal Único Siscomex…</div>
                  </div>
                )}

                {!loading && error && (
                  <div style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 14, padding: '20px 24px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#f87171', marginBottom: 4 }}>Erro ao consultar a API</div>
                      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>{error}</div>
                      <a href="https://portalunico.siscomex.gov.br/classif/?perfil=publico" target="_blank" rel="noopener" style={{ fontSize: 12, color: '#38bdf8' }}>
                        Acessar Sistema Classif diretamente →
                      </a>
                    </div>
                  </div>
                )}

                {!loading && !error && searched && results.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 16px' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/></svg>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#475569', marginBottom: 8 }}>Nenhum resultado</div>
                    <p style={{ fontSize: 13, color: '#334155' }}>Tente outros termos ou consulte o{' '}
                      <a href="https://portalunico.siscomex.gov.br/classif/?perfil=publico" target="_blank" rel="noopener" style={{ color: '#38bdf8' }}>Sistema Classif</a>.
                    </p>
                  </div>
                )}

                {!loading && !error && !searched && (
                  <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 20px' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/><path d="M11 8v6"/></svg>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#334155', marginBottom: 10 }}>Consulte a tabela NCM</div>
                    <p style={{ fontSize: 13, color: '#1e3a5f', maxWidth: 360, margin: '0 auto', lineHeight: 1.8 }}>
                      Digite um código NCM ou palavra-chave na caixa de pesquisa ao lado. Os resultados aparecem aqui automaticamente.
                    </p>
                  </div>
                )}

                {!loading && !error && results.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {results.map((item, i) => (
                      <div
                        key={item.codigo}
                        className="ncm-result-row"
                        onClick={() => setSelected(item)}
                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', animationDelay: `${Math.min(i * 30, 300)}ms` }}
                      >
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: '#38bdf8', flexShrink: 0, minWidth: 88 }}>{item.codigo}</span>
                        <span style={{ fontSize: 13, color: '#94a3b8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.descricao}</span>
                        <IIBadge ii={item.ii} />
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="m9 18 6-6-6-6"/></svg>
                      </div>
                    ))}
                    {results.length >= 80 && (
                      <p style={{ fontSize: 12, color: '#334155', marginTop: 12, textAlign: 'center' }}>
                        Exibindo os primeiros 80 resultados. Refine a busca para resultados mais precisos.
                      </p>
                    )}
                  </div>
                )}

              </div>
            </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
