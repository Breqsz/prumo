import { ArrowUpRight, Check } from "lucide-react";
import { ElectricBorder } from "@/components/effects/electric-border";
import { StarBorder } from "@/components/effects/star-border";

type PlanCardProps = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  /** Glow intensity: 0 (subtle) → 2 (strongest). Communicates plan tier visually. */
  glow: 0 | 1 | 2;
  featured?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};

const GLOW_STYLES = [
  { background: "rgba(255, 255, 255, 0.05)", filter: "blur(70px)" },
  { background: "rgba(255, 255, 255, 0.10)", filter: "blur(80px)" },
  { background: "rgba(255, 255, 255, 0.18)", filter: "blur(100px)" },
] as const;

export function PlanCard({
  name,
  price,
  cadence,
  description,
  features,
  glow,
  featured,
  ctaLabel = "Agendar conversa",
  ctaHref = "/contato",
}: PlanCardProps) {
  const inner = (
    <div
      className="relative h-full overflow-hidden rounded-[28px]"
      style={{
        background:
          "linear-gradient(#0E0E10, #0A0A0A) padding-box, linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.08) 80%, rgba(255,255,255,0.35) 100%) border-box",
        border: "1px solid transparent",
      }}
    >
      <div className="flex h-full flex-col gap-8 p-8 md:p-10">
        <header className="flex flex-col gap-3">
          {featured && (
            <span className="self-start rounded-full border border-white/15 px-3 py-1 text-[10px] tracking-[0.25em] text-white/70 uppercase">
              Mais escolhido
            </span>
          )}
          <h3 className="font-display text-4xl leading-none italic md:text-5xl">
            {name}
          </h3>
          <p className="text-sm text-white/55">{description}</p>
        </header>

        <div className="flex flex-col gap-1 border-y border-white/8 py-5">
          <span className="font-display text-3xl leading-none md:text-4xl">
            {price}
          </span>
          <span className="text-[11px] tracking-widest text-white/45 uppercase">
            {cadence}
          </span>
        </div>

        <ul className="flex flex-1 flex-col gap-3 text-sm text-white/75">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-white/55"
                strokeWidth={2}
              />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <a
          href={ctaHref}
          className="group/cta flex items-center justify-between rounded-full border border-white/12 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white/30"
        >
          {ctaLabel}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
        </a>
      </div>
    </div>
  );

  return (
    <div className="group relative flex w-full flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 inset-y-10 rounded-[40px]"
        style={GLOW_STYLES[glow]}
      />

      {featured ? (
        <ElectricBorder
          color="#ffffff"
          borderRadius={28}
          className="relative z-10 h-full w-full"
        >
          {inner}
        </ElectricBorder>
      ) : (
        <StarBorder
          color="rgba(255,255,255,0.7)"
          speed="6s"
          thickness={2}
          borderRadius={28}
          className="relative z-10 h-full"
        >
          {inner}
        </StarBorder>
      )}
    </div>
  );
}
