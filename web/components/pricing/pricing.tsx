import { PlanCard } from "./plan-card";
import { Reveal } from "@/components/ui/reveal";

const PLANS = [
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
    glow: 0 as const,
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
    glow: 1 as const,
    featured: true,
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
    glow: 2 as const,
  },
];

export function Pricing() {
  return (
    <section
      id="planos"
      className="relative px-6 py-32 md:py-40"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal
          as="header"
          className="mb-16 flex flex-col items-center gap-6 text-center md:mb-24"
        >
          <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
            Planos
          </span>
          <h2
            id="pricing-heading"
            className="font-display max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
          >
            Três caminhos.{" "}
            <em className="font-display italic">Sob medida</em> quando nenhum
            serve.
          </h2>
          <p className="max-w-xl text-base text-white md:text-lg">
            Pagamento único para entregar. Planos mensais opcionais para
            manter, crescer e iterar depois.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 120}>
              <PlanCard {...plan} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <p className="mt-10 text-center text-xs tracking-widest text-white/45 uppercase">
            Projetos acima de R$ 25.000 · orçamento sob briefing
          </p>
        </Reveal>
      </div>
    </section>
  );
}
