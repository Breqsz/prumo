# /sobre Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar a página `/sobre` do site Prumo com a estrutura aprovada (Hero + Manifesto + Método + Quem assina + CTA), usando placeholders honestos para nome/foto/bio/links sociais que o dono troca depois.

**Architecture:** Página Server Component em `web/app/sobre/page.tsx`, espelhando o padrão de `/planos` (`AmbientVideo` wrapper + `HeroNav` + seções + `Footer`). Quatro componentes novos isolados em `web/components/sobre/`. Reuso direto de `HeroNav`, `AmbientVideo`, `FinalCta`, `Footer`, `Reveal`, `LiquidGlass`.

**Tech Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Vitest + @testing-library/react + happy-dom. Ícones via `lucide-react`. Tipografia: Instrument Serif (display) + Inter (corpo).

**Spec de referência:** `docs/superpowers/specs/2026-05-26-sobre-page-design.md`

---

## File Structure

**Create:**
- `web/app/sobre/page.tsx` — Server Component, composição da página.
- `web/components/sobre/sobre-hero.tsx` — Hero da `/sobre` com kicker, h1 com italic e scroll hint.
- `web/components/sobre/manifesto.tsx` — Bloco de prosa editorial em 3-4 parágrafos com placeholders.
- `web/components/sobre/metodo.tsx` — Lista vertical numerada com 4 passos do método.
- `web/components/sobre/quem-assina.tsx` — Split foto/texto com placeholders honestos.

**Tests (create):**
- `web/tests/components/sobre/sobre-hero.test.tsx`
- `web/tests/components/sobre/metodo.test.tsx`
- `web/tests/components/sobre/quem-assina.test.tsx`
- `web/tests/app/sobre-page.test.tsx`

**No modifications to existing files.** Rota nova, componentes novos, sem mexer em `HeroNav`, `AmbientVideo`, `FinalCta`, `Footer`.

---

## Task 1: SobreHero — failing test

**Files:**
- Test: `web/tests/components/sobre/sobre-hero.test.tsx`

- [ ] **Step 1: Create the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SobreHero } from "@/components/sobre/sobre-hero";

describe("SobreHero", () => {
  it("renders the page H1", () => {
    render(<SobreHero />);
    expect(
      screen.getByRole("heading", { level: 1, name: /um estúdio\.\s*sem teatro/i }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow label", () => {
    render(<SobreHero />);
    expect(screen.getByText(/^Sobre$/)).toBeInTheDocument();
  });

  it("renders the subhead", () => {
    render(<SobreHero />);
    expect(screen.getByText(/solo, premium e sóbrio/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run from `web/`:
```
npm test -- tests/components/sobre/sobre-hero.test.tsx
```
Expected: FAIL — `Failed to resolve import "@/components/sobre/sobre-hero"`.

## Task 2: SobreHero — implementation

**Files:**
- Create: `web/components/sobre/sobre-hero.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function SobreHero() {
  return (
    <section
      className="relative flex min-h-screen items-start justify-center px-6 pt-32 pb-24 md:pt-40 md:pb-32"
      aria-labelledby="sobre-hero-heading"
    >
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Sobre
        </span>
        <h1
          id="sobre-hero-heading"
          className="font-display text-4xl font-semibold leading-[1.02] tracking-tight md:text-7xl"
        >
          Um estúdio. <em className="font-display italic">Sem teatro.</em>
        </h1>
        <p className="max-w-xl text-base text-white/70 md:text-lg">
          Solo, premium e sóbrio. Honestidade vale mais que tamanho.
        </p>
      </Reveal>

      <a
        href="#manifesto"
        aria-label="Rolar para o manifesto"
        className="prumo-scroll-hint absolute bottom-32 left-1/2 -translate-x-1/2 text-white/55 transition-colors hover:text-white md:bottom-40"
      >
        <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
      </a>
    </section>
  );
}
```

- [ ] **Step 2: Run test to verify it passes**

```
npm test -- tests/components/sobre/sobre-hero.test.tsx
```
Expected: PASS, 3 tests.

- [ ] **Step 3: Commit**

```
git add web/components/sobre/sobre-hero.tsx web/tests/components/sobre/sobre-hero.test.tsx
git commit -m "feat(sobre): SobreHero — kicker + headline + scroll hint"
```

## Task 3: Manifesto — implementation only (no test)

**Rationale para não testar:** o componente é prosa estática placeholder; teste vira espelho da copy e quebra no primeiro ajuste. A spec autoriza explicitamente pular teste deste componente.

**Files:**
- Create: `web/components/sobre/manifesto.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Reveal } from "@/components/ui/reveal";

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative px-6 py-24 md:py-32"
      aria-labelledby="manifesto-heading"
    >
      <Reveal className="mx-auto max-w-3xl">
        <span
          id="manifesto-heading"
          className="text-[11px] tracking-[0.3em] text-white/55 uppercase"
        >
          Manifesto
        </span>
        {/* TODO: copy final do manifesto (dono refina) */}
        <div className="mt-8 space-y-8 text-xl leading-relaxed text-white/80 md:text-2xl md:leading-relaxed">
          <p>
            O Prumo é um <em className="font-display italic">estúdio solo</em>. Uma pessoa do briefing à entrega. Sem time inflado, sem camadas, sem teatro de agência.
          </p>
          <p>
            A gente faz <em className="font-display italic">poucos projetos por ano</em> e trata cada um como se carregasse o nome inteiro da marca — porque carrega.
          </p>
          <p>
            Sites devem vender, profissionalizar ou lançar. Tudo que não serve a um desses três objetivos sai do escopo antes da primeira linha de código.
          </p>
          <p>
            Premium aqui não é luxo. É <em className="font-display italic">precisão</em>: a peça certa, no peso certo, no lugar certo. Nada a mais.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```
git add web/components/sobre/manifesto.tsx
git commit -m "feat(sobre): Manifesto — prosa editorial com placeholders"
```

## Task 4: Metodo — failing test

**Files:**
- Test: `web/tests/components/sobre/metodo.test.tsx`

- [ ] **Step 1: Create the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Metodo } from "@/components/sobre/metodo";

describe("Metodo", () => {
  it("renders the section heading", () => {
    render(<Metodo />);
    expect(screen.getByRole("heading", { level: 2, name: /como o prumo trabalha/i })).toBeInTheDocument();
  });

  it("renders the 4 method steps", () => {
    render(<Metodo />);
    expect(screen.getByRole("heading", { level: 3, name: /^alinhamento$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /^desenho$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /^construção$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /^lançamento$/i })).toBeInTheDocument();
  });

  it("renders the 4 step numbers", () => {
    render(<Metodo />);
    expect(screen.getByText(/^01$/)).toBeInTheDocument();
    expect(screen.getByText(/^02$/)).toBeInTheDocument();
    expect(screen.getByText(/^03$/)).toBeInTheDocument();
    expect(screen.getByText(/^04$/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```
npm test -- tests/components/sobre/metodo.test.tsx
```
Expected: FAIL — `Failed to resolve import "@/components/sobre/metodo"`.

## Task 5: Metodo — implementation

**Files:**
- Create: `web/components/sobre/metodo.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Reveal } from "@/components/ui/reveal";

type Step = {
  number: string;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    number: "01",
    title: "Alinhamento",
    description:
      "Briefing real, sem questionário decorativo. Em até 60 minutos a gente fecha objetivo, escopo, prazo e número.",
  },
  {
    number: "02",
    title: "Desenho",
    description:
      "Estrutura primeiro, estética depois. Arquitetura de conteúdo, fluxos e wireframes antes de qualquer pixel polido.",
  },
  {
    number: "03",
    title: "Construção",
    description:
      "Código sob medida ou no-code premium, decidido por projeto. Build incremental com preview navegável desde a primeira semana.",
  },
  {
    number: "04",
    title: "Lançamento",
    description:
      "Deploy, métricas e suporte ativo nos primeiros 30 dias. Marca no ar, não relatório no email.",
  },
];

export function Metodo() {
  return (
    <section
      id="metodo"
      className="relative px-6 py-24 md:py-32"
      aria-labelledby="metodo-heading"
    >
      <Reveal className="mx-auto max-w-4xl">
        <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Método
        </span>
        <h2
          id="metodo-heading"
          className="font-display mt-3 text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl"
        >
          Como o Prumo <em className="font-display italic">trabalha</em>.
        </h2>

        <ol className="mt-14 divide-y divide-white/10 border-t border-white/10">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="grid gap-4 py-8 md:grid-cols-[120px_1fr] md:gap-10 md:py-10"
            >
              <span className="font-display text-3xl text-white/45 md:text-5xl">
                {step.number}
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight md:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm text-white/65 md:text-base">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Run test to verify it passes**

```
npm test -- tests/components/sobre/metodo.test.tsx
```
Expected: PASS, 3 tests.

- [ ] **Step 3: Commit**

```
git add web/components/sobre/metodo.tsx web/tests/components/sobre/metodo.test.tsx
git commit -m "feat(sobre): Metodo — lista numerada dos 4 passos"
```

## Task 6: QuemAssina — failing test

**Files:**
- Test: `web/tests/components/sobre/quem-assina.test.tsx`

- [ ] **Step 1: Create the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QuemAssina } from "@/components/sobre/quem-assina";

describe("QuemAssina", () => {
  it("renders the section heading with the name placeholder", () => {
    render(<QuemAssina />);
    expect(
      screen.getByRole("heading", { level: 2, name: /seu nome aqui/i }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow label", () => {
    render(<QuemAssina />);
    expect(screen.getByText(/^Quem assina$/)).toBeInTheDocument();
  });

  it("renders the 3 social links as placeholders", () => {
    render(<QuemAssina />);
    const instagram = screen.getByRole("link", { name: /instagram/i });
    const linkedin = screen.getByRole("link", { name: /linkedin/i });
    const whatsapp = screen.getByRole("link", { name: /whatsapp/i });
    expect(instagram).toHaveAttribute("href", "#");
    expect(linkedin).toHaveAttribute("href", "#");
    expect(whatsapp).toHaveAttribute("href", "#");
  });

  it("renders the photo placeholder label", () => {
    render(<QuemAssina />);
    expect(screen.getByText(/foto · placeholder/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```
npm test -- tests/components/sobre/quem-assina.test.tsx
```
Expected: FAIL — `Failed to resolve import "@/components/sobre/quem-assina"`.

## Task 7: QuemAssina — implementation

**Files:**
- Create: `web/components/sobre/quem-assina.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Reveal } from "@/components/ui/reveal";
import { LiquidGlass } from "@/components/ui/liquid-glass";

type Social = { label: string; href: string };

// TODO: substituir hrefs por URLs reais (Instagram, LinkedIn, WhatsApp do dono)
const SOCIAL: Social[] = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "WhatsApp", href: "#" },
];

export function QuemAssina() {
  return (
    <section
      id="quem-assina"
      className="relative px-6 py-24 md:py-32"
      aria-labelledby="quem-assina-heading"
    >
      <Reveal className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[2fr_3fr] md:gap-16">
        {/* TODO: substituir por <Image> real com a foto do dono */}
        <LiquidGlass className="flex aspect-[4/5] items-center justify-center rounded-2xl">
          <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
            Foto · placeholder
          </span>
        </LiquidGlass>

        <div className="flex flex-col justify-center">
          <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
            Quem assina
          </span>
          {/* TODO: trocar [Seu nome aqui] pelo nome real */}
          <h2
            id="quem-assina-heading"
            className="font-display mt-3 text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl"
          >
            [Seu nome aqui]
          </h2>
          {/* TODO: trocar bio placeholder por bio real do dono */}
          <p className="mt-6 max-w-xl text-base text-white/70 md:text-lg">
            Designer e desenvolvedor por trás do Prumo. Trabalho com sites e presença digital há [X] anos, com foco em marcas que valorizam precisão. Atendimento direto, do briefing à entrega.
          </p>

          <ul className="mt-8 flex flex-wrap gap-6 text-sm text-white">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="group relative inline-block py-1 transition-transform duration-300 ease-out hover:-translate-y-0.5"
                >
                  {s.label}
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Run test to verify it passes**

```
npm test -- tests/components/sobre/quem-assina.test.tsx
```
Expected: PASS, 4 tests.

- [ ] **Step 3: Commit**

```
git add web/components/sobre/quem-assina.tsx web/tests/components/sobre/quem-assina.test.tsx
git commit -m "feat(sobre): QuemAssina — foto + bio + sociais com placeholders honestos"
```

## Task 8: Page composition — failing test

**Files:**
- Test: `web/tests/app/sobre-page.test.tsx`

- [ ] **Step 1: Create the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SobrePage from "@/app/sobre/page";

describe("SobrePage", () => {
  it("renders the page H1", () => {
    render(<SobrePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /um estúdio\.\s*sem teatro/i }),
    ).toBeInTheDocument();
  });

  it("renders the manifesto eyebrow", () => {
    render(<SobrePage />);
    expect(screen.getByText(/^Manifesto$/)).toBeInTheDocument();
  });

  it("renders the método heading", () => {
    render(<SobrePage />);
    expect(screen.getByRole("heading", { level: 2, name: /como o prumo trabalha/i })).toBeInTheDocument();
  });

  it("renders the quem assina heading", () => {
    render(<SobrePage />);
    expect(screen.getByRole("heading", { level: 2, name: /seu nome aqui/i })).toBeInTheDocument();
  });

  it("renders the final CTA", () => {
    render(<SobrePage />);
    expect(screen.getByRole("heading", { level: 2, name: /no prumo/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```
npm test -- tests/app/sobre-page.test.tsx
```
Expected: FAIL — `Failed to resolve import "@/app/sobre/page"`.

## Task 9: Page composition — implementation

**Files:**
- Create: `web/app/sobre/page.tsx`

- [ ] **Step 1: Create the page file**

```tsx
import type { Metadata } from "next";
import { HeroNav } from "@/components/hero/hero-nav";
import { AmbientVideo } from "@/components/ambient/ambient-video";
import { SobreHero } from "@/components/sobre/sobre-hero";
import { Manifesto } from "@/components/sobre/manifesto";
import { Metodo } from "@/components/sobre/metodo";
import { QuemAssina } from "@/components/sobre/quem-assina";
import { FinalCta } from "@/components/cta/final-cta";
import { Footer } from "@/components/footer/footer";

export const metadata: Metadata = {
  title: "Sobre · Prumo",
  description:
    "Estúdio solo de sites, estratégia e presença digital. Honestidade, sobriedade e precisão — uma pessoa do briefing à entrega.",
};

const AMBIENT_VIDEOS = ["/ambient.mp4", "/ambient-2.mp4"];

export default function SobrePage() {
  return (
    <>
      <AmbientVideo srcs={AMBIENT_VIDEOS} spotlight>
        <HeroNav />
        <SobreHero />
        <Manifesto />
        <Metodo />
        <QuemAssina />
        <FinalCta />
      </AmbientVideo>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run test to verify it passes**

```
npm test -- tests/app/sobre-page.test.tsx
```
Expected: PASS, 5 tests.

- [ ] **Step 3: Commit**

```
git add web/app/sobre/page.tsx web/tests/app/sobre-page.test.tsx
git commit -m "feat(sobre): /sobre page composing hero + manifesto + metodo + quem assina + cta"
```

## Task 10: Full verification

- [ ] **Step 1: Run the full test suite**

From `web/`:
```
npm test
```
Expected: All tests pass (including the 4 new test files: 3 component tests + 1 page test, totaling 15 new tests). Pre-existing test count unchanged otherwise.

- [ ] **Step 2: Run the build**

```
npm run build
```
Expected: Build succeeds (Turbopack), no type errors, no lint errors. Route `/sobre` listed in build output.

- [ ] **Step 3: Manual smoke test (recommended, optional in CI)**

```
npm run dev
```
Then visit `http://localhost:3000`, click "Sobre" in the HeroNav. Expected:
- Page loads (no 404).
- AmbientVideo background visible.
- Scroll through Hero → Manifesto → Método → Quem assina → CTA → Footer with motion reveals firing as each section enters viewport.
- Mobile breakpoint (DevTools 375px): Método stacks number-above-text; QuemAssina stacks photo-above-text.

- [ ] **Step 4: Final commit only if step 1 or 2 surfaced fixes**

If everything passes clean, no extra commit needed. If fixes were needed, commit them with a focused message describing what was fixed.

---

## Spec coverage — self-review

| Spec section | Covered by |
|---|---|
| Página `web/app/sobre/page.tsx` espelhando `/planos` | Task 9 |
| Metadata `title: "Sobre · Prumo"` + description | Task 9 |
| `SobreHero` com kicker, h1 italic, scroll hint → `#manifesto` | Tasks 1-2 |
| `Manifesto`, max-w-3xl, alinhamento à esquerda, 3-4 parágrafos com `<em>` | Task 3 |
| `Metodo` lista numerada 4 passos, divisória sutil, mobile stack | Tasks 4-5 |
| `QuemAssina` split foto/texto, placeholders TODO em nome/bio/social | Tasks 6-7 |
| `FinalCta` + `Footer` reuso direto | Task 9 |
| Acessibilidade: `aria-labelledby` por seção | Tasks 2, 3, 5, 7 |
| 3 testes de componente + página | Tasks 1, 4, 6, 8 |
| `npm run build` passa, `npm test` passa | Task 10 |
| Placeholders marcados `TODO` no JSX (foto, nome, bio, social, manifesto copy) | Tasks 3, 7 |
