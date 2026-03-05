'use client'

import { useEffect, useState } from 'react'
import styles from './Topbar.module.css'

interface RateData {
  usd: string
  chg: string
  isUp: boolean
  time: string
}

export function Topbar() {
  const [rate, setRate] = useState<RateData>({ usd: '—', chg: '—', isUp: true, time: '' })

  useEffect(() => {
    async function fetchRate() {
      try {
        const today = new Date()
        const pad = (n: number) => String(n).padStart(2, '0')
        const fmt = (d: Date) =>
          `${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${d.getFullYear()}`

        const past = new Date(today)
        past.setDate(past.getDate() - 5)

        const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@di,dataFinalCotacao=@df)?@di='${fmt(past)}'&@df='${fmt(today)}'&$orderby=dataHoraCotacao%20desc&$top=2&$format=json&$select=cotacaoVenda,dataHoraCotacao`
        const res = await fetch(url)
        const data = await res.json()
        const rows = data.value || []
        if (rows.length >= 1) {
          const last = rows[0].cotacaoVenda
          const prev = rows[1]?.cotacaoVenda
          const diff = prev ? ((last - prev) / prev) * 100 : 0
          const time = rows[0].dataHoraCotacao.slice(11, 16)
          setRate({
            usd: `R$ ${last.toFixed(4).replace('.', ',')}`,
            chg: `${diff >= 0 ? '▲' : '▼'} ${Math.abs(diff).toFixed(2)}%`,
            isUp: diff >= 0,
            time,
          })
        }
      } catch {}
    }
    fetchRate()
    const interval = setInterval(fetchRate, 300_000) // every 5 min
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.topbar}>
      <div className={styles.left}>
        <span className={styles.item}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          Seg–Sex 08:00–18:00
        </span>
        <span className={styles.sep} />
        <span className={styles.item}>
          <a href="mailto:contato@indaia.com.br">contato@indaia.com.br</a>
        </span>
        <span className={styles.sep} />
        <span className={styles.item}>
          <a href="tel:+551332898000">+55 13 3289-8000</a>
        </span>
      </div>

      <div className={styles.right}>
        <span className={styles.rateLabel}>USD / BRL</span>
        <span className={styles.rateVal}>{rate.usd}</span>
        <span
          className={styles.rateChg}
          style={{ color: rate.isUp ? 'var(--green)' : 'var(--red)' }}
        >
          {rate.chg}
        </span>
        {rate.time && (
          <>
            <span className={styles.sep} />
            <span className={styles.item}>BCB PTAX · {rate.time}</span>
          </>
        )}
      </div>
    </div>
  )
}
