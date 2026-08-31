import type { Metadata } from "next";
import { HeroNav } from "@/components/hero/hero-nav";
import { PlanosHero } from "@/components/planos/planos-hero";
import { SpotlightStage } from "@/components/planos/spotlight-stage";
import { CustomStrip } from "@/components/planos/custom-strip";
import { PlanosFaq } from "@/components/planos/planos-faq";
import { FinalCta } from "@/components/cta/final-cta";
import { Footer } from "@/components/footer/footer";
import { AmbientFerrofluid } from "@/components/ambient/ambient-ferrofluid";
import { JsonLd } from "@/components/seo/json-ld";
import { servicesGraph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Planos",
  description:
    "Sites sob medida e planos de manutenção contínua. Landing, institucional, projeto branded e mensalidades de parceria.",
  alternates: { canonical: "/planos" },
  openGraph: { url: "/planos" },
};


export default function PlanosPage() {
  return (
    <>
      <JsonLd data={servicesGraph()} />
      <AmbientFerrofluid spotlight>
        <HeroNav />
        <PlanosHero />
        <SpotlightStage />
        <CustomStrip />
        <PlanosFaq />
        <FinalCta />
      </AmbientFerrofluid>
      <Footer />
    </>
  );
}
