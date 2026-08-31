import type { Metadata } from "next";
import { HeroNav } from "@/components/hero/hero-nav";
import { AmbientFerrofluid } from "@/components/ambient/ambient-ferrofluid";
import { SobreHero } from "@/components/sobre/sobre-hero";
import { Manifesto } from "@/components/sobre/manifesto";
import { Metodo } from "@/components/sobre/metodo";
import { QuemAssina } from "@/components/sobre/quem-assina";
import { FinalCta } from "@/components/cta/final-cta";
import { Footer } from "@/components/footer/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { personNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "O estúdio, o método e quem assina cada projeto. Operação solo, posicionamento premium, honestidade no processo.",
  alternates: { canonical: "/sobre" },
  openGraph: { url: "/sobre" },
};


export default function SobrePage() {
  return (
    <>
      <JsonLd data={personNode()} />
      <AmbientFerrofluid spotlight>
        <HeroNav />
        <SobreHero />
        <QuemAssina />
        <Manifesto />
        <Metodo />
        <FinalCta />
      </AmbientFerrofluid>
      <Footer />
    </>
  );
}
