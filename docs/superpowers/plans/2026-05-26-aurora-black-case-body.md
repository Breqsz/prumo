# Aurora Black — Case Body Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o `#0A0A0A` chapado do body do case (`web/app/trabalhos/[slug]/page.tsx`) por um background atmosférico "Aurora Black": 3 radial gradients brancos (5–8%) flutuando em loops longos sobre film grain e vignette, costurado com fade ao header e ao próximo capítulo.

**Architecture:** Novo componente client `AuroraBlack` em `web/components/ambient/aurora-black.tsx` espelha o padrão estrutural do `AmbientVideo` existente: container `relative isolate` + camada de fundo `absolute -z-10` + child `sticky top-0 h-screen` segurando os layers. Children renderizam por cima. As 3 auroras usam `@keyframes` declaradas em `globals.css` dentro de `@layer components`. `prefers-reduced-motion` desabilita as animações via media query CSS — sem JS. A `<section>` do body em `[slug]/page.tsx` é envolvida em `<AuroraBlack>...</AuroraBlack>`. Header (vídeo) e "próximo capítulo" (vídeo) ficam fora.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4 (CSS-first config em `globals.css`), Vitest 4 + `@testing-library/react` + `happy-dom`. Zero JS de motion — pure CSS `@keyframes`. Lucide-react / Framer / Three NÃO entram aqui.

> **Spec:** `docs/superpowers/specs/2026-05-26-aurora-black-case-body-design.md`
> **Brand source-of-truth:** `E:\Projetos\Prumo\CONTEXT.md` + `web/DESIGN.md`

---

## Working Directory

- **Project root:** `E:\Projetos\Prumo\`
- **Next.js app:** `E:\Projetos\Prumo\web\` (todos os `npm` rodam aqui).
- **Paths relativos** nas tasks (ex.: `app/...`, `components/...`, `tests/...`) são relativos a `web/`.
- **`git add`** roda do project root com prefixo `web/...`.

---

## File Structure

```
E:\Projetos\Prumo\
├── docs/superpowers/
│   ├── specs/2026-05-26-aurora-black-case-body-design.md   ← (existing)
│   └── plans/2026-05-26-aurora-black-case-body.md          ← (este arquivo)
└── web/
    ├── app/
    │   ├── globals.css                                      ← MODIFY: add @keyframes + reduced-motion
    │   └── trabalhos/[slug]/page.tsx                        ← MODIFY: wrap body in <AuroraBlack>
    ├── components/ambient/
    │   ├── ambient-video.tsx                                ← (existing — referência de padrão)
    │   └── aurora-black.tsx                                 ← CREATE
    └── tests/components/ambient/
        └── aurora-black.test.tsx                            ← CREATE
```

---

## Task 1: AuroraBlack component (TDD)

**Files:**
- Create: `web/components/ambient/aurora-black.tsx`
- Test:   `web/tests/components/ambient/aurora-black.test.tsx`

- [ ] **Step 1: Create test directory**

Run (from `web/`):
```
mkdir -p tests/components/ambient
```
Expected: directory created, no error.

- [ ] **Step 2: Write failing tests**

Create `web/tests/components/ambient/aurora-black.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AuroraBlack } from "@/components/ambient/aurora-black";

describe("AuroraBlack", () => {
  it("renders children", () => {
    render(
      <AuroraBlack>
        <p data-testid="child">hello body</p>
      </AuroraBlack>,
    );
    expect(screen.getByTestId("child")).toHaveTextContent("hello body");
  });

  it("renders the background layer marked aria-hidden", () => {
    render(
      <AuroraBlack>
        <div />
      </AuroraBlack>,
    );
    const bg = screen.getByTestId("aurora-bg");
    expect(bg).toHaveAttribute("aria-hidden", "true");
  });

  it("renders three aurora layers, grain, vignette, and two fades", () => {
    render(
      <AuroraBlack>
        <div />
      </AuroraBlack>,
    );
    expect(screen.getByTestId("aurora-1")).toBeInTheDocument();
    expect(screen.getByTestId("aurora-2")).toBeInTheDocument();
    expect(screen.getByTestId("aurora-3")).toBeInTheDocument();
    expect(screen.getByTestId("aurora-grain")).toBeInTheDocument();
    expect(screen.getByTestId("aurora-vignette")).toBeInTheDocument();
    expect(screen.getByTestId("aurora-fade-top")).toBeInTheDocument();
    expect(screen.getByTestId("aurora-fade-bottom")).toBeInTheDocument();
  });

  it("wraps content in a relative isolate container", () => {
    const { container } = render(
      <AuroraBlack>
        <div />
      </AuroraBlack>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toMatch(/relative/);
    expect(wrapper.className).toMatch(/isolate/);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run (from `web/`):
```
npm run test -- tests/components/ambient/aurora-black.test.tsx
```
Expected: 4 failures, all referring to missing module `@/components/ambient/aurora-black`.

- [ ] **Step 4: Implement AuroraBlack**

Create `web/components/ambient/aurora-black.tsx`:

```tsx
import type { ReactNode } from "react";

type AuroraBlackProps = {
  children: ReactNode;
};

const GRAIN_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")";

export function AuroraBlack({ children }: AuroraBlackProps) {
  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        data-testid="aurora-bg"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black"
      >
        <div
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{ contain: "layout paint" }}
        >
          <div
            data-testid="aurora-1"
            className="aurora-layer aurora-1 absolute"
            style={{
              top: "-15%",
              left: "-10%",
              width: "80vw",
              height: "80vh",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 65%)",
              filter: "blur(80px)",
              willChange: "transform",
            }}
          />
          <div
            data-testid="aurora-2"
            className="aurora-layer aurora-2 absolute"
            style={{
              bottom: "-20%",
              right: "-12%",
              width: "70vw",
              height: "70vh",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 65%)",
              filter: "blur(80px)",
              willChange: "transform",
            }}
          />
          <div
            data-testid="aurora-3"
            className="aurora-layer aurora-3 absolute"
            style={{
              top: "30%",
              left: "35%",
              width: "55vw",
              height: "55vh",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
              filter: "blur(60px)",
              willChange: "transform",
            }}
          />
          <div
            data-testid="aurora-grain"
            className="absolute inset-0"
            style={{
              backgroundImage: GRAIN_SVG,
              opacity: 0.05,
              mixBlendMode: "screen",
            }}
          />
          <div
            data-testid="aurora-vignette"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          <div
            data-testid="aurora-fade-top"
            className="absolute inset-x-0 top-0"
            style={{
              height: 40,
              background:
                "linear-gradient(to bottom, #0A0A0A 0%, rgba(10,10,10,0) 100%)",
            }}
          />
          <div
            data-testid="aurora-fade-bottom"
            className="absolute inset-x-0 bottom-0"
            style={{
              height: 40,
              background:
                "linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0) 100%)",
            }}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run (from `web/`):
```
npm run test -- tests/components/ambient/aurora-black.test.tsx
```
Expected: 4 tests pass.

- [ ] **Step 6: Commit**

From `E:\Projetos\Prumo\`:
```
git add web/components/ambient/aurora-black.tsx web/tests/components/ambient/aurora-black.test.tsx
git commit -m "feat(ambient): add AuroraBlack background component"
```

---

## Task 2: Animations + reduced-motion in globals.css

**Files:**
- Modify: `web/app/globals.css`

- [ ] **Step 1: Write failing test (animation classes referenced from globals)**

Add a test inside `web/tests/components/ambient/aurora-black.test.tsx`. Append after the existing `describe` block (still inside the same `describe`):

```tsx
  it("each aurora layer carries the corresponding animation class", () => {
    render(
      <AuroraBlack>
        <div />
      </AuroraBlack>,
    );
    expect(screen.getByTestId("aurora-1").className).toMatch(/aurora-1/);
    expect(screen.getByTestId("aurora-2").className).toMatch(/aurora-2/);
    expect(screen.getByTestId("aurora-3").className).toMatch(/aurora-3/);
  });
```

- [ ] **Step 2: Run tests — expect this new test to PASS already**

Run (from `web/`):
```
npm run test -- tests/components/ambient/aurora-black.test.tsx
```
Expected: 5 tests pass (this test verifies the class names that Task 1 already added; Step 1 here just locks them into the test suite before we wire the keyframes to those class names in globals.css).

- [ ] **Step 3: Add keyframes + animation hooks to globals.css**

Edit `web/app/globals.css`. Inside the existing `@layer components { ... }` block, append the following BEFORE the closing brace of that layer (i.e., as siblings of `.prumo-line`):

```css
  .aurora-layer {
    pointer-events: none;
  }

  .aurora-1 {
    animation: aurora-drift-1 42s ease-in-out infinite;
  }
  .aurora-2 {
    animation: aurora-drift-2 48s ease-in-out infinite;
  }
  .aurora-3 {
    animation: aurora-drift-3 55s ease-in-out infinite;
  }

  @keyframes aurora-drift-1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%      { transform: translate(6%, 4%) scale(1.08); }
  }
  @keyframes aurora-drift-2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%      { transform: translate(-5%, -3%) scale(0.95); }
  }
  @keyframes aurora-drift-3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%      { transform: translate(3%, -6%) scale(1.05); }
  }

  @media (prefers-reduced-motion: reduce) {
    .aurora-1,
    .aurora-2,
    .aurora-3 {
      animation: none !important;
    }
  }
```

- [ ] **Step 4: Verify tests still pass**

Run (from `web/`):
```
npm run test -- tests/components/ambient/aurora-black.test.tsx
```
Expected: 5 tests pass.

- [ ] **Step 5: Run the full test suite to confirm no regression**

Run (from `web/`):
```
npm run test
```
Expected: all suites pass.

- [ ] **Step 6: Commit**

From `E:\Projetos\Prumo\`:
```
git add web/app/globals.css web/tests/components/ambient/aurora-black.test.tsx
git commit -m "feat(ambient): aurora drift keyframes + reduced-motion guard"
```

---

## Task 3: Wire AuroraBlack into the case body

**Files:**
- Modify: `web/app/trabalhos/[slug]/page.tsx` (specifically the section at lines 83–112 in the current file)

- [ ] **Step 1: Read the current page to confirm the slice you'll wrap**

Open `web/app/trabalhos/[slug]/page.tsx`. Locate the body `<section>` element. In the current revision it begins at line 83:

```tsx
<section className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_2fr] md:py-32">
```

and ends at the matching `</section>` (currently line 112, right before the `<div className="border-t border-white/10 px-6 py-16">` block).

This is the slice that gets the Aurora background. The `<header>` (lines 39–81) and the "próximo capítulo" `<section>` (lines 126–158) MUST stay outside.

- [ ] **Step 2: Add the import**

At the top of `web/app/trabalhos/[slug]/page.tsx`, alongside the other component imports (after `import { Reveal } from "@/components/ui/reveal";`), add:

```tsx
import { AuroraBlack } from "@/components/ambient/aurora-black";
```

- [ ] **Step 3: Wrap the body section**

Replace the existing body `<section>...</section>` block with the same `<section>...</section>` wrapped in `<AuroraBlack>`. The `<section>` itself must lose any opaque background so the aurora shows through — none is currently set, so just wrap. Final shape:

```tsx
<AuroraBlack>
  <section className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_2fr] md:py-32">
    <aside className="space-y-6 text-sm text-white/70">
      <Meta label="Cliente" value={project.meta.cliente} />
      <Meta label="Setor" value={project.meta.setor} />
      <Meta label="Entrega" value={project.meta.entrega} />
      <Meta label="Ano" value={String(project.year)} />
    </aside>

    <div className="space-y-16">
      <Block title="Brief" body={project.brief} />
      <Block title="Processo" body={project.process} />
      <Block title="Resultado" body={project.outcome} />

      <div
        className="grid gap-4 sm:grid-cols-2"
        aria-label="Galeria do projeto (placeholder)"
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-lg border border-white/10 bg-white/[0.02]"
          >
            <span className="sr-only">
              Placeholder de imagem {i + 1}, substituir
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
</AuroraBlack>
```

Make NO other changes to the file.

- [ ] **Step 4: Type-check and build**

Run (from `web/`):
```
npm run build
```
Expected: build succeeds with no TypeScript errors and no Next.js errors. `/trabalhos/[slug]` route generates statically (see `generateStaticParams`).

- [ ] **Step 5: Run the full test suite**

Run (from `web/`):
```
npm run test
```
Expected: all suites pass. (The existing slug route is not currently covered by a render test; this step just confirms nothing else broke.)

- [ ] **Step 6: Commit**

From `E:\Projetos\Prumo\`:
```
git add web/app/trabalhos/[slug]/page.tsx
git commit -m "feat(trabalhos): wrap case body in AuroraBlack ambient bg"
```

---

## Task 4: Manual visual verification

Pure-CSS motion and `prefers-reduced-motion` cannot be exercised by happy-dom unit tests — they have to be eyeballed in a real browser. Do this before declaring done.

- [ ] **Step 1: Start dev server**

Run (from `web/`):
```
npm run dev
```
Wait for `▲ Next.js ready on http://localhost:3000`. Leave running.

- [ ] **Step 2: Open a case in the browser**

Navigate to `http://localhost:3000/trabalhos/desafog-ai`.

Confirm visually:
- Header video plays at top (unchanged).
- Body section (Cliente / Setor / Brief / Processo / Resultado / 4 placeholders) sits over the aurora — you can see soft white pools drifting on a 40–55s cadence and faint film grain.
- The transition from header video → aurora and from aurora → próximo-capítulo video is smooth (no hard `#0A0A0A` band).
- Text remains crisp; aurora intensity does NOT make the body feel busy.
- Acceptance gate: pause for ~5 seconds while staring at the page. If motion calls attention to itself before you notice the text, it's too loud — revisit Task 2 opacities/durations before continuing.

- [ ] **Step 3: Verify reduced-motion**

In Chrome/Edge DevTools:
1. Open Command Menu (Ctrl+Shift+P).
2. Run `Emulation: Show Rendering`.
3. Under "Emulate CSS media feature prefers-reduced-motion", select `reduce`.

Confirm: auroras freeze in place; grain and vignette still render; layout unchanged.

- [ ] **Step 4: Verify other cases still look right**

Navigate to `http://localhost:3000/trabalhos/hold-corretora`, `/trabalhos/todo`, `/trabalhos/breq-dev`, `/trabalhos/bereading`. Confirm each renders the aurora behind the body identically.

- [ ] **Step 5: Verify mobile viewport**

In DevTools, switch to device emulation. Check 375px, 414px, 768px widths. Confirm the aurora still reads (not clipped weirdly) and that scroll performance feels smooth. If 375px feels heavy (frame drops while scrolling), note it in the PR description — fallback would be hiding `aurora-3` on `< 768px` viewports.

- [ ] **Step 6: Stop dev server**

In the terminal where `npm run dev` runs: `Ctrl+C`.

- [ ] **Step 7: Commit (only if any tuning was applied)**

If Step 2's acceptance gate forced you to tune opacities or durations in `globals.css`, commit the result:
```
git add web/app/globals.css
git commit -m "tune(ambient): aurora intensity calibrated against still/animated comparison"
```

If no tuning was needed, skip this step.

---

## Self-review checklist (run after writing the plan, not at execution time)

- [x] **Spec coverage:** Scope ✓ (case body only), arquitetura ✓ (Task 1), layer stack ✓ (Task 1 inline styles match spec), motion ✓ (Task 2 keyframes match spec exactly), accessibility ✓ (Task 2 reduced-motion + Task 1 aria-hidden), performance ✓ (`contain: layout paint`, `will-change: transform`), testing ✓ (Task 1 + Task 2 tests), file changes table ✓ (all 4 entries covered).
- [x] **Placeholder scan:** No "TBD" / "fill in later" / "add error handling" / "similar to Task N". All code blocks are complete and self-contained.
- [x] **Type consistency:** `AuroraBlack` exported as a named export everywhere. Test IDs (`aurora-bg`, `aurora-1/2/3`, `aurora-grain`, `aurora-vignette`, `aurora-fade-top/bottom`) match exactly between Task 1 implementation, Task 1 tests, Task 2 added test, and the wiring in Task 3. Animation class names (`aurora-1`, `aurora-2`, `aurora-3`) match exactly between component classNames and globals.css selectors.
