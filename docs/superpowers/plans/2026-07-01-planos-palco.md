# Planos "Palco" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir os 6 cards da página `/planos` por um "palco" que ilumina um plano por vez (jukebox slide-to-center), com toggle Criar/Manter e comparação sob demanda, aumentando atenção, clareza e conversão.

**Architecture:** Um client component `SpotlightStage` guarda o estado (`mode` + plano ativo) e posiciona 3 cards num grid-stack; cada card recebe uma posição (-1/0/+1) via CSS custom property `--pos` e desliza por `transform` (CSS, sem lib de motion). `StagePlanCard` é presentational (estado `active` ou `side`). `PlanComparison` expande os 3 cards completos sob demanda. Dados vêm de `lib/plans.ts` (fonte única, hoje duplicada nos dois grids).

**Tech Stack:** Next 16 (App Router) · React 19 · TypeScript · Tailwind 4 · Vitest 4 + Testing Library (happy-dom) · lucide-react · efeito `ElectricBorder` existente.

## Global Constraints

- **Sem cor / accent colorido** — só dark + branco puro (`#FFFFFF`/opacidades). Hierarquia por escala/opacidade/glass. (ADR 0001.)
- **Sem dependência nova** (nada de `framer-motion`). Motion só em CSS.
- **Motion ≤ 300ms** e obrigatoriamente respeitar `prefers-reduced-motion`.
- **Tipografia:** display via classe `font-display` (Instrument Serif, já configurada), corpo Inter.
- **Preços, cadências, descrições e features copiados VERBATIM** dos componentes atuais — não reescrever copy.
- **Preservar eventos umami declarativos** (`data-umami-event`), padrão do Tier 2.
- **Alias de import:** `@` = raiz de `web/` (ex.: `@/lib/plans`, `@/components/planos/...`).
- **Testes:** `tests/**/*.test.tsx`, ambiente happy-dom, `render/screen` de `@testing-library/react`.

---

### Task 1: Dados unificados (`lib/plans.ts`)

**Files:**
- Create: `web/lib/plans.ts`
- Test: `web/tests/lib/plans.test.ts`

**Interfaces:**
- Produces:
  - `type Plan = { name: string; price: string; cadence: string; description: string; features: string[]; featured?: boolean; eventSlug: string }`
  - `type PlanMode = "criar" | "manter"`
  - `const CRIAR_PLANS: Plan[]`, `const MANTER_PLANS: Plan[]`
  - `const PLAN_SETS: Record<PlanMode, Plan[]>`
  - `function featuredSlug(mode: PlanMode): string`

- [ ] **Step 1: Write the failing test**

```tsx
// web/tests/lib/plans.test.ts
import { describe, it, expect } from "vitest";
import { CRIAR_PLANS, MANTER_PLANS, PLAN_SETS, featuredSlug } from "@/lib/plans";

describe("plans data", () => {
  it("has three criar and three manter plans", () => {
    expect(CRIAR_PLANS).toHaveLength(3);
    expect(MANTER_PLANS).toHaveLength(3);
  });
  it("each set has exactly one featured plan", () => {
    expect(CRIAR_PLANS.filter((p) => p.featured)).toHaveLength(1);
    expect(MANTER_PLANS.filter((p) => p.featured)).toHaveLength(1);
  });
  it("featuredSlug returns the featured plan's slug per mode", () => {
    expect(featuredSlug("criar")).toBe("institucional");
    expect(featuredSlug("manter")).toBe("crescimento");
  });
  it("PLAN_SETS maps modes to arrays", () => {
    expect(PLAN_SETS.criar).toBe(CRIAR_PLANS);
    expect(PLAN_SETS.manter).toBe(MANTER_PLANS);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web && npx vitest run tests/lib/plans.test.ts`
Expected: FAIL — cannot resolve `@/lib/plans`.

- [ ] **Step 3: Write the implementation**

```ts
// web/lib/plans.ts
export type Plan = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  featured?: boolean;
  /** Umami slug for plano_click / plano_focus events */
  eventSlug: string;
};

export type PlanMode = "criar" | "manter";

export const CRIAR_PLANS: Plan[] = [
  {
    name: "Landing",
    price: "R$ 3.500",
    cadence: "Pagamento único · 10 dias",
    description:
      "Página única de alta conversão para validar uma oferta ou capturar leads qualificados.",
    features: [
      "Design e cópia sob medida",
      "1 idioma",
      "Performance e SEO técnico",
      "Domínio e deploy inclusos",
    ],
    eventSlug: "landing",
  },
  {
    name: "Institucional",
    price: "R$ 8.500",
    cadence: "Pagamento único · 21 dias",
    description:
      "Site multi-página para profissionalizar a marca e gerar autoridade no mercado.",
    features: [
      "Até 6 páginas",
      "CMS leve para conteúdo",
      "Formulário com integração",
      "PT-BR + EN opcional",
      "Performance e SEO completos",
    ],
    featured: true,
    eventSlug: "institucional",
  },
  {
    name: "Branded",
    price: "a partir de R$ 18.000",
    cadence: "Pagamento único · 30 a 45 dias",
    description:
      "Projeto custom com identidade integrada, animações sob medida e CMS robusto.",
    features: [
      "Escopo desenhado a quatro mãos",
      "Identidade visual integrada",
      "Animações e interações custom",
      "CMS robusto",
      "Implantação acompanhada",
    ],
    eventSlug: "branded",
  },
];

export const MANTER_PLANS: Plan[] = [
  {
    name: "Base",
    price: "R$ 397",
    cadence: "por mês · cancela quando quiser",
    description:
      "Mantém o site no ar, atualizado e seguro. Para quem precisa do mínimo bem-feito.",
    features: [
      "Hospedagem e CDN",
      "Backups automáticos",
      "Atualizações de segurança",
      "2h de alterações por mês",
    ],
    eventSlug: "base",
  },
  {
    name: "Crescimento",
    price: "R$ 997",
    cadence: "por mês · cancela quando quiser",
    description:
      "Mais horas, SEO técnico e suporte prioritário para quem está crescendo de verdade.",
    features: [
      "Tudo do Base",
      "6h por mês de design/dev",
      "SEO técnico recorrente",
      "Suporte prioritário",
    ],
    featured: true,
    eventSlug: "crescimento",
  },
  {
    name: "Parceria",
    price: "R$ 2.500",
    cadence: "por mês · contrato 6 meses",
    description:
      "Parceria contínua de estratégia, métricas e iteração. Quase um head of digital sob demanda.",
    features: [
      "Tudo do Crescimento",
      "12h por mês",
      "Reunião estratégica mensal",
      "Relatório de métricas",
      "A/B tests guiados",
    ],
    eventSlug: "parceria",
  },
];

export const PLAN_SETS: Record<PlanMode, Plan[]> = {
  criar: CRIAR_PLANS,
  manter: MANTER_PLANS,
};

export function featuredSlug(mode: PlanMode): string {
  const set = PLAN_SETS[mode];
  return (set.find((p) => p.featured) ?? set[0]).eventSlug;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web && npx vitest run tests/lib/plans.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add web/lib/plans.ts web/tests/lib/plans.test.ts
git commit -m "feat(planos): fonte única de dados dos planos (lib/plans.ts)"
```

---

### Task 2: `StagePlanCard` (card do palco)

**Files:**
- Create: `web/components/planos/stage-plan-card.tsx`
- Test: `web/tests/components/planos/stage-plan-card.test.tsx`

**Interfaces:**
- Consumes: `Plan` de `@/lib/plans`; `ElectricBorder` de `@/components/effects/electric-border`.
- Produces: `function StagePlanCard(props: { plan: Plan; state: "active" | "side"; onFocus: () => void }): JSX.Element`
  - `state="active"`: renderiza `<h3>` com o nome, descrição, TODAS as features, e um `<a href="/contato">` "Agendar conversa" com `data-umami-event="plano_click"`.
  - `state="side"`: renderiza um `<button aria-label="Focar plano {name}">` (chama `onFocus`), com nome, preço, cadência e até 3 features — SEM link de CTA.

- [ ] **Step 1: Write the failing test**

```tsx
// web/tests/components/planos/stage-plan-card.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StagePlanCard } from "@/components/planos/stage-plan-card";
import { CRIAR_PLANS } from "@/lib/plans";

const institucional = CRIAR_PLANS.find((p) => p.eventSlug === "institucional")!;
const landing = CRIAR_PLANS.find((p) => p.eventSlug === "landing")!;

describe("StagePlanCard", () => {
  it("active: renders name, description, every feature and a CTA to /contato", () => {
    render(<StagePlanCard plan={institucional} state="active" onFocus={() => {}} />);
    expect(screen.getByRole("heading", { level: 3, name: "Institucional" })).toBeInTheDocument();
    expect(screen.getByText(institucional.description)).toBeInTheDocument();
    institucional.features.forEach((f) => expect(screen.getByText(f)).toBeInTheDocument());
    const cta = screen.getByRole("link", { name: /agendar conversa/i });
    expect(cta).toHaveAttribute("href", "/contato");
    expect(cta).toHaveAttribute("data-umami-event", "plano_click");
    expect(cta).toHaveAttribute("data-umami-event-plano", "institucional");
  });

  it("side: renders a focus button, no CTA link, and calls onFocus on click", async () => {
    const onFocus = vi.fn();
    render(<StagePlanCard plan={landing} state="side" onFocus={onFocus} />);
    expect(screen.queryByRole("link", { name: /agendar conversa/i })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /focar plano landing/i }));
    expect(onFocus).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web && npx vitest run tests/components/planos/stage-plan-card.test.tsx`
Expected: FAIL — module `@/components/planos/stage-plan-card` not found.

- [ ] **Step 3: Write the implementation**

```tsx
// web/components/planos/stage-plan-card.tsx
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
            <h3 className="font-display text-3xl leading-none italic">{plan.name}</h3>
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web && npx vitest run tests/components/planos/stage-plan-card.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add web/components/planos/stage-plan-card.tsx web/tests/components/planos/stage-plan-card.test.tsx
git commit -m "feat(planos): StagePlanCard com estados active/side"
```

---

### Task 3: `PlanComparison` (comparação sob demanda)

**Files:**
- Create: `web/components/planos/plan-comparison.tsx`
- Test: `web/tests/components/planos/plan-comparison.test.tsx`

**Interfaces:**
- Consumes: `Plan` de `@/lib/plans`; `StagePlanCard` de `./stage-plan-card`.
- Produces: `function PlanComparison(props: { plans: Plan[] }): JSX.Element`
  - Botão com `aria-expanded` (default `false`). Conteúdo (3 cards `state="active"`) só é montado quando aberto.

- [ ] **Step 1: Write the failing test**

```tsx
// web/tests/components/planos/plan-comparison.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { PlanComparison } from "@/components/planos/plan-comparison";
import { CRIAR_PLANS } from "@/lib/plans";

describe("PlanComparison", () => {
  it("is collapsed by default and renders no plan headings", () => {
    render(<PlanComparison plans={CRIAR_PLANS} />);
    const toggle = screen.getByRole("button", { name: /ver comparação completa/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("heading", { level: 3, name: "Landing" })).not.toBeInTheDocument();
  });

  it("expands to show every plan when clicked", async () => {
    render(<PlanComparison plans={CRIAR_PLANS} />);
    const toggle = screen.getByRole("button", { name: /ver comparação completa/i });
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    CRIAR_PLANS.forEach((p) =>
      expect(screen.getByRole("heading", { level: 3, name: p.name })).toBeInTheDocument(),
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web && npx vitest run tests/components/planos/plan-comparison.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

```tsx
// web/components/planos/plan-comparison.tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web && npx vitest run tests/components/planos/plan-comparison.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add web/components/planos/plan-comparison.tsx web/tests/components/planos/plan-comparison.test.tsx
git commit -m "feat(planos): PlanComparison expansível"
```

---

### Task 4: CSS do palco + `SpotlightStage`

**Files:**
- Modify: `web/app/globals.css` (append — bloco `/* Planos — palco */`)
- Create: `web/components/planos/spotlight-stage.tsx`
- Test: `web/tests/components/planos/spotlight-stage.test.tsx`

**Interfaces:**
- Consumes: `PLAN_SETS`, `featuredSlug`, `PlanMode` de `@/lib/plans`; `StagePlanCard`; `PlanComparison`.
- Produces: `function SpotlightStage(): JSX.Element` — `"use client"`. Renderiza um `role="tablist"` (Criar/Manter), o palco (grid-stack, 1 card ativo por vez), prev/next mobile, e `PlanComparison`.

- [ ] **Step 1: Append the stage CSS**

Adicionar ao final de `web/app/globals.css`:

```css
/* Planos — palco / jukebox */
.stage {
  display: grid;
  grid-template-areas: "stack";
  place-items: center;
  min-height: 560px;
  --stage-offset: 0px;
}
@media (min-width: 768px) {
  .stage {
    --stage-offset: 340px;
  }
}
.stage-slot {
  grid-area: stack;
  --stage-scale: 0.82;
  --stage-op: 0.55;
  transform: translateX(calc(var(--pos) * var(--stage-offset))) scale(var(--stage-scale));
  opacity: var(--stage-op);
  transition:
    transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms cubic-bezier(0.22, 1, 0.36, 1);
}
.stage-slot[data-active="true"] {
  --stage-scale: 1;
  --stage-op: 1;
  z-index: 10;
}
/* Mobile: só o card ativo aparece; troca via prev/next */
@media (max-width: 767px) {
  .stage-slot:not([data-active="true"]) {
    opacity: 0;
    pointer-events: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .stage-slot {
    transition: opacity 120ms linear;
  }
}
```

> Nota: `web/app/globals.css` é o stylesheet global importado no `app/layout.tsx`. Se o projeto usar outro nome, apontar o mesmo arquivo global. Valores de offset/scale são o ponto de partida — ajustáveis no review visual.

- [ ] **Step 2: Write the failing test**

```tsx
// web/tests/components/planos/spotlight-stage.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { SpotlightStage } from "@/components/planos/spotlight-stage";

describe("SpotlightStage", () => {
  it("shows the three criar plans with Institucional active by default", () => {
    render(<SpotlightStage />);
    expect(screen.getByRole("heading", { level: 3, name: "Landing" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Institucional" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Branded" })).toBeInTheDocument();
    // exactly one CTA link exists — it belongs to the active plan
    const cta = screen.getByRole("link", { name: /agendar conversa/i });
    expect(cta).toHaveAttribute("data-umami-event-plano", "institucional");
  });

  it("switches to manter plans and resets active to Crescimento", async () => {
    render(<SpotlightStage />);
    await userEvent.click(screen.getByRole("tab", { name: /manter site/i }));
    expect(screen.getByRole("heading", { level: 3, name: "Crescimento" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /agendar conversa/i })).toHaveAttribute(
      "data-umami-event-plano",
      "crescimento",
    );
    expect(screen.queryByRole("heading", { level: 3, name: "Landing" })).not.toBeInTheDocument();
  });

  it("focusing a side plan makes it the active one", async () => {
    render(<SpotlightStage />);
    await userEvent.click(screen.getByRole("button", { name: /focar plano landing/i }));
    expect(screen.getByRole("link", { name: /agendar conversa/i })).toHaveAttribute(
      "data-umami-event-plano",
      "landing",
    );
  });

  it("exposes an accessible toggle with two tabs, criar selected by default", () => {
    render(<SpotlightStage />);
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByRole("tab", { name: /criar site/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd web && npx vitest run tests/components/planos/spotlight-stage.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 4: Write the implementation**

```tsx
// web/components/planos/spotlight-stage.tsx
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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd web && npx vitest run tests/components/planos/spotlight-stage.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add web/app/globals.css web/components/planos/spotlight-stage.tsx web/tests/components/planos/spotlight-stage.test.tsx
git commit -m "feat(planos): SpotlightStage (palco jukebox) + CSS do slide"
```

---

### Task 5: Ligar na página `/planos`

**Files:**
- Modify: `web/app/planos/page.tsx`
- Modify: `web/components/planos/planos-hero.tsx:26` (âncora do scroll hint)

**Interfaces:**
- Consumes: `SpotlightStage` de `@/components/planos/spotlight-stage`.

- [ ] **Step 1: Trocar a árvore da página**

Substituir o conteúdo de `web/app/planos/page.tsx` por:

```tsx
import type { Metadata } from "next";
import { HeroNav } from "@/components/hero/hero-nav";
import { PlanosHero } from "@/components/planos/planos-hero";
import { SpotlightStage } from "@/components/planos/spotlight-stage";
import { CustomStrip } from "@/components/planos/custom-strip";
import { PlanosFaq } from "@/components/planos/planos-faq";
import { FinalCta } from "@/components/cta/final-cta";
import { Footer } from "@/components/footer/footer";
import { AmbientVideo } from "@/components/ambient/ambient-video";

export const metadata: Metadata = {
  title: "Planos",
  description:
    "Sites sob medida e planos de manutenção contínua. Landing, institucional, projeto branded e mensalidades de parceria.",
  alternates: { canonical: "/planos" },
  openGraph: { url: "/planos" },
};

const AMBIENT_VIDEOS = ["/planos-1.mp4", "/planos-2.mp4"];

export default function PlanosPage() {
  return (
    <>
      <AmbientVideo srcs={AMBIENT_VIDEOS} spotlight>
        <HeroNav />
        <PlanosHero />
        <SpotlightStage />
        <CustomStrip />
        <PlanosFaq />
        <FinalCta />
      </AmbientVideo>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Corrigir a âncora do scroll hint**

Em `web/components/planos/planos-hero.tsx`, o link de scroll aponta para `#criar` (id da antiga `OneTimeGrid`, que deixa de existir). Trocar `href="#criar"` por `href="#planos-stage"`.

- [ ] **Step 3: Verificar que não há outras referências às âncoras antigas**

Run: `cd web && grep -rn "#criar\|#manter" app components`
Expected: nenhuma referência remanescente (fora da já corrigida). Se houver (ex.: em `HeroNav`), atualizar para `#planos-stage`.

- [ ] **Step 4: Rodar a suíte para garantir que nada quebrou**

Run: `cd web && npx vitest run`
Expected: PASS (os testes dos grids antigos ainda existem aqui e devem passar — serão removidos na Task 6).

- [ ] **Step 5: Commit**

```bash
git add web/app/planos/page.tsx web/components/planos/planos-hero.tsx
git commit -m "feat(planos): usar SpotlightStage na página de planos"
```

---

### Task 6: Remover componentes órfãos

**Files:**
- Delete: `web/components/planos/one-time-grid.tsx`
- Delete: `web/components/planos/monthly-grid.tsx`
- Delete: `web/components/pricing/plan-card.tsx`
- Delete: `web/tests/components/planos/one-time-grid.test.tsx`
- Delete: `web/tests/components/planos/monthly-grid.test.tsx`
- Delete: `web/tests/components/pricing/plan-card.test.tsx`

**Interfaces:** nenhuma — `grep` na Task 1/5 confirmou que só os dois grids usavam `PlanCard`, e a página não os importa mais.

- [ ] **Step 1: Confirmar que ninguém mais importa os removidos**

Run: `cd web && grep -rn "one-time-grid\|monthly-grid\|pricing/plan-card\|OneTimeGrid\|MonthlyGrid\|PlanCard" app components tests`
Expected: apenas os próprios arquivos que serão deletados (e seus testes). Se aparecer qualquer outro consumidor, PARAR e reavaliar.

- [ ] **Step 2: Deletar os arquivos**

```bash
cd web && git rm \
  components/planos/one-time-grid.tsx \
  components/planos/monthly-grid.tsx \
  components/pricing/plan-card.tsx \
  tests/components/planos/one-time-grid.test.tsx \
  tests/components/planos/monthly-grid.test.tsx \
  tests/components/pricing/plan-card.test.tsx
```

- [ ] **Step 3: Rodar a suíte inteira**

Run: `cd web && npx vitest run`
Expected: PASS — sem referências quebradas; testes novos (plans, stage-plan-card, plan-comparison, spotlight-stage) verdes.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore(planos): remover grids e PlanCard órfãos"
```

---

### Task 7: Barra de qualidade + review visual

**Files:** nenhum novo — verificação.

- [ ] **Step 1: Lint**

Run: `cd web && npm run lint`
Expected: sem erros. (Corrigir o que aparecer antes de seguir.)

- [ ] **Step 2: Testes**

Run: `cd web && npm run test`
Expected: toda a suíte PASS.

- [ ] **Step 3: Build**

Run: `cd web && npm run build`
Expected: build de produção conclui sem erro de tipo/compilação.

- [ ] **Step 4: Review visual no dev server**

Run: `cd web && npm run dev -- -p 3001` e abrir `http://localhost:3001/planos`. Conferir:
- Toggle Criar/Manter troca os 3 planos; âncora entra centralizado e iluminado.
- Clicar num card lateral desliza-o pro centro (~280ms), o antigo recua e escurece.
- `prefers-reduced-motion` (DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce): sem slide, troca por fade curto.
- Mobile (375/414): só o card ativo visível, prev/next funciona, contador `x / 3` correto.
- "ver comparação completa" expande os 3 cards e recolhe.
- **Legibilidade dos cards laterais** sobre o vídeo ambient — se estiver fraco, subir `--stage-op` das laterais ou adicionar scrim (ajuste no `globals.css`).

- [ ] **Step 5: Commit de eventuais ajustes de review**

```bash
git add -A
git commit -m "polish(planos): ajustes de review visual do palco"
```

---

## Self-Review

**Spec coverage:**
- Estrutura da página (Hero/CustomStrip/FAQ/FinalCta mantidos, grids → stage) → Task 5. ✓
- `SpotlightStage` (toggle, jukebox, âncora centrado, CTA no ativo) → Task 4. ✓
- `StagePlanCard` active/side → Task 2. ✓
- `PlanComparison` sob demanda → Task 3. ✓
- `lib/plans.ts` fonte única → Task 1. ✓
- Motion CSS + `prefers-reduced-motion` → Task 4 (CSS) + Task 7 (verificação). ✓
- Mobile (scroll/troca de card) → Task 4 (prev/next + CSS mobile) + Task 7. ✓
- Analytics `plano_click`/`plano_toggle`/`plano_focus` → Tasks 2 e 4. ✓
- Remoção de `OneTimeGrid`/`MonthlyGrid`/`PlanCard` + testes → Task 6. ✓
- Testes Vitest → Tasks 1–4 (TDD). ✓
- Quality bar (lint/test/build) → Task 7. ✓

> Desvio consciente vs. spec: a spec descrevia mobile como "scroll-snap carousel". O plano usa **1 card ativo + prev/next** no mobile — mesma intenção (foco em um plano por vez), porém single-DOM (evita render duplicado que quebraria os testes de heading) e a11y mais limpa. Registrar se o dono preferir o carousel.

**Placeholder scan:** sem TBD/TODO/"handle edge cases"/"similar to Task N". Código completo em cada step. ✓

**Type consistency:** `Plan`, `PlanMode`, `featuredSlug`, `PLAN_SETS` usados consistentemente entre Tasks 1→4. `StagePlanCard({ plan, state, onFocus })` idêntico onde consumido (Tasks 3 e 4). `data-umami-event-plano={plan.eventSlug}` consistente. ✓
