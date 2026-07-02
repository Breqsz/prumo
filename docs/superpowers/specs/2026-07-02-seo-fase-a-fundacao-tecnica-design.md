# SEO — Fase A: Fundação Técnica (design)

**Data:** 2026-07-02
**Projeto:** Prumo (`E:\projetos_breq\prumo\web` — Next.js 16 App Router)
**Autor:** Guilherme (Breq) + Claude
**Status:** aprovado, pronto para plano de implementação

---

## 1. Contexto e objetivo

O objetivo do site hoje é **captar clientes**. Decidimos mirar SEO **nacional (Brasil)**, com
apetite de conteúdo **apenas técnico + conversão** (sem blog por ora). Nesse cenário, o único
lever real de orgânico são páginas de serviço otimizadas — mas isso é a **Fase B**. Esta é a
**Fase A: fundação técnica**, pré-requisito de tudo e o que destrava a medição no Search Console.

A base atual (auditada em 2026-07-02) já é sólida: metadata por página com canonicals, OG images
dinâmicas via `next/og`, JSON-LD básico, tudo SSG, `next/font`, `lang="pt-BR"` e Umami. Esta fase
**fecha lacunas e consolida**, não reconstrói.

### Decisões que moldam o escopo
- **Nacional**, não local → sem `LocalBusiness`, sem páginas geo, sem Google Business Profile nesta fase.
- **Sem conteúdo/blog** → nenhuma página ou schema de artigo. Rich results vêm de `Service`/`Offer`.
- **Faseado A → B** → esta fase é bounded, shippável e verificável isoladamente.

---

## 2. Estado atual relevante (resumo da auditoria)

- **Root metadata** (`app/layout.tsx`): `metadataBase`, título com `template "%s · Prumo"`, description,
  `openGraph` (type/locale/siteName/url), `twitter.card`. **Sem** `robots`, `alternates`, `verification`,
  `themeColor`, `manifest` na raiz.
- **Por página**: home, `/sobre`, `/planos`, `/contato`, `/trabalhos` exportam `metadata`;
  `/trabalhos/[slug]` usa `generateMetadata`. Todas setam canonical próprio. Consistente.
- **`lib/site.ts`**: `SITE_URL` cai para a URL da Vercel quando `NEXT_PUBLIC_SITE_URL` não está setado.
- **`app/sitemap.ts`**: rotas estáticas + projetos dinâmicos; **sem** `priority`/`changeFrequency`.
- **`app/robots.ts`**: allow-all + referência ao sitemap (ok).
- **JSON-LD**: 3 schemas inline e soltos — `ProfessionalService` (home), `Person` (`/sobre`),
  `BreadcrumbList` (case). Sem `Organization`+`WebSite` linkados por `@id`, sem `Service`/`Offer`.
- **Headings**: 1 `h1` por página, **exceto `/trabalhos`** (título é `h2` dentro do reel).
- **Ícones**: `/icon.png` e `/apple-icon.png` existem como file-routes. **Sem** `manifest`/`themeColor`.
- **Analytics**: Umami configurado (`data-umami-event` nos CTAs). Sem Google Search Console.

---

## 3. Escopo da Fase A

### A1 · Domínio canônico & config
- Setar `NEXT_PUBLIC_SITE_URL` = domínio real (a ser fornecido por Guilherme) na **Vercel (Production)**
  e em `.env.local` para dev.
- `lib/site.ts` já tem o fallback correto; nenhuma mudança de código necessária além de garantir que
  o valor seja lido. Documentar a variável em `.env.example`.
- Escolher **um** canônico (apex `dominio.com.br` **ou** `www`) e configurar 301 do outro na Vercel.
- **Critério:** em produção, `view-source` mostra `<link rel="canonical">`, `og:url` e URLs do
  `sitemap.xml` todos no domínio de marca.

### A2 · Grafo de dados estruturados (JSON-LD)
Consolidar todo o schema em **`lib/schema.ts`** — funções puras, tipadas e testáveis — substituindo os
objetos inline espalhados. Entidades linkadas por `@id`:

- **Organization** (site-wide, renderizado no `app/layout.tsx`): `@id = ${SITE_URL}/#organization`,
  `name`, `url`, `logo` (`${SITE_URL}/prumo-logo.png`), `sameAs` (LinkedIn + Instagram de `CONTACT`),
  `areaServed: "BR"`, `email`. **Tipo: `ProfessionalService`** (que é subtipo de `Organization` no
  schema.org) — um único nó canônico com esse `@id`, referenciado por todas as outras entidades.
- **WebSite** (`app/layout.tsx`): `@id = ${SITE_URL}/#website`, `url`, `name`, `inLanguage: "pt-BR"`,
  `publisher: { "@id": organization }`. **Sem `SearchAction`** (não há busca interna — não forjar).
- **OfferCatalog / Service em `/planos`**: gerado de `lib/plans.ts`. Cada plano vira um `Service`
  (`name`, `description`, `provider: { "@id": organization }`, `areaServed: "BR"`) com `Offer`
  (`priceCurrency: "BRL"`, `price`/`priceSpecification` quando houver valor fixo). Planos "sob medida"
  usam `priceRange` ou omitem preço — **nunca inventar valor**.
- **CreativeWork em `/trabalhos/[slug]`**: além do `BreadcrumbList` existente, cada projeto como
  `CreativeWork` (`name = project.title`, `creator: { "@id": organization }`, `about = project.scope`,
  `datePublished` derivado de `project.year`).
- **BreadcrumbList em `/trabalhos`** (listagem): Home → Trabalhos. Mantém o breadcrumb dos cases.

**Renderização:** entidades site-wide (Organization + WebSite) num único `<JsonLd>` com `@graph` no
layout raiz. Páginas emitem seus nós próprios (Service, CreativeWork, Breadcrumb) referenciando
`@id` da Organization. Múltiplos blocos JSON-LD na página são válidos (o Google faz merge).

### A3 · Correções semânticas
- Adicionar `h1` em `/trabalhos` (`app/trabalhos/page.tsx`). Pode ser `sr-only` se o design não
  comportar título visível, mas **um `h1` real por página** é obrigatório. As demais páginas já estão ok.

### A4 · Sitemap enriquecido
- `app/sitemap.ts`: adicionar `priority` e `changeFrequency` por rota:
  - `/` → priority 1.0, `monthly`
  - `/planos` → 0.9, `monthly`
  - `/trabalhos` → 0.8, `monthly`
  - `/trabalhos/[slug]` → 0.7, `yearly`
  - `/contato` → 0.7, `yearly`
  - `/sobre` → 0.6, `yearly`
- `lastModified`: mantém build-time (`new Date()`) — justificado, pois o conteúdo vive em código
  (`lib/projects.ts`, `lib/plans.ts`) e cada deploy é um rebuild = atualização real. Documentar isso.
  Quando os dados ganharem um campo de data real, plugar aqui.

### A5 · Indexação & verificação
- **Google Search Console**: adicionar verificação via `metadata.verification.google` (token público,
  lido de env `GOOGLE_SITE_VERIFICATION` no build) **ou** registro TXT no DNS. Após deploy, **submeter
  o sitemap** no GSC. *Requer token/acesso de Guilherme.*
- **robots** (`app/robots.ts`): revisar — allow-all + sitemap já ok. Sem mudança esperada.
- **manifest + themeColor**: criar `app/manifest.ts` (`MetadataRoute.Manifest`: name, short_name,
  `theme_color: "#000000"`, `background_color: "#000000"`, ícones referenciando `/icon.png`) e
  `export const viewport = { themeColor: "#000000" }` no layout raiz. Ícones já existem como file-routes.

### A6 · Polish de metadata
- **OG image de `/contato`**: criar `app/contato/opengraph-image.tsx` (hoje cai na raiz), seguindo o
  padrão de `lib/og-template.tsx`.
- **Twitter**: adicionar `twitter.site`/`twitter.creator` **apenas se** a Prumo tiver perfil no X.
  Se não tiver, **não adicionar** (não inventar handle).
- **`keywords`**: **não** adicionar — Google ignora a meta keywords desde 2009; seria ruído.
- Verificar que cada página mescla corretamente a OG image file-based (os objetos `openGraph` por
  página só setam `url`; confirmar que a imagem por rota é herdada).

### A7 · Medição & validação
- Validar todos os schemas novos no **Rich Results Test** / **Schema Markup Validator**.
- Testes `vitest` para `lib/schema.ts` (cada função retorna nó válido, `@id` estáveis, sem preço
  inventado em plano sob medida) e para as entradas do `sitemap.ts` (todas as rotas presentes,
  priority/changefreq corretos).
- Confirmar eventos Umami de conversão (`form_submit`, cliques de CTA) para medir **lead**, não só
  tráfego.
- Barra de qualidade Breq no fim: **lint · build · testes** verdes.

---

## 4. Arquitetura

```
lib/schema.ts            ← NOVO. Funções puras que retornam nós schema.org tipados.
                            Single source of truth. Consumido via <JsonLd> nas páginas.
  organizationNode()          → Organization (@id estável)
  webSiteNode()               → WebSite (publisher → org)
  siteGraph()                 → { @context, @graph: [org, website] }   (layout raiz)
  serviceCatalogNode(plans)   → OfferCatalog/Service[] a partir de lib/plans.ts
  projectCreativeWorkNode(p)  → CreativeWork (creator → org)
  breadcrumbNode(items)       → BreadcrumbList

components/seo/json-ld.tsx  ← mantido (render de <script type="application/ld+json">).
app/layout.tsx              ← renderiza siteGraph() + viewport.themeColor.
app/manifest.ts             ← NOVO (MetadataRoute.Manifest).
app/sitemap.ts              ← enriquecido (priority/changeFrequency).
app/trabalhos/page.tsx      ← + h1 + breadcrumbNode.
app/planos/page.tsx         ← + serviceCatalogNode(plans).
app/trabalhos/[slug]/page.tsx ← + projectCreativeWorkNode (mantém breadcrumb).
app/contato/opengraph-image.tsx ← NOVO.
lib/site.ts                 ← inalterado (só a env NEXT_PUBLIC_SITE_URL na Vercel).
.env.example                ← documentar NEXT_PUBLIC_SITE_URL e GOOGLE_SITE_VERIFICATION.
```

**Princípio:** nenhum objeto JSON-LD solto/duplicado. Todo schema nasce de função pura testável em
`lib/schema.ts`, alinhado ao padrão `lib/` existente (`site.ts`, `plans.ts`, `contact-config.ts`).

---

## 5. Fora de escopo (fica para Fase B)
- Páginas de serviço novas (`/criacao-de-sites`, `/landing-pages`, etc.).
- `FAQPage` schema e conteúdo editorial novo.
- Blog / artigos.
- `LocalBusiness`, páginas geo, Google Business Profile.

---

## 6. Pré-requisitos / inputs externos
1. **Nome do domínio** (Guilherme) — bloqueia A1.
2. **Token de verificação do Google Search Console** (Guilherme) — bloqueia parte de A5. O restante da
   fase não depende disso e pode ser feito antes.

---

## 7. Critérios de aceite
- Produção serve canonical/OG/sitemap no domínio de marca (A1).
- `Organization` + `WebSite` linkados por `@id` validam no Rich Results Test; `/planos` expõe
  `Service`/`Offer` válidos; cases expõem `CreativeWork` (A2).
- Todas as páginas têm exatamente **um `h1`** (A3).
- `sitemap.xml` traz `priority`/`changeFrequency` corretos (A4).
- Site verificado no GSC e sitemap submetido; `manifest.webmanifest` e `themeColor` presentes (A5).
- `/contato` tem OG image própria (A6).
- `lib/schema.ts` e `sitemap.ts` cobertos por testes; lint/build/testes verdes (A7).
