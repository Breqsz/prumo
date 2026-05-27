import { Reveal } from "@/components/ui/reveal";

export function ContatoHero() {
  return (
    <section
      className="relative flex items-start justify-center px-6 pt-28 pb-12 md:pt-40 md:pb-16"
      aria-labelledby="contato-hero-heading"
    >
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Contato
        </span>
        <h1
          id="contato-hero-heading"
          className="font-display text-4xl font-semibold leading-[1.02] tracking-tight md:text-7xl"
        >
          Briefing <em className="font-display italic">inicial.</em>
        </h1>
        <p className="max-w-xl text-base text-white/70 md:text-lg">
          Me conta o projeto. Respondo em até 24h com perguntas, cronograma e
          uma opinião honesta sobre se posso ajudar.
        </p>
      </Reveal>
    </section>
  );
}
