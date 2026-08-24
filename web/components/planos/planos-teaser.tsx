import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function PlanosTeaser() {
  return (
    <section
      id="planos"
      className="relative flex min-h-dvh items-center justify-center px-6 py-24 md:py-40"
      aria-labelledby="planos-teaser-heading"
    >
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Planos
        </span>
        <h2
          id="planos-teaser-heading"
          className="font-editorial text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
        >
          Preço transparente. <em className="font-editorial italic">Escopo claro.</em>
        </h2>
        <p className="max-w-xl text-base text-white/70 md:text-lg">
          Três planos para criar, três para manter, projetos custom sob briefing. Sem orçamento por email.
        </p>
        <Link
          href="/planos"
          className="group mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white transition-colors hover:border-white/40"
        >
          Ver todos os planos
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </section>
  );
}
