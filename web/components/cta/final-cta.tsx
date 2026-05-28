import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { Reveal } from "@/components/ui/reveal";
import PixelSnow from "@/components/ui/pixel-snow";

export function FinalCta() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden px-6 py-40 md:py-56"
      aria-labelledby="cta-heading"
    >
      <PixelSnow
        color="#ffffff"
        flakeSize={0.01}
        minFlakeSize={1.25}
        pixelResolution={200}
        speed={1.25}
        density={0.3}
        direction={125}
        brightness={1}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
        <span className="anim anim-eyebrow text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Próximo passo
        </span>
        <h2 className="anim anim-headline font-display mt-10 text-6xl font-semibold leading-[0.85] tracking-[-0.04em] md:text-[8rem] lg:text-[10.5rem]">
          Vamos colocar
          <br />
          sua marca
          <br />
          <em className="sweep font-display font-normal italic text-white">
            no prumo.
          </em>
        </h2>
        <p className="anim anim-copy mt-12 max-w-md text-base text-white/70 md:text-lg">
          Uma conversa de 30 minutos é suficiente para entender o seu
          objetivo e dizer honestamente se posso ajudar.
        </p>
        <div className="anim anim-cta mt-14 flex flex-col items-center gap-3 sm:flex-row">
          <LiquidGlass
            as="a"
            href="/contato"
            className="group flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium text-white"
            data-umami-event="cta_contato"
            data-umami-event-source="final-cta"
          >
            Agendar conversa
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </LiquidGlass>
        </div>
      </div>
    </section>
  );
}
