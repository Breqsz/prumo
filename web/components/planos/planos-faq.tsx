"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const ITEMS = [
  {
    q: "Posso trocar de plano mensal depois?",
    a: "Sim. Subir de nível vale a partir do próximo ciclo. Descer também — só não vale dentro do mesmo mês.",
  },
  {
    q: "O que está incluído nas horas mensais — e o que NÃO está?",
    a: "Horas valem para alterações de conteúdo, ajustes de design, pequenos componentes novos, SEO técnico recorrente e correções. Não valem para projetos novos (nova landing, novo módulo grande) — isso entra como projeto custom à parte.",
  },
  {
    q: "Posso cancelar o plano mensal quando quiser?",
    a: "Manutenção e Crescimento: cancelamento livre a qualquer momento. Parceria: contrato mínimo de 6 meses por causa do envolvimento estratégico — após esse período, mensal sem fidelidade.",
  },
  {
    q: "Os mensais incluem hospedagem ou pago separado?",
    a: "Incluem. Hospedagem na Vercel, domínio próprio (você só paga o registro do domínio direto no registrar), CDN, SSL, backups — tudo dentro da assinatura. Sem surpresa no fim do mês.",
  },
  {
    q: "Como funciona o pagamento dos planos one-time?",
    a: "50% para iniciar, 50% na entrega. PIX, cartão ou transferência. Nota fiscal sempre. Para Branded e custom, pagamento pode ser quebrado em 3 parcelas se fizer sentido pro projeto.",
  },
];

export function PlanosFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq-planos"
      className="relative px-6 py-24 md:py-32"
      aria-labelledby="planos-faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <Reveal as="header" className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
          <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
            Dúvidas comuns
          </span>
          <h2
            id="planos-faq-heading"
            className="font-display text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl"
          >
            Escopo, pagamento, fidelidade.
          </h2>
        </Reveal>

        <ul className="flex flex-col">
          {ITEMS.map((it, i) => {
            const expanded = open === i;
            return (
              <li key={it.q} className="border-b border-white/8">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? -1 : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left text-base text-white transition-colors hover:text-white md:text-lg"
                >
                  <span>{it.q}</span>
                  <Plus
                    className={`h-5 w-5 shrink-0 transition-transform duration-300 ${expanded ? "rotate-45" : ""}`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <p className="min-h-0 text-sm text-white/65 md:text-base">
                    <span className="block pb-6 pr-8">{it.a}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
