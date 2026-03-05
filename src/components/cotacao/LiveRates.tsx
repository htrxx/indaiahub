'use client'

import { useEffect, useState } from 'react'
import { LOCATIONS } from '@/lib/constants'

interface Rate { val: string; chg: string; isUp: boolean; bars: number[] }

function wmoStatus(code: number, wind: number, vis: number, type: 'port' | 'airport') {
  const isStorm = code >= 95
  const isRain = code >= 51 && code <= 82
  const isFog = code >= 45 && code <= 48
  const wKt = wind / 1.852
  const visKm = (vis / 1000).toFixed(1)
  const wStr = `${wind.toFixed(0)} km/h`

  if (type === 'airport') {
    if (isStorm || wKt > 40 || vis < 800) return { dot: 'bad', label: 'Condições adversas (IFR)', tip: `${isStorm ? 'Tempestade' : 'Vento/Vis.'} · ${wStr} · vis ${visKm}km` }
    if (isRain || isFog || wKt > 25 || vis < 5000) return { dot: 'warn', label: 'Condições MVFR', tip: `${isRain ? 'Chuva' : isFog ? 'Neblina' : 'Vento'} · ${wStr}` }
    return { dot: 'ok', label: 'Condições VFR normais', tip: `Tempo bom · ${wStr}` }
  } else {
    if (isStorm || wind > 55) return { dot: 'bad', label: 'Operação suspensa', tip: `${isStorm ? 'Tempestade' : 'Ventos'} · ${wStr}` }
    if (isRain || isFog || wind > 35 || vis < 1000) return { dot: 'warn', label: 'Operação com restrição', tip: `${isRain ? 'Chuva' : isFog ? 'Neblina' : 'Vento'} · ${wStr}` }
    return { dot: 'ok', label: 'Operando normalmente', tip: `Favorável · ${wStr}` }
  }
}

interface PortStatus { id: string; name: string; type: string; dot: string; label: string; tip: string }

export function LiveRates() {
  const [rates, setRates] = useState<Record<string, Rate>>({
    USD: { val: '—', chg: '—', isUp: true, bars: [60, 65, 58, 72, 68, 75, 70] },
    EUR: { val: '—', chg: '—', isUp: true, bars: [55, 60, 62, 58, 65, 63, 68] },
    CNY: { val: '—', chg: '—', isUp: false, bars: [40, 42, 38, 45, 43, 41, 44] },
  })
  const [ports, setPorts] = useState<PortStatus[]>([])
  const [portsTime, setPortsTime] = useState('')
  const [rateSrc, setRateSrc] = useState('')

  useEffect(() => {
    async function fetchRates() {
      try {
        const pad = (n: number) => String(n).padStart(2, '0')
        const today = new Date()
        const past = new Date(today); past.setDate(past.getDate() - 10)
        const fmt = (d: Date) => `${pad(d.getMonth()+1)}-${pad(d.getDate())}-${d.getFullYear()}`

        const [usdData, eurData, cnyData] = await Promise.allSettled([
          fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${fmt(past)}'&@dataFinalCotacao='${fmt(today)}'&$orderby=dataHoraCotacao%20desc&$top=8&$format=json&$select=cotacaoVenda,dataHoraCotacao`).then(r => r.json()),
          fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='EUR'&@dataInicial='${fmt(past)}'&@dataFinalCotacao='${fmt(today)}'&$orderby=dataHoraCotacao%20desc&$top=8&$format=json&$select=cotacaoVenda`).then(r => r.json()),
          fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='CNY'&@dataInicial='${fmt(past)}'&@dataFinalCotacao='${fmt(today)}'&$orderby=dataHoraCotacao%20desc&$top=8&$format=json&$select=cotacaoVenda`).then(r => r.json()),
        ])

        const processRows = (data: { value: { cotacaoVenda: number }[] }) => {
       const rows = data.value || []
        if (!rows.length) return null
        const last = rows[0].cotacaoVenda
          const prev = rows[1]?.cotacaoVenda
          const chg = prev ? ((last - prev) / prev) * 100 : 0
          const bars = rows.slice(0, 7).reverse().map(r => Math.round((r.cotacaoVenda / last) * 70))
          return { val: `R$ ${last.toFixed(4).replace('.', ',')}`, chg: `${chg >= 0 ? '▲' : '▼'} ${Math.abs(chg).toFixed(2)}%`, isUp: chg >= 0, bars }
        }

        const newRates = { ...rates }
        if (usdData.status === 'fulfilled') { const r = processRows(usdData.value); if (r) newRates.USD = r }
        if (eurData.status === 'fulfilled') { const r = processRows(eurData.value); if (r) newRates.EUR = r }
        if (cnyData.status === 'fulfilled') { const r = processRows(cnyData.value); if (r) newRates.CNY = r }
        setRates(newRates)
        setRateSrc('BCB PTAX')
      } catch {}
    }

    async function fetchPorts() {
      const results = await Promise.allSettled(LOCATIONS.map(loc =>
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=weather_code,wind_speed_10m,wind_gusts_10m,visibility&wind_speed_unit=kmh&timezone=America%2FSao_Paulo`).then(r => r.json())
      ))

      const statuses: PortStatus[] = results.map((res, i) => {
        const loc = LOCATIONS[i]
        if (res.status === 'fulfilled') {
          const c = res.value.current
          const st = wmoStatus(c.weather_code, c.wind_speed_10m, c.visibility ?? 10000, loc.type)
          return { id: loc.id, name: loc.name, type: loc.type, ...st }
        }
        return { id: loc.id, name: loc.name, type: loc.type, dot: 'loading', label: 'Sem dados', tip: 'API indisponível' }
      })

      setPorts(statuses)
      setPortsTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    }

    fetchRates()
    fetchPorts()
    const iv1 = setInterval(fetchRates, 300_000)
    const iv2 = setInterval(fetchPorts, 600_000)
    return () => { clearInterval(iv1); clearInterval(iv2) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const CURRENCIES = [
    { code: 'USD', flag: '🇺🇸', name: 'Dólar Comercial', label: 'por USD 1,00' },
    { code: 'EUR', flag: '🇪🇺', name: 'Euro', label: 'por EUR 1,00' },
    { code: 'CNY', flag: '🇨🇳', name: 'Yuan Renminbi', label: 'por CNY 1,00' },
  ]

  const dotColor: Record<string, string> = { ok: 'var(--green)', warn: 'var(--yellow)', bad: 'var(--red)', loading: 'var(--gray-2)' }

  return (
    <section style={{ background: 'var(--brand-deep)', padding: '80px 48px' }} id="cotacoes">
      <div className="wrap">
        <div className="sec-eye" style={{ color: 'var(--brand-sky)' }}>
          <span style={{ background: 'var(--brand-sky)' }} />
          Câmbio ao Vivo &nbsp;
          <span style={{ fontSize: 9, letterSpacing: '0.08em', fontWeight: 600, color: 'rgba(66,165,245,0.6)' }}>{rateSrc}</span>
        </div>
        <h2 className="sec-h" style={{ color: 'white' }}>
          Taxas em <span style={{ color: 'var(--brand-sky)' }}>tempo real</span>
        </h2>
        <p className="sec-p" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Acompanhe dólar, euro e yuan para planejar suas importações com precisão.
        </p>

        {/* Rate cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 48 }}>
          {CURRENCIES.map(c => {
            const r = rates[c.code]
            return (
              <div key={c.code} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: 24,
                transition: 'border-color 0.2s, background 0.2s',
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(66,165,245,0.2)'; el.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.background = 'rgba(255,255,255,0.04)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{c.name}</div>
                  <div style={{ fontSize: 18 }}>{c.flag}</div>
                </div>
                <div style={{ fontFamily: 'DM Mono', fontSize: 34, fontWeight: 500, color: 'white', letterSpacing: '-0.02em' }}>{r.val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{c.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 12, color: r.isUp ? 'var(--green)' : 'var(--red)' }}>{r.chg}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 28, marginTop: 14 }}>
                  {r.bars.map((h, i) => (
                    <div key={i} style={{
                      flex: 1, borderRadius: '2px 2px 0 0',
                      background: i === r.bars.length - 1 ? 'var(--brand-sky)' : 'rgba(66,165,245,0.2)',
                      height: `${h}%`, transition: 'height 0.6s ease',
                    }} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Ports status */}
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
              Status Portos & Aeroportos
            </div>
            {portsTime && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                Atualizado {portsTime} · Open-Meteo
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {ports.length === 0 ? (
              LOCATIONS.map(loc => (
                <div key={loc.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gray-2)' }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                      {loc.type === 'port' ? '⚓' : '✈'} {loc.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Carregando…</div>
                  </div>
                </div>
              ))
            ) : (
              ports.map(p => (
                <div key={p.id} title={p.tip} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor[p.dot] ?? 'var(--gray-2)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                      {p.type === 'port' ? '⚓' : '✈'} {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{p.label}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
