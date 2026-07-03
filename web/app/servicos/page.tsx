import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeroNav } from "@/components/hero/hero-nav";
import { Footer } from "@/components/footer/footer";
import { AuroraBlack } from "@/components/ambient/aurora-black";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { breadcrumbNode, collectionPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Criação de sites sob medida e landing pages de alta conversão. Design premium, código próprio e foco em resultado. Atendimento nacional.",
  alternates: { canonical: "/servicos" },
  openGraph: { url: "/servicos" },
};

export default function ServicosHub() {
  const breadcrumb = breadcrumbNode([
    { name: "Início", url: `${SITE_URL}/` },
    { name: "Serviços", url: `${SITE_URL}/servicos` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={collectionPageSchema()} />
      <HeroNav />
      <main>
        <header className="relative px-6 pt-40 pb-16">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
                O que a Prumo faz
              </span>
            </Reveal>
            <Reveal delay={120} distance={24}>
              <h1 className="font-display mt-6 text-5xl leading-[0.95] tracking-[-0.03em] text-white md:text-7xl">
                Serviços
              </h1>
            </Reveal>
            <Reveal delay={260} distance={16}>
              <p className="mt-8 max-w-2xl text-base text-white/70 md:text-lg">
                Sites sob medida e landing pages que convertem, do briefing à
                publicação. Design premium, código próprio e SEO desde o dia um.
                Atendimento em todo o Brasil.
              </p>
            </Reveal>
          </div>
        </header>

        <AuroraBlack>
          <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <div className="grid gap-4 md:grid-cols-2">
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  href={`/servicos/${s.slug}`}
                  className="group flex flex-col rounded-3xl border border-white/10 p-8 transition-colors hover:border-white/40 hover:bg-white/[0.03]"
                >
                  <h2 className="font-display flex items-center gap-2 text-2xl text-white md:text-3xl">
                    {s.navLabel}
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </h2>
                  <p className="mt-4 text-[0.95rem] leading-[1.6] text-white/70">
                    {s.cardBlurb}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </AuroraBlack>
      </main>
      <Footer />
    </>
  );
}
