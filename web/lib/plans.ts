export type Plan = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  featured?: boolean;
  /** Shown in the expandable "+ detalhes técnicos" on the plan card */
  technicalDetails?: string;
  /** Umami slug for plano_click / plano_focus events */
  eventSlug: string;
};

export type PlanMode = "criar" | "manter";

export const CRIAR_PLANS: Plan[] = [
  {
    name: "Landing",
    price: "R$ 3.750",
    cadence: "Pagamento único · 10 dias",
    description:
      "Página única focada em converter visitante em contato ou venda.",
    features: [
      "Carrega em segundos em qualquer dispositivo",
      "Formulário conectado ao seu WhatsApp ou email",
      "Aparece no Google desde o primeiro dia",
      "Design sob medida, sem template",
    ],
    technicalDetails: "Construída em Framer. Formulário via Resend. Hospedagem inclusa no plano Manutenção (Hostinger, Hostgator ou similar).",
    eventSlug: "landing",
  },
  {
    name: "Institucional",
    price: "R$ 8.500",
    cadence: "Pagamento único · 15 dias",
    description:
      "Site completo para profissionalizar a marca e gerar autoridade.",
    features: [
      "Até 5 páginas com design sob medida",
      "Você atualiza textos e imagens sozinho",
      "Contatos do formulário nunca perdidos",
      "Aparece bem no Google",
      "Funciona perfeito no celular e no computador",
    ],
    featured: true,
    technicalDetails: "Framer ou código sob medida dependendo do escopo. CMS incluso para edição autônoma. Leads do formulário salvos em banco de dados. Hospedagem em Hostinger, Hostgator ou plataforma adequada ao projeto.",
    eventSlug: "institucional",
  },
  {
    name: "Branded",
    price: "a partir de R$ 18.000",
    cadence: "Pagamento único · 30 a 45 dias",
    description:
      "Projeto digital construído do zero, integrado à identidade da marca.",
    features: [
      "Feito no código — sem template, sem limitação",
      "Animações e interações exclusivas",
      "Você controla todo o conteúdo pelo painel",
      "Base técnica para crescer",
      "Implantação acompanhada",
    ],
    technicalDetails: "Next.js + TypeScript + Tailwind + Framer Motion. CMS Sanity para edição de conteúdo. Banco de dados Supabase. Hospedagem em plataforma dedicada (Hostinger, Hostgator ou similar).",
    eventSlug: "branded",
  },
];

export const MANTER_PLANS: Plan[] = [
  {
    name: "Manutenção",
    price: "R$ 350",
    cadence: "por mês · cancela quando quiser",
    description:
      "Seu site continua no ar, seguro e funcionando sem você precisar se preocupar.",
    features: [
      "Hospedagem gerenciada",
      "Atualizações de segurança automáticas",
      "1 ajuste pontual por mês",
      "Suporte via WhatsApp em até 24h",
    ],
    technicalDetails: "Hospedagem gerenciada (Hostinger, Hostgator ou plataforma adequada ao site). SSL automático. Backups diários. Ajuste pontual de até 30 minutos por mês. Horas adicionais a R$ 200/h.",
    eventSlug: "manutencao",
  },
  {
    name: "Crescimento",
    price: "R$ 1.350",
    cadence: "por mês · cancela quando quiser",
    description:
      "Seu site evolui todo mês com horas dedicadas de design e desenvolvimento.",
    features: [
      "6 horas de design e desenvolvimento por mês",
      "Melhorias de posicionamento no Google",
      "Relatório mensal de visitas e conversões",
      "Suporte prioritário",
    ],
    featured: true,
    technicalDetails: "6h de dev/design por ciclo. SEO técnico: auditoria mensal, meta tags, schema markup. Relatório via Google Analytics ou ferramenta equivalente. Horas adicionais a R$ 200/h.",
    eventSlug: "crescimento",
  },
  {
    name: "Parceria",
    price: "R$ 3.000",
    cadence: "por mês · contrato 6 meses",
    description: "Um olho estratégico no seu digital, todo mês.",
    features: [
      "12 horas de design e desenvolvimento",
      "Reunião mensal para definir prioridades",
      "Relatório completo de performance",
      "Testes de conversão baseados em dados",
      "Suporte com resposta em até 2 horas",
    ],
    technicalDetails: "12h de dev/design por ciclo. Reunião via Meet ou presencial. Relatório com métricas de tráfego, conversão e resultados de A/B tests. Horas adicionais a R$ 200/h.",
    eventSlug: "parceria",
  },
];

export const PLAN_SETS: Record<PlanMode, Plan[]> = {
  criar: CRIAR_PLANS,
  manter: MANTER_PLANS,
};

export function featuredSlug(mode: PlanMode): string {
  const set = PLAN_SETS[mode];
  return (set.find((p) => p.featured) ?? set[0]).eventSlug;
}

export function getPlanByEventSlug(slug: string): Plan | undefined {
  return [...CRIAR_PLANS, ...MANTER_PLANS].find((p) => p.eventSlug === slug);
}
