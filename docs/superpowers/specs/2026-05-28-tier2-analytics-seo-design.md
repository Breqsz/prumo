# Tier 2 — Analytics + SEO técnico (design)

> Data: 2026-05-28
> Sub-projeto do [roadmap Prumo](2026-05-28-prumo-roadmap.md). Objetivo: tornar o site **mensurável** (saber o que converte) e **achável** (SEO técnico + previews premium ao compartilhar). Código puro, sem depender de conteúdo novo do dono.
> Fora de escopo: blog `/notas`, GA4, consent banner — sub-projetos/decisões separados.

## Contexto técnico

- Next.js **16.2.6** (App Router) — tem breaking changes vs. versões antigas. **Ler `node_modules/next/dist/docs/` (metadata API, `ImageResponse`/`opengraph-image`, `sitemap`/`robots` conventions) antes de implementar.**
- React 19, Tailwind v4, TS strict, Vitest + RTL, happy-dom.
- Estado atual de SEO: só `title`/`description` global em `web/app/layout.tsx`. Nenhum analytics instalado.
- Páginas: `/`, `/planos`, `/sobre`, `/trabalhos`, `/trabalhos/[slug]`, `/contato`. Todos os CTAs apontam pra `/contato`.

## Componente 1 — Analytics (Umami Cloud, cookieless)

**Decisão:** Umami Cloud (free tier, 10k eventos/mês, zero infra). Cookieless → **sem banner de consentimento LGPD**. Self-host fica como alternativa futura se quiser posse total dos dados.

- Script carregado no root layout via `<Script>` do Next, com `src` e `data-website-id` vindos de env vars (`NEXT_PUBLIC_UMAMI_SRC`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`). Se as vars não existirem, o script não renderiza (analytics inerte, nada quebra).
- Helper tipado em `web/lib/analytics.ts`:
  - `track(event: string, data?: Record<string, unknown>)` → embrulha `window.umami?.track`. No-op seguro quando `umami` indefinido (SSR, script não carregado, dev sem env).
  - Tipo `declare global { interface Window { umami?: { track: (...) => void } } }`.
- **Taxonomia de eventos:**
  | Evento | Quando | Payload |
  |---|---|---|
  | `cta_contato` | clique em qualquer CTA que leva a `/contato` | `{ source: "hero" \| "nav" \| "planos" \| "final-cta" }` |
  | `form_submit` | briefing enviado com sucesso (após Resend OK) | — |
  | `plano_click` | clique no CTA de um card de plano | `{ plano: "landing" \| "institucional" \| "branded" \| "base" \| "crescimento" \| "parceria" }` |
  | `social_click` | clique em ícone social | `{ network: "instagram" \| "linkedin" \| "whatsapp" }` |
- Pageviews são automáticos do Umami — não precisam de evento custom.

## Componente 2 — SEO foundation

- **Root layout:** `metadataBase` = `new URL(process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? \`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}\` : "http://localhost:3000"))`, `title.template = "%s · Prumo"`, `title.default`, `description`, `openGraph` defaults (siteName "Prumo", locale "pt_BR", type website), `twitter.card = "summary_large_image"`.
- **Metadata por página** — cada rota exporta `metadata` (ou `generateMetadata` no case dinâmico) com `title`, `description` e `alternates.canonical` únicos:
  - `/` — home
  - `/planos` — foco preço/oferta
  - `/sobre` — pessoa/método
  - `/trabalhos` — listagem
  - `/trabalhos/[slug]` — `generateMetadata` lê o case (título/resumo) → title/description/canonical próprios
  - `/contato` — conversão
- **`web/app/sitemap.ts`** — convention do App Router; rotas estáticas + slugs de cases (mesma fonte de dados que `/trabalhos`).
- **`web/app/robots.ts`** — allow all, aponta pro sitemap.
- **JSON-LD structured data** (componente `<JsonLd>` server que injeta `<script type="application/ld+json">`):
  - Home: `ProfessionalService` (ou `Organization`) — name, url, logo, description, `sameAs` (Instagram/LinkedIn/WhatsApp).
  - `/sobre`: `Person` (o dono).
  - `/trabalhos/[slug]`: `BreadcrumbList`.

## Componente 3 — OG images dinâmicas

- Template branded via `ImageResponse` (Edge): fundo `#0A0A0A`, **Instrument Serif** no título, wordmark "Prumo", layout sóbrio dark cinematic. Fonte carregada via fetch do woff (App Router `ImageResponse` exige passar a fonte explicitamente).
- `web/app/opengraph-image.tsx` — card default do site.
- Por página-chave (`/planos`, `/sobre`, `/trabalhos`): `opengraph-image.tsx` no segmento, com o título da página.
- `web/app/trabalhos/[slug]/opengraph-image.tsx` — lê o título do case → card por case (escala automático).
- `twitter:image` espelha a OG (gerenciado pelo metadata defaults).

## Dependências externas (do dono)

- **Conta Umami Cloud** → fornece `website-id` + `src` pra preencher as env vars. Sem isso, analytics fica inerte (não bloqueia o resto).
- **Domínio** (Tier 0, não comprado) → valor real de `NEXT_PUBLIC_SITE_URL`. Até lá, fallback pra URL da Vercel. Não bloqueia implementação.

## Testes

- `web/lib/analytics.ts`: `track()` é no-op seguro quando `window.umami` indefinido; chama `umami.track` com nome+payload corretos quando presente.
- `sitemap.ts`: retorna as rotas estáticas esperadas + um entry por slug de case.
- SEO/metadata e OG images: validação via `npm run build` verde + inspeção manual (não forçar teste frágil de metadata estática). Build verde é o gate real.

## Arquivos previstos

- Novos: `web/lib/analytics.ts`, `web/app/sitemap.ts`, `web/app/robots.ts`, `web/components/seo/json-ld.tsx`, `web/app/opengraph-image.tsx`, `web/app/{planos,sobre,trabalhos}/opengraph-image.tsx`, `web/app/trabalhos/[slug]/opengraph-image.tsx`, `web/lib/og-template.tsx` (template compartilhado).
- Editados: `web/app/layout.tsx` (metadata defaults + metadataBase + script Umami), metadata em cada `page.tsx`, e os componentes de CTA/form/social pra disparar os eventos `track()`.
- `.env.local` / Vercel env: `NEXT_PUBLIC_UMAMI_SRC`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_SITE_URL`.
