# Página /planos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir a página `/planos` como destino único de preço (move pricing da home pra cá), exibindo 3 one-time + 3 mensais + faixa custom, com preço cravado e funil único pro Cal.com.

**Architecture:** Página composta por atomic sections (`PlanosHero`, `OneTimeGrid`, `MonthlyGrid`, `CustomStrip`, `PlanosFaq`, `FinalCta` reutilizado). `PlanCard` existente é estendido pra aceitar `ctaLabel`/`ctaHref` (DRY entre one-time e mensais). Home perde `<Pricing/>` e ganha um `PlanosTeaser` mínimo com link pra /planos.

**Tech Stack:** Next.js 16.2 App Router · React 19 · Tailwind v4 · TypeScript · Vitest + React Testing Library · lucide-react.

**Decisões fixadas no brainstorm:**
- Mover pricing pra /planos; home só linka.
- One-time + Mensais + Custom (7 produtos).
- Preço cravado.
- Funil rápido pro Cal.com (CTA único em cada bloco, sem múltiplos paths).
- Tensão resolvida: 7 produtos em página única — separa visualmente em 2 grids + Custom strip + FAQ enxuta.

**Decisões fixadas pra evitar pergunta no meio da execução:**
- Headline: "Preço transparente. Escopo claro."
- Eyebrow: "Planos"
- Sub: "Três planos para criar. Três para manter. Você sabe o número antes da call."
- CTA de TODOS os cards (one-time e mensais) → `https://cal.com/` com texto "Agendar conversa". Justificativa: mensais exigem onboarding humano antes de cobrar; self-signup gera lead errado.
- Custom strip CTA: "Pedir brief" → mesma URL.
- Trabalho está em `web/`. Todos os caminhos abaixo são relativos à raiz do repo.
- Test runner: `npm test` rodado a partir de `web/`. Build: `npm run build` a partir de `web/`.

---

## File Structure

**Create:**
- `web/components/planos/planos-hero.tsx` — header da página (eyebrow + h1 + sub)
- `web/components/planos/one-time-grid.tsx` — 3 PlanCards one-time (atual conteúdo do Pricing)
- `web/components/planos/monthly-grid.tsx` — 3 PlanCards mensais (Base/Crescimento/Parceria)
- `web/components/planos/custom-strip.tsx` — bloco horizontal "Acima de R$ 25k? brief antes"
- `web/components/planos/planos-faq.tsx` — 5 perguntas específicas de planos
- `web/components/planos/planos-teaser.tsx` — bloco compacto na home com link pra /planos
- `web/app/planos/page.tsx` — composição da página
- Tests correspondentes (1:1)

**Modify:**
- `web/components/pricing/plan-card.tsx` — adicionar props `ctaLabel?` + `ctaHref?` (default mantém comportamento atual)
- `web/app/page.tsx` — remover `<Pricing/>`, adicionar `<PlanosTeaser/>`
- `web/tests/page.test.tsx` — remover expectativa de Pricing, adicionar expectativa de PlanosTeaser

**Delete:**
- `web/components/pricing/pricing.tsx` — substituído por `OneTimeGrid` dentro de `/planos`
- `web/tests/components/pricing/pricing.test.tsx` — substituído por teste de `OneTimeGrid`

---

## Pre-flight

- [ ] **Step P1: Confirme branch limpo**

Run: `git status --short`
Expected: vazio (ou só `?? web/public/image_Pippit_*.png` que é stray).

- [ ] **Step P2: Confirme testes brittle pré-existentes (baseline)**

Run (de `web/`): `npm test 2>&1 | grep -E "Test Files|Tests"`
Expected: contém "20 failed | 61 passed". Esse é o baseline pré-existente. Não pioramos.

- [ ] **Step P3: Confirme build verde**

Run (de `web/`): `npm run build`
Expected: "✓ Compiled successfully", sem TypeScript error.

---

## Task 1: Estender PlanCard com CTA customizável

**Files:**
- Modify: `web/components/pricing/plan-card.tsx`
- Test: `web/tests/components/pricing/plan-card.test.tsx`

- [ ] **Step 1.1: Adicionar teste pro CTA customizado**

Adicionar ao final do `describe("PlanCard", () => {...})` em `web/tests/components/pricing/plan-card.test.tsx`:

```ts
it("renders custom CTA label and href when provided", () => {
  render(
    <PlanCard
      name="Teste"
      price="R$ 1"
      cadence="único"
      description="d"
      features={["f"]}
      glow={0}
      ctaLabel="Assinar plano"
      ctaHref="https://example.com/sub"
    />,
  );
  const link = screen.getByRole("link", { name: /assinar plano/i });
  expect(link).toHaveAttribute("href", "https://example.com/sub");
});

it("falls back to default CTA when no props passed", () => {
  render(
    <PlanCard
      name="Teste"
      price="R$ 1"
      cadence="único"
      description="d"
      features={["f"]}
      glow={0}
    />,
  );
  const link = screen.getByRole("link", { name: /agendar conversa/i });
  expect(link).toHaveAttribute("href", "https://cal.com/");
});
```

- [ ] **Step 1.2: Rodar testes pra confirmar falha**

Run (de `web/`): `npx vitest run tests/components/pricing/plan-card.test.tsx`
Expected: o teste "renders custom CTA label and href" falha porque PlanCard ignora as props novas.

- [ ] **Step 1.3: Implementar props no PlanCard**

Editar `web/components/pricing/plan-card.tsx`:

Substituir o type `PlanCardProps`:

```ts
type PlanCardProps = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  glow: 0 | 1 | 2;
  featured?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};
```

Substituir a assinatura e o `<a>` final:

```tsx
export function PlanCard({
  name,
  price,
  cadence,
  description,
  features,
  glow,
  featured,
  ctaLabel = "Agendar conversa",
  ctaHref = "https://cal.com/",
}: PlanCardProps) {
  // ...existing body up to the <a>...
          <a
            href={ctaHref}
            className="group/cta flex items-center justify-between rounded-full border border-white/12 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white/30"
          >
            {ctaLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
          </a>
```

- [ ] **Step 1.4: Rodar testes pra confirmar verde**

Run (de `web/`): `npx vitest run tests/components/pricing/plan-card.test.tsx`
Expected: todos passando.

- [ ] **Step 1.5: Commit**

```bash
git add web/components/pricing/plan-card.tsx web/tests/components/pricing/plan-card.test.tsx
git commit -m "feat(pricing): PlanCard accepts ctaLabel and ctaHref props"
```

---

## Task 2: OneTimeGrid (substitui Pricing)

**Files:**
- Create: `web/components/planos/one-time-grid.tsx`
- Test: `web/tests/components/planos/one-time-grid.test.tsx`

- [ ] **Step 2.1: Escrever teste de renderização**

Criar `web/tests/components/planos/one-time-grid.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OneTimeGrid } from "@/components/planos/one-time-grid";

describe("OneTimeGrid", () => {
  it("renders three one-time plan headings", () => {
    render(<OneTimeGrid />);
    expect(screen.getByRole("heading", { level: 3, name: "Landing" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Institucional" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Branded" })).toBeInTheDocument();
  });

  it("marks the Institucional plan as featured", () => {
    render(<OneTimeGrid />);
    expect(screen.getByText(/mais escolhido/i)).toBeInTheDocument();
  });

  it("renders an Agendar conversa CTA per card pointing to Cal.com", () => {
    render(<OneTimeGrid />);
    const ctas = screen.getAllByRole("link", { name: /agendar conversa/i });
    expect(ctas).toHaveLength(3);
    ctas.forEach((c) => expect(c).toHaveAttribute("href", "https://cal.com/"));
  });

  it("renders the section heading", () => {
    render(<OneTimeGrid />);
    expect(screen.getByRole("heading", { level: 2, name: /para criar/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2.2: Confirmar falha**

Run (de `web/`): `npx vitest run tests/components/planos/one-time-grid.test.tsx`
Expected: FAIL — módulo não existe.

- [ ] **Step 2.3: Implementar OneTimeGrid**

Criar `web/components/planos/one-time-grid.tsx`:

```tsx
import { PlanCard } from "@/components/pricing/plan-card";
import { Reveal } from "@/components/ui/reveal";

const PLANS = [
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
    glow: 0 as const,
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
    glow: 1 as const,
    featured: true,
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
    glow: 2 as const,
  },
];

export function OneTimeGrid() {
  return (
    <section
      id="criar"
      className="relative px-6 py-24 md:py-32"
      aria-labelledby="one-time-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal as="header" className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
          <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
            Para criar
          </span>
          <h2
            id="one-time-heading"
            className="font-display max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl"
          >
            Para criar do zero.
          </h2>
          <p className="max-w-xl text-sm text-white/70 md:text-base">
            Pagamento único. Entrega completa. Sem mensalidade obrigatória depois.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 120}>
              <PlanCard {...plan} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2.4: Confirmar verde**

Run (de `web/`): `npx vitest run tests/components/planos/one-time-grid.test.tsx`
Expected: 4 passando.

- [ ] **Step 2.5: Commit**

```bash
git add web/components/planos/one-time-grid.tsx web/tests/components/planos/one-time-grid.test.tsx
git commit -m "feat(planos): OneTimeGrid renders 3 one-time plan cards"
```

---

## Task 3: MonthlyGrid (planos mensais recorrentes)

**Files:**
- Create: `web/components/planos/monthly-grid.tsx`
- Test: `web/tests/components/planos/monthly-grid.test.tsx`

- [ ] **Step 3.1: Escrever teste**

Criar `web/tests/components/planos/monthly-grid.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MonthlyGrid } from "@/components/planos/monthly-grid";

describe("MonthlyGrid", () => {
  it("renders three monthly plan headings", () => {
    render(<MonthlyGrid />);
    expect(screen.getByRole("heading", { level: 3, name: "Base" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Crescimento" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Parceria" })).toBeInTheDocument();
  });

  it("marks the Crescimento plan as featured", () => {
    render(<MonthlyGrid />);
    expect(screen.getByText(/mais escolhido/i)).toBeInTheDocument();
  });

  it("renders the section heading", () => {
    render(<MonthlyGrid />);
    expect(screen.getByRole("heading", { level: 2, name: /para manter/i })).toBeInTheDocument();
  });

  it("renders cadence with /mês indicator", () => {
    render(<MonthlyGrid />);
    expect(screen.getAllByText(/\/mês|por mês/i).length).toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Step 3.2: Confirmar falha**

Run (de `web/`): `npx vitest run tests/components/planos/monthly-grid.test.tsx`
Expected: FAIL — módulo não existe.

- [ ] **Step 3.3: Implementar MonthlyGrid**

Criar `web/components/planos/monthly-grid.tsx`:

```tsx
import { PlanCard } from "@/components/pricing/plan-card";
import { Reveal } from "@/components/ui/reveal";

const PLANS = [
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
    glow: 0 as const,
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
    glow: 1 as const,
    featured: true,
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
    glow: 2 as const,
  },
];

export function MonthlyGrid() {
  return (
    <section
      id="manter"
      className="relative px-6 py-24 md:py-32"
      aria-labelledby="monthly-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal as="header" className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
          <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
            Para manter
          </span>
          <h2
            id="monthly-heading"
            className="font-display max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl"
          >
            Para manter no ar.
          </h2>
          <p className="max-w-xl text-sm text-white/70 md:text-base">
            Opcional. Para quem entrega e quer continuar entregando — sem ter que cuidar do site.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 120}>
              <PlanCard {...plan} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3.4: Confirmar verde**

Run (de `web/`): `npx vitest run tests/components/planos/monthly-grid.test.tsx`
Expected: 4 passando.

- [ ] **Step 3.5: Commit**

```bash
git add web/components/planos/monthly-grid.tsx web/tests/components/planos/monthly-grid.test.tsx
git commit -m "feat(planos): MonthlyGrid renders 3 recurring plan cards"
```

---

## Task 4: CustomStrip (faixa textual)

**Files:**
- Create: `web/components/planos/custom-strip.tsx`
- Test: `web/tests/components/planos/custom-strip.test.tsx`

- [ ] **Step 4.1: Escrever teste**

Criar `web/tests/components/planos/custom-strip.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CustomStrip } from "@/components/planos/custom-strip";

describe("CustomStrip", () => {
  it("renders the custom headline", () => {
    render(<CustomStrip />);
    expect(screen.getByRole("heading", { level: 2, name: /sob medida/i })).toBeInTheDocument();
  });

  it("renders the briefing CTA pointing to Cal.com", () => {
    render(<CustomStrip />);
    const link = screen.getByRole("link", { name: /pedir brief/i });
    expect(link).toHaveAttribute("href", "https://cal.com/");
  });

  it("mentions the R$ 25.000 floor", () => {
    render(<CustomStrip />);
    expect(screen.getByText(/25\.000/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 4.2: Confirmar falha**

Run (de `web/`): `npx vitest run tests/components/planos/custom-strip.test.tsx`
Expected: FAIL — módulo não existe.

- [ ] **Step 4.3: Implementar CustomStrip**

Criar `web/components/planos/custom-strip.tsx`:

```tsx
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
                className="font-display mt-3 text-2xl font-semibold leading-[1.1] md:text-4xl"
              >
                Projeto <em className="font-display italic">sob medida</em>.
              </h2>
              <p className="mt-4 text-sm text-white/70 md:text-base">
                Escopo fora do padrão ou orçamento acima de R$ 25.000. Brief de 30 minutos antes do orçamento — sem número chutado no email.
              </p>
            </div>
            <a
              href="https://cal.com/"
              className="group inline-flex items-center justify-between gap-3 rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:border-white/40"
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
```

- [ ] **Step 4.4: Confirmar verde**

Run (de `web/`): `npx vitest run tests/components/planos/custom-strip.test.tsx`
Expected: 3 passando.

- [ ] **Step 4.5: Commit**

```bash
git add web/components/planos/custom-strip.tsx web/tests/components/planos/custom-strip.test.tsx
git commit -m "feat(planos): CustomStrip with brief CTA"
```

---

## Task 5: PlanosFaq (perguntas específicas de planos)

**Files:**
- Create: `web/components/planos/planos-faq.tsx`
- Test: `web/tests/components/planos/planos-faq.test.tsx`

- [ ] **Step 5.1: Escrever teste**

Criar `web/tests/components/planos/planos-faq.test.tsx`:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PlanosFaq } from "@/components/planos/planos-faq";

describe("PlanosFaq", () => {
  it("renders all five scope-specific questions", () => {
    render(<PlanosFaq />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(5);
  });

  it("opens the first question by default", () => {
    render(<PlanosFaq />);
    const first = screen.getAllByRole("button")[0];
    expect(first).toHaveAttribute("aria-expanded", "true");
  });

  it("opens a clicked question and closes the previously open one", () => {
    render(<PlanosFaq />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[2]);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
    expect(buttons[2]).toHaveAttribute("aria-expanded", "true");
  });
});
```

- [ ] **Step 5.2: Confirmar falha**

Run (de `web/`): `npx vitest run tests/components/planos/planos-faq.test.tsx`
Expected: FAIL.

- [ ] **Step 5.3: Implementar PlanosFaq**

Criar `web/components/planos/planos-faq.tsx`:

```tsx
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
    a: "Base e Crescimento: cancelamento livre a qualquer momento. Parceria: contrato mínimo de 6 meses por causa do envolvimento estratégico — após esse período, mensal sem fidelidade.",
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
```

- [ ] **Step 5.4: Confirmar verde**

Run (de `web/`): `npx vitest run tests/components/planos/planos-faq.test.tsx`
Expected: 3 passando.

- [ ] **Step 5.5: Commit**

```bash
git add web/components/planos/planos-faq.tsx web/tests/components/planos/planos-faq.test.tsx
git commit -m "feat(planos): PlanosFaq with 5 scope-specific questions"
```

---

## Task 6: PlanosHero (header da página)

**Files:**
- Create: `web/components/planos/planos-hero.tsx`
- Test: `web/tests/components/planos/planos-hero.test.tsx`

- [ ] **Step 6.1: Escrever teste**

Criar `web/tests/components/planos/planos-hero.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PlanosHero } from "@/components/planos/planos-hero";

describe("PlanosHero", () => {
  it("renders the page H1", () => {
    render(<PlanosHero />);
    expect(
      screen.getByRole("heading", { level: 1, name: /preço transparente/i }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow label", () => {
    render(<PlanosHero />);
    expect(screen.getByText(/^Planos$/)).toBeInTheDocument();
  });

  it("renders the subhead", () => {
    render(<PlanosHero />);
    expect(screen.getByText(/você sabe o número antes/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6.2: Confirmar falha**

Run (de `web/`): `npx vitest run tests/components/planos/planos-hero.test.tsx`
Expected: FAIL.

- [ ] **Step 6.3: Implementar PlanosHero**

Criar `web/components/planos/planos-hero.tsx`:

```tsx
import { Reveal } from "@/components/ui/reveal";

export function PlanosHero() {
  return (
    <section
      className="relative px-6 pt-32 pb-12 md:pt-40 md:pb-16"
      aria-labelledby="planos-hero-heading"
    >
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Planos
        </span>
        <h1
          id="planos-hero-heading"
          className="font-display text-4xl font-semibold leading-[1.02] tracking-tight md:text-7xl"
        >
          Preço <em className="font-display italic">transparente</em>. Escopo claro.
        </h1>
        <p className="max-w-xl text-base text-white/70 md:text-lg">
          Três planos para criar. Três para manter. Você sabe o número antes da call.
        </p>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 6.4: Confirmar verde**

Run (de `web/`): `npx vitest run tests/components/planos/planos-hero.test.tsx`
Expected: 3 passando.

- [ ] **Step 6.5: Commit**

```bash
git add web/components/planos/planos-hero.tsx web/tests/components/planos/planos-hero.test.tsx
git commit -m "feat(planos): PlanosHero with page-level headline"
```

---

## Task 7: Página /planos (composição)

**Files:**
- Create: `web/app/planos/page.tsx`
- Test: `web/tests/app/planos-page.test.tsx`

- [ ] **Step 7.1: Escrever teste**

Criar `web/tests/app/planos-page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PlanosPage from "@/app/planos/page";

describe("PlanosPage", () => {
  it("renders the page H1", () => {
    render(<PlanosPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /preço transparente/i }),
    ).toBeInTheDocument();
  });

  it("renders the one-time grid heading", () => {
    render(<PlanosPage />);
    expect(screen.getByRole("heading", { level: 2, name: /para criar/i })).toBeInTheDocument();
  });

  it("renders the monthly grid heading", () => {
    render(<PlanosPage />);
    expect(screen.getByRole("heading", { level: 2, name: /para manter/i })).toBeInTheDocument();
  });

  it("renders the custom strip heading", () => {
    render(<PlanosPage />);
    expect(screen.getByRole("heading", { level: 2, name: /sob medida/i })).toBeInTheDocument();
  });

  it("renders the planos FAQ", () => {
    render(<PlanosPage />);
    expect(screen.getByRole("heading", { level: 2, name: /escopo, pagamento/i })).toBeInTheDocument();
  });

  it("renders the final CTA", () => {
    render(<PlanosPage />);
    expect(screen.getByRole("heading", { level: 2, name: /no prumo/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 7.2: Confirmar falha**

Run (de `web/`): `npx vitest run tests/app/planos-page.test.tsx`
Expected: FAIL — módulo não existe.

- [ ] **Step 7.3: Implementar página**

Criar `web/app/planos/page.tsx`:

```tsx
import type { Metadata } from "next";
import { PlanosHero } from "@/components/planos/planos-hero";
import { OneTimeGrid } from "@/components/planos/one-time-grid";
import { MonthlyGrid } from "@/components/planos/monthly-grid";
import { CustomStrip } from "@/components/planos/custom-strip";
import { PlanosFaq } from "@/components/planos/planos-faq";
import { FinalCta } from "@/components/cta/final-cta";
import { Footer } from "@/components/footer/footer";
import { AmbientVideo } from "@/components/ambient/ambient-video";

export const metadata: Metadata = {
  title: "Planos · Prumo",
  description:
    "Preço transparente. Três planos para criar (Landing, Institucional, Branded), três para manter (Base, Crescimento, Parceria) e projetos custom sob briefing.",
};

const AMBIENT_VIDEOS = ["/ambient.mp4", "/ambient-2.mp4"];

export default function PlanosPage() {
  return (
    <>
      <AmbientVideo srcs={AMBIENT_VIDEOS}>
        <PlanosHero />
        <OneTimeGrid />
        <MonthlyGrid />
        <CustomStrip />
        <PlanosFaq />
        <FinalCta />
      </AmbientVideo>
      <Footer />
    </>
  );
}
```

- [ ] **Step 7.4: Confirmar verde**

Run (de `web/`): `npx vitest run tests/app/planos-page.test.tsx`
Expected: 6 passando.

- [ ] **Step 7.5: Build smoke check**

Run (de `web/`): `npm run build`
Expected: "✓ Compiled successfully", e o output de rotas inclui `/planos`.

- [ ] **Step 7.6: Commit**

```bash
git add web/app/planos/page.tsx web/tests/app/planos-page.test.tsx
git commit -m "feat(planos): /planos route composing hero + grids + custom + faq + cta"
```

---

## Task 8: PlanosTeaser (substitui Pricing na home)

**Files:**
- Create: `web/components/planos/planos-teaser.tsx`
- Test: `web/tests/components/planos/planos-teaser.test.tsx`

- [ ] **Step 8.1: Escrever teste**

Criar `web/tests/components/planos/planos-teaser.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PlanosTeaser } from "@/components/planos/planos-teaser";

describe("PlanosTeaser", () => {
  it("renders a link pointing to /planos", () => {
    render(<PlanosTeaser />);
    const link = screen.getByRole("link", { name: /ver todos os planos/i });
    expect(link).toHaveAttribute("href", "/planos");
  });

  it("renders the teaser headline", () => {
    render(<PlanosTeaser />);
    expect(
      screen.getByRole("heading", { level: 2, name: /preço transparente/i }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 8.2: Confirmar falha**

Run (de `web/`): `npx vitest run tests/components/planos/planos-teaser.test.tsx`
Expected: FAIL.

- [ ] **Step 8.3: Implementar PlanosTeaser**

Criar `web/components/planos/planos-teaser.tsx`:

```tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function PlanosTeaser() {
  return (
    <section
      id="planos"
      className="relative px-6 py-32 md:py-40"
      aria-labelledby="planos-teaser-heading"
    >
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Planos
        </span>
        <h2
          id="planos-teaser-heading"
          className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
        >
          Preço transparente. <em className="font-display italic">Escopo claro.</em>
        </h2>
        <p className="max-w-xl text-base text-white/70 md:text-lg">
          Três planos para criar, três para manter, projetos custom sob briefing. Sem orçamento por email.
        </p>
        <Link
          href="/planos"
          className="group mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white transition-colors hover:border-white/40"
        >
          Ver todos os planos
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 8.4: Confirmar verde**

Run (de `web/`): `npx vitest run tests/components/planos/planos-teaser.test.tsx`
Expected: 2 passando.

- [ ] **Step 8.5: Commit**

```bash
git add web/components/planos/planos-teaser.tsx web/tests/components/planos/planos-teaser.test.tsx
git commit -m "feat(planos): PlanosTeaser bloco compacto pra home"
```

---

## Task 9: Trocar Pricing por PlanosTeaser na home + ajustar tests

**Files:**
- Modify: `web/app/page.tsx`
- Modify: `web/tests/page.test.tsx`

- [ ] **Step 9.1: Atualizar teste da home**

Editar `web/tests/page.test.tsx` — substituir TODA expectativa de Pricing pelo PlanosTeaser.

Localizar o bloco `it("renders the pricing section", ...)` e substituir por:

```ts
it("renders the planos teaser pointing to /planos", () => {
  render(<HomePage />);
  const link = screen.getByRole("link", { name: /ver todos os planos/i });
  expect(link).toHaveAttribute("href", "/planos");
});
```

- [ ] **Step 9.2: Confirmar falha**

Run (de `web/`): `npx vitest run tests/page.test.tsx`
Expected: o novo teste FAIL ("ver todos os planos" não está na home).

- [ ] **Step 9.3: Trocar import e jsx em page.tsx**

Editar `web/app/page.tsx`:

Substituir `import { Pricing } from "@/components/pricing/pricing";` por:

```tsx
import { PlanosTeaser } from "@/components/planos/planos-teaser";
```

E dentro do JSX, trocar `<Pricing />` por `<PlanosTeaser />`.

- [ ] **Step 9.4: Confirmar verde**

Run (de `web/`): `npx vitest run tests/page.test.tsx`
Expected: o novo teste passa. Os outros 4 da home podem continuar com o mesmo estado de antes (não pioramos baseline).

- [ ] **Step 9.5: Commit**

```bash
git add web/app/page.tsx web/tests/page.test.tsx
git commit -m "feat(home): replace Pricing section with PlanosTeaser linking to /planos"
```

---

## Task 10: Cleanup — remover Pricing antigo

**Files:**
- Delete: `web/components/pricing/pricing.tsx`
- Delete: `web/tests/components/pricing/pricing.test.tsx`

- [ ] **Step 10.1: Confirmar que nada importa mais o Pricing**

Run (de `E:\Projetos\Prumo`): `git grep -n "from \"@/components/pricing/pricing\"" -- web/`
Expected: nenhum match (vazio).

Se houver match: PARAR. Voltar e ajustar o caller antes de deletar.

- [ ] **Step 10.2: Deletar arquivos**

```bash
git rm web/components/pricing/pricing.tsx web/tests/components/pricing/pricing.test.tsx
```

- [ ] **Step 10.3: Rodar build + testes**

Run (de `web/`): `npm run build`
Expected: ✓ Compiled successfully. Output de rotas inclui `/planos`.

Run (de `web/`): `npm test 2>&1 | grep -E "Test Files|Tests"`
Expected: contagem de "passed" ≥ baseline (61) + novos testes adicionados nas tasks 1-9 (~25 novos). "failed" ≤ baseline (20). Não pioramos.

- [ ] **Step 10.4: Commit**

```bash
git commit -m "chore(pricing): remove old Pricing component superseded by OneTimeGrid"
```

---

## Task 11: Push final

- [ ] **Step 11.1: Confirmar branch**

Run: `git branch --show-current`
Expected: `main` (a sessão está direta em main desde o ff-merge anterior).

Se estiver em outro branch: rodar `git checkout main && git merge --ff-only <branch>` primeiro.

- [ ] **Step 11.2: Push**

Run: `git push origin main`
Expected: push limpo, sem rejeição.

- [ ] **Step 11.3: Verificar repositório no GitHub**

Run: `gh repo view Breqsz/prumo --web`
Expected: abre `https://github.com/Breqsz/prumo` no browser; nova lista de commits visível.

---

## Self-Review

**Spec coverage:**
- "Mover pricing pra /planos" → Tasks 2 + 7 + 9 + 10. ✓
- "One-time + Mensais + Custom" → Tasks 2, 3, 4. ✓
- "Preço cravado" → Valores literais em PLANS arrays (Tasks 2 e 3) e CustomStrip menciona o piso R$25k. ✓
- "Funil rápido pro Cal.com" → Todos os CTAs (cards, custom, FinalCta) apontam a `https://cal.com/`. CTA único por bloco. ✓
- Headline/eyebrow/sub fixados no plano → Task 6. ✓
- "Sem orçamento por email" → mencionado em PlanosTeaser (Task 8) e implícito em CustomStrip ("sem número chutado no email"). ✓

**Placeholder scan:** Sem TBD, sem TODO, sem "implement later". Todo código exibido inline em code blocks. ✓

**Type consistency:**
- `PlanCardProps` (Task 1) — `ctaLabel`/`ctaHref` opcionais usados por OneTimeGrid (Task 2) e MonthlyGrid (Task 3) via defaults. ✓
- `OneTimeGrid` exportado como named export, importado em `/planos/page.tsx`. ✓
- `MonthlyGrid`, `CustomStrip`, `PlanosFaq`, `PlanosHero`, `PlanosTeaser` — todos named exports consistentes. ✓
- Routes: `/planos` em `web/app/planos/page.tsx` (App Router, default export). ✓

**Test paths verificados:**
- `web/tests/app/planos-page.test.tsx` — pasta `tests/app/` não existe ainda; vitest aceita criar. Confirmar no Step 7.1 que `vitest.config.ts` não restringe pasta. (Já vi pattern `tests/page.test.tsx` no root, então `tests/app/` deve funcionar dado o glob padrão `tests/**/*.test.{ts,tsx}`.)

---

## Riscos e débito conhecidos

- **20 testes baseline falham** desde antes do plano (hero-nav, rotating-phrase, reveal, faq, cta, page). Não são bloqueio pro deploy (build verde). Plano separado pra consertar testes pode rodar em paralelo ou depois — esse plano NÃO pretende consertá-los.
- **Preços ainda não confirmados pelo cliente** (CONTEXT.md §4). Quando confirmar, basta alterar os arrays PLANS em `one-time-grid.tsx` e `monthly-grid.tsx`. O esqueleto não muda.
- **CTAs todos apontam para `https://cal.com/`** (placeholder; troque pelo handle real assim que tiver: ex. `https://cal.com/prumo/30min`). Documentado em CONTEXT.md.
- **WhatsApp flutuante secundário** mencionado em CONTEXT.md §7 não está implementado e não entra neste plano (escopo separado).
- **Sticky nav / TOC interno na /planos** não implementado. Página rola natural. Se virar muro de info na prática, adicionar mini-nav num PR follow-up.
