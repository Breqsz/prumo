import { PlanCard } from "@/components/pricing/plan-card";
import { Reveal } from "@/components/ui/reveal";

const PLANS = [
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
    glow: 0 as const,
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
    glow: 1 as const,
    featured: true,
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
    glow: 2 as const,
  },
];

export function MonthlyGrid() {
  return (
    <section
      id="manter"
      className="relative px-6 py-24 md:py-32"
      aria-labelledby="monthly-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal as="header" className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
          <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
            Para manter
          </span>
          <h2
            id="monthly-heading"
            className="font-display max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl"
          >
            Para manter no ar.
          </h2>
          <p className="max-w-xl text-sm text-white/70 md:text-base">
            Opcional. Para quem entrega e quer continuar entregando — sem ter que cuidar do site.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 120}>
              <PlanCard {...plan} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
