"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Plan } from "@/lib/plans";
import { StagePlanCard } from "./stage-plan-card";

export function PlanComparison({ plans }: { plans: Plan[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="mt-12 flex flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white/80"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
        {open ? "ocultar comparação" : "ver comparação completa dos 3 planos"}
      </button>

      {open && (
        <div
          id={panelId}
          className="mt-10 grid w-full max-w-6xl grid-cols-1 items-stretch gap-6 md:grid-cols-3"
        >
          {plans.map((plan) => (
            <div key={plan.eventSlug} className="flex justify-center">
              <StagePlanCard plan={plan} state="active" onFocus={() => {}} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
