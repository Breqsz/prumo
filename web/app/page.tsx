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

export default function HomePage() {
  return (
    <>
      <Hero />
      <AmbientFerrofluid>
        <Prova cases={homeCases()} />
        <PlanosTeaser />
        {/* bgVariant: 1=marginalia, 2=blueprint, 3=halo, 4=prumo */}
        <Faq bgVariant={1} />
        <FinalCta />
      </AmbientFerrofluid>
      <Footer />
    </>
  );
}
