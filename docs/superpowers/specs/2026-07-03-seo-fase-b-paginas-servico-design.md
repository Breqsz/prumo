# SEO Fase B — Páginas de serviço (v1) — Design

**Data:** 2026-07-03
**Projeto:** Prumo (prumo-digital)
**Contexto:** ADR 0005 — SEO nacional, técnico+conversão, faseado A→B (na Wiki: `projects/prumo-digital/decisions/0005-...`). Fase A (fundação técnica) já em produção.

## Objetivo
Criar as primeiras **páginas de serviço** — o motor de orgânico da estratégia sem blog. Cada página é uma landing SEO por cluster de keyword, com `Service` + `FAQPage` schema, que educa (topo de funil) e converte (CTA → Cal.com/contato), linkando pra `/planos` e pros cases.

## Escopo do v1 (decidido)
- **2 páginas core:** `criacao-de-sites` e `landing-pages` (maiores volume/intenção comercial no BR).
- **+ hub** `/servicos` que lista os serviços.
- Escala pra mais serviços depois com o mesmo template (não fazer agora — YAGNI).

## Decisões travadas (brainstorming 2026-07-03)
1. **Escopo v1:** 2 páginas core + hub.
2. **Copy:** escrito por mim (Claude) a partir de posicionamento/ofertas/cases existentes; dono revisa fatos/tom/preço.
3. **URL:** hub `/servicos` + filhos `/servicos/<slug>` (IA navegável priorizada sobre keyword-na-raiz).
4. **Nav:** "Serviços" entra no **nav principal** + footer.
5. **Preço:** páginas de serviço mostram só **"a partir de R$ X"** linkando pra `/planos` — **sem** tabela de preços (evita canibalizar `/planos` e sinal de price-mismatch no Google; respeita a consequência de `minPrice` do ADR 0005).

## Arquitetura & rotas
Rota dinâmica **data-driven** (padrão da casa: `plans.ts`/`projects.ts`/`schema.ts`). Rejeitadas: página estática por serviço (duplica layout, diverge) e MDX (tooling sem decisão de blog).

```
lib/services.ts                       ← fonte única, tipada
app/servicos/page.tsx                 ← hub: lista serviços + CTA (CollectionPage schema + breadcrumb)
app/servicos/[servico]/page.tsx       ← dinâmica: generateStaticParams + generateMetadata
components/servicos/service-page.tsx  ← template compartilhado
```
Geração **estática (SSG)** no build a partir de `services.ts`. Reaproveita efeitos/UI existentes (aurora, reveal, liquid-glass, accordion da FAQ da home).

## Modelo de dados (`lib/services.ts`)
```ts
export type Service = {
  slug: "criacao-de-sites" | "landing-pages";
  navLabel: string;                 // "Criação de sites"
  h1: string;                       // keyword-focada
  metaTitle: string;
  metaDescription: string;
  intro: string;                    // problema → solução
  benefits: { title: string; body: string }[];   // 4-6
  process: { step: string; body: string }[];      // passos do processo
  relatedPlanSlugs: string[];       // eventSlug de plans.ts → linka pra /planos
  relatedProjectSlugs: string[];    // slug de projects.ts → cases de prova
  faq: { q: string; a: string }[];  // 4-6 → FAQPage schema
};

export const SERVICES: Service[] = [ /* criacao-de-sites, landing-pages */ ];
export function getService(slug: string): Service | undefined;
```
Copy real das 2 páginas mora aqui (denso: ~600–1200 palavras/página pra evitar thin content).

## Anatomia da página (template `service-page.tsx`)
Hero (H1 + subhead + CTA primário) → Intro → Benefícios (grid) → Processo (passos) → **Prova** (cases relevantes de `/trabalhos` via `relatedProjectSlugs`) → **Planos relacionados** (cards que linkam pra `/planos`, só "a partir de") → **FAQ** (accordion) → CTA final (Cal.com/contato).

Hub `/servicos`: intro curta + grid de cards (um por serviço) → CTA.

## Schema.org (estende `lib/schema.ts`, funções puras + `@id`)
- `serviceSchema(service)` — `Service`: `provider` = `Organization#organization` (`@id`), `areaServed: "BR"`, `serviceType`, `offers` linkando planos com **`PriceSpecification.minPrice`** (nunca `price` exato).
- `faqPageSchema(faq)` — rich result de FAQ.
- `breadcrumbSchema` — Início → Serviços → [serviço].
- Hub: `CollectionPage` + `BreadcrumbList`.
- Consumido via `<JsonLd>`; zero JSON-LD inline. Reusa o grafo existente por `@id`.

## Conversão + linkagem interna (papéis distintos → sem canibalizar)
- `/servicos/*` = topo de funil, educacional + intenção (keyword). **Não** repete tabela de preços.
- `/planos` = comparação + preço + decisão.
- Home e `/planos` linkam **pra** os serviços; serviços linkam **pra** planos + cases. Gera o internal linking que o SEO exige.

## Navegação & descoberta
- "Serviços" no **nav principal** + footer.
- `sitemap.ts`: adicionar `/servicos` + os 2 filhos com priority adequada (hub ~0.8, serviços ~0.8).

## Testes & qualidade (Vitest, padrão do repo)
- `services.ts`: slugs únicos, campos obrigatórios presentes, `relatedPlanSlugs`/`relatedProjectSlugs` apontam pra itens existentes.
- Schema novo: `serviceSchema`/`faqPageSchema`/breadcrumb — shape + `@id` + `minPrice` (não `price`).
- Rota: `generateStaticParams` cobre os 2 slugs; `generateMetadata` gera canonical por serviço.
- **Barra de qualidade antes de push:** lint + build + suíte completa (cicatriz `[quality-bar]`). As 12 falhas happy-dom pré-existentes (`[test-env]`) não são regressão.

## Fora de escopo (v1)
- Serviços além dos 2 (site institucional, branded/sob-medida) — Fase B v2.
- Blog/conteúdo editorial (decisão do ADR 0005: sem blog).
- i18n PT/EN das páginas de serviço (segue a lacuna geral do projeto).

## Critério de "pronto"
Lint 0 · build OK · testes verdes (novos + sem regressão) · 3 rotas novas geradas (`/servicos`, `/servicos/criacao-de-sites`, `/servicos/landing-pages`) · schema validável · "Serviços" no nav · sitemap atualizado · copy revisado pelo dono.
