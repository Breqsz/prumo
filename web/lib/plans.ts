export type Plan = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  featured?: boolean;
  /** Umami slug for plano_click / plano_focus events */
  eventSlug: string;
};

export type PlanMode = "criar" | "manter";

export const CRIAR_PLANS: Plan[] = [
  {
    name: "Landing",
    price: "R$ 3.500",
    cadence: "Pagamento único · 10 dias",
    description:
      "Página única de alta conversão para validar uma oferta ou capturar leads qualificados.",
    features: [
      "Design e cópia sob medida",
      "1 idioma",
      "Performance e SEO técnico",
      "Domínio e deploy inclusos",
    ],
    eventSlug: "landing",
  },
  {
    name: "Institucional",
    price: "R$ 8.500",
    cadence: "Pagamento único · 21 dias",
    description:
      "Site multi-página para profissionalizar a marca e gerar autoridade no mercado.",
    features: [
      "Até 6 páginas",
      "CMS leve para conteúdo",
      "Formulário com integração",
      "PT-BR + EN opcional",
      "Performance e SEO completos",
    ],
    featured: true,
    eventSlug: "institucional",
  },
  {
    name: "Branded",
    price: "a partir de R$ 18.000",
    cadence: "Pagamento único · 30 a 45 dias",
    description:
      "Projeto custom com identidade integrada, animações sob medida e CMS robusto.",
    features: [
      "Escopo desenhado a quatro mãos",
      "Identidade visual integrada",
      "Animações e interações custom",
      "CMS robusto",
      "Implantação acompanhada",
    ],
    eventSlug: "branded",
  },
];

export const MANTER_PLANS: Plan[] = [
  {
    name: "Base",
    price: "R$ 397",
    cadence: "por mês · cancela quando quiser",
    description:
      "Mantém o site no ar, atualizado e seguro. Para quem precisa do mínimo bem-feito.",
    features: [
      "Hospedagem e CDN",
      "Backups automáticos",
      "Atualizações de segurança",
      "2h de alterações por mês",
    ],
    eventSlug: "base",
  },
  {
    name: "Crescimento",
    price: "R$ 997",
    cadence: "por mês · cancela quando quiser",
    description:
      "Mais horas, SEO técnico e suporte prioritário para quem está crescendo de verdade.",
    features: [
      "Tudo do Base",
      "6h por mês de design/dev",
      "SEO técnico recorrente",
      "Suporte prioritário",
    ],
    featured: true,
    eventSlug: "crescimento",
  },
  {
    name: "Parceria",
    price: "R$ 2.500",
    cadence: "por mês · contrato 6 meses",
    description:
      "Parceria contínua de estratégia, métricas e iteração. Quase um head of digital sob demanda.",
    features: [
      "Tudo do Crescimento",
      "12h por mês",
      "Reunião estratégica mensal",
      "Relatório de métricas",
      "A/B tests guiados",
    ],
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
