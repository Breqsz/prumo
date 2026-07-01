import type { ReactNode } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { ElectricBorder } from "@/components/effects/electric-border";
import type { Plan } from "@/lib/plans";

type StagePlanCardProps = {
  plan: Plan;
  state: "active" | "side";
  onFocus: () => void;
};

const CARD_BG =
  "linear-gradient(#0E0E10, #0A0A0A) padding-box, linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.08) 80%, rgba(255,255,255,0.35) 100%) border-box";

function CardShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative h-full overflow-hidden rounded-[28px]"
      style={{ background: CARD_BG, border: "1px solid transparent" }}
    >
      {children}
    </div>
  );
}

export function StagePlanCard({ plan, state, onFocus }: StagePlanCardProps) {
  if (state === "side") {
    return (
      <button
        type="button"
        onClick={onFocus}
        aria-label={`Focar plano ${plan.name}`}
        data-umami-event="plano_focus"
        data-umami-event-plano={plan.eventSlug}
        className="group block w-[16rem] rounded-[28px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        <CardShell>
          <div className="flex flex-col gap-4 p-7">
            <span className="font-display block text-3xl leading-none italic">{plan.name}</span>
            <div className="flex flex-col gap-1">
              <span className="font-display text-2xl leading-none">{plan.price}</span>
              <span className="text-[10px] tracking-widest text-white/45 uppercase">
                {plan.cadence}
              </span>
            </div>
            <ul className="flex flex-col gap-2 text-xs text-white/60">
              {plan.features.slice(0, 3).map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/45" strokeWidth={2} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardShell>
      </button>
    );
  }

  return (
    <div className="relative w-[22rem]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 inset-y-10 rounded-[40px]"
        style={{ background: "rgba(255,255,255,0.18)", filter: "blur(100px)" }}
      />
      <ElectricBorder color="#ffffff" borderRadius={28} className="relative z-10">
        <CardShell>
          <div className="flex flex-col gap-7 p-9">
            <header className="flex flex-col gap-3">
              {plan.featured && (
                <span className="self-start rounded-full border border-white/15 px-3 py-1 text-[10px] tracking-[0.25em] text-white/70 uppercase">
                  Mais escolhido
                </span>
              )}
              <h3 className="font-display text-5xl leading-none italic">{plan.name}</h3>
              <p className="text-sm text-white/55">{plan.description}</p>
            </header>

            <div className="flex flex-col gap-1 border-y border-white/8 py-5">
              <span className="font-display text-4xl leading-none">{plan.price}</span>
              <span className="text-[11px] tracking-widest text-white/45 uppercase">
                {plan.cadence}
              </span>
            </div>

            <ul className="flex flex-col gap-3 text-sm text-white/75">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-white/55" strokeWidth={2} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <a
              href="/contato"
              className="group/cta flex items-center justify-between rounded-full border border-white/12 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white/30"
              data-umami-event="plano_click"
              data-umami-event-plano={plan.eventSlug}
            >
              Agendar conversa
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
            </a>
          </div>
        </CardShell>
      </ElectricBorder>
    </div>
  );
}
