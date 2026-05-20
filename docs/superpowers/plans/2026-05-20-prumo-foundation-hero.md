# Prumo — Foundation + Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the Prumo Next.js project with full design system (dark cinematic, white-only accent, Instrument Serif + Inter, Liquid Glass, Prumo Lines) and a production-ready Hero with looping video background + custom JS fade — deployable to Vercel as a visual-identity validation milestone.

**Architecture:** Next.js 15 App Router project with TypeScript. Single home page (`/`) renders only the Hero in this plan. Design tokens centralized in CSS variables + Tailwind 4 `@theme` config. Reusable primitives (`LiquidGlass`, `PrumoLines`) live in `components/ui`. Hero composed from focused sub-components (`HeroVideo`, `HeroNav`, `HeroContent`, `HeroSocial`). Video fade implemented as a custom React hook using `requestAnimationFrame` (not CSS transitions).

**Tech Stack:** Next.js 15.x, React 19, TypeScript 5.x, Tailwind CSS 4.x (CSS-first config), `next/font/google` for Instrument Serif + Inter, `lucide-react` for icons, Vitest 3.x + `@testing-library/react` + `happy-dom` for component smoke tests. Deploy on Vercel.

> **Project source-of-truth:** `E:\Projetos\Prumo\CONTEXT.md` — the brand decisions, copy, planos and pendências live there. This plan references it but does NOT duplicate strategic context.

---

## Working Directory

The project root is `E:\Projetos\Prumo\` and already contains `CONTEXT.md`, `docs/`, and `mockups/`. To avoid the `create-next-app` "non-empty directory" conflict, **the Next.js application lives in `E:\Projetos\Prumo\web\`**.

- **Git repository root:** `E:\Projetos\Prumo\` (git init at root, includes everything).
- **All `npm`/`npx` commands from Task 2 onward run from `E:\Projetos\Prumo\web\`.**
- **All relative file paths in tasks** (e.g., `app/layout.tsx`) are relative to `E:\Projetos\Prumo\web\` unless the path explicitly starts with `docs/` or `CONTEXT.md` (which are at project root).
- **Git commands** run from the project root `E:\Projetos\Prumo\` — staging paths use `web/...` prefix.
- **Vercel deploy:** project root in Vercel dashboard set to `web`.

---

## File Structure

```
E:\Projetos\Prumo\                  ← PROJECT ROOT (git repo)
├── CONTEXT.md                       ← (existing — brand source of truth)
├── docs/                            ← (existing — plans, specs)
├── mockups/                         ← (existing — paleta comparison)
└── web/                             ← Next.js application (everything below)
    ├── app/
    │   ├── layout.tsx               ← root layout: fonts, body, metadata
    │   ├── page.tsx                 ← home page (renders Hero only in this plan)
    │   ├── globals.css              ← Tailwind base + Liquid Glass + Prumo Lines + design tokens
    │   └── fonts.ts                 ← Instrument Serif + Inter via next/font/google
    ├── components/
    │   ├── hero/
    │   │   ├── hero.tsx             ← composes the hero sections
    │   │   ├── hero-video.tsx       ← <video> + useVideoFade hook
    │   │   ├── hero-nav.tsx         ← top navbar (glass capsule)
    │   │   ├── hero-content.tsx     ← centered text + CTAs
    │   │   └── hero-social.tsx      ← bottom social icons row
    │   └── ui/
    │       ├── liquid-glass.tsx     ← polymorphic glass wrapper
    │       └── prumo-lines.tsx      ← vertical lines decoration
    ├── lib/
    │   └── hooks/
    │       └── use-video-fade.ts    ← custom fade-in/out via requestAnimationFrame
    ├── public/
    │   └── hero-placeholder.mp4     ← local placeholder until real video chosen
    ├── tests/
    │   ├── setup.ts                 ← Vitest setup
    │   ├── components/
    │   │   ├── liquid-glass.test.tsx
    │   │   ├── prumo-lines.test.tsx
    │   │   └── hero/
    │   │       ├── hero-nav.test.tsx
    │   │       ├── hero-content.test.tsx
    │   │       ├── hero-social.test.tsx
    │   │       └── hero.test.tsx
    │   └── lib/
    │       └── use-video-fade.test.ts
    ├── postcss.config.mjs
    ├── next.config.mjs
    ├── vitest.config.ts
    ├── tsconfig.json
    ├── package.json
    ├── .gitignore
    └── README.md
```

**File responsibilities:**

- `app/layout.tsx`: HTML shell, font loading, dark theme, viewport, base metadata.
- `app/page.tsx`: Home route. In this plan: renders `<Hero />` only.
- `app/globals.css`: Tailwind directives, design tokens (`--color-bg`, `--color-fg`, etc.), `.liquid-glass` class with mask trick, `.prumo-line` class.
- `components/ui/liquid-glass.tsx`: Pure presentational wrapper. Forwards refs, accepts `as` prop for polymorphic rendering. NO business logic.
- `components/ui/prumo-lines.tsx`: Renders an array of vertical lines at given x-percentages. Pure decoration.
- `components/hero/hero-video.tsx`: `<video>` element + `useVideoFade` hook. Handles full-screen positioning, crop translate, vignette overlay.
- `components/hero/hero-nav.tsx`: Top capsule navbar. Logo + nav links + CTAs.
- `components/hero/hero-content.tsx`: Centered heading + sub + CTAs.
- `components/hero/hero-social.tsx`: Bottom row of glass-circular social buttons.
- `components/hero/hero.tsx`: Composes the four pieces inside one `min-h-screen bg-black` container, places `PrumoLines`.
- `lib/hooks/use-video-fade.ts`: Custom hook returning a ref + opacity handlers. Encapsulates all the raf/fade logic.

**Testing philosophy:** This is a marketing site, not a library. Smoke tests verify components render, accept critical props, and expose accessibility attrs. We DO NOT TDD every visual detail — visual validation happens with `next dev` + `vercel preview`. The video-fade hook gets thorough tests because it has real logic.

---

## Task 1: Bootstrap Next.js project in `web/` subdirectory

**Files:**
- Create: `web/` directory with full Next.js scaffolding (`web/package.json`, `web/tsconfig.json`, `web/next.config.mjs`, `web/app/layout.tsx`, `web/app/page.tsx`, `web/app/globals.css`, `web/postcss.config.mjs`, `web/.gitignore`, `web/README.md`)
- Create: `.gitignore` at project root (to ignore `web/node_modules`, `web/.next`, etc.)

- [ ] **Step 1: Run create-next-app targeting the `web` subdirectory**

Run from `E:\Projetos\Prumo\`:

```powershell
npx --yes create-next-app@latest web --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack --skip-install
```

Expected: A new `web/` folder containing the Next.js scaffolding. The pre-existing files (`CONTEXT.md`, `docs/`, `mockups/`) are untouched at project root.

- [ ] **Step 2: Install runtime + test dependencies**

```powershell
cd web
npm install
npm install lucide-react
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event happy-dom @vitejs/plugin-react
cd ..
```

Expected: `web/node_modules/` populated, `web/package.json` lists the new deps.

- [ ] **Step 3: Create root-level `.gitignore`**

Create `E:\Projetos\Prumo\.gitignore`:

```gitignore
# Next.js / Node — inside web/
web/node_modules/
web/.next/
web/out/
web/.vercel/
web/next-env.d.ts

# Env files
web/.env*.local
.env*.local

# OS / editor
.DS_Store
Thumbs.db
.vscode/
.idea/
*.log
```

(The `web/.gitignore` that create-next-app produced stays as-is — it's the Next.js-specific one. The root `.gitignore` covers anything outside `web/`.)

- [ ] **Step 4: Initialize git at project root and commit**

Run from `E:\Projetos\Prumo\`:

```powershell
git init
git add CONTEXT.md docs/ mockups/ web/ .gitignore
git commit -m "chore: bootstrap Next.js 15 in web/ with TypeScript, Tailwind, lucide-react, Vitest"
```

Expected: initial commit on `main` (or `master`) containing the existing context files plus the freshly scaffolded `web/` directory. `node_modules/` and build artifacts are NOT in the commit (ignored).

---

## Task 2: Configure design tokens and base styles

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `app/fonts.ts`

- [ ] **Step 1: Configure fonts via `next/font/google`**

Create `app/fonts.ts`:

```ts
import { Instrument_Serif, Inter } from 'next/font/google';

export const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

export const inter = Inter({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});
```

- [ ] **Step 2: Wire fonts and base theme in layout**

Replace `app/layout.tsx` contents with:

```tsx
import type { Metadata } from 'next';
import { instrumentSerif, inter } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prumo — Sites, estratégia e presença digital',
  description: 'Estúdio digital. Sites sob medida, planos de manutenção e parceria contínua.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${instrumentSerif.variable} ${inter.variable} dark`}>
      <body className="min-h-screen bg-black text-white antialiased font-body">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Define design tokens and shared classes in `app/globals.css`**

Replace contents of `app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-bg: #000000;
  --color-bg-soft: #0a0a0a;
  --color-fg: #ffffff;
  --color-fg-70: rgba(255, 255, 255, 0.70);
  --color-fg-55: rgba(255, 255, 255, 0.55);
  --color-fg-35: rgba(255, 255, 255, 0.35);
  --font-display: var(--font-display);
  --font-body: var(--font-body);
}

@layer base {
  :root { color-scheme: dark; }
  html, body { background: var(--color-bg); }
}

@layer components {
  .liquid-glass {
    background: rgba(255, 255, 255, 0.01);
    background-blend-mode: luminosity;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
  }
  .liquid-glass::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.45) 0%,
      rgba(255, 255, 255, 0.15) 20%,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0) 60%,
      rgba(255, 255, 255, 0.15) 80%,
      rgba(255, 255, 255, 0.45) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .prumo-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(255, 255, 255, 0.12) 30%,
      rgba(255, 255, 255, 0.12) 70%,
      transparent 100%
    );
    pointer-events: none;
  }
}
```

- [ ] **Step 4: Replace `app/page.tsx` with a smoke placeholder**

```tsx
export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="font-display text-5xl">Prumo</h1>
    </main>
  );
}
```

- [ ] **Step 5: Add Tailwind `font-display` and `font-body` utilities by referencing CSS variables**

Add to `app/globals.css` (append after `@theme` block):

```css
@utility font-display { font-family: var(--font-display), serif; }
@utility font-body { font-family: var(--font-body), system-ui, sans-serif; }
```

- [ ] **Step 6: Verify the dev server starts and renders the placeholder**

```powershell
npm run dev
```

Open `http://localhost:3000` in browser. Expected: black background, white "Prumo" centered in Instrument Serif. Stop the dev server (Ctrl+C) before moving on.

- [ ] **Step 7: Commit**

```powershell
git add app/fonts.ts app/layout.tsx app/page.tsx app/globals.css
git commit -m "feat(theme): add Instrument Serif + Inter, design tokens, liquid glass and prumo line classes"
```

---

## Task 3: Configure Vitest test infrastructure

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`
- Modify: `package.json` (scripts), `tsconfig.json` (include tests)

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': resolve(__dirname, '.') },
  },
});
```

- [ ] **Step 2: Create `tests/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 3: Add test scripts to `package.json`**

In `package.json`, ensure the `scripts` object contains:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

- [ ] **Step 4: Update `tsconfig.json` to include test types**

In `tsconfig.json`, ensure `compilerOptions.types` includes vitest globals:

```jsonc
{
  "compilerOptions": {
    // ...existing options
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "tests/**/*"]
}
```

- [ ] **Step 5: Write a sanity test to confirm Vitest works**

Create `tests/sanity.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('sanity', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run it**

```powershell
npm test
```

Expected: 1 test passed. Delete `tests/sanity.test.ts` after passing.

```powershell
Remove-Item tests/sanity.test.ts
```

- [ ] **Step 7: Commit**

```powershell
git add vitest.config.ts tests/setup.ts package.json tsconfig.json
git commit -m "test: configure Vitest with happy-dom and Testing Library"
```

---

## Task 4: LiquidGlass component

**Files:**
- Create: `components/ui/liquid-glass.tsx`
- Test: `tests/components/liquid-glass.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/liquid-glass.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LiquidGlass } from '@/components/ui/liquid-glass';

describe('LiquidGlass', () => {
  it('renders children inside a div with the liquid-glass class', () => {
    render(<LiquidGlass data-testid="lg">hello</LiquidGlass>);
    const el = screen.getByTestId('lg');
    expect(el).toHaveClass('liquid-glass');
    expect(el).toHaveTextContent('hello');
  });

  it('merges custom className without dropping liquid-glass', () => {
    render(<LiquidGlass className="rounded-full px-4" data-testid="lg">x</LiquidGlass>);
    const el = screen.getByTestId('lg');
    expect(el).toHaveClass('liquid-glass');
    expect(el).toHaveClass('rounded-full');
    expect(el).toHaveClass('px-4');
  });

  it('renders as a different element when "as" prop is provided', () => {
    render(<LiquidGlass as="a" href="#" data-testid="lg">link</LiquidGlass>);
    const el = screen.getByTestId('lg');
    expect(el.tagName).toBe('A');
    expect(el).toHaveAttribute('href', '#');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```powershell
npm test
```

Expected: FAIL with "Cannot find module '@/components/ui/liquid-glass'".

- [ ] **Step 3: Implement `LiquidGlass`**

Create `components/ui/liquid-glass.tsx`:

```tsx
import { forwardRef, type ElementType, type ComponentPropsWithoutRef, type Ref } from 'react';

type LiquidGlassOwnProps<E extends ElementType> = {
  as?: E;
  className?: string;
  children?: React.ReactNode;
};

type LiquidGlassProps<E extends ElementType> = LiquidGlassOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof LiquidGlassOwnProps<E>>;

function LiquidGlassImpl<E extends ElementType = 'div'>(
  { as, className = '', children, ...rest }: LiquidGlassProps<E>,
  ref: Ref<Element>,
) {
  const Component = (as ?? 'div') as ElementType;
  return (
    <Component ref={ref} className={`liquid-glass ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
}

export const LiquidGlass = forwardRef(LiquidGlassImpl) as <E extends ElementType = 'div'>(
  props: LiquidGlassProps<E> & { ref?: Ref<Element> },
) => React.ReactElement | null;
```

- [ ] **Step 4: Run tests to verify pass**

```powershell
npm test
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```powershell
git add components/ui/liquid-glass.tsx tests/components/liquid-glass.test.tsx
git commit -m "feat(ui): add LiquidGlass polymorphic wrapper component"
```

---

## Task 5: PrumoLines component

**Files:**
- Create: `components/ui/prumo-lines.tsx`
- Test: `tests/components/prumo-lines.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/prumo-lines.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PrumoLines } from '@/components/ui/prumo-lines';

describe('PrumoLines', () => {
  it('renders one line per position', () => {
    const { container } = render(<PrumoLines positions={[16, 50, 84]} />);
    const lines = container.querySelectorAll('.prumo-line');
    expect(lines).toHaveLength(3);
  });

  it('places each line at the given left percentage', () => {
    const { container } = render(<PrumoLines positions={[20, 80]} />);
    const lines = container.querySelectorAll<HTMLElement>('.prumo-line');
    expect(lines[0].style.left).toBe('20%');
    expect(lines[1].style.left).toBe('80%');
  });

  it('is decorative — has aria-hidden', () => {
    const { container } = render(<PrumoLines positions={[50]} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
npm test
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `PrumoLines`**

Create `components/ui/prumo-lines.tsx`:

```tsx
type PrumoLinesProps = {
  positions: number[];
  className?: string;
};

export function PrumoLines({ positions, className = '' }: PrumoLinesProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`.trim()}>
      {positions.map((left, i) => (
        <span key={i} className="prumo-line" style={{ left: `${left}%` }} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run tests**

```powershell
npm test
```

Expected: all passing.

- [ ] **Step 5: Commit**

```powershell
git add components/ui/prumo-lines.tsx tests/components/prumo-lines.test.tsx
git commit -m "feat(ui): add PrumoLines decorative vertical-lines component"
```

---

## Task 6: useVideoFade hook

**Files:**
- Create: `lib/hooks/use-video-fade.ts`
- Test: `tests/lib/use-video-fade.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/lib/use-video-fade.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useVideoFade } from '@/lib/hooks/use-video-fade';

function makeFakeVideo(): HTMLVideoElement {
  const events: Record<string, EventListener[]> = {};
  const v = {
    style: { opacity: '0' } as CSSStyleDeclaration,
    currentTime: 0,
    duration: 10,
    play: vi.fn().mockResolvedValue(undefined),
    addEventListener: (name: string, handler: EventListener) => {
      (events[name] ||= []).push(handler);
    },
    removeEventListener: vi.fn(),
    __fire: (name: string) => events[name]?.forEach((h) => h(new Event(name))),
  } as unknown as HTMLVideoElement & { __fire: (n: string) => void };
  return v;
}

describe('useVideoFade', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) =>
      setTimeout(() => cb(performance.now()), 16) as unknown as number,
    );
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id as unknown as NodeJS.Timeout));
  });

  it('returns a ref callback', () => {
    const { result } = renderHook(() => useVideoFade());
    expect(typeof result.current).toBe('function');
  });

  it('starts fade-in when the video fires loadeddata', async () => {
    const { result } = renderHook(() => useVideoFade({ durationMs: 500 }));
    const v = makeFakeVideo();
    act(() => { (result.current as (el: HTMLVideoElement | null) => void)(v); });
    act(() => { (v as unknown as { __fire(n: string): void }).__fire('loadeddata'); });
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    expect(parseFloat(v.style.opacity || '0')).toBeCloseTo(1, 1);
  });

  it('fades out when timeupdate fires within fadeOutLeadMs of duration', async () => {
    const { result } = renderHook(() => useVideoFade({ durationMs: 500, fadeOutLeadMs: 550 }));
    const v = makeFakeVideo();
    act(() => { (result.current as (el: HTMLVideoElement | null) => void)(v); });
    act(() => { (v as unknown as { __fire(n: string): void }).__fire('loadeddata'); });
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    (v as { currentTime: number }).currentTime = 9.5;
    act(() => { (v as unknown as { __fire(n: string): void }).__fire('timeupdate'); });
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    expect(parseFloat(v.style.opacity || '1')).toBeCloseTo(0, 1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
npm test
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `useVideoFade`**

Create `lib/hooks/use-video-fade.ts`:

```ts
import { useCallback, useEffect, useRef } from 'react';

type Options = {
  /** Fade-in / fade-out duration in ms. Default 500. */
  durationMs?: number;
  /** Time before video.duration to trigger fade-out, in ms. Default 550. */
  fadeOutLeadMs?: number;
};

export function useVideoFade({ durationMs = 500, fadeOutLeadMs = 550 }: Options = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  const cancelRaf = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const animateOpacity = useCallback((from: number, to: number, onDone?: () => void) => {
    const el = videoRef.current;
    if (!el) return;
    cancelRaf();
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const value = from + (to - from) * progress;
      el.style.opacity = value.toString();
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        onDone?.();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [durationMs]);

  const fadeIn = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    fadingOutRef.current = false;
    const current = parseFloat(el.style.opacity || '0');
    animateOpacity(current, 1);
  }, [animateOpacity]);

  const fadeOut = useCallback(() => {
    const el = videoRef.current;
    if (!el || fadingOutRef.current) return;
    fadingOutRef.current = true;
    const current = parseFloat(el.style.opacity || '1');
    animateOpacity(current, 0);
  }, [animateOpacity]);

  const onLoaded = useCallback(() => { fadeIn(); }, [fadeIn]);

  const onTimeUpdate = useCallback(() => {
    const el = videoRef.current;
    if (!el || !el.duration || isNaN(el.duration)) return;
    if (fadingOutRef.current) return;
    const remaining = (el.duration - el.currentTime) * 1000;
    if (remaining <= fadeOutLeadMs) {
      fadeOut();
    }
  }, [fadeOut, fadeOutLeadMs]);

  const onEnded = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => {
      el.currentTime = 0;
      el.play().catch(() => {});
      fadingOutRef.current = false;
      fadeIn();
    }, 100);
  }, [fadeIn]);

  const setRef = useCallback((el: HTMLVideoElement | null) => {
    const prev = videoRef.current;
    if (prev) {
      prev.removeEventListener('loadeddata', onLoaded);
      prev.removeEventListener('timeupdate', onTimeUpdate);
      prev.removeEventListener('ended', onEnded);
    }
    videoRef.current = el;
    if (el) {
      el.style.opacity = '0';
      el.addEventListener('loadeddata', onLoaded);
      el.addEventListener('timeupdate', onTimeUpdate);
      el.addEventListener('ended', onEnded);
    }
  }, [onLoaded, onTimeUpdate, onEnded]);

  useEffect(() => () => { cancelRaf(); }, []);

  return setRef;
}
```

- [ ] **Step 4: Run tests**

```powershell
npm test
```

Expected: useVideoFade tests pass. If a flaky timer test occurs, retry once — if persistent, increase `vi.advanceTimersByTimeAsync` by 100 ms.

- [ ] **Step 5: Commit**

```powershell
git add lib/hooks/use-video-fade.ts tests/lib/use-video-fade.test.ts
git commit -m "feat(hooks): add useVideoFade with requestAnimationFrame-based fades"
```

---

## Task 7: Add hero placeholder video to public

**Files:**
- Create: `public/hero-placeholder.mp4` (binary — see step 1)

- [ ] **Step 1: Provide a placeholder video file**

Since we don't have the real video yet, copy ANY small mp4 you have locally OR download a free architectural loop. From PowerShell (one option using ffmpeg if installed, otherwise see fallback):

```powershell
# Option A — if you have a local mp4 to use as placeholder:
Copy-Item "C:\path\to\some-clip.mp4" "public\hero-placeholder.mp4"

# Option B — generate a 6s solid-black mp4 with ffmpeg (if ffmpeg installed):
ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=6 -c:v libx264 -pix_fmt yuv420p -movflags +faststart public/hero-placeholder.mp4

# Option C — download a free arch/geometry clip from pexels/coverr manually and save to public/hero-placeholder.mp4
```

If none of those work right now, create an empty file as a stub and skip step 2 visual check until you have a real file:

```powershell
New-Item -ItemType File public/hero-placeholder.mp4
```

- [ ] **Step 2: (Visual check, optional)**

If a real video was placed, you can preview it by opening the file. Otherwise proceed.

- [ ] **Step 3: Commit**

If the file is real (>0 bytes), commit it:

```powershell
git add public/hero-placeholder.mp4
git commit -m "chore: add placeholder hero background video"
```

If it's an empty stub, skip the commit and revisit in Task 12.

---

## Task 8: HeroVideo component

**Files:**
- Create: `components/hero/hero-video.tsx`
- (No new test file — covered by hero.test.tsx in Task 12)

- [ ] **Step 1: Implement HeroVideo**

Create `components/hero/hero-video.tsx`:

```tsx
'use client';

import { useVideoFade } from '@/lib/hooks/use-video-fade';

type HeroVideoProps = {
  src: string;
  /** Vertical translate applied to the video to crop top portion. Default 17%. */
  translateY?: string;
};

export function HeroVideo({ src, translateY = '17%' }: HeroVideoProps) {
  const setRef = useVideoFade();
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <video
        ref={setRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: `translateY(${translateY})`, opacity: 0 }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add components/hero/hero-video.tsx
git commit -m "feat(hero): add HeroVideo with crop translate and vignette"
```

---

## Task 9: HeroNav component

**Files:**
- Create: `components/hero/hero-nav.tsx`
- Test: `tests/components/hero/hero-nav.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/hero/hero-nav.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroNav } from '@/components/hero/hero-nav';

describe('HeroNav', () => {
  it('renders Prumo wordmark and the primary CTA', () => {
    render(<HeroNav />);
    expect(screen.getByText('Prumo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /agendar conversa/i })).toBeInTheDocument();
  });

  it('renders the four nav links', () => {
    render(<HeroNav />);
    ['Trabalhos', 'Planos', 'Sobre', 'Contato'].forEach((label) => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run — fails (module not found)**

```powershell
npm test
```

- [ ] **Step 3: Implement HeroNav**

Create `components/hero/hero-nav.tsx`:

```tsx
import Link from 'next/link';
import { LiquidGlass } from '@/components/ui/liquid-glass';

const NAV = [
  { href: '/trabalhos', label: 'Trabalhos' },
  { href: '/planos', label: 'Planos' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
];

export function HeroNav() {
  return (
    <nav className="relative z-20 px-6 py-6">
      <LiquidGlass className="mx-auto flex max-w-5xl items-center justify-between rounded-full px-6 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-display text-xl text-white">
            <span aria-hidden className="inline-block h-5 w-[2px] bg-white/80" />
            Prumo
          </Link>
          <ul className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-white">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/"
            className="hidden text-sm text-white/70 transition-colors hover:text-white md:inline-block"
          >
            WhatsApp
          </a>
          <LiquidGlass
            as="a"
            href="https://cal.com/"
            className="rounded-full px-5 py-2 text-sm font-medium text-white"
          >
            Agendar conversa
          </LiquidGlass>
        </div>
      </LiquidGlass>
    </nav>
  );
}
```

- [ ] **Step 4: Run tests — pass**

```powershell
npm test
```

- [ ] **Step 5: Commit**

```powershell
git add components/hero/hero-nav.tsx tests/components/hero/hero-nav.test.tsx
git commit -m "feat(hero): add HeroNav with glass capsule, wordmark and CTAs"
```

---

## Task 10: HeroContent component

**Files:**
- Create: `components/hero/hero-content.tsx`
- Test: `tests/components/hero/hero-content.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/hero/hero-content.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroContent } from '@/components/hero/hero-content';

describe('HeroContent', () => {
  it('renders the heading text', () => {
    render(<HeroContent />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tudo começa por');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('uma linha reta.');
  });

  it('renders the tagline', () => {
    render(<HeroContent />);
    expect(
      screen.getByText(/Sites, estratégia e presença digital para marcas que valorizam precisão\./),
    ).toBeInTheDocument();
  });

  it('renders primary and secondary CTAs', () => {
    render(<HeroContent />);
    expect(screen.getByRole('link', { name: /agendar conversa/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver trabalhos/i })).toBeInTheDocument();
  });

  it('does NOT render any email input (we are not a newsletter)', () => {
    render(<HeroContent />);
    expect(screen.queryByPlaceholderText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — fails**

```powershell
npm test
```

- [ ] **Step 3: Implement HeroContent**

Create `components/hero/hero-content.tsx`:

```tsx
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

export function HeroContent() {
  return (
    <section className="relative z-10 flex flex-1 -translate-y-[6%] flex-col items-center justify-center px-6 py-12 text-center">
      <p className="mb-8 text-xs uppercase tracking-[0.3em] text-white/40">
        Estúdio digital · Brasil
      </p>

      <h1 className="font-display mb-8 max-w-5xl text-5xl leading-[1.05] tracking-tight md:text-7xl lg:text-[5.5rem]">
        Tudo começa por <em className="font-display italic">uma linha reta.</em>
      </h1>

      <p className="mb-10 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
        Sites, estratégia e presença digital para marcas que valorizam precisão.
      </p>

      <div className="mb-16 flex flex-col items-center gap-3 sm:flex-row">
        <LiquidGlass
          as="a"
          href="https://cal.com/"
          className="group flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium text-white"
        >
          Agendar conversa
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </LiquidGlass>
        <Link
          href="/trabalhos"
          className="rounded-full px-8 py-3.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          Ver trabalhos →
        </Link>
      </div>

      <div className="flex items-center gap-6 text-[11px] uppercase tracking-widest text-white/35">
        <span>Next.js</span>
        <span className="h-1 w-1 rounded-full bg-white/30" />
        <span>Framer</span>
        <span className="h-1 w-1 rounded-full bg-white/30" />
        <span>Webflow</span>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests — pass**

```powershell
npm test
```

- [ ] **Step 5: Commit**

```powershell
git add components/hero/hero-content.tsx tests/components/hero/hero-content.test.tsx
git commit -m "feat(hero): add HeroContent with anchor phrase, tagline, dual CTAs and stack chips"
```

---

## Task 11: HeroSocial component

**Files:**
- Create: `components/hero/hero-social.tsx`
- Test: `tests/components/hero/hero-social.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/hero/hero-social.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroSocial } from '@/components/hero/hero-social';

describe('HeroSocial', () => {
  it('renders three social icon links with aria-labels', () => {
    render(<HeroSocial />);
    expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — fails**

```powershell
npm test
```

- [ ] **Step 3: Implement HeroSocial**

Create `components/hero/hero-social.tsx`:

```tsx
import { Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

const ITEMS = [
  { href: 'https://instagram.com/', label: 'Instagram', Icon: Instagram },
  { href: 'https://linkedin.com/', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://wa.me/', label: 'WhatsApp', Icon: MessageCircle },
];

export function HeroSocial() {
  return (
    <div className="relative z-10 flex justify-center gap-3 pb-10">
      {ITEMS.map(({ href, label, Icon }) => (
        <LiquidGlass
          key={label}
          as="a"
          href={href}
          aria-label={label}
          className="rounded-full p-3.5 text-white/70 transition-colors hover:text-white"
        >
          <Icon className="h-4 w-4" />
        </LiquidGlass>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run tests — pass**

```powershell
npm test
```

- [ ] **Step 5: Commit**

```powershell
git add components/hero/hero-social.tsx tests/components/hero/hero-social.test.tsx
git commit -m "feat(hero): add HeroSocial with three glass-circle icon links"
```

---

## Task 12: Hero composition + wire to home page

**Files:**
- Create: `components/hero/hero.tsx`
- Test: `tests/components/hero/hero.test.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/hero/hero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from '@/components/hero/hero';

describe('Hero', () => {
  it('renders nav, heading, social row', () => {
    const { container } = render(<Hero videoSrc="/hero-placeholder.mp4" />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument();
    expect(container.querySelector('video')).toBeTruthy();
  });

  it('renders decorative prumo lines', () => {
    const { container } = render(<Hero videoSrc="/hero-placeholder.mp4" />);
    expect(container.querySelectorAll('.prumo-line').length).toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Step 2: Run — fails**

```powershell
npm test
```

- [ ] **Step 3: Implement Hero**

Create `components/hero/hero.tsx`:

```tsx
import { HeroVideo } from './hero-video';
import { HeroNav } from './hero-nav';
import { HeroContent } from './hero-content';
import { HeroSocial } from './hero-social';
import { PrumoLines } from '@/components/ui/prumo-lines';

type HeroProps = {
  videoSrc: string;
};

export function Hero({ videoSrc }: HeroProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black">
      <HeroVideo src={videoSrc} />
      <PrumoLines positions={[16, 50, 84]} />
      <HeroNav />
      <HeroContent />
      <HeroSocial />
    </div>
  );
}
```

- [ ] **Step 4: Wire Hero into the home page**

Replace `app/page.tsx` with:

```tsx
import { Hero } from '@/components/hero/hero';

export default function HomePage() {
  return <Hero videoSrc="/hero-placeholder.mp4" />;
}
```

- [ ] **Step 5: Run tests — all pass**

```powershell
npm test
```

- [ ] **Step 6: Visual check**

```powershell
npm run dev
```

Open `http://localhost:3000`. Expected: navbar capsule on top, big serif heading "Tudo começa por uma linha reta." centered, dual CTAs, social icons at bottom, video (or placeholder) running behind, three vertical prumo lines visible at 16/50/84%.

If the heading collides with the navbar on mobile widths, resize check at ≥1024px first. We polish mobile in Task 14.

Stop the dev server before moving on.

- [ ] **Step 7: Commit**

```powershell
git add components/hero/hero.tsx tests/components/hero/hero.test.tsx app/page.tsx
git commit -m "feat(hero): compose Hero and render on home page"
```

---

## Task 13: Build + production sanity check

**Files:** none (validation only)

- [ ] **Step 1: Build the project**

```powershell
npm run build
```

Expected: Build succeeds. No type errors. No ESLint errors. Bundle output includes the home page as static.

- [ ] **Step 2: Run the production build locally**

```powershell
npm run start
```

Open `http://localhost:3000`. Confirm everything looks like in Task 12 Step 6, with the production bundle. Stop the server.

- [ ] **Step 3: If build fails, fix and re-run**

Common issues:
- Missing `'use client'` directive in `HeroVideo` (it uses a hook) — already present per Task 8.
- ESLint complaining about `<a>` instead of `<Link>` — replace internal `<a>` with `<Link>` where appropriate.
- Type errors on polymorphic `LiquidGlass` — leave the `as any` if needed for the second cast; the test suite enforces behavior.

Do not bypass errors. Fix the root cause.

- [ ] **Step 4: Commit any fixes**

```powershell
git add -A
git commit -m "fix: address production build issues"
```

(Skip commit if no fixes were needed.)

---

## Task 14: Mobile pass — verify nav + heading + CTAs look right under 768px

**Files:** modify whichever hero subcomponent has issues

- [ ] **Step 1: Visual check at narrow widths**

```powershell
npm run dev
```

Open `http://localhost:3000`, open DevTools (F12), device toolbar (Ctrl+Shift+M), test at:
- 375px (iPhone SE)
- 414px (iPhone Pro Max)
- 768px (iPad portrait)

Look for:
- Nav capsule overflowing (links hidden? CTAs visible?)
- Heading overflow horizontally
- CTAs stacking properly (sm:flex-row already handles this)
- Social row not overflowing

- [ ] **Step 2: Fix any issues identified**

Most likely fixes (apply only if needed):
- In `hero-nav.tsx`, reduce padding at narrow widths: change `px-6 py-3` to `px-4 py-3 md:px-6`.
- In `hero-content.tsx`, ensure heading wraps cleanly: heading already uses `max-w-5xl` and responsive sizes. If overflow occurs at 375px, add `text-[2.5rem]` as the base size.
- In `hero-social.tsx`, no expected issues.

- [ ] **Step 3: Re-verify on all three widths**

Confirm no horizontal scroll, no overlap, all elements legible.

- [ ] **Step 4: Commit**

```powershell
git add -A
git commit -m "fix(hero): mobile layout adjustments"
```

(Skip if nothing changed.)

---

## Task 15: Deploy preview to Vercel

**Files:** `vercel.json` (optional, only if needed)

- [ ] **Step 1: Confirm Vercel CLI is available**

```powershell
npx vercel --version
```

If not installed, install globally OR use `npx vercel` per-command.

- [ ] **Step 2: Link the project**

```powershell
npx vercel link
```

Follow prompts: scope = your account, link to a new project named `prumo`.

- [ ] **Step 3: Deploy preview**

```powershell
npx vercel
```

Expected: a preview URL like `https://prumo-xxxxxx-yourname.vercel.app`. Open it and confirm the Hero renders identical to local production.

- [ ] **Step 4: Note the URL in the project README**

Append to `README.md`:

```markdown
## Preview deploy

Latest preview: <paste URL>

Production: not yet deployed.
```

- [ ] **Step 5: Commit**

```powershell
git add README.md
git commit -m "docs: add Vercel preview URL to README"
```

- [ ] **Step 6: Confirm in browser on a mobile device (or DevTools mobile mode) that production preview matches expectations.**

If anything looks off vs local, the most common cause is missing public asset (`hero-placeholder.mp4`) — confirm it was committed and pushed. The mp4 must be in the deployed bundle.

---

## Task 16: Update CONTEXT.md and close out the plan

**Files:** `CONTEXT.md`

- [ ] **Step 1: Update the "Status atual" section in `E:\Projetos\Prumo\CONTEXT.md`**

Mark these items done:
- [x] Setup do projeto Next.js
- [x] Identidade visual final (paleta accent, logo simples, sistema de tipografia)
- (Partial) Implementação das seções — only Hero done.

Add a new entry:
```markdown
- [x] **Plano 1 executado:** Foundation + Hero deployado em <vercel preview URL>
```

- [ ] **Step 2: Commit**

```powershell
git add CONTEXT.md
git commit -m "docs: mark Plan 1 (Foundation + Hero) as complete in CONTEXT.md"
```

- [ ] **Step 3: Decide next step**

Open the preview URL one more time. If the Hero looks right at production scale on a real device:
- Proceed to write Plan 2 (Home sections).

If the Hero needs visual tweaks:
- Stop, iterate locally, redeploy. Do not start Plan 2 until the visual identity is validated.

---

## Self-Review

**Spec coverage:**
- ✅ Next.js 15 + Tailwind + TypeScript stack (Tasks 1, 2)
- ✅ Instrument Serif + Inter fonts (Task 2)
- ✅ Dark cinematic with white-only accent (Task 2, design tokens)
- ✅ Liquid Glass class + component (Tasks 2, 4)
- ✅ Prumo Lines as marca element (Tasks 2, 5)
- ✅ Hero with video bg + custom JS fade via requestAnimationFrame (Tasks 6, 8)
- ✅ Hero copy "Tudo começa por uma linha reta." (Task 10)
- ✅ Calendly CTA + WhatsApp + Ver trabalhos (Tasks 9, 10)
- ✅ Social icons via lucide-react (Task 11)
- ✅ Deploy to Vercel (Task 15)
- ⏭️ i18n PT-BR/EN — deferred to Plan 4 (intentional; layout uses `lang="pt-BR"` for now)
- ⏭️ Real hero video — Task 7 uses placeholder; final video TBD by client
- ⏭️ Domain — deferred (`E:\Projetos\Prumo\CONTEXT.md` section 10)

**Placeholder scan:** No "TBD" steps. The `hero-placeholder.mp4` is intentional and called out — it's a known artifact, not a missing instruction. Task 7 gives 3 concrete options.

**Type consistency:** `LiquidGlass` used consistently. `PrumoLines` used consistently. `useVideoFade` returns a ref callback used in `HeroVideo`. All names check out.

**Scope:** focused on Foundation + Hero. Other sections explicitly out of scope and queued as Plans 2-4.

---

## Execution Handoff

**Plan complete and saved to `E:\Projetos\Prumo\docs\superpowers\plans\2026-05-20-prumo-foundation-hero.md`.**

Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Cleaner state per task, easier to roll back individual tasks.

2. **Inline Execution** — Execute tasks in this session using executing-plans. Batch execution with checkpoints for review. Slower because everything goes through this conversation, but you see every step live.

**Which approach?**
