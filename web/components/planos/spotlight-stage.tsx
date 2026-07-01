"use client";

import { useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PLAN_SETS, featuredSlug, type PlanMode } from "@/lib/plans";
import { StagePlanCard } from "./stage-plan-card";
import { PlanComparison } from "./plan-comparison";

const MODES: { id: PlanMode; label: string }[] = [
  { id: "criar", label: "Criar site" },
  { id: "manter", label: "Manter site" },
];

export function SpotlightStage() {
  const [mode, setMode] = useState<PlanMode>("criar");
  const [activeSlug, setActiveSlug] = useState<string>(() => featuredSlug("criar"));

  const plans = PLAN_SETS[mode];
  const activeIndex = Math.max(
    0,
    plans.findIndex((p) => p.eventSlug === activeSlug),
  );

  function switchMode(next: PlanMode) {
    if (next === mode) return;
    setMode(next);
    setActiveSlug(featuredSlug(next));
  }

  function step(dir: -1 | 1) {
    const next = (activeIndex + dir + plans.length) % plans.length;
    setActiveSlug(plans[next].eventSlug);
  }

  // one non-active plan slides left (-1), the other right (+1); active is centered (0)
  const others = plans.map((_, i) => i).filter((i) => i !== activeIndex);
  const posByIndex = new Map<number, number>([
    [activeIndex, 0],
    [others[0], -1],
    [others[1], 1],
  ]);

  return (
    <section id="planos-stage" className="relative px-6 py-20 md:py-28" aria-labelledby="stage-heading">
      <h2 id="stage-heading" className="sr-only">
        Escolha um plano
      </h2>

      {/* Toggle Criar / Manter */}
      <div
        role="tablist"
        aria-label="Tipo de plano"
        className="mx-auto mb-14 flex w-fit rounded-full border border-white/12 p-1"
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => switchMode(m.id)}
            data-umami-event="plano_toggle"
            data-umami-event-mode={m.id}
            className={`rounded-full px-6 py-2 text-xs tracking-[0.16em] uppercase transition-colors ${
              mode === m.id ? "bg-white text-black" : "text-white/45 hover:text-white/70"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Palco */}
      <div className="stage relative mx-auto max-w-6xl">
        {plans.map((plan, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={plan.eventSlug}
              className="stage-slot"
              data-active={isActive}
              style={{ "--pos": posByIndex.get(i) ?? 0 } as CSSProperties}
            >
              <StagePlanCard
                plan={plan}
                state={isActive ? "active" : "side"}
                onFocus={() => setActiveSlug(plan.eventSlug)}
              />
            </div>
          );
        })}
      </div>

      {/* Prev/next (mobile) */}
      <div className="mt-8 flex items-center justify-center gap-6 md:hidden">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Plano anterior"
          className="rounded-full border border-white/15 p-2 text-white/70 transition-colors hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-xs tracking-widest text-white/45 uppercase">
          {activeIndex + 1} / {plans.length}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Próximo plano"
          className="rounded-full border border-white/15 p-2 text-white/70 transition-colors hover:text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <PlanComparison plans={plans} />
    </section>
  );
}
