import type { ReactNode } from "react";
import { HeroNav } from "@/components/hero/hero-nav";
import { Footer } from "@/components/footer/footer";
import { Reveal } from "@/components/ui/reveal";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  updatedAt: string;
  children: ReactNode;
};

export function LegalPage({ eyebrow, title, updatedAt, children }: LegalPageProps) {
  return (
    <>
      <HeroNav />
      <main className="relative px-6 pt-28 pb-32 md:pt-40 md:pb-48">
        <Reveal className="mx-auto flex max-w-3xl flex-col gap-4">
          <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
            {eyebrow}
          </span>
          <h1 className="font-display text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
            {title}
          </h1>
          <p className="text-sm text-white/45">Última atualização: {updatedAt}</p>
        </Reveal>
        <div className="mx-auto mt-16 flex max-w-3xl flex-col gap-10 text-white/70">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-semibold text-white md:text-2xl">
        {heading}
      </h2>
      {children}
    </section>
  );
}
