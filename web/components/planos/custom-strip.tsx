import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function CustomStrip() {
  return (
    <section
      id="custom"
      className="relative px-6 py-20 md:py-28"
      aria-labelledby="custom-heading"
    >
      <Reveal className="mx-auto max-w-5xl">
        <div
          className="overflow-hidden rounded-[28px] p-8 md:p-12"
          style={{
            background:
              "linear-gradient(#0E0E10, #0A0A0A) padding-box, linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.22) 100%) border-box",
            border: "1px solid transparent",
          }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
                Custom
              </span>
              <h2
                id="custom-heading"
                className="font-editorial mt-3 text-2xl font-semibold leading-[1.1] md:text-4xl"
              >
                Projeto <em className="font-editorial italic">sob medida</em>.
              </h2>
              <p className="mt-4 text-sm text-white/70 md:text-base">
                Escopo fora do padrão ou orçamento acima de R$ 25.000. Brief de 30 minutos antes do orçamento. Sem número chutado no email.
              </p>
            </div>
            <a
              href="/contato"
              className="group inline-flex items-center justify-between gap-3 rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:border-white/40"
              data-umami-event="cta_contato"
              data-umami-event-source="planos"
            >
              Pedir brief
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
