import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function SobreHero() {
  return (
    <section
      className="relative flex min-h-screen items-start justify-center px-6 pt-32 pb-24 md:pt-40 md:pb-32"
      aria-labelledby="sobre-hero-heading"
    >
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Sobre
        </span>
        <h1
          id="sobre-hero-heading"
          className="font-display text-4xl font-semibold leading-[1.02] tracking-tight md:text-7xl"
        >
          Um estúdio. <em className="font-display italic">Sem teatro.</em>
        </h1>
        <p className="max-w-xl text-base text-white/70 md:text-lg">
          Solo, premium e sóbrio. Honestidade vale mais que tamanho.
        </p>
      </Reveal>

      <a
        href="#manifesto"
        aria-label="Rolar para o manifesto"
        className="prumo-scroll-hint absolute bottom-32 left-1/2 -translate-x-1/2 text-white/55 transition-colors hover:text-white md:bottom-40"
      >
        <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
      </a>
    </section>
  );
}
