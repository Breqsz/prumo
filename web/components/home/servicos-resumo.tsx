import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const LINHAS = [
  "Sites institucionais que dão autoridade a quem já tem reputação.",
  "Landing pages construídas para uma conversão específica.",
  "Projetos sob medida quando o pronto não resolve.",
];

export function ServicosResumo() {
  return (
    <section
      id="servicos-resumo"
      className="relative px-6 py-24 md:py-32"
      aria-labelledby="servicos-resumo-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="servicos-resumo-heading"
          className="font-display text-4xl tracking-tight text-white md:text-5xl"
        >
          O que eu faço
        </h2>
        <ul className="mt-10 space-y-4 text-base text-white/70 md:text-lg">
          {LINHAS.map((linha) => (
            <li key={linha}>{linha}</li>
          ))}
        </ul>
        <Link
          href="/servicos"
          className="group mt-10 inline-flex items-center gap-2 text-sm text-white"
          data-umami-event="home_servicos"
        >
          Ver serviços em detalhe
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
