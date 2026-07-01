import type { Metadata } from "next";
import { Hero } from "@/components/hero/hero";
import { PlanosTeaser } from "@/components/planos/planos-teaser";
import { Faq } from "@/components/faq/faq";
import { FinalCta } from "@/components/cta/final-cta";
import { Footer } from "@/components/footer/footer";
import { AmbientVideo } from "@/components/ambient/ambient-video";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";
import { CONTACT } from "@/lib/contact-config";

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

const sameAs = [CONTACT.linkedin, CONTACT.instagram].filter(
  (v): v is string => Boolean(v),
);
const orgLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Prumo",
  description: "Estúdio digital. Sites sob medida, estratégia e presença digital.",
  url: SITE_URL,
  email: CONTACT.email,
  sameAs,
  areaServed: "BR",
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={orgLd} />
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
