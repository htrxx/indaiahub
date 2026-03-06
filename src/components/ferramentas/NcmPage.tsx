'use client'

import { useState, useRef, useCallback } from 'react'

interface NcmItem { codigo: string; descricao: string; tipo: string; ii?: number | null }

/* ── Helpers ────────────────────────────── */
function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, color, background: bg, flexShrink: 0 }}>
      {label}
    </span>
  )
}

function IIBadge({ ii }: { ii?: number | null }) {
  if (ii === null || ii === undefined) return <Badge label="II: —" color="var(--text-3)" bg="var(--surface)" />
  const color = ii === 0 ? 'var(--green)' : ii <= 10 ? 'var(--brand-core)' : ii <= 20 ? 'var(--yellow)' : 'var(--red)'
  const bg    = ii === 0 ? 'rgba(16,185,129,0.08)' : ii <= 10 ? 'rgba(21,101,192,0.08)' : ii <= 20 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)'
  return <Badge label={`II: ${ii}%`} color={color} bg={bg} />
}

/* ── Detail modal ───────────────────────── */
function NcmDetailPanel({ item, onClose }: { item: NcmItem; onClose: () => void }) {
  const cap = item.codigo.replace(/\D/g, '').slice(0, 2)
  const pis = 2.1
  const cofins = 9.65

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-card)', borderRadius: 20, padding: 32, maxWidth: 560, width: '100%', border: '1px solid var(--border)', boxShadow: 'var(--shx)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'DM Mono', fontSize: 26, fontWeight: 500, color: 'var(--brand-core)', marginBottom: 4 }}>{item.codigo}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 420 }}>{item.descricao}</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 22, color: 'var(--text-3)', cursor: 'pointer', flexShrink: 0, marginLeft: 12, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, padding: '6px 10px', background: 'var(--brand-frost)', borderRadius: 8, width: 'fit-content' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--brand-core)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand-core)', letterSpacing: '0.05em' }}>Portal Único Siscomex · TEC/NCM</span>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>Tributos na Importação</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'II — Imposto de Importação',       val: item.ii != null ? `${item.ii}%` : 'Consultar', sub: 'Base: TEC/CAMEX',  color: item.ii === 0 ? 'var(--green)' : 'var(--brand-sky)' },
            { label: 'IPI — Imp. Prod. Industrializado', val: 'Variável',                                    sub: 'Consultar TIPI',   color: 'var(--text-3)' },
            { label: 'PIS/Importação',                   val: `${pis}%`,                                     sub: 'Lei 10.865/2004', color: 'var(--brand-core)' },
            { label: 'COFINS/Importação',                val: `${cofins}%`,                                  sub: 'Lei 10.865/2004', color: 'var(--brand-core)' },
          ].map(t => (
            <div key={t.label} style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 6 }}>{t.label}</div>
              <div style={{ fontFamily: 'DM Mono', fontSize: 22, fontWeight: 500, color: t.color }}>{t.val}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 3 }}>{t.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 2 }}>Capítulo NCM</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Capítulo {cap}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 2 }}>PIS + COFINS</div>
            <div style={{ fontFamily: 'DM Mono', fontSize: 16, color: 'var(--brand-core)' }}>{pis + cofins}%</div>
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.6, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, padding: '10px 14px', margin: 0, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          <span>Alíquotas do II são referências pela TEC/CAMEX por capítulo. Para valores exatos, ex-tarifários e acordos comerciais (MERCOSUL, ALADI) consulte o{' '}
            <a href="https://portalunico.siscomex.gov.br/classif/?perfil=publico" target="_blank" rel="noopener" style={{ color: 'var(--brand-sky)' }}>Sistema Classif</a>.
          </span>
        </p>
      </div>
    </div>
  )
}

/* ── Main page ──────────────────────────── */
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

  return (
    <>
      {selected && <NcmDetailPanel item={selected} onClose={() => setSelected(null)} />}

      <section className="sec" style={{ background: 'var(--bg-alt)', minHeight: '80vh' }}>
        <div className="wrap">
          <div className="sec-eye">NCM — Nomenclatura Comum do Mercosul</div>
          <h1 className="sec-h">Consulta <span>NCM</span></h1>
          <p className="sec-p">Pesquise códigos NCM com alíquotas de II, IPI, PIS e COFINS via Portal Único Siscomex.</p>

          {/* Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 36, boxShadow: 'var(--sh)', marginTop: 8 }}>

            <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 24, lineHeight: 1.7 }}>
              Pesquise por <strong style={{ color: 'var(--text)' }}>código NCM</strong> (ex:{' '}
              <code style={{ fontFamily: 'DM Mono', fontSize: 12, background: 'var(--surface)', padding: '1px 5px', borderRadius: 4 }}>8471.30</code>) ou por{' '}
              <strong style={{ color: 'var(--text)' }}>descrição da mercadoria</strong> (ex:{' '}
              <code style={{ fontFamily: 'DM Mono', fontSize: 12, background: 'var(--surface)', padding: '1px 5px', borderRadius: 4 }}>computador portátil</code>).
              Dados via <strong style={{ color: 'var(--brand-sky)' }}>Portal Único Siscomex</strong>.
            </p>

            {/* Search bar */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  value={query}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  placeholder="Código NCM (ex: 8471.30) ou descrição (ex: smartphone)"
                  style={{
                    width: '100%', padding: '13px 16px 13px 42px',
                    border: '1.5px solid var(--border)', borderRadius: 10,
                    background: 'var(--input-bg)', fontFamily: 'Plus Jakarta Sans',
                    fontSize: 14, color: 'var(--text)', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--brand-core)')}
                  onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>
              <button
                onClick={() => { if (debounceRef.current) clearTimeout(debounceRef.current); search(query) }}
                style={{
                  padding: '0 24px', borderRadius: 10, background: 'var(--brand-core)',
                  border: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700,
                  color: 'white', cursor: 'pointer', whiteSpace: 'nowrap',
                  boxShadow: '0 4px 16px rgba(21,101,192,0.3)',
                }}>
                Consultar
              </button>
            </div>

            {/* Suggestion chips */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              {['smartphone','calçados','soja','automóvel','8471','6109','0901','8517','3004'].map(s => (
                <button key={s} onClick={() => { setQuery(s); search(s) }} style={{
                  padding: '4px 12px', borderRadius: 100,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600,
                  color: 'var(--text-3)', cursor: 'pointer', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'var(--brand-core)'; el.style.color = 'var(--brand-core)' }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-3)' }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Info chips */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
              {[
                { svg: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>, label: 'Portal Único Siscomex' },
                { svg: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>, label: 'TEC/CAMEX' },
                { svg: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>, label: 'Cache 24h' },
              ].map(c => (
                <span key={c.label} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 100, background: 'var(--brand-frost)', color: 'var(--brand-core)', border: '1px solid var(--brand-pale)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  {c.svg}{c.label}
                </span>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--brand-sky)" strokeWidth="2" strokeLinecap="round"
                  style={{ animation: 'spin 0.8s linear infinite', display: 'block', margin: '0 auto 12px' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <div style={{ fontSize: 14 }}>Consultando Portal Único Siscomex…</div>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '20px 24px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--red)', marginBottom: 4 }}>Erro ao consultar a API</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 10 }}>{error}</div>
                  <a href="https://portalunico.siscomex.gov.br/classif/?perfil=publico" target="_blank" rel="noopener" style={{ fontSize: 12, color: 'var(--brand-sky)' }}>
                    Acessar Sistema Classif diretamente →
                  </a>
                </div>
              </div>
            )}

            {/* No results */}
            {!loading && !error && searched && results.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gray-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 12px' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/></svg>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Nenhum resultado encontrado</div>
                <p style={{ fontSize: 13 }}>Tente outros termos ou consulte o <a href="https://portalunico.siscomex.gov.br/classif/?perfil=publico" target="_blank" rel="noopener" style={{ color: 'var(--brand-sky)' }}>Sistema Classif</a> diretamente.</p>
              </div>
            )}

            {/* Results */}
            {!loading && !error && results.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
                  {results.length} resultado{results.length !== 1 ? 's' : ''} · clique para ver tributos
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {results.map(item => (
                    <div
                      key={item.codigo}
                      onClick={() => setSelected(item)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-alt)', transition: 'all 0.15s' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--brand-core)'; el.style.background = 'var(--brand-frost)' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--border)'; el.style.background = 'var(--bg-alt)' }}
                    >
                      <span style={{ fontFamily: 'DM Mono', fontSize: 13, fontWeight: 500, color: 'var(--brand-core)', flexShrink: 0, minWidth: 88 }}>{item.codigo}</span>
                      <span style={{ fontSize: 13, color: 'var(--text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.descricao}</span>
                      <IIBadge ii={item.ii} />
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  ))}
                </div>
                {results.length >= 80 && (
                  <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 12, textAlign: 'center' }}>
                    Exibindo os primeiros 80 resultados. Refine a busca para resultados mais precisos.
                  </p>
                )}
              </div>
            )}

            {/* Initial state */}
            {!loading && !error && !searched && (
              <div style={{ textAlign: 'center', padding: '40px 0 20px', color: 'var(--text-3)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-2)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 16px' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/><path d="M11 8v6"/></svg>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Consulte a tabela NCM oficial</div>
                <p style={{ fontSize: 13, maxWidth: 400, margin: '0 auto', lineHeight: 1.7 }}>
                  Digite o código NCM ou uma palavra-chave acima. Os dados são carregados diretamente do Portal Único Siscomex.
                </p>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  )
}
