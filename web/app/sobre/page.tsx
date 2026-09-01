import type { Metadata } from "next";
import { HeroNav } from "@/components/hero/hero-nav";
import { AmbientVideo } from "@/components/ambient/ambient-video";
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

const AMBIENT_VIDEOS = ["/ambient.mp4", "/ambient-2.mp4"];

export default function SobrePage() {
  return (
    <>
      <JsonLd data={personNode()} />
      <AmbientVideo srcs={AMBIENT_VIDEOS} spotlight>
        <HeroNav />
        <SobreHero />
        <QuemAssina />
        <Manifesto />
        <Metodo />
        <FinalCta />
      </AmbientVideo>
      <Footer />
    </>
  );
}
