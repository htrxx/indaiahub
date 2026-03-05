'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const NAV_ITEMS = [
  {
    label: 'Serviços',
    href: '/servicos',
    mega: true,
    cols: [
      {
        title: 'Importação',
        items: [
          { icon: '📦', label: 'Gerenciamento de Processos', sub: 'DI, LI, parametrização', href: '/servicos#gerenciamento' },
          { icon: '🏛️', label: 'Desembaraço Aduaneiro', sub: 'Todos os portos do Brasil', href: '/servicos#desembaraco' },
          { icon: '⚖️', label: 'Drawback & OEA', sub: 'Regimes especiais', href: '/servicos#drawback' },
        ],
      },
      {
        title: 'Exportação & Logística',
        items: [
          { icon: '🌐', label: 'Logística Internacional', sub: 'Door-to-door, agenciamento', href: '/servicos#logistica' },
          { icon: '🚛', label: 'Transportation Management', sub: 'Transporte nacional', href: '/servicos#transporte' },
          { icon: '📋', label: 'Habilitação RADAR', sub: 'Receita Federal', href: '/servicos#radar' },
        ],
      },
    ],
  },
  {
    label: 'Ferramentas',
    href: '/ferramentas',
    items: [
      { icon: '🧮', label: 'Simulador de DI', sub: 'Calcule impostos de importação', href: '/ferramentas#simulador' },
      { icon: '📑', label: 'Comparador Incoterms', sub: 'FOB, CIF, EXW e mais', href: '/ferramentas#incoterms' },
      { icon: '✅', label: 'Checklist Documental', sub: 'Importação e exportação', href: '/ferramentas#checklist' },
      { icon: '🔍', label: 'Consulta NCM', sub: 'Alíquotas e tributação', href: '/ferramentas#ncm' },
    ],
  },
  {
    label: 'Cotações',
    href: '/cotacoes',
    items: [
      { icon: '💱', label: 'Câmbio ao Vivo', sub: 'USD, EUR, CNY — BCB PTAX', href: '/cotacoes#cambio' },
      { icon: '📅', label: 'Tabela PTAX Mensal', sub: 'Histórico do Banco Central', href: '/cotacoes#ptax' },
      { icon: '⚓', label: 'Status dos Portos', sub: 'Condições meteorológicas', href: '/cotacoes#portos' },
    ],
  },
  { label: 'Notícias', href: '/noticias' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const toggleMobile = useCallback(() => setMobileOpen(p => !p), [])

  return (
    <nav className={styles.nav}>
      {/* Logo */}
      <Link href="/" className={styles.logo}>
        <span className={styles.logoText}>
          IND<span className={styles.logoAccent}>AIA</span>
        </span>
        <span className={styles.logoTag}>
          Despacho<br />Aduaneiro
        </span>
      </Link>

      <div className={styles.div} />

      {/* Desktop nav */}
      <ul className={styles.links}>
        {NAV_ITEMS.map(item => (
          <li
            key={item.label}
            className={styles.navItem}
            onMouseEnter={() => setActiveMenu(item.label)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            {item.items || item.cols ? (
              <>
                <button className={styles.navBtn}>
                  {item.label}
                  <svg className={styles.caret} width="8" height="5" viewBox="0 0 8 5" fill="none">
                    <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Mega dropdown */}
                <div className={`${styles.dropdown} ${item.mega ? styles.mega : ''} ${activeMenu === item.label ? styles.open : ''}`}>
                  {item.mega && item.cols ? (
                    <div className={styles.megaCols}>
                      {item.cols.map(col => (
                        <div key={col.title}>
                          <div className={styles.colTitle}>{col.title}</div>
                          {col.items.map(dd => (
                            <Link key={dd.label} href={dd.href} className={styles.ddItem}>
                              <div className={styles.ddIcon}>{dd.icon}</div>
                              <div>
                                <div className={styles.ddLabel}>{dd.label}</div>
                                <div className={styles.ddSub}>{dd.sub}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    item.items?.map(dd => (
                      <Link key={dd.label} href={dd.href} className={styles.ddItem}>
                        <div className={styles.ddIcon}>{dd.icon}</div>
                        <div>
                          <div className={styles.ddLabel}>{dd.label}</div>
                          <div className={styles.ddSub}>{dd.sub}</div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </>
            ) : (
              <Link href={item.href} className={styles.navLink}>{item.label}</Link>
            )}
          </li>
        ))}
      </ul>

      {/* Right controls */}
      <div className={styles.right}>
        <ThemeToggle />

        {/* Cliente area dropdown */}
        <div
          className={styles.navItem}
          onMouseEnter={() => setActiveMenu('cliente')}
          onMouseLeave={() => setActiveMenu(null)}
          style={{ position: 'relative' }}
        >
          <button className={styles.btnGhost}>Área do Cliente ▾</button>
          <div className={`${styles.dropdown} ${styles.clientDd} ${activeMenu === 'cliente' ? styles.open : ''}`}>
            <div className={styles.clientHead}>
              <span style={{ fontSize: 20 }}>🔐</span>
              <div>
                <div className={styles.clientHeadTitle}>Área do Cliente INDAIA</div>
                <div className={styles.clientHeadSub}>Selecione a plataforma de acesso</div>
              </div>
            </div>
            {[
              { badge: 'MY', cls: styles.clBlue, label: 'MyINDAIA Web', sub: 'Portal de processos e documentos', href: 'https://www.myindaiaweb.com.br/autentica.asp' },
              { badge: 'PBI', cls: styles.clYellow, label: 'Power BI — Dashboards', sub: 'Indicadores e relatórios gerenciais', href: 'https://app.powerbi.com' },
              { badge: '📱', cls: styles.clGreen, label: 'App Mobile', sub: 'iOS e Android', href: 'https://app.myindaia.com.br/' },
            ].map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener" className={styles.clientLink}>
                <div className={`${styles.clientBadge} ${link.cls}`}>{link.badge}</div>
                <div>
                  <div className={styles.clientLinkLabel}>{link.label}</div>
                  <div className={styles.clientLinkSub}>{link.sub}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <Link href="/contato" className={styles.btnFill}>Solicitar Cotação</Link>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={toggleMobile}
          aria-label="Menu"
        >
          <span className={mobileOpen ? styles.barOpen1 : styles.bar} />
          <span className={mobileOpen ? styles.barOpen2 : styles.bar} />
          <span className={mobileOpen ? styles.barOpen3 : styles.bar} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className={styles.mobileSep} />
          <a href="https://www.myindaiaweb.com.br" target="_blank" rel="noopener" className={styles.mobileLink}>
            MyINDAIA Web →
          </a>
          <Link href="/contato" className={styles.mobileCta} onClick={() => setMobileOpen(false)}>
            Solicitar Cotação
          </Link>
        </div>
      )}
    </nav>
  )
}
