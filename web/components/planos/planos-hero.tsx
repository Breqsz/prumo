import { Reveal } from "@/components/ui/reveal";

export function PlanosHero() {
  return (
    <section
      className="relative px-6 pt-32 pb-12 md:pt-40 md:pb-16"
      aria-labelledby="planos-hero-heading"
    >
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Planos
        </span>
        <h1
          id="planos-hero-heading"
          className="font-display text-4xl font-semibold leading-[1.02] tracking-tight md:text-7xl"
        >
          Preço <em className="font-display italic">transparente</em>. Escopo claro.
        </h1>
        <p className="max-w-xl text-base text-white/70 md:text-lg">
          Três planos para criar. Três para manter. Você sabe o número antes da call.
        </p>
      </Reveal>
    </section>
  );
}
