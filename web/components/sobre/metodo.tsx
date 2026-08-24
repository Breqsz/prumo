import { Reveal } from "@/components/ui/reveal";

type Step = {
  number: string;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    number: "01",
    title: "Alinhamento",
    description:
      "Briefing real, sem questionário decorativo. Em até 60 minutos a gente fecha objetivo, escopo, prazo e número.",
  },
  {
    number: "02",
    title: "Desenho",
    description:
      "Estrutura primeiro, estética depois. Arquitetura de conteúdo, fluxos e wireframes antes de qualquer pixel polido.",
  },
  {
    number: "03",
    title: "Construção",
    description:
      "Código sob medida ou no-code premium, decidido por projeto. Build incremental com preview navegável desde a primeira semana.",
  },
  {
    number: "04",
    title: "Lançamento",
    description:
      "Deploy, métricas e suporte ativo nos primeiros 30 dias. Marca no ar, não relatório no email.",
  },
];

export function Metodo() {
  return (
    <section
      id="metodo"
      className="relative px-6 py-24 md:py-32"
      aria-labelledby="metodo-heading"
    >
      <Reveal className="mx-auto max-w-4xl">
        <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Método
        </span>
        <h2
          id="metodo-heading"
          className="font-editorial mt-3 text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl"
        >
          Como o Prumo <em className="font-editorial italic">trabalha</em>.
        </h2>

        <ol className="mt-14 divide-y divide-white/10 border-t border-white/10">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="grid gap-4 py-8 md:grid-cols-[120px_1fr] md:gap-10 md:py-10"
            >
              <span
                aria-hidden="true"
                className="font-editorial text-3xl text-white/45 md:text-5xl"
              >
                {step.number}
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight md:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm text-white/65 md:text-base">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
