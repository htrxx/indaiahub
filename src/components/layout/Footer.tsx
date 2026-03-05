import Link from 'next/link'
import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        {/* Top */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              IND<span>AIA</span>
            </div>
            <p className={styles.tagline}>
              Despacho Aduaneiro & Comércio Exterior<br />
              Santos, SP — desde 1966
            </p>
            <div className={styles.socials}>
              {[
                { href: 'https://linkedin.com', label: 'LinkedIn', icon: '💼' },
                { href: 'https://instagram.com', label: 'Instagram', icon: '📸' },
                { href: 'https://wa.me/551332898000', label: 'WhatsApp', icon: '💬' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener" className={styles.socialLink} aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className={styles.cols}>
            <div className={styles.col}>
              <div className={styles.colTitle}>Serviços</div>
              {['Gerenciamento de Processos', 'Desembaraço Aduaneiro', 'Logística Internacional', 'Transportation Management', 'Drawback & OEA', 'Habilitação RADAR'].map(s => (
                <Link key={s} href="/servicos" className={styles.colLink}>{s}</Link>
              ))}
            </div>

            <div className={styles.col}>
              <div className={styles.colTitle}>Ferramentas</div>
              {[
                ['Simulador de DI', '/ferramentas#simulador'],
                ['Comparador Incoterms', '/ferramentas#incoterms'],
                ['Checklist Documental', '/ferramentas#checklist'],
                ['Consulta NCM', '/ferramentas#ncm'],
                ['Cotações PTAX', '/cotacoes'],
                ['Status dos Portos', '/cotacoes#portos'],
              ].map(([label, href]) => (
                <Link key={label} href={href} className={styles.colLink}>{label}</Link>
              ))}
            </div>

            <div className={styles.col}>
              <div className={styles.colTitle}>Empresa</div>
              {[
                ['Quem Somos', '/sobre'],
                ['Notícias COMEX', '/noticias'],
                ['Área do Cliente', 'https://www.myindaiaweb.com.br'],
                ['Power BI', 'https://app.powerbi.com'],
                ['App Mobile', 'https://app.myindaia.com.br'],
                ['Contato', '/contato'],
              ].map(([label, href]) => (
                <a key={label} href={href} className={styles.colLink} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener">{label}</a>
              ))}
            </div>

            <div className={styles.col}>
              <div className={styles.colTitle}>Contato</div>
              <div className={styles.contactItem}>
                <span>📍</span>
                <span>Rua XV de Novembro, 195<br />Centro — Santos, SP<br />CEP 11010-151</span>
              </div>
              <div className={styles.contactItem}>
                <span>📞</span>
                <a href="tel:+551332898000">+55 13 3289-8000</a>
              </div>
              <div className={styles.contactItem}>
                <span>✉️</span>
                <a href="mailto:contato@indaia.com.br">contato@indaia.com.br</a>
              </div>
              <div className={styles.contactItem}>
                <span>🕐</span>
                <span>Seg–Sex 08:00–18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <span>© {year} INDAIA Assessoria em Comércio Exterior Ltda. CNPJ 00.000.000/0001-00</span>
          <div className={styles.bottomLinks}>
            <a href="#">Política de Privacidade</a>
            <a href="#">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
