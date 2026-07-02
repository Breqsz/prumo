import type { Metadata } from "next";
import { Hero } from "@/components/hero/hero";
import { PlanosTeaser } from "@/components/planos/planos-teaser";
import { Faq } from "@/components/faq/faq";
import { FinalCta } from "@/components/cta/final-cta";
import { Footer } from "@/components/footer/footer";
import { AmbientVideo } from "@/components/ambient/ambient-video";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const HERO_VIDEOS = [
  "/hero.mp4", // low-angle building exterior (Pexels 7065802)
  "/hero-2.mp4", // dark hallway with light on ceiling (Pexels 19217898)
  "/hero-3.mp4", // dark hallway with light on floor (Pexels 19217895)
];

const AMBIENT_VIDEOS = [
  "/ambient.mp4", // dark liquid abstract shapes (Pexels 16392051)
  "/ambient-2.mp4", // ferrofluid inky (Pexels 16296848)
];


export default function HomePage() {
  return (
    <>
      <Hero videoSrcs={HERO_VIDEOS} />
      <AmbientVideo srcs={AMBIENT_VIDEOS}>
        <PlanosTeaser />
        <FinalCta />
        {/* bgVariant: 1=marginalia, 2=blueprint, 3=halo, 4=prumo */}
        <Faq bgVariant={1} />
      </AmbientVideo>
      <Footer />
    </>
  );
}
