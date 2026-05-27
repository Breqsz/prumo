import type { Metadata } from "next";
import { HeroNav } from "@/components/hero/hero-nav";
import { PlanosHero } from "@/components/planos/planos-hero";
import { OneTimeGrid } from "@/components/planos/one-time-grid";
import { MonthlyGrid } from "@/components/planos/monthly-grid";
import { CustomStrip } from "@/components/planos/custom-strip";
import { PlanosFaq } from "@/components/planos/planos-faq";
import { FinalCta } from "@/components/cta/final-cta";
import { Footer } from "@/components/footer/footer";
import { AmbientVideo } from "@/components/ambient/ambient-video";

export const metadata: Metadata = {
  title: "Planos · Prumo",
  description:
    "Preço transparente. Três planos para criar (Landing, Institucional, Branded), três para manter (Base, Crescimento, Parceria) e projetos custom sob briefing.",
};

const AMBIENT_VIDEOS = ["/planos-1.mp4", "/planos-2.mp4"];

export default function PlanosPage() {
  return (
    <>
      <AmbientVideo srcs={AMBIENT_VIDEOS} spotlight>
        <HeroNav />
        <PlanosHero />
        <OneTimeGrid />
        <MonthlyGrid />
        <CustomStrip />
        <PlanosFaq />
        <FinalCta />
      </AmbientVideo>
      <Footer />
    </>
  );
}
