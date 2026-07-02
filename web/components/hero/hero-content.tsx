import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { RotatingPhrase } from "@/components/hero/rotating-phrase";

export function HeroContent() {
  return (
    <section className="relative z-10 flex flex-1 -translate-y-[6%] flex-col items-center justify-center px-6 py-12 text-center">
      <p className="mb-8 text-xs tracking-[0.3em] text-white uppercase">
        Precisão em forma de site.
      </p>

      <h1 className="font-display mb-8 text-4xl leading-[1.05] tracking-tight sm:whitespace-nowrap sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]">
        Tudo começa por <RotatingPhrase />
      </h1>

      <p className="mb-10 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
        Sites, estratégia e presença digital para marcas que valorizam precisão.
      </p>

      <div className="mb-16 flex flex-col items-center gap-3 sm:flex-row">
        <LiquidGlass
          as="a"
          href="/contato"
          className="group flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium text-white"
          data-umami-event="cta_contato"
          data-umami-event-source="hero"
        >
          Agendar conversa
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </LiquidGlass>
        <Link
          href="/trabalhos"
          className="prumo-cta-pulse group flex items-center gap-2 rounded-full border border-white/15 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:border-white/30"
          data-umami-event="cta_trabalhos"
          data-umami-event-source="hero"
        >
          Ver trabalhos
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="flex items-center gap-6 text-[11px] tracking-widest text-white uppercase">
        <span>Estratégia</span>
        <span className="h-1 w-1 rounded-full bg-white/70" />
        <span>Design</span>
        <span className="h-1 w-1 rounded-full bg-white/70" />
        <span>Construção</span>
        <span className="h-1 w-1 rounded-full bg-white/70" />
        <span>Performance</span>
      </div>
    </section>
  );
}
