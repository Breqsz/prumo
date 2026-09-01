import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function PlanosHero() {
  return (
    <section
      className="relative flex min-h-dvh items-start justify-center px-6 pt-28 pb-24 md:pt-40 md:pb-32"
      aria-labelledby="planos-hero-heading"
    >
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Planos
        </span>
        <h1
          id="planos-hero-heading"
          className="font-editorial text-4xl font-semibold leading-[1.02] tracking-tight md:text-7xl"
        >
          Preço <em className="font-editorial italic">transparente</em>. Escopo claro.
        </h1>
        <p className="max-w-xl text-base text-white/70 md:text-lg">
          Três planos para criar. Três para manter. Você sabe o número antes da call.
        </p>
      </Reveal>

      <a
        href="#planos-stage"
        aria-label="Rolar para os planos"
        className="prumo-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 text-white/55 transition-colors hover:text-white md:bottom-40"
      >
        <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
      </a>
    </section>
  );
}
