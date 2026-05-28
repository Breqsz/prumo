# Tier 2 — Analytics + SEO técnico Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar o site Prumo mensurável (Umami events nas conversões) e achável (SEO técnico: metadata por página, sitemap, robots, JSON-LD, OG images dinâmicas branded).

**Architecture:** Duas fases independentes. **Fase A (Analytics):** script Umami carregado por env var no root layout; cliques rastreados de forma declarativa via `data-umami-event` (server-safe, sem virar client component); `form_submit` via helper programático. **Fase B (SEO):** `SITE_URL` centralizado, metadata defaults + por página, `sitemap.ts`/`robots.ts`, componente `<JsonLd>`, e OG images via `ImageResponse`.

**Tech Stack:** Next.js **16.2.6** (App Router), React 19, TypeScript strict, Tailwind v4, Vitest + happy-dom, Umami Cloud.

> **AVISO Next 16:** esta versão tem breaking changes. Antes de mexer em `sitemap`/`robots`/`opengraph-image`/`ImageResponse`/metadata, **ler o doc correspondente em `node_modules/next/dist/docs/`**. O código abaixo segue convenções estáveis do App Router como referência — confirme contra o doc local e ajuste se divergir.

> **Env vars** (já obtidas; configurar em `.env.local` e na Vercel):
> - `NEXT_PUBLIC_UMAMI_SRC=https://cloud.umami.is/script.js`
> - `NEXT_PUBLIC_UMAMI_WEBSITE_ID=76e2a9e7-40a5-4e8f-b491-e345724737fd`
> - `NEXT_PUBLIC_SITE_URL=` (vazio até o domínio sair; cai no fallback da Vercel/localhost)

---

## File Structure

- `web/lib/analytics.ts` — **novo.** Helper `track()` programático + tipo global `window.umami`.
- `web/lib/site.ts` — **novo.** `SITE_URL` centralizado (usado por layout, sitemap, robots, OG).
- `web/components/seo/json-ld.tsx` — **novo.** Componente server que injeta `<script type="application/ld+json">`.
- `web/app/sitemap.ts` — **novo.** Rotas estáticas + slugs de cases.
- `web/app/robots.ts` — **novo.** Allow all + sitemap.
- `web/lib/og-template.tsx` — **novo.** Template JSX branded compartilhado pras OG images.
- `web/app/opengraph-image.tsx` — **novo.** OG default do site.
- `web/app/{planos,sobre,trabalhos}/opengraph-image.tsx` — **novos.** OG por página-chave.
- `web/app/trabalhos/[slug]/opengraph-image.tsx` — **novo.** OG por case.
- `web/app/layout.tsx` — **editar.** metadataBase + title.template + openGraph/twitter defaults + `<Script>` Umami.
- `web/app/page.tsx`, `web/app/{planos,sobre,trabalhos,contato}/page.tsx`, `web/app/trabalhos/[slug]/page.tsx` — **editar.** title (sem `· Prumo` manual onde o template cobre) + canonical + openGraph; JSON-LD em home/sobre/[slug].
- CTAs (**editar**, só adicionar data-attrs): `web/components/hero/hero-nav.tsx`, `web/components/hero/hero-content.tsx`, `web/components/cta/final-cta.tsx`, `web/components/hero/hero-social.tsx`, `web/components/planos/*` (cards), `web/components/contato/contato-form.tsx` (form_submit).
- Testes: `web/lib/analytics.test.ts`, `web/app/sitemap.test.ts`.

---

# FASE A — Analytics (Umami)

### Task A1: Helper `track()` + tipo global

**Files:**
- Create: `web/lib/analytics.ts`
- Test: `web/lib/analytics.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// web/lib/analytics.test.ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "./analytics";

afterEach(() => {
  delete (window as unknown as { umami?: unknown }).umami;
  vi.restoreAllMocks();
});

describe("track", () => {
  it("is a no-op (no throw) when umami is not loaded", () => {
    expect(() => track("cta_contato", { source: "nav" })).not.toThrow();
  });

  it("forwards event name and data to umami.track when present", () => {
    const spy = vi.fn();
    (window as unknown as { umami: { track: typeof spy } }).umami = { track: spy };
    track("form_submit");
    expect(spy).toHaveBeenCalledWith("form_submit", undefined);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web && npx vitest run lib/analytics.test.ts`
Expected: FAIL — `Cannot find module './analytics'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// web/lib/analytics.ts
declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

/** Programmatic Umami event. Safe no-op on server or when the script
 * hasn't loaded (missing env vars, dev, blocked). Click events use the
 * declarative `data-umami-event` attribute instead — see plan Task A3. */
export function track(event: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.umami?.track(event, data);
}

export {};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web && npx vitest run lib/analytics.test.ts`
Expected: PASS (2 passed).

- [ ] **Step 5: Commit**

```bash
git add web/lib/analytics.ts web/lib/analytics.test.ts
git commit -m "feat(analytics): track() helper + window.umami type"
```

---

### Task A2: Carregar script Umami no layout

**Files:**
- Modify: `web/app/layout.tsx`

- [ ] **Step 1: Read the Next 16 Script doc**

Run: `cd web && ls node_modules/next/dist/docs/` e ler o doc de `next/script` se existir. Confirmar API do componente `<Script>` e `strategy`.

- [ ] **Step 2: Add the Umami `<Script>` (conditional on env vars)**

Editar `web/app/layout.tsx`. Adicionar import e renderizar o script no fim do `<body>`, só quando ambas as env vars existem:

```tsx
import Script from "next/script";
// ...existing imports...

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  return (
    <html
      lang="pt-BR"
      className={`${instrumentSerif.variable} ${inter.variable} dark`}
    >
      <body className="min-h-screen bg-black text-white antialiased font-body">
        {children}
        {umamiSrc && umamiId && (
          <Script
            src={umamiSrc}
            data-website-id={umamiId}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Add env vars locally**

Criar/editar `web/.env.local` (NÃO commitar):

```
NEXT_PUBLIC_UMAMI_SRC=https://cloud.umami.is/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=76e2a9e7-40a5-4e8f-b491-e345724737fd
```

- [ ] **Step 4: Verify build + script presence**

Run: `cd web && npm run build`
Expected: build verde.
Run: `cd web && npm run dev`, abrir `http://localhost:3000`, no DevTools → Network filtrar por `script.js` → confirmar request pro `cloud.umami.is`. (Em produção/preview, confirmar pageview aparecendo no dashboard Umami.)

- [ ] **Step 5: Commit**

```bash
git add web/app/layout.tsx
git commit -m "feat(analytics): load Umami script via env vars in root layout"
```

---

### Task A3: Eventos de clique declarativos nos CTAs

**Files:**
- Modify: `web/components/hero/hero-nav.tsx`
- Modify: `web/components/cta/final-cta.tsx`
- Modify: `web/components/hero/hero-social.tsx`
- Modify: `web/components/hero/hero-content.tsx`
- Modify: `web/components/planos/one-time-grid.tsx`, `web/components/planos/monthly-grid.tsx`, `web/components/planos/planos-teaser.tsx`, `web/components/planos/custom-strip.tsx` (os que tiverem CTA pra `/contato` ou pra plano)

> Mecanismo: adicionar `data-umami-event="<nome>"` e `data-umami-event-<key>="<valor>"` no elemento clicável. `LiquidGlass` repassa `...rest`, então funciona nele e em `<Link>`/`<a>`. Sem `"use client"`, sem onClick.

- [ ] **Step 1: HeroNav — 2 CTAs `/contato` (source=nav)**

Em `web/components/hero/hero-nav.tsx`, no `<Link href="/contato">` mobile (linha ~21) e no `<LiquidGlass as="a" href="/contato">` desktop (linha ~45), adicionar:

```tsx
data-umami-event="cta_contato"
data-umami-event-source="nav"
```

- [ ] **Step 2: FinalCta — CTA `/contato` (source=final-cta)**

Em `web/components/cta/final-cta.tsx`, no `<LiquidGlass as="a" href="/contato">` (linha ~43):

```tsx
data-umami-event="cta_contato"
data-umami-event-source="final-cta"
```

- [ ] **Step 3: HeroContent — CTA(s) do hero (source=hero)**

Ler `web/components/hero/hero-content.tsx`. No(s) CTA(s) que apontam pra `/contato`, adicionar `data-umami-event="cta_contato"` + `data-umami-event-source="hero"`. (Se houver CTA secundário "Ver trabalhos" pra `/trabalhos`, NÃO marcar — só os de conversão.)

- [ ] **Step 4: HeroSocial — social_click por network**

Em `web/components/hero/hero-social.tsx`, o array `ITEMS` (linha ~47) vira com `network` e o `LiquidGlass` ganha os data-attrs:

```tsx
const ITEMS = [
  { href: "https://instagram.com/", label: "Instagram", network: "instagram", Icon: InstagramIcon },
  { href: "https://linkedin.com/", label: "LinkedIn", network: "linkedin", Icon: LinkedinIcon },
  { href: "https://wa.me/", label: "WhatsApp", network: "whatsapp", Icon: WhatsappIcon },
];

export function HeroSocial() {
  return (
    <div className="relative z-10 flex justify-center gap-3 pb-10">
      {ITEMS.map(({ href, label, network, Icon }) => (
        <LiquidGlass
          key={label}
          as="a"
          href={href}
          aria-label={label}
          data-umami-event="social_click"
          data-umami-event-network={network}
          className="rounded-full p-3.5 text-white/70 transition-colors hover:text-white"
        >
          <Icon />
        </LiquidGlass>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Cards de plano — plano_click**

Ler cada arquivo em `web/components/planos/` que renderiza CTA de plano (provavelmente via `web/components/pricing/plan-card.tsx`). No CTA de cada card, adicionar `data-umami-event="plano_click"` + `data-umami-event-plano="<slug>"` onde `<slug>` ∈ {landing, institucional, branded, base, crescimento, parceria}. Se os cards são gerados por array, adicionar um campo `eventSlug` no array e passar via prop pro CTA. CTAs de plano que levam a `/contato` devem usar `plano_click` (mais específico) em vez de `cta_contato`.

- [ ] **Step 6: Verify build**

Run: `cd web && npm run build`
Expected: build verde (mudanças são só atributos JSX).

- [ ] **Step 7: Commit**

```bash
git add web/components/hero/hero-nav.tsx web/components/cta/final-cta.tsx web/components/hero/hero-social.tsx web/components/hero/hero-content.tsx web/components/planos/ web/components/pricing/
git commit -m "feat(analytics): declarative data-umami-event on CTAs/socials/plan cards"
```

---

### Task A4: Evento `form_submit` no sucesso do briefing

**Files:**
- Modify: `web/components/contato/contato-form.tsx`

- [ ] **Step 1: Track on success transition**

Em `web/components/contato/contato-form.tsx` (já é `"use client"`), importar o helper e disparar quando o estado vira `ok`. Adicionar perto do topo do componente, após os hooks de estado (após linha ~124):

```tsx
import { useEffect } from "react";
import { track } from "@/lib/analytics";
// ...
useEffect(() => {
  if (state.status === "ok") track("form_submit");
}, [state.status]);
```

> O `return <SuccessPanel />` quando `state.status === "ok"` continua igual — o `useEffect` roda antes do early-return desmontar nada relevante porque o componente re-renderiza com o novo `state`.

- [ ] **Step 2: Verify build + test suite**

Run: `cd web && npm run build && npx vitest run`
Expected: build verde; suíte sem NOVAS falhas (lembrar: existem ~12 testes brittle pré-existentes documentados — não tratá-los como regressão; comparar contra a baseline em `main`).

- [ ] **Step 3: Manual check**

Run: `cd web && npm run dev`, preencher e enviar o form em `/contato`, confirmar evento `form_submit` no dashboard Umami (ou `window.umami` chamado via breakpoint).

- [ ] **Step 4: Commit**

```bash
git add web/components/contato/contato-form.tsx
git commit -m "feat(analytics): fire form_submit event on successful briefing"
```

---

# FASE B — SEO técnico

### Task B1: `SITE_URL` centralizado

**Files:**
- Create: `web/lib/site.ts`

- [ ] **Step 1: Create the module**

```ts
// web/lib/site.ts
/** Base URL canônica do site. Vem de NEXT_PUBLIC_SITE_URL quando o domínio
 * estiver comprado (Tier 0). Até lá, cai na URL de produção da Vercel, e
 * em último caso localhost. Usado por metadataBase, sitemap, robots e OG. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
```

- [ ] **Step 2: Verify it imports**

Run: `cd web && npx tsc --noEmit`
Expected: sem erros novos.

- [ ] **Step 3: Commit**

```bash
git add web/lib/site.ts
git commit -m "feat(seo): centralized SITE_URL with Vercel/localhost fallback"
```

---

### Task B2: Metadata defaults + metadataBase no root layout

**Files:**
- Modify: `web/app/layout.tsx`

- [ ] **Step 1: Read the Next 16 metadata doc**

Ler o doc de Metadata em `node_modules/next/dist/docs/` — confirmar shape de `metadataBase`, `title.template`, `openGraph`, `twitter`, `alternates.canonical`.

- [ ] **Step 2: Replace the metadata export**

Em `web/app/layout.tsx`, importar `SITE_URL` e substituir o `export const metadata`:

```tsx
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Prumo · Sites, estratégia e presença digital",
    template: "%s · Prumo",
  },
  description:
    "Estúdio digital. Sites sob medida, planos de manutenção e parceria contínua.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Prumo",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};
```

- [ ] **Step 3: Verify build**

Run: `cd web && npm run build`
Expected: build verde. Inspecionar `<head>` na home (`npm run dev`) — `og:site_name`, `og:locale`, `twitter:card` presentes.

- [ ] **Step 4: Commit**

```bash
git add web/app/layout.tsx
git commit -m "feat(seo): metadataBase + title template + OG/twitter defaults"
```

---

### Task B3: Metadata por página (title + canonical + OG)

**Files:**
- Modify: `web/app/page.tsx` (home)
- Modify: `web/app/planos/page.tsx`
- Modify: `web/app/sobre/page.tsx`
- Modify: `web/app/trabalhos/page.tsx`
- Modify: `web/app/contato/page.tsx`
- Modify: `web/app/trabalhos/[slug]/page.tsx`

> Padrão: cada página exporta/ajusta `metadata` com `title` **sem** `· Prumo` manual (o template do layout adiciona), `description` própria, e `alternates: { canonical: "<path>" }`. `openGraph.url` segue o canonical. A home usa o `title.default` (não redefine title) mas adiciona canonical.

- [ ] **Step 1: Home — adicionar metadata com canonical**

Em `web/app/page.tsx` (hoje sem `export const metadata`), adicionar:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};
```

- [ ] **Step 2: `/planos`**

Ler o `metadata` atual em `web/app/planos/page.tsx` e substituir por:

```tsx
export const metadata: Metadata = {
  title: "Planos",
  description:
    "Sites sob medida e planos de manutenção contínua. Landing, institucional, projeto branded e mensalidades de parceria.",
  alternates: { canonical: "/planos" },
  openGraph: { url: "/planos" },
};
```

- [ ] **Step 3: `/sobre`**

Substituir o `metadata` em `web/app/sobre/page.tsx`:

```tsx
export const metadata: Metadata = {
  title: "Sobre",
  description:
    "O estúdio, o método e quem assina cada projeto. Operação solo, posicionamento premium, honestidade no processo.",
  alternates: { canonical: "/sobre" },
  openGraph: { url: "/sobre" },
};
```

- [ ] **Step 4: `/trabalhos`**

Substituir o `metadata` em `web/app/trabalhos/page.tsx`:

```tsx
export const metadata: Metadata = {
  title: "Trabalhos",
  description:
    "Projetos selecionados do estúdio Prumo — sites institucionais, apps e produtos digitais.",
  alternates: { canonical: "/trabalhos" },
  openGraph: { url: "/trabalhos" },
};
```

- [ ] **Step 5: `/contato`**

Substituir o `metadata` em `web/app/contato/page.tsx` (remover o `· Prumo` manual se houver, deixar o template cuidar):

```tsx
export const metadata: Metadata = {
  title: "Contato",
  description:
    "Conta o seu objetivo num briefing rápido. Respondo em até 24h com perguntas, cronograma e próximos passos.",
  alternates: { canonical: "/contato" },
  openGraph: { url: "/contato" },
};
```

- [ ] **Step 6: `/trabalhos/[slug]` — canonical + OG no generateMetadata**

Em `web/app/trabalhos/[slug]/page.tsx`, ajustar o `generateMetadata` (linha ~20). Tirar o `· Prumo` manual (template adiciona) e incluir canonical + openGraph:

```tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Projeto não encontrado" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/trabalhos/${slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/trabalhos/${slug}`,
    },
  };
}
```

- [ ] **Step 7: Verify build + inspect**

Run: `cd web && npm run build`
Expected: build verde.
Run: `npm run dev` e inspecionar `<head>` em `/`, `/planos`, `/sobre`, `/trabalhos`, `/contato`, `/trabalhos/hold-corretora` — title com `· Prumo` uma única vez, `<link rel="canonical">` correto por página.

- [ ] **Step 8: Commit**

```bash
git add web/app/page.tsx web/app/planos/page.tsx web/app/sobre/page.tsx web/app/trabalhos/page.tsx web/app/contato/page.tsx web/app/trabalhos/[slug]/page.tsx
git commit -m "feat(seo): per-page title/description/canonical + OG url"
```

---

### Task B4: `sitemap.ts`

**Files:**
- Create: `web/app/sitemap.ts`
- Test: `web/app/sitemap.test.ts`

- [ ] **Step 1: Read the Next 16 sitemap doc**

Ler doc de `sitemap` em `node_modules/next/dist/docs/` — confirmar assinatura `MetadataRoute.Sitemap` e nome do arquivo.

- [ ] **Step 2: Write the failing test**

```ts
// web/app/sitemap.test.ts
import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { projects } from "@/lib/projects";

describe("sitemap", () => {
  it("includes the static routes", () => {
    const urls = sitemap().map((e) => e.url);
    for (const path of ["/planos", "/sobre", "/trabalhos", "/contato"]) {
      expect(urls.some((u) => u.endsWith(path))).toBe(true);
    }
  });

  it("includes one entry per project case", () => {
    const urls = sitemap().map((e) => e.url);
    for (const p of projects) {
      expect(urls.some((u) => u.endsWith(`/trabalhos/${p.slug}`))).toBe(true);
    }
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd web && npx vitest run app/sitemap.test.ts`
Expected: FAIL — `Cannot find module './sitemap'`.

- [ ] **Step 4: Implement**

```ts
// web/app/sitemap.ts
import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/planos", "/sobre", "/trabalhos", "/contato"].map(
    (path) => ({ url: `${SITE_URL}${path}`, lastModified: now }),
  );
  const caseRoutes = projects.map((p) => ({
    url: `${SITE_URL}/trabalhos/${p.slug}`,
    lastModified: now,
  }));
  return [...staticRoutes, ...caseRoutes];
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd web && npx vitest run app/sitemap.test.ts`
Expected: PASS (2 passed).

- [ ] **Step 6: Verify route renders**

Run: `npm run dev`, abrir `http://localhost:3000/sitemap.xml` — XML com todas as rotas + 5 cases.

- [ ] **Step 7: Commit**

```bash
git add web/app/sitemap.ts web/app/sitemap.test.ts
git commit -m "feat(seo): sitemap with static routes + project cases"
```

---

### Task B5: `robots.ts`

**Files:**
- Create: `web/app/robots.ts`

- [ ] **Step 1: Implement**

```ts
// web/app/robots.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Verify route renders**

Run: `npm run dev`, abrir `http://localhost:3000/robots.txt` — `User-Agent: *`, `Allow: /`, `Sitemap: .../sitemap.xml`.

- [ ] **Step 3: Commit**

```bash
git add web/app/robots.ts
git commit -m "feat(seo): robots.txt allowing all + sitemap reference"
```

---

### Task B6: Componente `<JsonLd>` + structured data

**Files:**
- Create: `web/components/seo/json-ld.tsx`
- Modify: `web/app/page.tsx` (ProfessionalService)
- Modify: `web/app/sobre/page.tsx` (Person)
- Modify: `web/app/trabalhos/[slug]/page.tsx` (BreadcrumbList)

- [ ] **Step 1: Create the component**

```tsx
// web/components/seo/json-ld.tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Conteúdo é nosso, estático e tipado — não vem de input do usuário.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 2: Home — ProfessionalService**

Em `web/app/page.tsx`, importar `JsonLd`, `SITE_URL` e `CONTACT`, e renderizar dentro do retorno (topo do fragmento). `sameAs` só inclui canais não-nulos:

```tsx
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";
import { CONTACT } from "@/lib/contact-config";

const sameAs = [CONTACT.linkedin, CONTACT.instagram].filter(
  (v): v is string => Boolean(v),
);

const orgLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Prumo",
  description: "Estúdio digital. Sites sob medida, estratégia e presença digital.",
  url: SITE_URL,
  email: CONTACT.email,
  sameAs,
  areaServed: "BR",
};
// no JSX, antes do conteúdo: <JsonLd data={orgLd} />
```

- [ ] **Step 3: `/sobre` — Person**

Em `web/app/sobre/page.tsx`, adicionar:

```tsx
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";
import { CONTACT } from "@/lib/contact-config";

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Guilherme",
  jobTitle: "Fundador · Prumo",
  url: `${SITE_URL}/sobre`,
  email: CONTACT.email,
  sameAs: [CONTACT.linkedin].filter((v): v is string => Boolean(v)),
};
// no JSX: <JsonLd data={personLd} />
```

> Confirmar o nome real exibido em `/sobre` (componente QuemAssina) e usar o mesmo.

- [ ] **Step 4: `/trabalhos/[slug]` — BreadcrumbList**

Em `web/app/trabalhos/[slug]/page.tsx`, dentro do `ProjectPage` (após resolver `project`), montar e renderizar:

```tsx
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Trabalhos", item: `${SITE_URL}/trabalhos` },
    { "@type": "ListItem", position: 2, name: project.title, item: `${SITE_URL}/trabalhos/${slug}` },
  ],
};
// no JSX (topo do fragmento): <JsonLd data={breadcrumbLd} />
```

- [ ] **Step 5: Verify build + validate**

Run: `cd web && npm run build`
Expected: build verde.
Run: `npm run dev`, ver source de `/`, `/sobre`, `/trabalhos/hold-corretora` — um `<script type="application/ld+json">` válido em cada. Opcional: colar no validador schema.org.

- [ ] **Step 6: Commit**

```bash
git add web/components/seo/json-ld.tsx web/app/page.tsx web/app/sobre/page.tsx web/app/trabalhos/[slug]/page.tsx
git commit -m "feat(seo): JSON-LD (ProfessionalService, Person, BreadcrumbList)"
```

---

### Task B7: Template OG branded compartilhado

**Files:**
- Create: `web/lib/og-template.tsx`

- [ ] **Step 1: Read the Next 16 ImageResponse / opengraph-image doc**

**Obrigatório.** Ler em `node_modules/next/dist/docs/` o doc de `opengraph-image` e de `ImageResponse` (import: provavelmente `next/og`). Confirmar: import path, opção `fonts` (carregamento de fonte custom), tamanho/contentType. **Ajustar o código abaixo ao que o doc local definir.**

- [ ] **Step 2: Implement the shared template + font loader**

```tsx
// web/lib/og-template.tsx
// Template JSX branded pras OG images. Fundo dark cinematic + Instrument
// Serif no título + wordmark Prumo. A fonte é carregada via fetch (o
// ImageResponse exige passar a fonte explicitamente em runtime Edge).
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export async function loadInstrumentSerif(): Promise<ArrayBuffer> {
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap",
    { headers: { "User-Agent": "Mozilla/5.0" } },
  ).then((r) => r.text());
  const url = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype|woff2?)'\)/)?.[1];
  if (!url) throw new Error("Falha ao extrair URL da fonte Instrument Serif");
  return fetch(url).then((r) => r.arrayBuffer());
}

export function OgCard({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0A0A0A",
        padding: "80px",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "rgba(255,255,255,0.55)", letterSpacing: 8, textTransform: "uppercase" }}>
        {eyebrow ?? "Prumo"}
      </div>
      <div style={{ display: "flex", fontFamily: "Instrument Serif", fontSize: 84, color: "#FFFFFF", lineHeight: 1.05, letterSpacing: -2 }}>
        {title}
      </div>
      <div style={{ display: "flex", fontSize: 30, color: "#FFFFFF", letterSpacing: 2 }}>
        Prumo
      </div>
    </div>
  );
}
```

> Se o doc local indicar que `fonts` aceita só `Buffer`/`ArrayBuffer` de fonte estática, considere baixar o `.woff` da Instrument Serif uma vez pra `web/app/_og/InstrumentSerif.woff` e importá-lo via `fs`/import em vez do fetch em runtime. Decidir conforme o doc.

- [ ] **Step 3: Verify it compiles**

Run: `cd web && npx tsc --noEmit`
Expected: sem erros novos.

- [ ] **Step 4: Commit**

```bash
git add web/lib/og-template.tsx
git commit -m "feat(seo): shared branded OG image template + font loader"
```

---

### Task B8: OG image default + por página-chave + por case

**Files:**
- Create: `web/app/opengraph-image.tsx`
- Create: `web/app/planos/opengraph-image.tsx`
- Create: `web/app/sobre/opengraph-image.tsx`
- Create: `web/app/trabalhos/opengraph-image.tsx`
- Create: `web/app/trabalhos/[slug]/opengraph-image.tsx`

> Cada arquivo segue o mesmo shape; só muda título/eyebrow. Repetido na íntegra por arquivo de propósito (worker pode ler fora de ordem). Ajustar import de `ImageResponse` ao doc local (Task B7 Step 1).

- [ ] **Step 1: Default (`web/app/opengraph-image.tsx`)**

```tsx
import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, OgCard, loadInstrumentSerif } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Prumo · Sites, estratégia e presença digital";

export default async function Image() {
  const font = await loadInstrumentSerif();
  return new ImageResponse(
    <OgCard title="Sites, estratégia e presença digital." />,
    { ...OG_SIZE, fonts: [{ name: "Instrument Serif", data: font, style: "normal" }] },
  );
}
```

- [ ] **Step 2: `/planos`, `/sobre`, `/trabalhos`**

Criar os três arquivos idênticos ao Step 1, trocando só o `title`/`alt`:
- `web/app/planos/opengraph-image.tsx` → `<OgCard title="Planos" eyebrow="Prumo" />`, `alt = "Planos · Prumo"`.
- `web/app/sobre/opengraph-image.tsx` → `<OgCard title="Sobre o estúdio" eyebrow="Prumo" />`, `alt = "Sobre · Prumo"`.
- `web/app/trabalhos/opengraph-image.tsx` → `<OgCard title="Trabalhos selecionados" eyebrow="Prumo" />`, `alt = "Trabalhos · Prumo"`.

Exemplo completo (`web/app/planos/opengraph-image.tsx`):

```tsx
import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, OgCard, loadInstrumentSerif } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Planos · Prumo";

export default async function Image() {
  const font = await loadInstrumentSerif();
  return new ImageResponse(
    <OgCard title="Planos" eyebrow="Prumo" />,
    { ...OG_SIZE, fonts: [{ name: "Instrument Serif", data: font, style: "normal" }] },
  );
}
```

- [ ] **Step 3: Por case (`web/app/trabalhos/[slug]/opengraph-image.tsx`)**

```tsx
import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, OgCard, loadInstrumentSerif } from "@/lib/og-template";
import { getProject } from "@/lib/projects";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Trabalho · Prumo";

export default async function Image({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  const font = await loadInstrumentSerif();
  return new ImageResponse(
    <OgCard title={project?.title ?? "Trabalho"} eyebrow={project?.scope ?? "Prumo"} />,
    { ...OG_SIZE, fonts: [{ name: "Instrument Serif", data: font, style: "normal" }] },
  );
}
```

> Confirmar no doc local se `params` aqui é `Promise` (como nas pages do projeto, ex. `params: Promise<{ slug: string }>`) e ajustar pra `await params` se for. O `page.tsx` deste projeto usa `Promise` — provável que `opengraph-image` também use. Ajustar conforme o doc/comportamento.

- [ ] **Step 4: Verify build + render**

Run: `cd web && npm run build`
Expected: build verde.
Run: `npm run dev`, abrir `http://localhost:3000/opengraph-image` e `http://localhost:3000/trabalhos/hold-corretora/opengraph-image` — PNG branded renderiza com a fonte serif correta. Testar preview real depois do deploy via opengraph.xyz.

- [ ] **Step 5: Commit**

```bash
git add web/app/opengraph-image.tsx web/app/planos/opengraph-image.tsx web/app/sobre/opengraph-image.tsx web/app/trabalhos/opengraph-image.tsx web/app/trabalhos/[slug]/opengraph-image.tsx
git commit -m "feat(seo): dynamic branded OG images (default, key pages, per case)"
```

---

### Task B9: Configurar env vars na Vercel + verificação final

**Files:** nenhum (config externa).

- [ ] **Step 1: Adicionar env vars na Vercel**

No projeto Vercel → Settings → Environment Variables, adicionar pra Production + Preview:
- `NEXT_PUBLIC_UMAMI_SRC=https://cloud.umami.is/script.js`
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID=76e2a9e7-40a5-4e8f-b491-e345724737fd`
- `NEXT_PUBLIC_SITE_URL` → deixar vazio/ausente até o domínio sair (cai no fallback `VERCEL_PROJECT_PRODUCTION_URL`).

- [ ] **Step 2: Suíte completa + build final**

Run: `cd web && npm run build && npx vitest run`
Expected: build verde; só as ~12 falhas brittle pré-existentes (comparar com baseline `main` — nenhuma falha NOVA introduzida por este plano).

- [ ] **Step 3: Smoke check pós-deploy**

Após deploy preview: confirmar no dashboard Umami pageviews + um evento de cada tipo (`cta_contato`, `plano_click`, `social_click`, `form_submit`); conferir `/sitemap.xml`, `/robots.txt`, e preview de OG via opengraph.xyz num link de case.

---

## Self-Review (preenchido pelo autor do plano)

- **Cobertura do spec:** Componente 1 (analytics) → Tasks A1–A4. Componente 2 (SEO foundation: metadataBase/defaults, per-page metadata, sitemap, robots, JSON-LD) → Tasks B1–B6. Componente 3 (OG dinâmica) → Tasks B7–B8. Dependências externas (env Vercel) → B9. ✔ Sem lacunas.
- **Placeholders:** nenhum "TODO/TBD". Os pontos "ajustar conforme doc local" são deliberados (AGENTS.md exige ler docs do Next 16 antes de codar APIs que podem ter breaking changes) — vêm com código de referência concreto + critério de ajuste, não são vagueza.
- **Consistência de tipos/nomes:** `track(event, data?)` definido em A1 e usado em A4. `SITE_URL` definido em B1, usado em B2/B4/B5/B6/B7-8. `OgCard`/`OG_SIZE`/`OG_CONTENT_TYPE`/`loadInstrumentSerif` definidos em B7, usados em B8. Eventos (`cta_contato`/`plano_click`/`social_click`/`form_submit`) batem com a taxonomia do spec.
- **Riscos conhecidos:** (1) API de `ImageResponse`/fonts no Next 16 — mitigado pela leitura obrigatória do doc local em B7/B8 + fallback de fonte estática. (2) `params` Promise vs objeto em `opengraph-image` — flag explícita em B8 Step 3.
