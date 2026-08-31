# Home para o indicado — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Realinhar a home do prumoestudio.com.br ao visitante que chega por indicação — prova antes de preço, WhatsApp como caminho primário, e o site utilizável no celular.

**Architecture:** Mudanças localizadas em `web/`. A ordem da home é recomposta em `app/page.tsx`; a prova ganha dois componentes novos em `components/home/`; a supressão de vídeo no celular sai de um hook novo consumido pelos dois componentes de vídeo existentes; o bloco "Resultado" do case vira componente próprio que sabe não renderizar.

**Tech Stack:** Next.js 16.2.6 (App Router), React 19.2, TypeScript, Tailwind 4, Vitest 4 + @testing-library/react, happy-dom.

**Spec:** `docs/superpowers/specs/2026-08-31-home-indicado-design.md`

## Global Constraints

- Branch de trabalho: `feat/home-indicado`, criada a partir de `feat/marca-2026-duas-vozes`. **Nunca commitar no `main`. Nunca fazer `push` sem autorização explícita do dono. Nunca disparar deploy.**
- Comandos: `npm test` (vitest run), `npm run lint`, `npm run build`, executados de dentro de `web/`.
- **Medir o baseline antes de tocar em qualquer arquivo.** Baseline conhecido da branch base: lint 0 erros / 8 warnings, build OK, **237/248** testes, com 11 falhas da cicatriz `[test-env]` (happy-dom/IntersectionObserver) em `faq`, `page`, `reveal` e `rotating-phrase`. Ao final, o número de falhas não pode subir.
- Tipografia segue o ADR 0006: `font-display` (Archivo) para declaração seca, `font-editorial` (Instrument Serif) para frase com `<em>` em itálico. Não misturar.
- Amarelo `#F5B400` (`--color-plumb`) só marca estado. Nunca decorativo, nunca em texto corrido.
- Preço não muda. O ADR 0003 segue valendo: Landing R$ 3.750 · Institucional R$ 8.500 · Branded a partir de R$ 18.000 · Manutenção R$ 350 · Crescimento R$ 1.350 · Parceria R$ 3.000.
- Nenhum número de resultado inventado sobre cliente. Se não é verificável, não entra.

---

## File Structure

**Criar**
- `web/lib/hooks/use-is-wide-viewport.ts` — decide se o viewport comporta vídeo de fundo. Uma responsabilidade.
- `web/lib/home-content.ts` — a seleção explícita dos cases da home, isolada da ordem de `projects.ts`.
- `web/components/home/prova.tsx` — a faixa de 4 cases. Recebe dados prontos.
- `web/components/home/servicos-resumo.tsx` — três linhas + link para `/servicos`.
- `web/components/trabalhos/case-block.tsx` — o `Block` extraído de `page.tsx`, com corpo opcional.

**Modificar**
- `web/lib/projects.ts` — `outcome` opcional; remoção das 4 anotações de rascunho.
- `web/app/trabalhos/[slug]/page.tsx` — passa a usar `CaseBlock`.
- `web/components/hero/hero-video.tsx` e `web/components/ambient/ambient-video.tsx` — vídeo só em viewport largo.
- `web/app/page.tsx` — nova ordem.
- `web/lib/contact-config.ts` — mensagem padrão de WhatsApp.
- `web/components/cta/final-cta.tsx` — dois caminhos.
- `web/components/footer/footer.tsx` — passa a importar a mensagem compartilhada.

---

### Task 1: Tirar o rascunho de produção

O bloco "Resultado" de 4 dos 5 cases está publicando uma anotação interna. Esta task é independente das outras e é a única que conserta um dano em curso.

**Files:**
- Modify: `web/lib/projects.ts`
- Create: `web/components/trabalhos/case-block.tsx`
- Modify: `web/app/trabalhos/[slug]/page.tsx:117` e `:186-197`
- Test: `web/tests/lib/projects.test.ts` (adicionar), `web/tests/components/trabalhos/case-block.test.tsx` (criar)

**Interfaces:**
- Consumes: nada.
- Produces: `Project.outcome?: string` (era obrigatório) e `CaseBlock({ title, body }: { title: string; body?: string })`, que retorna `null` quando `body` é vazio ou só espaços.

- [ ] **Step 1: Medir o baseline antes de tocar em qualquer coisa**

```bash
cd web && npm run lint && npm test && npm run build
```

Anote os três números. Se o total de falhas divergir de 11, pare e informe o dono antes de continuar — a premissa do plano mudou.

- [ ] **Step 2: Escrever o teste do guard permanente**

Adicionar ao final de `web/tests/lib/projects.test.ts`, dentro do `describe("projects data")`:

```ts
  it("no renderable copy carries draft annotations", () => {
    const draft = /\[Substituir|\bSTUB\b|\bTODO\b|Lorem ipsum/i;
    for (const p of projects) {
      const copy = [p.summary, p.brief, p.process, p.outcome ?? ""];
      for (const field of copy) {
        expect(draft.test(field), `${p.slug}: "${field.slice(0, 60)}…"`).toBe(
          false,
        );
      }
    }
  });
```

- [ ] **Step 3: Rodar e confirmar que falha**

```bash
cd web && npm test -- tests/lib/projects.test.ts
```

Esperado: FAIL em 4 cases — `hold-corretora`, `desafog-ai`, `todo`, `bereading`.

- [ ] **Step 4: Remover as 4 anotações**

Em `web/lib/projects.ts`, apagar apenas a sentença entre colchetes ao fim de cada `outcome`, junto do espaço que a precede. O restante do texto é factual e permanece **exatamente** como está — não reescrever, não acrescentar resultado que não foi medido.

As 4 sentenças a remover:
- `[Substituir por números reais de conversão quando estabilizar a baseline]`
- `[Substituir por métricas de uso reais após lançamento público]`
- `[Substituir por métricas pós-deploy: Core Web Vitals, conversão de formulário, posicionamento orgânico]`
- `[Substituir por resultados de piloto real assim que entrar em escola]`

- [ ] **Step 5: Rodar e confirmar que passa**

```bash
cd web && npm test -- tests/lib/projects.test.ts
```

Esperado: PASS.

- [ ] **Step 6: Tornar `outcome` opcional**

Em `web/lib/projects.ts`, no type `Project`, trocar a linha do campo e o comentário acima dele:

```ts
  /** Narrativa de resultado. Ausente quando não há resultado verificável. */
  outcome?: string;
```

Os comentários `/** STUB: substituir por narrativa real */` sobre `brief` e `process` também saem — são instruções vencidas, e o guard do Step 2 varre o valor, não o comentário.

- [ ] **Step 7: Escrever o teste do CaseBlock**

Criar `web/tests/components/trabalhos/case-block.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CaseBlock } from "@/components/trabalhos/case-block";

describe("CaseBlock", () => {
  it("renders the title and body when there is copy", () => {
    render(<CaseBlock title="Resultado" body="Site no ar desde maio." />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Resultado",
    );
    expect(screen.getByText(/site no ar desde maio/i)).toBeInTheDocument();
  });

  it("renders nothing when the body is missing", () => {
    const { container } = render(<CaseBlock title="Resultado" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when the body is only whitespace", () => {
    const { container } = render(<CaseBlock title="Resultado" body="   " />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 8: Rodar e confirmar que falha**

```bash
cd web && npm test -- tests/components/trabalhos/case-block.test.tsx
```

Esperado: FAIL — não existe `@/components/trabalhos/case-block`.

- [ ] **Step 9: Criar o componente**

Criar `web/components/trabalhos/case-block.tsx` com o markup movido de `page.tsx`, sem alterar uma classe sequer:

```tsx
export function CaseBlock({ title, body }: { title: string; body?: string }) {
  if (!body || !body.trim()) return null;
  return (
    <div>
      <h2 className="font-display text-3xl tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">
        {body}
      </p>
    </div>
  );
}
```

- [ ] **Step 10: Trocar o uso na página do case**

Em `web/app/trabalhos/[slug]/page.tsx`: importar `CaseBlock`, apagar a função local `Block` (linhas 186-197) e trocar as três chamadas por `<CaseBlock ... />`. A função local `Meta` fica onde está — não é escopo desta task.

- [ ] **Step 11: Rodar a suíte inteira**

```bash
cd web && npm test && npm run lint
```

Esperado: PASS nos novos, e o total de falhas continua 11.

- [ ] **Step 12: Commit**

```bash
git add web/lib/projects.ts web/components/trabalhos/case-block.tsx "web/app/trabalhos/[slug]/page.tsx" web/tests/lib/projects.test.ts web/tests/components/trabalhos/case-block.test.tsx
git commit -m "fix(trabalhos): remove anotacao de rascunho publicada nos cases"
```

---

### Task 2: Vídeo de fundo fora do celular

A home baixa ≈27,5 MB de vídeo antes do primeiro parágrafo, com `preload="auto"` e sem cartaz. Esta task corta isso no celular sem tocar no desktop.

**Files:**
- Create: `web/lib/hooks/use-is-wide-viewport.ts`
- Modify: `web/components/hero/hero-video.tsx`, `web/components/ambient/ambient-video.tsx`
- Test: `web/tests/lib/use-is-wide-viewport.test.ts`, `web/tests/components/hero/hero-video.test.tsx` (criar)

**Interfaces:**
- Consumes: nada.
- Produces: `WIDE_VIEWPORT_QUERY: string` (`"(min-width: 768px)"`), `readIsWideViewport(): boolean`, `useIsWideViewport(): boolean`.

O hook começa em `false` e só vira `true` depois da hidratação, em tela larga. Assim o HTML servido nunca contém `<video>`, e o celular não baixa nada. Onde `matchMedia` não existe — SSR e o happy-dom dos testes — o resultado é `false`, que é o lado seguro.

- [ ] **Step 1: Escrever o teste do hook**

Criar `web/tests/lib/use-is-wide-viewport.test.ts`:

```ts
import { describe, it, expect, afterEach } from "vitest";
import {
  WIDE_VIEWPORT_QUERY,
  readIsWideViewport,
} from "@/lib/hooks/use-is-wide-viewport";

const original = window.matchMedia;

afterEach(() => {
  Object.defineProperty(window, "matchMedia", {
    value: original,
    configurable: true,
    writable: true,
  });
});

function stubMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
    configurable: true,
    writable: true,
  });
}

describe("WIDE_VIEWPORT_QUERY", () => {
  it("matches the tailwind md breakpoint", () => {
    expect(WIDE_VIEWPORT_QUERY).toBe("(min-width: 768px)");
  });
});

describe("readIsWideViewport", () => {
  it("is true when the media query matches", () => {
    stubMatchMedia(true);
    expect(readIsWideViewport()).toBe(true);
  });

  it("is false when the media query does not match", () => {
    stubMatchMedia(false);
    expect(readIsWideViewport()).toBe(false);
  });

  it("is false when matchMedia is unavailable", () => {
    Object.defineProperty(window, "matchMedia", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    expect(readIsWideViewport()).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

```bash
cd web && npm test -- tests/lib/use-is-wide-viewport.test.ts
```

Esperado: FAIL — módulo não existe.

- [ ] **Step 3: Criar o hook**

Criar `web/lib/hooks/use-is-wide-viewport.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

/** Tailwind `md`. Abaixo disso o fundo é estático e nenhum vídeo é baixado. */
export const WIDE_VIEWPORT_QUERY = "(min-width: 768px)";

export function readIsWideViewport(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia(WIDE_VIEWPORT_QUERY).matches;
}

/**
 * Falso no servidor e no primeiro render, para que o HTML entregue ao
 * celular nunca contenha um <video>. Vira verdadeiro após a hidratação
 * em tela larga, e acompanha o redimensionamento.
 */
export function useIsWideViewport(): boolean {
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(WIDE_VIEWPORT_QUERY);
    setIsWide(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsWide(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isWide;
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

```bash
cd web && npm test -- tests/lib/use-is-wide-viewport.test.ts
```

Esperado: PASS.

- [ ] **Step 5: Escrever o teste do HeroVideo**

Criar `web/tests/components/hero/hero-video.test.tsx`. No happy-dom `matchMedia` não resolve para largo, então o componente deve cair no fundo estático que ele já tem:

```tsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeroVideo } from "@/components/hero/hero-video";

describe("HeroVideo", () => {
  it("does not mount a video element on a narrow viewport", () => {
    const { container } = render(<HeroVideo srcs={["/hero.mp4"]} />);
    expect(container.querySelector("video")).toBeNull();
  });

  it("still renders the static background layer", () => {
    const { container } = render(<HeroVideo srcs={["/hero.mp4"]} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("does not mount a video when there are no sources", () => {
    const { container } = render(<HeroVideo />);
    expect(container.querySelector("video")).toBeNull();
  });
});
```

- [ ] **Step 6: Rodar e confirmar que falha**

```bash
cd web && npm test -- tests/components/hero/hero-video.test.tsx
```

Esperado: FAIL no primeiro caso — hoje o `<video>` é montado sempre que há `srcs`.

- [ ] **Step 7: Ligar o hook no HeroVideo**

Em `web/components/hero/hero-video.tsx`, importar `useIsWideViewport` e trocar a linha do `hasSrc`:

```tsx
  const isWide = useIsWideViewport();
  const hasSrc = isWide && !!srcs && srcs.length > 0;
```

No `<video>`, trocar `preload="auto"` por `preload="none"`. O ramo `else` já existente — o gradiente radial — passa a ser o fundo de celular. Nenhum asset novo.

- [ ] **Step 8: Rodar e confirmar que passa**

```bash
cd web && npm test -- tests/components/hero/hero-video.test.tsx
```

Esperado: PASS.

- [ ] **Step 9: Aplicar o mesmo no AmbientVideo**

`web/components/ambient/ambient-video.tsx` não tem ramo alternativo: ele sempre renderiza o `<video>`. Envolver só o elemento de vídeo, mantendo as camadas de gradiente, grain e fades intactas — elas sozinhas já compõem o fundo:

```tsx
  const isWide = useIsWideViewport();
```

e, dentro do `<div className="sticky top-0 h-dvh w-full overflow-hidden">`, trocar o `<video ...>` por `{isWide && (<video ... preload="none" ... />)}`, preservando todos os atributos e estilos atuais.

- [ ] **Step 10: Rodar a suíte inteira e o build**

```bash
cd web && npm test && npm run lint && npm run build
```

Esperado: falhas seguem em 11, lint 0 erros, build OK.

- [ ] **Step 11: Commit**

```bash
git add web/lib/hooks/use-is-wide-viewport.ts web/components/hero/hero-video.tsx web/components/ambient/ambient-video.tsx web/tests/lib/use-is-wide-viewport.test.ts web/tests/components/hero/hero-video.test.tsx
git commit -m "perf(video): nao baixa video de fundo em viewport de celular"
```

---

### Task 3: A prova na home

**Files:**
- Create: `web/lib/home-content.ts`, `web/components/home/prova.tsx`
- Test: `web/tests/lib/home-content.test.ts`, `web/tests/components/home/prova.test.tsx`

**Interfaces:**
- Consumes: `projects`, `getProject` de `@/lib/projects`.
- Produces: `HOME_CASE_SLUGS: readonly string[]` e `homeCases(): Project[]`, na ordem de `HOME_CASE_SLUGS`; `Prova({ cases }: { cases: Project[] })`.

- [ ] **Step 1: Escrever o teste da seleção**

Criar `web/tests/lib/home-content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { HOME_CASE_SLUGS, homeCases } from "@/lib/home-content";
import { projects } from "@/lib/projects";

describe("HOME_CASE_SLUGS", () => {
  it("lists the four cases chosen for the home", () => {
    expect([...HOME_CASE_SLUGS]).toEqual([
      "hold-corretora",
      "todo",
      "desafog-ai",
      "bereading",
    ]);
  });

  it("leaves the personal portfolio out", () => {
    expect(HOME_CASE_SLUGS).not.toContain("breq-dev");
  });

  it("only references slugs that exist", () => {
    const known = new Set(projects.map((p) => p.slug));
    for (const slug of HOME_CASE_SLUGS) expect(known.has(slug)).toBe(true);
  });
});

describe("homeCases", () => {
  it("returns the projects in the declared order", () => {
    expect(homeCases().map((p) => p.slug)).toEqual([...HOME_CASE_SLUGS]);
  });

  it("does not depend on the order inside projects.ts", () => {
    expect(homeCases()).toHaveLength(4);
    expect(projects.length).toBeGreaterThan(4);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

```bash
cd web && npm test -- tests/lib/home-content.test.ts
```

Esperado: FAIL — módulo não existe.

- [ ] **Step 3: Criar a seleção**

Criar `web/lib/home-content.ts`:

```ts
import { getProject, type Project } from "@/lib/projects";

/**
 * Os cases que sobem para a home, em ordem de argumento: cliente pagante
 * primeiro. O portfólio pessoal (`breq-dev`) fica fora de propósito — é
 * marca Breq, voltada a recrutador, dentro do site do estúdio Prumo.
 * Explícito, e não um slice de `projects`, para que reordenar /trabalhos
 * não mude a home por acidente.
 */
export const HOME_CASE_SLUGS = [
  "hold-corretora",
  "todo",
  "desafog-ai",
  "bereading",
] as const;

export function homeCases(): Project[] {
  return HOME_CASE_SLUGS.map((slug) => getProject(slug)).filter(
    (p): p is Project => Boolean(p),
  );
}
```

Se `Project` ainda não é exportado como tipo em `web/lib/projects.ts`, trocar `type Project = {` por `export type Project = {`.

- [ ] **Step 4: Rodar e confirmar que passa**

```bash
cd web && npm test -- tests/lib/home-content.test.ts
```

Esperado: PASS.

- [ ] **Step 5: Escrever o teste do componente**

Criar `web/tests/components/home/prova.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Prova } from "@/components/home/prova";
import { homeCases } from "@/lib/home-content";

describe("Prova", () => {
  it("renders one link per case, pointing at its page", () => {
    render(<Prova cases={homeCases()} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);
    expect(links[0]).toHaveAttribute("href", "/trabalhos/hold-corretora");
  });

  it("shows each case title", () => {
    render(<Prova cases={homeCases()} />);
    expect(screen.getByText("Hold Corretora")).toBeInTheDocument();
    expect(screen.getByText("To Do Green")).toBeInTheDocument();
  });

  it("does not show the personal portfolio", () => {
    render(<Prova cases={homeCases()} />);
    expect(screen.queryByText(/Software Engineer Portfolio/i)).toBeNull();
  });

  it("renders nothing when there are no cases", () => {
    const { container } = render(<Prova cases={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 6: Rodar e confirmar que falha**

```bash
cd web && npm test -- tests/components/home/prova.test.tsx
```

Esperado: FAIL — componente não existe.

- [ ] **Step 7: Criar o componente**

Criar `web/components/home/prova.tsx`. Título na voz da marca (`font-display`, ADR 0006), grid de 2 colunas no celular e 4 em tela larga, primeira imagem da galeria de cada case:

```tsx
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

export function Prova({ cases }: { cases: Project[] }) {
  if (cases.length === 0) return null;
  return (
    <section
      id="prova"
      className="relative px-6 py-28 md:py-36"
      aria-labelledby="prova-heading"
    >
      <div className="mx-auto max-w-6xl">
        <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Trabalhos
        </span>
        <h2
          id="prova-heading"
          className="font-display mt-6 text-4xl tracking-tight text-white md:text-5xl"
        >
          O que já está no ar
        </h2>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {cases.map((p) => (
            <Link
              key={p.slug}
              href={`/trabalhos/${p.slug}`}
              className="group block"
              data-umami-event="prova_case"
              data-umami-event-case={p.slug}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <Image
                  src={p.gallery[0]}
                  alt={p.title}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-4 text-sm font-medium text-white">{p.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                {p.scope}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Rodar e confirmar que passa**

```bash
cd web && npm test -- tests/components/home/prova.test.tsx && npm run lint
```

Esperado: PASS, lint 0 erros.

- [ ] **Step 9: Commit**

```bash
git add web/lib/home-content.ts web/components/home/prova.tsx web/tests/lib/home-content.test.ts web/tests/components/home/prova.test.tsx web/lib/projects.ts
git commit -m "feat(home): componente de prova com os quatro cases da home"
```

---

### Task 4: Serviços em resumo e a nova ordem

**Files:**
- Create: `web/components/home/servicos-resumo.tsx`
- Modify: `web/app/page.tsx`
- Test: `web/tests/components/home/servicos-resumo.test.tsx`, `web/tests/app/home-order.test.tsx`

**Interfaces:**
- Consumes: `Prova` e `homeCases` da Task 3.
- Produces: `ServicosResumo()`.

O resumo é copy fixa de três linhas, **não** derivada de `web/lib/services.ts`. As páginas de serviço existem e continuam sendo a fonte densa; a home só aponta para elas. Duplicar três frases é mais barato que acoplar a home ao formato do catálogo.

- [ ] **Step 1: Escrever o teste do resumo**

Criar `web/tests/components/home/servicos-resumo.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ServicosResumo } from "@/components/home/servicos-resumo";

describe("ServicosResumo", () => {
  it("links to the services hub", () => {
    render(<ServicosResumo />);
    expect(screen.getByRole("link", { name: /serviços/i })).toHaveAttribute(
      "href",
      "/servicos",
    );
  });

  it("renders a heading", () => {
    render(<ServicosResumo />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar, falhar, criar o componente**

```bash
cd web && npm test -- tests/components/home/servicos-resumo.test.tsx
```

Esperado: FAIL. Então criar `web/components/home/servicos-resumo.tsx`:

```tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const LINHAS = [
  "Sites institucionais que dão autoridade a quem já tem reputação.",
  "Landing pages construídas para uma conversão específica.",
  "Projetos sob medida quando o pronto não resolve.",
];

export function ServicosResumo() {
  return (
    <section
      id="servicos-resumo"
      className="relative px-6 py-24 md:py-32"
      aria-labelledby="servicos-resumo-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="servicos-resumo-heading"
          className="font-display text-4xl tracking-tight text-white md:text-5xl"
        >
          O que eu faço
        </h2>
        <ul className="mt-10 space-y-4 text-base text-white/70 md:text-lg">
          {LINHAS.map((linha) => (
            <li key={linha}>{linha}</li>
          ))}
        </ul>
        <Link
          href="/servicos"
          className="group mt-10 inline-flex items-center gap-2 text-sm text-white"
          data-umami-event="home_servicos"
        >
          Ver serviços em detalhe
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Rodar e confirmar que passa**

```bash
cd web && npm test -- tests/components/home/servicos-resumo.test.tsx
```

Esperado: PASS.

- [ ] **Step 4: Escrever o teste da ordem da home**

Criar `web/tests/app/home-order.test.tsx`. O teste lê a ordem dos marcos no DOM, e não a implementação.

**Atenção à cicatriz `[test-env]`:** `tests/app/page` já é uma das 11 falhas conhecidas, porque o happy-dom não traz `IntersectionObserver` e o `Reveal` depende dele. Um teste novo que renderize a home inteira cairia no mesmo buraco — por isso ele instala o stub antes de renderizar. Não remova esse bloco achando que é ruído:

```tsx
import { render } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import HomePage from "@/app/page";

beforeAll(() => {
  if (!("IntersectionObserver" in window)) {
    class StubObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    Object.defineProperty(window, "IntersectionObserver", {
      value: StubObserver,
      configurable: true,
      writable: true,
    });
  }
});

describe("home section order", () => {
  it("puts the proof before the pricing teaser", () => {
    const { container } = render(<HomePage />);
    const html = container.innerHTML;
    const prova = html.indexOf('id="prova"');
    const planos = html.indexOf('id="planos-teaser"');
    expect(prova).toBeGreaterThan(-1);
    expect(planos).toBeGreaterThan(-1);
    expect(prova).toBeLessThan(planos);
  });

  it("puts the services summary between proof and pricing", () => {
    const { container } = render(<HomePage />);
    const html = container.innerHTML;
    expect(html.indexOf('id="prova"')).toBeLessThan(
      html.indexOf('id="servicos-resumo"'),
    );
    expect(html.indexOf('id="servicos-resumo"')).toBeLessThan(
      html.indexOf('id="planos-teaser"'),
    );
  });
});
```

- [ ] **Step 5: Rodar e confirmar que falha**

```bash
cd web && npm test -- tests/app/home-order.test.tsx
```

Esperado: FAIL. Se falhar por `id="planos-teaser"` não existir, adicione esse `id` à `<section>` de `web/components/planos/planos-teaser.tsx` — é uma âncora, não muda estilo.

- [ ] **Step 6: Recompor a home**

Em `web/app/page.tsx`, importar `Prova`, `ServicosResumo` e `homeCases`, e trocar o corpo do `AmbientVideo` para a ordem nova:

```tsx
      <Hero videoSrcs={HERO_VIDEOS} />
      <AmbientVideo srcs={AMBIENT_VIDEOS}>
        <Prova cases={homeCases()} />
        <ServicosResumo />
        <PlanosTeaser />
        <Faq bgVariant={1} />
        <FinalCta />
      </AmbientVideo>
      <Footer />
```

Note que o `FinalCta` também desce para depois do FAQ, fechando a página no contato — hoje ele fica antes.

- [ ] **Step 7: Rodar tudo**

```bash
cd web && npm test && npm run lint && npm run build
```

Esperado: os testes novos passam; o total de falhas segue 11. Se algum teste antigo de home quebrar por ordem, atualize-o — a ordem mudou de propósito.

- [ ] **Step 8: Commit**

```bash
git add web/app/page.tsx web/components/home/servicos-resumo.tsx web/components/planos/planos-teaser.tsx web/tests/components/home/servicos-resumo.test.tsx web/tests/app/home-order.test.tsx
git commit -m "feat(home): prova antes de preco na ordem da home"
```

---

### Task 5: CTA com dois caminhos

**Files:**
- Modify: `web/lib/contact-config.ts`, `web/components/cta/final-cta.tsx`, `web/components/footer/footer.tsx`
- Test: `web/tests/lib/contact-config.test.ts` (adicionar), `web/tests/components/cta/final-cta.test.tsx` (atualizar)

**Interfaces:**
- Consumes: `buildWhatsappLink` de `@/lib/contact-config`.
- Produces: `WHATSAPP_DEFAULT_MESSAGE: string`.

- [ ] **Step 1: Escrever o teste da mensagem padrão**

Adicionar em `web/tests/lib/contact-config.test.ts`:

```ts
  it("exposes a single default whatsapp message mentioning the studio", () => {
    expect(WHATSAPP_DEFAULT_MESSAGE).toMatch(/Prumo/);
    expect(WHATSAPP_DEFAULT_MESSAGE.length).toBeGreaterThan(20);
  });

  it("builds a wa.me link carrying the default message", () => {
    const link = buildWhatsappLink(WHATSAPP_DEFAULT_MESSAGE);
    expect(link).toContain("https://wa.me/5534999194509");
    expect(link).toContain("text=");
    expect(decodeURIComponent(link)).toContain("Prumo");
  });
```

Ajuste o import do topo do arquivo para incluir `WHATSAPP_DEFAULT_MESSAGE`.

- [ ] **Step 2: Rodar e confirmar que falha**

```bash
cd web && npm test -- tests/lib/contact-config.test.ts
```

Esperado: FAIL — export não existe.

- [ ] **Step 3: Adicionar a constante**

Em `web/lib/contact-config.ts`, depois do bloco `CONTACT`:

```ts
/**
 * Mensagem única de abertura no WhatsApp. Centralizada porque a home, o
 * footer, /sobre e /contato usavam textos diferentes (ou nenhum), e o
 * contexto da primeira linha é o que diz de onde a pessoa veio.
 */
export const WHATSAPP_DEFAULT_MESSAGE =
  "Oi, Guilherme! Vim pelo site da Prumo e queria falar sobre um projeto.";
```

- [ ] **Step 4: Rodar e confirmar que passa**

```bash
cd web && npm test -- tests/lib/contact-config.test.ts
```

Esperado: PASS.

- [ ] **Step 5: Atualizar o teste do FinalCta**

Em `web/tests/components/cta/final-cta.test.tsx`, substituir o caso `"renders the primary CTA pointing to the briefing form"` por:

```tsx
  it("offers whatsapp as the primary path", () => {
    render(<FinalCta />);
    const wa = screen.getByRole("link", { name: /whatsapp/i });
    expect(wa.getAttribute("href")).toContain("wa.me");
    expect(decodeURIComponent(wa.getAttribute("href") ?? "")).toContain(
      "Prumo",
    );
  });

  it("keeps the form as a secondary path", () => {
    render(<FinalCta />);
    expect(
      screen.getByRole("link", { name: /prefiro escrever/i }),
    ).toHaveAttribute("href", "/contato");
  });

  it("tags the whatsapp click for analytics", () => {
    render(<FinalCta />);
    const wa = screen.getByRole("link", { name: /whatsapp/i });
    expect(wa).toHaveAttribute("data-umami-event", "cta_whatsapp");
  });
```

- [ ] **Step 6: Rodar e confirmar que falha**

```bash
cd web && npm test -- tests/components/cta/final-cta.test.tsx
```

Esperado: FAIL — só existe o link para `/contato`.

- [ ] **Step 7: Reescrever o bloco de ação do FinalCta**

Em `web/components/cta/final-cta.tsx`, importar `buildWhatsappLink` e `WHATSAPP_DEFAULT_MESSAGE`, e trocar o conteúdo da `div.anim-cta`:

```tsx
        <div className="anim anim-cta mt-14 flex flex-col items-center gap-4 sm:flex-row">
          <LiquidGlass
            as="a"
            href={buildWhatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium text-white"
            data-umami-event="cta_whatsapp"
            data-umami-event-source="final-cta"
          >
            Falar no WhatsApp
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </LiquidGlass>
          <Link
            href="/contato"
            className="text-sm text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
            data-umami-event="cta_contato"
            data-umami-event-source="final-cta"
          >
            prefiro escrever
          </Link>
        </div>
```

O `<p>` acima promete *"uma conversa de 30 minutos"* e continua verdadeiro — mas troque *"Agendar conversa"* onde ela ainda aparecer como rótulo, porque a palavra prometia calendário e entregava formulário.

- [ ] **Step 8: Rodar e confirmar que passa**

```bash
cd web && npm test -- tests/components/cta/final-cta.test.tsx
```

Esperado: PASS.

- [ ] **Step 9: Unificar a mensagem no footer**

Em `web/components/footer/footer.tsx`, apagar a constante local `WHATSAPP_MESSAGE` e importar `WHATSAPP_DEFAULT_MESSAGE`, usando-a na chamada de `buildWhatsappLink`. Mesmo tratamento em `web/components/sobre/quem-assina.tsx`, que hoje usa `"Oi! Vim do site da Prumo."`.

- [ ] **Step 10: Rodar tudo**

```bash
cd web && npm test && npm run lint && npm run build
```

Esperado: total de falhas segue 11, lint 0 erros, build OK.

- [ ] **Step 11: Commit**

```bash
git add web/lib/contact-config.ts web/components/cta/final-cta.tsx web/components/footer/footer.tsx web/components/sobre/quem-assina.tsx web/tests/lib/contact-config.test.ts web/tests/components/cta/final-cta.test.tsx
git commit -m "feat(cta): whatsapp como caminho primario com formulario ao lado"
```

---

### Task 6: Poster e recompressão — BLOQUEADA

**Não comece esta task sem autorização explícita do dono.** Ela exige instalar `ffmpeg`, que não está nesta máquina (`command -v ffmpeg` → vazio). As tasks 1 a 5 entregam a reforma inteira sem ela; esta melhora o desktop e tira ~50 MB do repositório.

Quando autorizada:

- [ ] **Step 1: Instalar o ffmpeg** — `winget install Gyan.FFmpeg`, e reabrir o terminal.
- [ ] **Step 2: Registrar o tamanho de origem** — `ls -lh web/public/*.mp4`, guardando os oito valores para comparação.
- [ ] **Step 3: Extrair um poster por clipe** — `ffmpeg -i web/public/hero.mp4 -vf "select=eq(n\,30)" -vframes 1 web/public/posters/hero.jpg`, repetindo para os oito.
- [ ] **Step 4: Recomprimir** — `ffmpeg -i entrada.mp4 -c:v libx264 -crf 30 -preset slow -an -movflags +faststart saida.mp4`. O `-an` remove áudio, que nenhum fundo usa. Alvo: `planos-1.mp4` abaixo de 3 MB.
- [ ] **Step 5: Comparar lado a lado no navegador** antes de substituir. Perda visível é motivo para refazer com `-crf` menor, não para aceitar.
- [ ] **Step 6: Adicionar `poster`** aos dois componentes de vídeo e um teste garantindo que todo `<video>` tem `poster`.
- [ ] **Step 7: Rodar tudo e commitar.**

---

## Fecho — o que fazer depois da Task 5

1. `cd web && npm run dev` e abrir a home em 375, 414 e 768 px. É o QA que nunca foi feito, e agora acumula três mudanças: marca 2026, nova ordem e vídeo suprimido.
2. Conferir as imagens de `public/Hold`, `public/ToDo`, `public/Desafog` e `public/bereading` em tela pequena — nunca foram vistas assim.
3. Levar ao dono para aprovação de merge. **Não mergear, não pushar.**
4. Registrar a sessão na Wiki (`playbooks/close-session.md`) e corrigir lá: o `overview.md` do namespace lista preços antigos, divergentes do ADR 0003, e promete um botão flutuante de WhatsApp que não existe no código.
