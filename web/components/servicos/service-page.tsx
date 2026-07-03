import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { AuroraBlack } from "@/components/ambient/aurora-black";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import {
  type Service,
  getPlansForService,
  getProjectsForService,
} from "@/lib/services";

export function ServicePage({ service }: { service: Service }) {
  const plans = getPlansForService(service);
  const projects = getProjectsForService(service);

  return (
    <main>
      {/* HERO */}
      <header className="relative flex min-h-[70vh] items-end overflow-hidden bg-black px-6 pt-32 pb-20">
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <Reveal delay={0} duration={700} distance={12}>
            <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
              Serviços
            </span>
          </Reveal>
          <Reveal delay={120} duration={900} distance={24}>
            <h1 className="font-display mt-6 text-5xl leading-[0.95] tracking-[-0.03em] text-white md:text-7xl">
              {service.h1}
            </h1>
          </Reveal>
          <Reveal delay={280} duration={900} distance={18}>
            <p className="mt-8 max-w-2xl text-base text-white/70 md:text-lg">
              {service.subhead}
            </p>
          </Reveal>
          <Reveal delay={420} duration={800} distance={14}>
            <div className="mt-10 flex flex-wrap gap-4">
              <LiquidGlass
                as="a"
                href="/contato"
                className="rounded-full px-6 py-3 text-sm font-medium text-white"
                data-umami-event="cta_contato"
                data-umami-event-source={`servico_${service.slug}`}
              >
                Agendar conversa
              </LiquidGlass>
              <Link
                href="/planos"
                className="rounded-full border border-white/20 px-6 py-3 text-sm text-white transition-colors hover:border-white/60"
              >
                Ver planos e valores
              </Link>
            </div>
          </Reveal>
        </div>
      </header>

      <AuroraBlack>
        {/* INTRO */}
        <section className="mx-auto max-w-3xl px-6 py-24 md:py-32">
          <Reveal>
            <p className="text-lg leading-relaxed text-white/80 md:text-xl">
              {service.intro}
            </p>
          </Reveal>
        </section>

        {/* BENEFÍCIOS */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-3xl tracking-tight text-white md:text-5xl">
            Por que vale
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
            {service.benefits.map((b) => (
              <div key={b.title} className="bg-black p-8">
                <h3 className="font-display text-xl text-white">{b.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-[1.6] text-white/70">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PROCESSO */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="font-display text-3xl tracking-tight text-white md:text-5xl">
            Como funciona
          </h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {service.process.map((p, i) => (
              <li key={p.step} className="flex flex-col gap-3">
                <span className="font-display text-5xl text-white/15 italic">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg text-white">{p.step}</h3>
                <p className="text-sm leading-[1.55] text-white/65">{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* PROVA — cases */}
        {projects.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="font-display text-3xl tracking-tight text-white md:text-5xl">
              Trabalhos relacionados
            </h2>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {projects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/trabalhos/${p.slug}`}
                  className="group rounded-2xl border border-white/10 p-6 transition-colors hover:border-white/40 hover:bg-white/[0.03]"
                >
                  <span className="text-[11px] tracking-[0.25em] text-white/45 uppercase">
                    {p.scope}
                  </span>
                  <h3 className="font-display mt-3 flex items-center gap-2 text-2xl text-white">
                    {p.title}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </h3>
                  <p className="mt-3 text-sm leading-[1.55] text-white/65">
                    {p.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* PLANOS RELACIONADOS — linka pra /planos, só "a partir de" */}
        {plans.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="font-display text-3xl tracking-tight text-white md:text-5xl">
              Planos para esse serviço
            </h2>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.eventSlug}
                  className="flex flex-col rounded-2xl border border-white/10 p-6"
                >
                  <h3 className="font-display text-xl text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-4 flex-1 text-[0.95rem] leading-[1.55] text-white/70">
                    {plan.description}
                  </p>
                  <Link
                    href="/planos"
                    className="mt-6 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
                    data-umami-event="plano_click"
                    data-umami-event-source={`servico_${service.slug}`}
                  >
                    Ver detalhes
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section
          className="mx-auto max-w-4xl px-6 py-24"
          aria-labelledby="servico-faq"
        >
          <h2
            id="servico-faq"
            className="font-display text-3xl tracking-tight text-white md:text-5xl"
          >
            Perguntas frequentes
          </h2>
          <dl className="mt-12 divide-y divide-white/10 border-t border-white/10">
            {service.faq.map((f) => (
              <div key={f.q} className="py-8">
                <dt className="font-display text-xl text-white">{f.q}</dt>
                <dd className="mt-3 max-w-[62ch] text-[0.95rem] leading-[1.6] text-white/70">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA FINAL */}
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="font-display text-3xl tracking-tight text-white md:text-5xl">
            Vamos tirar o seu projeto do papel?
          </h2>
          <div className="mt-10 flex justify-center">
            <LiquidGlass
              as="a"
              href="/contato"
              className="rounded-full px-8 py-4 text-sm font-medium text-white"
              data-umami-event="cta_contato"
              data-umami-event-source={`servico_${service.slug}_final`}
            >
              Agendar conversa
            </LiquidGlass>
          </div>
        </section>
      </AuroraBlack>
    </main>
  );
}
