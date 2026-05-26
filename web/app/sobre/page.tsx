import type { Metadata } from "next";
import { HeroNav } from "@/components/hero/hero-nav";
import { AmbientVideo } from "@/components/ambient/ambient-video";
import { SobreHero } from "@/components/sobre/sobre-hero";
import { Manifesto } from "@/components/sobre/manifesto";
import { Metodo } from "@/components/sobre/metodo";
import { QuemAssina } from "@/components/sobre/quem-assina";
import { FinalCta } from "@/components/cta/final-cta";
import { Footer } from "@/components/footer/footer";

export const metadata: Metadata = {
  title: "Sobre · Prumo",
  description:
    "Estúdio solo de sites, estratégia e presença digital. Honestidade, sobriedade e precisão — uma pessoa do briefing à entrega.",
};

const AMBIENT_VIDEOS = ["/ambient.mp4", "/ambient-2.mp4"];

export default function SobrePage() {
  return (
    <>
      <AmbientVideo srcs={AMBIENT_VIDEOS} spotlight>
        <HeroNav />
        <SobreHero />
        <Manifesto />
        <Metodo />
        <QuemAssina />
        <FinalCta />
      </AmbientVideo>
      <Footer />
    </>
  );
}
