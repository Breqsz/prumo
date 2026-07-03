"use client";

import { useState, useRef, type CSSProperties } from "react";
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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

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

  function onTabKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const idx = MODES.findIndex((m) => m.id === mode);
    const nextIdx =
      e.key === "ArrowRight"
        ? (idx + 1) % MODES.length
        : (idx - 1 + MODES.length) % MODES.length;
    switchMode(MODES[nextIdx].id);
    tabRefs.current[nextIdx]?.focus();
  }

  function step(dir: -1 | 1) {
    const next = (activeIndex + dir + plans.length) % plans.length;
    setActiveSlug(plans[next].eventSlug);
  }

  // swipe horizontal (mobile): esquerda → próximo, direita → anterior.
  // ignora gestos majoritariamente verticais para não roubar o scroll da página.
  function onStageTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function onStageTouchEnd(e: React.TouchEvent) {
    const start = touchStart.current;
    if (!start) return;
    touchStart.current = null;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
    step(dx < 0 ? 1 : -1);
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
        {MODES.map((m, i) => (
          <button
            key={m.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            role="tab"
            aria-selected={mode === m.id}
            tabIndex={mode === m.id ? 0 : -1}
            onClick={() => switchMode(m.id)}
            onKeyDown={onTabKeyDown}
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

      {/* Palco — keyed by mode so the stage-in reveal replays on category switch */}
      <div
        key={mode}
        className="stage relative mx-auto max-w-6xl touch-pan-y"
        onTouchStart={onStageTouchStart}
        onTouchEnd={onStageTouchEnd}
      >
        {plans.map((plan, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={plan.eventSlug}
              className="stage-slot"
              data-active={isActive || undefined}
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
