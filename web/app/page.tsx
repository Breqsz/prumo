import type { Metadata } from "next";
import { Hero } from "@/components/hero/hero";
import { Prova } from "@/components/home/prova";
import { PlanosTeaser } from "@/components/planos/planos-teaser";
import { Faq } from "@/components/faq/faq";
import { FinalCta } from "@/components/cta/final-cta";
import { Footer } from "@/components/footer/footer";
import { AmbientFerrofluid } from "@/components/ambient/ambient-ferrofluid";
import { homeCases } from "@/lib/home-content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const HERO_VIDEOS = [
  "/hero.mp4", // low-angle building exterior (Pexels 7065802)
  "/hero-2.mp4", // dark hallway with light on ceiling (Pexels 19217898)
  "/hero-3.mp4", // dark hallway with light on floor (Pexels 19217895)
];

export default function HomePage() {
  return (
    <>
      <Hero videoSrcs={HERO_VIDEOS} />
      {/* Um ambient so para as duas secoes, de proposito. Dois ambients
          adjacentes criam uma costura visivel no meio: o fade de base do
          primeiro somado ao fade de topo do segundo vira uma faixa preta
          entre eles. Continuo, o fundo atravessa a fronteira sem marca. */}
      <AmbientFerrofluid>
        <Prova cases={homeCases()} />
        <PlanosTeaser />
      </AmbientFerrofluid>
      {/* bgVariant: 1=marginalia, 2=blueprint, 3=halo, 4=prumo */}
      <Faq bgVariant={1} />
      <FinalCta />
      <Footer />
    </>
  );
}
