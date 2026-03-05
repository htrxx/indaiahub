// ═══════════════════════════════════════════════
// INDAIA PORTAL — Static Data Constants
// ═══════════════════════════════════════════════

// ── Services ──────────────────────────────────
export const SERVICES = [
  {
    icon: '📦',
    name: 'Gerenciamento de Processos',
    desc: 'Gestão completa dos pedidos de importação e embarques de exportação com visibilidade em tempo real.',
    href: '#gerenciamento',
  },
  {
    icon: '🏛️',
    name: 'Desembaraço Aduaneiro',
    desc: '58 anos de experiência no desembaraço de grandes empresas em todos os portos e aeroportos do Brasil.',
    href: '#desembaraco',
  },
  {
    icon: '🌐',
    name: 'Logística Internacional',
    desc: 'Agenciamento de cargas, door-to-door internacional, transporte e coletas nacionais.',
    href: '#logistica',
  },
  {
    icon: '🚛',
    name: 'Transportation Management',
    desc: 'Time dedicado ao gerenciamento de transporte e logística de entrada e saída das operações.',
    href: '#transporte',
  },
  {
    icon: '⚖️',
    name: 'Drawback & OEA',
    desc: 'Consultoria em regimes especiais, gestão de drawback e suporte aos processos de OEA dos clientes.',
    href: '#drawback',
  },
  {
    icon: '📋',
    name: 'Habilitação RADAR',
    desc: 'Habilitação de pessoa física e jurídica junto à Receita Federal para iniciar importações e exportações.',
    href: '#radar',
  },
]

// ── Stats ──────────────────────────────────────
export const STATS = [
  { value: 18,  suffix: 'K+',   label: 'Processos ao ano' },
  { value: 58,  suffix: 'anos', label: 'De experiência em COMEX' },
  { value: 340, suffix: '+',    label: 'Clientes ativos' },
  { value: 99,  suffix: '%',    label: 'Taxa de aprovação DI' },
]

// ── Ports & Airports ──────────────────────────
export const LOCATIONS = [
  { id: 'santos',    name: 'Porto de Santos',   type: 'port' as const,    lat: -23.9535, lon: -46.3340 },
  { id: 'paranagua', name: 'Porto de Paranaguá', type: 'port' as const,    lat: -25.5016, lon: -48.5204 },
  { id: 'itajai',    name: 'Porto de Itajaí',   type: 'port' as const,    lat: -26.9078, lon: -48.6614 },
  { id: 'gru',       name: 'GRU — Cumbica',     type: 'airport' as const, lat: -23.4356, lon: -46.4731 },
  { id: 'gig',       name: 'GIG — Galeão',      type: 'airport' as const, lat: -22.8099, lon: -43.2505 },
  { id: 'vcp',       name: 'VCP — Viracopos',   type: 'airport' as const, lat: -23.0074, lon: -47.1345 },
]

// ── Incoterms ──────────────────────────────────
export interface IncoResp {
  icon: string
  name: string
  who: 'buy' | 'sel'
}

export interface IncoData {
  desc: string
  resp: IncoResp[]
}

export const INCOTERMS: Record<string, IncoData> = {
  FOB: {
    desc: 'Vendedor entrega a mercadoria no porto de embarque. Frete e seguro internacional por conta do comprador.',
    resp: [
      { icon: '📦', name: 'Embalagem e carga', who: 'sel' },
      { icon: '🚚', name: 'Transporte interno (origem)', who: 'sel' },
      { icon: '📋', name: 'Despacho de exportação', who: 'sel' },
      { icon: '🚢', name: 'Frete marítimo/aéreo', who: 'buy' },
      { icon: '🛡️', name: 'Seguro internacional', who: 'buy' },
      { icon: '🏛️', name: 'Despacho de importação', who: 'buy' },
    ],
  },
  CIF: {
    desc: 'Vendedor paga o frete e seguro até o porto de destino. Comprador assume a partir do desembarque.',
    resp: [
      { icon: '📦', name: 'Embalagem e carga', who: 'sel' },
      { icon: '🚚', name: 'Transporte interno (origem)', who: 'sel' },
      { icon: '📋', name: 'Despacho de exportação', who: 'sel' },
      { icon: '🚢', name: 'Frete marítimo/aéreo', who: 'sel' },
      { icon: '🛡️', name: 'Seguro internacional', who: 'sel' },
      { icon: '🏛️', name: 'Despacho de importação', who: 'buy' },
    ],
  },
  EXW: {
    desc: 'Mínima responsabilidade do vendedor. Comprador assume todos os custos e riscos a partir da fábrica.',
    resp: [
      { icon: '📦', name: 'Embalagem', who: 'sel' },
      { icon: '🚚', name: 'Transporte interno (origem)', who: 'buy' },
      { icon: '📋', name: 'Despacho de exportação', who: 'buy' },
      { icon: '🚢', name: 'Frete principal', who: 'buy' },
      { icon: '🛡️', name: 'Seguro', who: 'buy' },
      { icon: '🏛️', name: 'Despacho de importação', who: 'buy' },
    ],
  },
  DDP: {
    desc: 'Máxima responsabilidade do vendedor. Entrega no destino final com impostos e desembaraço pagos.',
    resp: [
      { icon: '📦', name: 'Embalagem', who: 'sel' },
      { icon: '🚚', name: 'Transporte total', who: 'sel' },
      { icon: '📋', name: 'Despacho de exportação', who: 'sel' },
      { icon: '🚢', name: 'Frete principal', who: 'sel' },
      { icon: '🛡️', name: 'Seguro', who: 'sel' },
      { icon: '🏛️', name: 'Despacho de importação + impostos', who: 'sel' },
    ],
  },
  CFR: {
    desc: 'Vendedor paga o frete, mas não o seguro. Risco transfere-se no embarque.',
    resp: [
      { icon: '📦', name: 'Embalagem', who: 'sel' },
      { icon: '🚢', name: 'Frete marítimo', who: 'sel' },
      { icon: '🛡️', name: 'Seguro', who: 'buy' },
      { icon: '📋', name: 'Despacho exportação', who: 'sel' },
      { icon: '🏛️', name: 'Despacho importação', who: 'buy' },
    ],
  },
  DAP: {
    desc: 'Entregue no local acordado no destino, sem desembaraço de importação.',
    resp: [
      { icon: '📦', name: 'Embalagem', who: 'sel' },
      { icon: '🚢', name: 'Frete até destino', who: 'sel' },
      { icon: '🛡️', name: 'Seguro', who: 'sel' },
      { icon: '📋', name: 'Despacho exportação', who: 'sel' },
      { icon: '🏛️', name: 'Desembaraço importação', who: 'buy' },
    ],
  },
  FCA: {
    desc: 'Vendedor entrega ao transportador indicado pelo comprador no local de origem.',
    resp: [
      { icon: '📦', name: 'Embalagem', who: 'sel' },
      { icon: '📋', name: 'Despacho exportação', who: 'sel' },
      { icon: '🚢', name: 'Frete principal', who: 'buy' },
      { icon: '🛡️', name: 'Seguro', who: 'buy' },
      { icon: '🏛️', name: 'Desembaraço importação', who: 'buy' },
    ],
  },
  CPT: {
    desc: 'Vendedor paga frete até destino, mas risco passa ao comprador na entrega ao transportador.',
    resp: [
      { icon: '📦', name: 'Embalagem', who: 'sel' },
      { icon: '🚢', name: 'Frete até destino', who: 'sel' },
      { icon: '🛡️', name: 'Seguro', who: 'buy' },
      { icon: '📋', name: 'Despacho exportação', who: 'sel' },
      { icon: '🏛️', name: 'Desembaraço importação', who: 'buy' },
    ],
  },
}

// ── Checklist ──────────────────────────────────
export interface ChecklistItem {
  n: string      // name
  r: 'ob' | 'op' // obrigatório | opcional
}

export interface ChecklistSection {
  title: string
  items: Record<string, ChecklistItem>
}

export const CHECKLIST_IMP: ChecklistSection[] = [
  {
    title: 'Documentos Comerciais',
    items: {
      invoice:     { n: 'Commercial Invoice',     r: 'ob' },
      packing:     { n: 'Packing List',           r: 'ob' },
      contrato:    { n: 'Contrato de Câmbio',      r: 'ob' },
      proforma:    { n: 'Proforma Invoice',        r: 'op' },
      catalogo:    { n: 'Catálogo Técnico',        r: 'op' },
    },
  },
  {
    title: 'Documentos de Transporte',
    items: {
      bl:          { n: 'Bill of Lading (BL)',     r: 'ob' },
      awb:         { n: 'Air Waybill (AWB)',       r: 'op' },
      ce:          { n: 'Conhecimento de Embarque', r: 'ob' },
    },
  },
  {
    title: 'Documentos Aduaneiros',
    items: {
      di:          { n: 'Declaração de Importação (DI)', r: 'ob' },
      li:          { n: 'Licença de Importação (LI)',    r: 'op' },
      laudo:       { n: 'Laudo Técnico',                 r: 'op' },
      certificado: { n: 'Certificado de Origem',         r: 'op' },
      seguro:      { n: 'Apólice de Seguro',             r: 'ob' },
    },
  },
]

export const CHECKLIST_EXP: ChecklistSection[] = [
  {
    title: 'Documentos Comerciais',
    items: {
      invoice:     { n: 'Commercial Invoice',     r: 'ob' },
      packing:     { n: 'Packing List',           r: 'ob' },
      contrato:    { n: 'Contrato de Câmbio',      r: 'op' },
    },
  },
  {
    title: 'Documentos de Exportação',
    items: {
      due:         { n: 'Declaração Única de Exportação (DUE)', r: 'ob' },
      re:          { n: 'Registro de Exportação (RE)',          r: 'ob' },
      origem:      { n: 'Certificado de Origem',                r: 'op' },
    },
  },
  {
    title: 'Documentos de Transporte',
    items: {
      bl:          { n: 'Bill of Lading (BL)',     r: 'ob' },
      booking:     { n: 'Booking Confirmation',   r: 'ob' },
    },
  },
]

// ── News ──────────────────────────────────────
export const NEWS = [
  {
    id: 1,
    icon: '⚖️',
    category: '🔴 Alerta Regulatório · Siscomex',
    title: 'Siscomex anuncia mudanças no tratamento de importações de produtos controlados pela DFPC a partir de março',
    date: '6 Mar 2025',
    readTime: '4 min',
    theme: 'blue' as const,
  },
  {
    id: 2,
    icon: '📊',
    category: '💱 Mercado',
    title: 'Governo anuncia redução de II para produtos tecnológicos visando inovação',
    date: '27 Fev 2025',
    readTime: '3 min',
    theme: 'green' as const,
  },
  {
    id: 3,
    icon: '📋',
    category: '📋 Importação',
    title: 'IN nº 015/2025 — Adesão do Ministério da Defesa ao NPI',
    date: '27 Fev 2025',
    readTime: '2 min',
    theme: 'yellow' as const,
  },
]

// ── Client Logos ──────────────────────────────
export const CLIENT_LOGOS = [
  'ambev', 'vale', 'braskem', 'embraer', 'natura',
  'gerdau', 'suzano', 'ultrapar', 'weg', 'marcopolo',
  'tupy', 'randon', 'iochpe', 'fras-le', 'schulz',
  'metal-leve', 'mahle', 'dana', 'eaton', 'parker',
]
