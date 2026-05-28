import type { Metadata } from "next";
import { HeroNav } from "@/components/hero/hero-nav";
import { AmbientVideo } from "@/components/ambient/ambient-video";
import { Footer } from "@/components/footer/footer";
import { Reveal } from "@/components/ui/reveal";
import { ContatoHero } from "@/components/contato/contato-hero";
import { ContatoForm } from "@/components/contato/contato-form";
import { ContatoChannels } from "@/components/contato/contato-channels";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Conta o seu objetivo num briefing rápido. Respondo em até 24h com perguntas, cronograma e próximos passos.",
  alternates: { canonical: "/contato" },
  openGraph: { url: "/contato" },
};

// Single clip on loop with near-imperceptible fade at the seam (250ms).
// Using the same fade infrastructure as the other pages but tuned shorter.
const AMBIENT_VIDEOS = ["/contato.mp4"];

export default function ContatoPage() {
  return (
    <>
      <AmbientVideo
        srcs={AMBIENT_VIDEOS}
        spotlight
        fadeDurationMs={250}
        fadeOutLeadMs={280}
      >
        <HeroNav />
        <ContatoHero />
        <section
          id="briefing"
          className="relative px-6 pb-32 md:pb-48"
          aria-labelledby="briefing-heading"
        >
          <Reveal className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[3fr_2fr] md:gap-24">
            <div>
              <h2 id="briefing-heading" className="sr-only">
                Formulário de briefing
              </h2>
              <ContatoForm />
            </div>
            <ContatoChannels />
          </Reveal>
        </section>
      </AmbientVideo>
      <Footer />
    </>
  );
}
