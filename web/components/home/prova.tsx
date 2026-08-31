import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

/**
 * O que o estúdio faz, como índice ao lado do que ele já fez. Eram duas
 * seções: uma lista de três serviços sem hierarquia, e a grade de cases.
 * A lista sozinha não sustentava a própria altura — o DESIGN.md pede
 * assimetria editorial, e três frases de mesmo peso não são assimetria.
 * Juntas, o serviço vira a legenda da prova, que é como um indicado lê.
 */
const SERVICOS = [
  "Sites institucionais",
  "Landing pages",
  "Projetos sob medida",
];

export function Prova({ cases }: { cases: Project[] }) {
  if (cases.length === 0) return null;
  return (
    <section
      id="prova"
      className="relative px-6 py-28 md:py-36"
      aria-labelledby="prova-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.25fr_1fr] md:items-end md:gap-16">
          <h2
            id="prova-heading"
            className="font-display text-4xl leading-[0.95] tracking-tight text-white md:text-6xl"
          >
            Trabalhos
            <br />
            recentes
          </h2>

          <div className="md:pb-2">
            <ul className="text-sm text-white/70">
              {SERVICOS.map((servico) => (
                <li
                  key={servico}
                  className="border-t border-white/10 py-3 first:border-t-0 md:py-3.5"
                >
                  {servico}
                </li>
              ))}
            </ul>
            <Link
              href="/servicos"
              className="group mt-5 inline-flex items-center gap-2 text-sm text-white"
              data-umami-event="home_servicos"
            >
              Ver serviços em detalhe
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-4 md:gap-6">
          {cases.map((p) => (
            <Link
              key={p.slug}
              href={`/trabalhos/${p.slug}`}
              className="group block"
              data-umami-event="prova_case"
              data-umami-event-case={p.slug}
            >
              <div className="relative aspect-[2/1] overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <Image
                  src={p.gallery[0]}
                  alt=""
                  fill
                  sizes="(min-width: 1200px) 280px, (min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-4 text-sm font-medium text-white">{p.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                {p.scope}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
