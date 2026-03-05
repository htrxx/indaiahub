'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './Hero.module.css'
import { HeroHUD } from './HeroHUD'

const PHRASES = [
  <>Despacho aduaneiro e logística para <strong>importação e exportação</strong> — do DI ao desembaraço com transparência total.</>,
  <>Gerenciamos seus embarques de <strong>exportação</strong>: DUE, Registro de Exportação e logística door-to-door internacional.</>,
  <>Do licenciamento à entrega: <strong>importações</strong> com rastreamento em tempo real e consultoria fiscal especializada.</>,
  <>Drawback, OEA e regimes especiais para <strong>reduzir custos</strong> nas suas operações de comércio exterior.</>,
  <>58 anos conectando empresas ao mundo — <strong>importação e exportação</strong> com expertise que gera resultado.</>,
]

interface RateData { usd: string; eur: string; chg: string; isUp: boolean; time: string }

export function Hero() {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [rate, setRate] = useState<RateData>({ usd: 'R$ —', eur: 'R$ —', chg: '—', isUp: true, time: '—' })

  useEffect(() => {
    const id = setInterval(() => setPhraseIdx(p => (p + 1) % PHRASES.length), 3800)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    async function fetch_() {
      try {
        const pad = (n: number) => String(n).padStart(2, '0')
        const today = new Date()
        const past = new Date(today); past.setDate(past.getDate() - 7)
        const fmt = (d: Date) => `${pad(d.getMonth()+1)}-${pad(d.getDate())}-${d.getFullYear()}`

        const [usdRes, eurRes] = await Promise.allSettled([
          fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${fmt(past)}'&@dataFinalCotacao='${fmt(today)}'&$orderby=dataHoraCotacao%20desc&$top=2&$format=json&$select=cotacaoVenda,dataHoraCotacao`).then(r => r.json()),
          fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='EUR'&@dataInicial='${fmt(past)}'&@dataFinalCotacao='${fmt(today)}'&$orderby=dataHoraCotacao%20desc&$top=1&$format=json&$select=cotacaoVenda`).then(r => r.json()),
        ])

        let usd = 5.87, eur = 6.35, chg = 0, time = ''
        if (usdRes.status === 'fulfilled') {
          const rows = usdRes.value.value || []
          if (rows.length >= 1) { usd = rows[0].cotacaoVenda; time = rows[0].dataHoraCotacao.slice(11,16) }
          if (rows.length >= 2) { chg = ((rows[0].cotacaoVenda - rows[1].cotacaoVenda) / rows[1].cotacaoVenda) * 100 }
        }
        if (eurRes.status === 'fulfilled') {
          const rows = eurRes.value.value || []
          if (rows.length) eur = rows[0].cotacaoVenda
        }

        setRate({
          usd: `R$ ${usd.toFixed(4).replace('.', ',')}`,
          eur: `R$ ${eur.toFixed(4).replace('.', ',')}`,
          chg: `${chg >= 0 ? '▲' : '▼'} ${Math.abs(chg).toFixed(2)}%`,
          isUp: chg >= 0,
          time,
        })
      } catch {}
    }
    fetch_()
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.bg} />
      <div className={styles.grid} />
      <div className={styles.lines}>
        {[20, 40, 60, 80].map(t => <div key={t} className={styles.line} style={{ top: `${t}%` }} />)}
      </div>

      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgePip} />
          Despachante Aduaneiro — Santos, SP · 58 anos
        </div>

        <h1 className={styles.title}>
          A extensão do seu<br />
          departamento de <span className={styles.hl}>COMEX</span>
        </h1>

        <div className={styles.subWrap}>
          <p className={styles.sub}>{PHRASES[phraseIdx]}</p>
        </div>

        <div className={styles.ctas}>
          <Link href="/contato" className={styles.btnPrimary}>
            Solicitar Cotação
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <a href="https://www.myindaiaweb.com.br" target="_blank" rel="noopener" className={styles.btnGhost}>
            Acessar Portal
          </a>
        </div>

        {/* Live rates strip */}
        <div className={styles.livePill}>
          <div>
            <div className={styles.liveLabel}>USD / BRL</div>
            <div className={styles.liveVal}>{rate.usd}</div>
          </div>
          <div className={styles.liveSep} />
          <div>
            <div className={styles.liveLabel}>EUR / BRL</div>
            <div className={styles.liveVal}>{rate.eur}</div>
          </div>
          <div className={styles.liveSep} />
          <div>
            <div className={styles.liveLabel}>Variação USD</div>
            <div className={styles.liveChg} style={{ color: rate.isUp ? 'var(--green)' : 'var(--red)' }}>
              {rate.chg}
            </div>
          </div>
          <div className={styles.liveSep} />
          <div>
            <div className={styles.liveLabel} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span className={styles.liveDot} />
              Ao vivo
            </div>
            <div className={styles.liveTime}>{rate.time}</div>
          </div>
        </div>
      </div>

      {/* New CTA HUD */}
      <div className={styles.hudWrapper}>
        <HeroHUD usd={rate.usd} />
      </div>
    </section>
  )
}
