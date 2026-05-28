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
  title: "Planos",
  description:
    "Sites sob medida e planos de manutenção contínua. Landing, institucional, projeto branded e mensalidades de parceria.",
  alternates: { canonical: "/planos" },
  openGraph: { url: "/planos" },
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
