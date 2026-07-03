# SEO Fase B — Páginas de serviço (v1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o hub `/servicos` e duas páginas de serviço (`/servicos/criacao-de-sites`, `/servicos/landing-pages`) data-driven, com `Service`+`FAQPage` schema, como motor de orgânico da Fase B.

**Architecture:** Um `lib/services.ts` tipado é a fonte única. Uma rota dinâmica `app/servicos/[servico]/page.tsx` (SSG via `generateStaticParams`) renderiza um componente-template compartilhado `components/servicos/service-page.tsx`. O schema.org nasce de funções puras em `lib/schema.ts` e é injetado via `<JsonLd>`. Segue exatamente os padrões existentes (`plans.ts`/`projects.ts`, `trabalhos/[slug]`).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind 4, Vitest 4.

## Global Constraints

- **Sem preço exato nas páginas de serviço.** Mostrar só "a partir de R$ X" (copy) e, no schema, `PriceSpecification.minPrice` — nunca `price` exato. (ADR 0005)
- **Zero JSON-LD inline.** Todo structured data vem de funções puras em `lib/schema.ts`, consumido via `<JsonLd data={...} />`.
- **`@id` graph.** Nós de schema referenciam `Organization` por `{ "@id": ORG_ID }`. Não redefinir a org.
- **Canonical relativo por rota** via `alternates: { canonical: "/servicos/..." }` (o `metadataBase` já resolve pro domínio).
- **Dark cinematic premium.** Reusar UI/efeitos existentes (`Reveal`, `AuroraBlack`, `LiquidGlass`, `HeroNav`, `Footer`). Tipografia `font-display` (Instrument Serif) nos títulos. Accent branco puro. Sem framer-motion (o projeto não usa).
- **Barra de qualidade antes de qualquer push:** `npm run lint` (0 erros) + `npm run build` (OK) + `npx vitest run` (suíte completa; as ~12 falhas happy-dom pré-existentes `[test-env]` não contam como regressão — cicatriz `[quality-bar]`).
- **Comandos rodam em `E:\projetos_breq\prumo\web`.**

---

## File Structure

- `web/lib/services.ts` **(novo)** — tipo `Service`, array `SERVICES` com copy das 2 páginas, helpers `getService`/`getPlansForService`/`getProjectsForService`.
- `web/lib/plans.ts` **(modificar)** — adicionar helper `getPlanByEventSlug`.
- `web/lib/schema.ts` **(modificar)** — extrair `offerFromPlan`, adicionar `serviceSchema`, `faqPageSchema`.
- `web/components/servicos/service-page.tsx` **(novo)** — template compartilhado (hero, intro, benefícios, processo, prova, planos relacionados, FAQ, CTA).
- `web/app/servicos/[servico]/page.tsx` **(novo)** — rota dinâmica SSG.
- `web/app/servicos/page.tsx` **(novo)** — hub.
- `web/components/hero/hero-nav.tsx` **(modificar)** — "Serviços" no nav.
- `web/components/footer/footer.tsx` **(modificar)** — "Serviços" no footer.
- `web/app/sitemap.ts` **(modificar)** — `/servicos` + 2 filhos.
- Testes: `web/tests/lib/services.test.ts`, `web/tests/lib/schema.test.ts` (estende), `web/tests/components/servicos/service-page.test.tsx`, `web/tests/app/servicos-page.test.tsx`, `web/tests/app/sitemap.test.ts` (estende).

---

### Task 1: `lib/services.ts` — modelo de dados, copy e helpers

**Files:**
- Create: `web/lib/services.ts`
- Modify: `web/lib/plans.ts` (adicionar `getPlanByEventSlug`)
- Test: `web/tests/lib/services.test.ts`

**Interfaces:**
- Consumes: `Plan`, `CRIAR_PLANS`, `MANTER_PLANS` de `@/lib/plans`; `Project`, `projects` de `@/lib/projects`.
- Produces:
  - `type Service` (campos abaixo).
  - `SERVICES: Service[]` (2 itens).
  - `getService(slug: string): Service | undefined`
  - `getPlansForService(service: Service): Plan[]`
  - `getProjectsForService(service: Service): Project[]`
  - `getPlanByEventSlug(slug: string): Plan | undefined` (em `plans.ts`)

- [ ] **Step 1: Escrever o teste que falha**

Create `web/tests/lib/services.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  SERVICES,
  getService,
  getPlansForService,
  getProjectsForService,
} from "@/lib/services";

describe("SERVICES", () => {
  it("has the two v1 services with unique slugs", () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(slugs).toEqual(["criacao-de-sites", "landing-pages"]);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every service has the required non-empty fields", () => {
    for (const s of SERVICES) {
      expect(s.h1.length).toBeGreaterThan(0);
      expect(s.metaTitle.length).toBeGreaterThan(0);
      expect(s.metaDescription.length).toBeGreaterThan(0);
      expect(s.intro.length).toBeGreaterThan(80);
      expect(s.benefits.length).toBeGreaterThanOrEqual(4);
      expect(s.process.length).toBeGreaterThanOrEqual(3);
      expect(s.faq.length).toBeGreaterThanOrEqual(4);
    }
  });
});

describe("getService", () => {
  it("finds by slug and returns undefined otherwise", () => {
    expect(getService("landing-pages")?.slug).toBe("landing-pages");
    expect(getService("nope")).toBeUndefined();
  });
});

describe("related resolvers", () => {
  it("resolves every relatedPlanSlug to a real plan", () => {
    for (const s of SERVICES) {
      const plans = getPlansForService(s);
      expect(plans.length).toBe(s.relatedPlanSlugs.length);
      expect(plans.every(Boolean)).toBe(true);
    }
  });
  it("resolves every relatedProjectSlug to a real project", () => {
    for (const s of SERVICES) {
      const projs = getProjectsForService(s);
      expect(projs.length).toBe(s.relatedProjectSlugs.length);
      expect(projs.every(Boolean)).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Rodar o teste e ver falhar**

Run: `npx vitest run tests/lib/services.test.ts`
Expected: FAIL — `Cannot find module '@/lib/services'`.

- [ ] **Step 3: Adicionar `getPlanByEventSlug` em `plans.ts`**

Ao final de `web/lib/plans.ts`, depois de `featuredSlug`:

```ts
export function getPlanByEventSlug(slug: string): Plan | undefined {
  return [...CRIAR_PLANS, ...MANTER_PLANS].find((p) => p.eventSlug === slug);
}
```

- [ ] **Step 4: Criar `web/lib/services.ts` com o copy real**

```ts
import { type Plan, getPlanByEventSlug } from "@/lib/plans";
import { type Project, getProject } from "@/lib/projects";

export type Service = {
  slug: "criacao-de-sites" | "landing-pages";
  navLabel: string;
  h1: string;
  subhead: string;
  metaTitle: string;
  metaDescription: string;
  /** Frase de vitrine no hub /servicos */
  cardBlurb: string;
  intro: string;
  benefits: { title: string; body: string }[];
  process: { step: string; body: string }[];
  /** eventSlug de plans.ts — linka pra /planos, sem repetir preço exato */
  relatedPlanSlugs: string[];
  /** slug de projects.ts — cases de prova */
  relatedProjectSlugs: string[];
  faq: { q: string; a: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "criacao-de-sites",
    navLabel: "Criação de sites",
    h1: "Criação de sites sob medida",
    subhead:
      "Sites institucionais e projetos digitais construídos do zero — design próprio, código sob medida e foco em resultado. Atendimento em todo o Brasil, 100% remoto.",
    metaTitle: "Criação de Sites Sob Medida | Prumo",
    metaDescription:
      "Criação de sites profissionais sob medida: institucionais, landing pages e projetos branded. Design premium, código próprio e foco em conversão. Atendimento nacional.",
    cardBlurb:
      "Sites institucionais e projetos completos, do briefing à entrega, sem template.",
    intro:
      "A maioria dos sites de empresa cai em um de dois extremos: template genérico que parece com o do concorrente, ou uma reforma cara que continua lenta e não aparece no Google. A Prumo trabalha no meio-termo raro — sites feitos sob medida, com design original e código enxuto, que carregam rápido, ranqueiam e conduzem o visitante até o contato. Cada projeto começa entendendo o objetivo comercial antes de qualquer pixel, porque site bonito que não converte é custo, não investimento.",
    benefits: [
      {
        title: "Design sob medida, nunca template",
        body: "Cada site é desenhado do zero a partir da sua marca e do seu público. Nada de tema comprado que mil empresas usam — a identidade é sua e o resultado não parece genérico.",
      },
      {
        title: "Rápido em qualquer dispositivo",
        body: "Código otimizado e imagens tratadas fazem a página abrir em segundos no celular e no computador. Velocidade é experiência do usuário e é fator de ranqueamento no Google.",
      },
      {
        title: "Encontrado no Google desde o dia um",
        body: "Estrutura técnica de SEO já vem embutida: títulos, metadados, dados estruturados (schema) e sitemap. O site nasce pronto pra ser indexado, não como um pensamento posterior.",
      },
      {
        title: "Construído para converter",
        body: "Cada seção tem um propósito e termina num caminho de contato — formulário conectado ao seu WhatsApp ou email, CTAs claros, sem visitante perdido no meio do caminho.",
      },
      {
        title: "Você no controle do conteúdo",
        body: "Quando o projeto pede, entra um painel (CMS) pra você editar textos e imagens sozinho, sem depender de ninguém e sem custo recorrente de manutenção só pra trocar uma frase.",
      },
    ],
    process: [
      {
        step: "Conversa e briefing",
        body: "Começamos entendendo o objetivo do site, o público e o que precisa acontecer pra ser um sucesso comercial. Sem essa clareza, o resto é chute.",
      },
      {
        step: "Estratégia e estrutura",
        body: "Defino a arquitetura de páginas, a hierarquia da mensagem e os pontos de conversão antes de desenhar. É aqui que o SEO e a jornada do visitante são planejados.",
      },
      {
        step: "Design e desenvolvimento",
        body: "Desenho a identidade visual e construo o site em código sob medida (ou base no-code premium quando o prazo pede), com performance e responsividade desde o primeiro commit.",
      },
      {
        step: "Entrega e acompanhamento",
        body: "Publico o site, configuro domínio e medição, e acompanho a implantação. Manutenção contínua é opcional, nunca imposta pra te prender.",
      },
    ],
    relatedPlanSlugs: ["institucional", "branded"],
    relatedProjectSlugs: ["hold-corretora", "todo", "bereading"],
    faq: [
      {
        q: "Quanto custa criar um site com a Prumo?",
        a: "Depende do escopo. Um site institucional sob medida parte de um valor fixo fechado no briefing; projetos branded, construídos inteiramente em código, partem de uma faixa maior. Você vê os pontos de partida na página de planos — sempre com preço combinado antes de começar, sem surpresa.",
      },
      {
        q: "Quanto tempo leva pra ficar pronto?",
        a: "Um site institucional leva cerca de 15 a 21 dias; projetos branded, de 30 a 45 dias, dependendo da complexidade. O prazo é definido no briefing, sem promessa irreal só pra fechar.",
      },
      {
        q: "Vocês atendem empresas de fora de São Paulo?",
        a: "Sim. A Prumo é um estúdio 100% remoto e atende clientes em todo o Brasil. Toda a comunicação, aprovação e entrega acontece online, com a mesma proximidade de um time local.",
      },
      {
        q: "Eu consigo atualizar o site sozinho depois?",
        a: "Sim, quando o projeto inclui um CMS você edita textos e imagens por um painel simples, sem tocar em código. Para mudanças estruturais ou evolução contínua, existem os planos de manutenção — opcionais.",
      },
      {
        q: "Já tenho um site. Dá pra reformular em vez de começar do zero?",
        a: "Avaliamos no briefing. Se a base é aproveitável e o problema é design, copy ou conversão, reformulamos. Se a fundação está comprometida (stack ruim, SEO destruído), começar do zero costuma sair mais barato no longo prazo.",
      },
    ],
  },
  {
    slug: "landing-pages",
    navLabel: "Landing pages",
    h1: "Landing pages que convertem",
    subhead:
      "Página única, rápida e focada em um só objetivo: transformar visitante em contato ou venda. Copy estratégica, design sob medida e entrega em 10 dias.",
    metaTitle: "Criação de Landing Pages de Alta Conversão | Prumo",
    metaDescription:
      "Landing pages sob medida focadas em converter visitante em cliente: página única, rápida, com copy estratégica e formulário integrado. Entrega em 10 dias, atendimento nacional.",
    cardBlurb:
      "Página única de alta conversão pra campanha, lançamento ou anúncio.",
    intro:
      "Uma landing page tem um único trabalho: converter. Diferente de um site institucional, ela não tenta contar tudo sobre a empresa — ela remove distração e conduz o visitante a uma ação: preencher o formulário, chamar no WhatsApp, comprar. É a peça certa pra quem investe em anúncios, lança um produto ou quer testar uma oferta sem construir um site inteiro. A Prumo desenha cada landing a partir do objetivo da campanha, com copy que argumenta e um caminho de conversão sem atrito.",
    benefits: [
      {
        title: "Um objetivo, zero distração",
        body: "A página inteira é construída em torno de uma única ação. Sem menu que dispersa, sem link que tira o visitante do funil — só o argumento e o caminho pra converter.",
      },
      {
        title: "Carrega antes do visitante desistir",
        body: "Landing lenta queima verba de anúncio: o clique é pago e a página não abre a tempo. As nossas carregam em segundos, o que também melhora o custo por lead nas plataformas.",
      },
      {
        title: "Copy que argumenta, não só enfeita",
        body: "O texto é estruturado pra levar da dor à solução até a ação — prova, objeções respondidas e um CTA claro. Design serve o argumento, não o contrário.",
      },
      {
        title: "Formulário conectado ao seu contato",
        body: "Os leads chegam direto no seu WhatsApp ou email, sem lead perdido e sem planilha manual. Integração pronta no dia da entrega.",
      },
      {
        title: "No ar em 10 dias",
        body: "Escopo enxuto e foco em uma página só permitem entrega rápida — ideal pra campanha com data marcada ou pra validar uma oferta antes de investir mais.",
      },
    ],
    process: [
      {
        step: "Objetivo e oferta",
        body: "Definimos qual é a única conversão que importa, quem é o público do anúncio e qual a oferta. Tudo na página serve a essa decisão.",
      },
      {
        step: "Copy e estrutura de conversão",
        body: "Escrevo a sequência de argumentos — promessa, prova, objeções, CTA — e defino a ordem das seções pra guiar o visitante sem atrito.",
      },
      {
        step: "Design e build",
        body: "Desenho e construo a página sob medida, rápida e responsiva, com o formulário já conectado ao seu canal de contato.",
      },
      {
        step: "Publicação e medição",
        body: "Publico, conecto ao domínio e deixo a medição de conversão pronta pra você acompanhar o desempenho da campanha desde o primeiro clique.",
      },
    ],
    relatedPlanSlugs: ["landing"],
    relatedProjectSlugs: ["breq-dev", "desafog-ai"],
    faq: [
      {
        q: "Qual a diferença entre landing page e site?",
        a: "Um site institucional apresenta a empresa inteira e tem várias páginas. Uma landing page é uma página única focada em uma ação específica — ideal pra anúncio, campanha ou lançamento, onde cada distração custa conversão.",
      },
      {
        q: "Quanto custa uma landing page?",
        a: "Uma landing sob medida parte de um valor fixo, fechado antes de começar. Você vê o ponto de partida na página de planos. Nada de escopo aberto: o preço é combinado no briefing.",
      },
      {
        q: "Em quanto tempo fica pronta?",
        a: "Cerca de 10 dias, do briefing à publicação. O escopo enxuto de uma página única permite entrega rápida, mesmo pra campanha com data marcada.",
      },
      {
        q: "A landing já vem preparada pra Google Ads e Meta Ads?",
        a: "Sim. Ela é construída pra carregar rápido (o que reduz o custo por clique) e já sai com a medição de conversão pronta pra conectar às plataformas de anúncio.",
      },
      {
        q: "Vocês fazem os anúncios também?",
        a: "O foco da Prumo é criar a página que converte. A gestão de tráfego pode ser acompanhada dentro dos planos de parceria ou feita pelo seu time/agência de mídia — a landing é entregue pronta pra receber a campanha.",
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getPlansForService(service: Service): Plan[] {
  return service.relatedPlanSlugs
    .map(getPlanByEventSlug)
    .filter((p): p is Plan => Boolean(p));
}

export function getProjectsForService(service: Service): Project[] {
  return service.relatedProjectSlugs
    .map(getProject)
    .filter((p): p is Project => Boolean(p));
}
```

- [ ] **Step 5: Rodar o teste e ver passar**

Run: `npx vitest run tests/lib/services.test.ts`
Expected: PASS (todos os describes verdes).

- [ ] **Step 6: Commit**

```bash
git add web/lib/services.ts web/lib/plans.ts web/tests/lib/services.test.ts
git commit -m "feat(servicos): lib/services.ts data-driven com copy das 2 paginas + helpers"
```

---

### Task 2: `lib/schema.ts` — `serviceSchema` + `faqPageSchema`

**Files:**
- Modify: `web/lib/schema.ts`
- Test: `web/tests/lib/schema.test.ts` (estende)

**Interfaces:**
- Consumes: `Plan` de `@/lib/plans`; `Service` de `@/lib/services`; `ORG_ID`, `SITE_URL`.
- Produces:
  - `offerFromPlan(plan: Plan): Record<string, unknown>` (extraído; usado por `serviceNode` e `serviceSchema`)
  - `serviceSchema(service: Service, plans: Plan[]): Record<string, unknown>`
  - `faqPageSchema(faq: { q: string; a: string }[]): Record<string, unknown>`

- [ ] **Step 1: Escrever os testes que falham**

Adicionar em `web/tests/lib/schema.test.ts` (novos imports + describes):

```ts
// adicionar aos imports existentes:
import { serviceSchema, faqPageSchema } from "@/lib/schema";
import { SERVICES, getPlansForService } from "@/lib/services";

describe("serviceSchema", () => {
  const svc = SERVICES[0]; // criacao-de-sites
  const node = serviceSchema(svc, getPlansForService(svc));
  it("is a Service provided by the org, area BR", () => {
    expect(node["@type"]).toBe("Service");
    expect(node.provider).toEqual({ "@id": ORG_ID });
    expect(node.areaServed).toBe("BR");
    expect(String(node.url)).toMatch(/\/servicos\/criacao-de-sites$/);
  });
  it("carries one Offer per related plan", () => {
    const offers = node.offers as Array<Record<string, unknown>>;
    expect(offers.length).toBe(svc.relatedPlanSlugs.length);
    expect(offers.every((o) => o["@type"] === "Offer")).toBe(true);
  });
  it("never emits an exact price for 'a partir de' plans", () => {
    // branded é relatedPlan de criacao-de-sites e é "a partir de"
    const offers = node.offers as Array<Record<string, unknown>>;
    const branded = offers.find(
      (o) =>
        (o.priceSpecification as Record<string, unknown> | undefined)?.[
          "minPrice"
        ] === 18000,
    );
    expect(branded).toBeDefined();
    expect(branded?.price).toBeUndefined();
  });
});

describe("faqPageSchema", () => {
  const node = faqPageSchema(SERVICES[0].faq);
  it("is a FAQPage with one Question per item", () => {
    expect(node["@type"]).toBe("FAQPage");
    const main = node.mainEntity as Array<Record<string, unknown>>;
    expect(main.length).toBe(SERVICES[0].faq.length);
    expect(main[0]["@type"]).toBe("Question");
    const answer = main[0].acceptedAnswer as Record<string, unknown>;
    expect(answer["@type"]).toBe("Answer");
    expect(String(answer.text).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/lib/schema.test.ts`
Expected: FAIL — `serviceSchema`/`faqPageSchema` não exportados.

- [ ] **Step 3: Refatorar `serviceNode` extraindo `offerFromPlan` + adicionar as funções novas**

Em `web/lib/schema.ts`, substituir a função `serviceNode` por esta versão (extrai `offerFromPlan`, mantém saída idêntica):

```ts
export function offerFromPlan(plan: Plan): Record<string, unknown> {
  const amount = parsePriceBRL(plan.price);
  const recurring = /m[êe]s/i.test(plan.cadence);
  // "a partir de R$ X" is a floor, not an exact price — emit minPrice so we
  // don't misrepresent it (and avoid Google price-mismatch signals).
  const fromPrice = /a partir de/i.test(plan.price);
  const offers: Record<string, unknown> = {
    "@type": "Offer",
    priceCurrency: "BRL",
  };
  if (amount !== null) {
    if (recurring) {
      offers.priceSpecification = {
        "@type": "UnitPriceSpecification",
        price: amount,
        priceCurrency: "BRL",
        unitText: "MONTH",
      };
    } else if (fromPrice) {
      offers.priceSpecification = {
        "@type": "PriceSpecification",
        minPrice: amount,
        priceCurrency: "BRL",
      };
    } else {
      offers.price = amount;
    }
  }
  return offers;
}

function serviceNode(plan: Plan): Record<string, unknown> {
  return {
    "@type": "Service",
    name: `${plan.name} — Prumo`,
    description: plan.description,
    provider: { "@id": ORG_ID },
    areaServed: "BR",
    offers: offerFromPlan(plan),
  };
}
```

Adicionar (no fim do arquivo) as duas funções novas. Importar `Service` no topo:

```ts
import type { Service } from "@/lib/services";
```

```ts
export function serviceSchema(
  service: Service,
  plans: Plan[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.h1,
    serviceType: service.navLabel,
    description: service.subhead,
    provider: { "@id": ORG_ID },
    areaServed: "BR",
    url: `${SITE_URL}/servicos/${service.slug}`,
    offers: plans.map(offerFromPlan),
  };
}

export function faqPageSchema(
  faq: { q: string; a: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
```

> Nota: `import type { Service }` cria dependência de tipo `schema.ts → services.ts`. `services.ts` importa valores de `plans.ts`/`projects.ts`, não de `schema.ts` — sem ciclo de runtime. Como é `import type`, é apagado no build.

- [ ] **Step 4: Rodar e ver passar (novos + existentes)**

Run: `npx vitest run tests/lib/schema.test.ts`
Expected: PASS — inclusive os testes antigos de `servicesGraph` (saída de `serviceNode` inalterada).

- [ ] **Step 5: Commit**

```bash
git add web/lib/schema.ts web/tests/lib/schema.test.ts
git commit -m "feat(seo): serviceSchema + faqPageSchema; extrai offerFromPlan (DRY)"
```

---

### Task 3: `components/servicos/service-page.tsx` — template compartilhado

**Files:**
- Create: `web/components/servicos/service-page.tsx`
- Test: `web/tests/components/servicos/service-page.test.tsx`

**Interfaces:**
- Consumes: `Service` de `@/lib/services`; `getPlansForService`, `getProjectsForService`; `Reveal`, `AuroraBlack`, `LiquidGlass`.
- Produces: `export function ServicePage({ service }: { service: Service }): JSX.Element`

- [ ] **Step 1: Escrever o teste que falha**

Create `web/tests/components/servicos/service-page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServicePage } from "@/components/servicos/service-page";
import { getService } from "@/lib/services";

const svc = getService("criacao-de-sites")!;

describe("ServicePage", () => {
  it("renders the service h1", () => {
    render(<ServicePage service={svc} />);
    expect(
      screen.getByRole("heading", { level: 1, name: svc.h1 }),
    ).toBeInTheDocument();
  });

  it("renders every benefit title and every faq question", () => {
    render(<ServicePage service={svc} />);
    for (const b of svc.benefits) {
      expect(screen.getByText(b.title)).toBeInTheDocument();
    }
    for (const f of svc.faq) {
      expect(screen.getByText(f.q)).toBeInTheDocument();
    }
  });

  it("links related plans to /planos and cases to /trabalhos", () => {
    render(<ServicePage service={svc} />);
    const planLinks = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href") === "/planos");
    expect(planLinks.length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: /hold corretora/i }),
    ).toHaveAttribute("href", "/trabalhos/hold-corretora");
  });

  it("has a primary CTA to /contato", () => {
    render(<ServicePage service={svc} />);
    const cta = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href") === "/contato");
    expect(cta.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/components/servicos/service-page.test.tsx`
Expected: FAIL — módulo do componente não existe.

- [ ] **Step 3: Criar o componente**

Create `web/components/servicos/service-page.tsx`:

```tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { AuroraBlack } from "@/components/ambient/aurora-black";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import {
  type Service,
  getPlansForService,
  getProjectsForService,
} from "@/lib/services";

export function ServicePage({ service }: { service: Service }) {
  const plans = getPlansForService(service);
  const projects = getProjectsForService(service);

  return (
    <main>
      {/* HERO */}
      <header className="relative flex min-h-[70vh] items-end overflow-hidden bg-black px-6 pt-32 pb-20">
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <Reveal delay={0} duration={700} distance={12}>
            <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
              Serviços
            </span>
          </Reveal>
          <Reveal delay={120} duration={900} distance={24}>
            <h1 className="font-display mt-6 text-5xl leading-[0.95] tracking-[-0.03em] text-white md:text-7xl">
              {service.h1}
            </h1>
          </Reveal>
          <Reveal delay={280} duration={900} distance={18}>
            <p className="mt-8 max-w-2xl text-base text-white/70 md:text-lg">
              {service.subhead}
            </p>
          </Reveal>
          <Reveal delay={420} duration={800} distance={14}>
            <div className="mt-10 flex flex-wrap gap-4">
              <LiquidGlass
                as="a"
                href="/contato"
                className="rounded-full px-6 py-3 text-sm font-medium text-white"
                data-umami-event="cta_contato"
                data-umami-event-source={`servico_${service.slug}`}
              >
                Agendar conversa
              </LiquidGlass>
              <Link
                href="/planos"
                className="rounded-full border border-white/20 px-6 py-3 text-sm text-white transition-colors hover:border-white/60"
              >
                Ver planos e valores
              </Link>
            </div>
          </Reveal>
        </div>
      </header>

      <AuroraBlack>
        {/* INTRO */}
        <section className="mx-auto max-w-3xl px-6 py-24 md:py-32">
          <Reveal>
            <p className="text-lg leading-relaxed text-white/80 md:text-xl">
              {service.intro}
            </p>
          </Reveal>
        </section>

        {/* BENEFÍCIOS */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-3xl tracking-tight text-white md:text-5xl">
            Por que vale
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
            {service.benefits.map((b) => (
              <div key={b.title} className="bg-black p-8">
                <h3 className="font-display text-xl text-white">{b.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-[1.6] text-white/70">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PROCESSO */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="font-display text-3xl tracking-tight text-white md:text-5xl">
            Como funciona
          </h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {service.process.map((p, i) => (
              <li key={p.step} className="flex flex-col gap-3">
                <span className="font-display text-5xl text-white/15 italic">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg text-white">{p.step}</h3>
                <p className="text-sm leading-[1.55] text-white/65">{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* PROVA — cases */}
        {projects.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="font-display text-3xl tracking-tight text-white md:text-5xl">
              Trabalhos relacionados
            </h2>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {projects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/trabalhos/${p.slug}`}
                  className="group rounded-2xl border border-white/10 p-6 transition-colors hover:border-white/40 hover:bg-white/[0.03]"
                >
                  <span className="text-[11px] tracking-[0.25em] text-white/45 uppercase">
                    {p.scope}
                  </span>
                  <h3 className="font-display mt-3 flex items-center gap-2 text-2xl text-white">
                    {p.title}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </h3>
                  <p className="mt-3 text-sm leading-[1.55] text-white/65">
                    {p.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* PLANOS RELACIONADOS — linka pra /planos, só "a partir de" */}
        {plans.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="font-display text-3xl tracking-tight text-white md:text-5xl">
              Planos para esse serviço
            </h2>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.eventSlug}
                  className="flex flex-col rounded-2xl border border-white/10 p-6"
                >
                  <h3 className="font-display text-xl text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/55">{plan.price}</p>
                  <p className="mt-4 flex-1 text-[0.95rem] leading-[1.55] text-white/70">
                    {plan.description}
                  </p>
                  <Link
                    href="/planos"
                    className="mt-6 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
                    data-umami-event="plano_click"
                    data-umami-event-source={`servico_${service.slug}`}
                  >
                    Ver detalhes
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section
          className="mx-auto max-w-4xl px-6 py-24"
          aria-labelledby="servico-faq"
        >
          <h2
            id="servico-faq"
            className="font-display text-3xl tracking-tight text-white md:text-5xl"
          >
            Perguntas frequentes
          </h2>
          <dl className="mt-12 divide-y divide-white/10 border-t border-white/10">
            {service.faq.map((f) => (
              <div key={f.q} className="py-8">
                <dt className="font-display text-xl text-white">{f.q}</dt>
                <dd className="mt-3 max-w-[62ch] text-[0.95rem] leading-[1.6] text-white/70">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA FINAL */}
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="font-display text-3xl tracking-tight text-white md:text-5xl">
            Vamos tirar o seu projeto do papel?
          </h2>
          <div className="mt-10 flex justify-center">
            <LiquidGlass
              as="a"
              href="/contato"
              className="rounded-full px-8 py-4 text-sm font-medium text-white"
              data-umami-event="cta_contato"
              data-umami-event-source={`servico_${service.slug}_final`}
            >
              Agendar conversa
            </LiquidGlass>
          </div>
        </section>
      </AuroraBlack>
    </main>
  );
}
```

> Se `AuroraBlack`, `Reveal` ou `LiquidGlass` tiverem props diferentes das usadas aqui, ajuste conforme o uso real em `app/trabalhos/[slug]/page.tsx` (Reveal/AuroraBlack) e `hero-nav.tsx` (LiquidGlass `as="a"`). Os testes de render não dependem dos efeitos visuais.

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run tests/components/servicos/service-page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/components/servicos/service-page.tsx web/tests/components/servicos/service-page.test.tsx
git commit -m "feat(servicos): componente-template ServicePage (hero, beneficios, processo, prova, planos, FAQ, CTA)"
```

---

### Task 4: `app/servicos/[servico]/page.tsx` — rota dinâmica SSG

**Files:**
- Create: `web/app/servicos/[servico]/page.tsx`
- Test: `web/tests/app/servicos-page.test.tsx` (cobre metadata dos filhos)

**Interfaces:**
- Consumes: `SERVICES`, `getService`, `getPlansForService` de `@/lib/services`; `serviceSchema`, `faqPageSchema`, `breadcrumbNode` de `@/lib/schema`; `ServicePage`, `HeroNav`, `Footer`, `JsonLd`, `SITE_URL`.
- Produces: `generateStaticParams`, `generateMetadata`, default page component.

- [ ] **Step 1: Escrever o teste que falha**

Create `web/tests/app/servicos-page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import {
  generateStaticParams,
  generateMetadata,
} from "@/app/servicos/[servico]/page";

describe("servicos/[servico] generateStaticParams", () => {
  it("returns both service slugs", async () => {
    const params = await generateStaticParams();
    expect(params).toEqual([
      { servico: "criacao-de-sites" },
      { servico: "landing-pages" },
    ]);
  });
});

describe("servicos/[servico] generateMetadata", () => {
  it("sets a per-service canonical", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ servico: "landing-pages" }),
    });
    expect(meta.alternates?.canonical).toBe("/servicos/landing-pages");
    expect(String(meta.title)).toMatch(/Landing/i);
  });
  it("falls back to a not-found title for unknown slugs", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ servico: "nope" }),
    });
    expect(String(meta.title)).toMatch(/não encontrado/i);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/app/servicos-page.test.tsx`
Expected: FAIL — página não existe.

- [ ] **Step 3: Criar a rota**

Create `web/app/servicos/[servico]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroNav } from "@/components/hero/hero-nav";
import { Footer } from "@/components/footer/footer";
import { ServicePage } from "@/components/servicos/service-page";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";
import { SERVICES, getService, getPlansForService } from "@/lib/services";
import { serviceSchema, faqPageSchema, breadcrumbNode } from "@/lib/schema";

type PageProps = {
  params: Promise<{ servico: string }>;
};

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ servico: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { servico } = await params;
  const service = getService(servico);
  if (!service) return { title: "Serviço não encontrado" };
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/servicos/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `/servicos/${service.slug}`,
    },
  };
}

export default async function ServicoPage({ params }: PageProps) {
  const { servico } = await params;
  const service = getService(servico);
  if (!service) notFound();

  const breadcrumb = breadcrumbNode([
    { name: "Início", url: `${SITE_URL}/` },
    { name: "Serviços", url: `${SITE_URL}/servicos` },
    { name: service.navLabel, url: `${SITE_URL}/servicos/${service.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={serviceSchema(service, getPlansForService(service))} />
      <JsonLd data={faqPageSchema(service.faq)} />
      <HeroNav />
      <ServicePage service={service} />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run tests/app/servicos-page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/app/servicos/[servico]/page.tsx web/tests/app/servicos-page.test.tsx
git commit -m "feat(servicos): rota dinamica SSG /servicos/[servico] com Service+FAQPage+breadcrumb schema"
```

---

### Task 5: `app/servicos/page.tsx` — hub

**Files:**
- Create: `web/app/servicos/page.tsx`
- Test: `web/tests/app/servicos-hub.test.tsx`

**Interfaces:**
- Consumes: `SERVICES` de `@/lib/services`; `breadcrumbNode` de `@/lib/schema`; `HeroNav`, `Footer`, `JsonLd`, `AuroraBlack`, `Reveal`, `LiquidGlass`, `SITE_URL`.
- Produces: `metadata`, default hub component.

- [ ] **Step 1: Escrever o teste que falha**

Create `web/tests/app/servicos-hub.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicosHub, { metadata } from "@/app/servicos/page";

describe("servicos hub", () => {
  it("has a /servicos canonical", () => {
    expect(metadata.alternates?.canonical).toBe("/servicos");
  });
  it("links to both service pages", () => {
    render(<ServicosHub />);
    expect(
      screen.getByRole("link", { name: /criação de sites/i }),
    ).toHaveAttribute("href", "/servicos/criacao-de-sites");
    expect(
      screen.getByRole("link", { name: /landing pages/i }),
    ).toHaveAttribute("href", "/servicos/landing-pages");
  });
});
```

> Nota: o componente do hub não é `async` (não usa `params`), então pode ser renderizado direto no teste — igual ao padrão de `tests/app/planos-page.test.tsx`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/app/servicos-hub.test.tsx`
Expected: FAIL — hub não existe.

- [ ] **Step 3: Criar o hub**

Create `web/app/servicos/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeroNav } from "@/components/hero/hero-nav";
import { Footer } from "@/components/footer/footer";
import { AuroraBlack } from "@/components/ambient/aurora-black";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { breadcrumbNode } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Criação de sites sob medida e landing pages de alta conversão. Design premium, código próprio e foco em resultado. Atendimento nacional.",
  alternates: { canonical: "/servicos" },
  openGraph: { url: "/servicos" },
};

function collectionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Serviços — Prumo",
    url: `${SITE_URL}/servicos`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

export default function ServicosHub() {
  const breadcrumb = breadcrumbNode([
    { name: "Início", url: `${SITE_URL}/` },
    { name: "Serviços", url: `${SITE_URL}/servicos` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={collectionSchema()} />
      <HeroNav />
      <main>
        <header className="relative px-6 pt-40 pb-16">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
                O que a Prumo faz
              </span>
            </Reveal>
            <Reveal delay={120} distance={24}>
              <h1 className="font-display mt-6 text-5xl leading-[0.95] tracking-[-0.03em] text-white md:text-7xl">
                Serviços
              </h1>
            </Reveal>
            <Reveal delay={260} distance={16}>
              <p className="mt-8 max-w-2xl text-base text-white/70 md:text-lg">
                Sites sob medida e landing pages que convertem, do briefing à
                publicação. Design premium, código próprio e SEO desde o dia um —
                atendimento em todo o Brasil.
              </p>
            </Reveal>
          </div>
        </header>

        <AuroraBlack>
          <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <div className="grid gap-4 md:grid-cols-2">
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  href={`/servicos/${s.slug}`}
                  className="group flex flex-col rounded-3xl border border-white/10 p-8 transition-colors hover:border-white/40 hover:bg-white/[0.03]"
                >
                  <h2 className="font-display flex items-center gap-2 text-2xl text-white md:text-3xl">
                    {s.navLabel}
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </h2>
                  <p className="mt-4 text-[0.95rem] leading-[1.6] text-white/70">
                    {s.cardBlurb}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </AuroraBlack>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run tests/app/servicos-hub.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/app/servicos/page.tsx web/tests/app/servicos-hub.test.tsx
git commit -m "feat(servicos): hub /servicos (CollectionPage + breadcrumb, cards dos servicos)"
```

---

### Task 6: Nav + footer + sitemap (descoberta e internal linking)

**Files:**
- Modify: `web/components/hero/hero-nav.tsx`
- Modify: `web/components/footer/footer.tsx`
- Modify: `web/app/sitemap.ts`
- Test: `web/tests/app/sitemap.test.ts` (estende)

**Interfaces:**
- Consumes: `SERVICES` de `@/lib/services` (no sitemap).
- Produces: rota `/servicos` + filhos no sitemap; link "Serviços" no nav e footer.

- [ ] **Step 1: Escrever o teste que falha (sitemap)**

Adicionar ao `web/tests/app/sitemap.test.ts` um `it` que exige as rotas de serviço. Se o arquivo já importa `sitemap` e `SITE_URL`, reutilize; senão espelhe o import existente no topo do arquivo:

```ts
import { SERVICES } from "@/lib/services";

it("includes the servicos hub and every service child", () => {
  const urls = sitemap().map((e) => e.url);
  expect(urls).toContain(`${SITE_URL}/servicos`);
  for (const s of SERVICES) {
    expect(urls).toContain(`${SITE_URL}/servicos/${s.slug}`);
  }
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/app/sitemap.test.ts`
Expected: FAIL — rotas de serviço ausentes.

- [ ] **Step 3: Adicionar as rotas no `sitemap.ts`**

Em `web/app/sitemap.ts`, importar `SERVICES` e adicionar as entradas. Substituir o corpo por:

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { projects } from "@/lib/projects";
import { SERVICES } from "@/lib/services";

type Entry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: Entry[] = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/servicos`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/planos`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/trabalhos`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contato`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/sobre`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const serviceRoutes: Entry[] = SERVICES.map((s) => ({
    url: `${SITE_URL}/servicos/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectRoutes: Entry[] = projects.map((p) => ({
    url: `${SITE_URL}/trabalhos/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
```

- [ ] **Step 4: Adicionar "Serviços" ao nav principal**

Em `web/components/hero/hero-nav.tsx`, no array `NAV`, inserir "Serviços" como primeiro item:

```ts
const NAV = [
  { href: "/servicos", label: "Serviços" },
  { href: "/trabalhos", label: "Trabalhos" },
  { href: "/planos", label: "Planos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];
```

- [ ] **Step 5: Adicionar "Serviços" ao footer**

Em `web/components/footer/footer.tsx`, no grupo `Estúdio`, inserir "Serviços" no topo:

```ts
  Estúdio: [
    { href: "/servicos", label: "Serviços" },
    { href: "/sobre", label: "Sobre" },
    { href: "/trabalhos", label: "Trabalhos" },
    { href: "/planos", label: "Planos" },
  ],
```

- [ ] **Step 6: Rodar e ver passar**

Run: `npx vitest run tests/app/sitemap.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add web/app/sitemap.ts web/components/hero/hero-nav.tsx web/components/footer/footer.tsx web/tests/app/sitemap.test.ts
git commit -m "feat(servicos): 'Servicos' no nav+footer e rotas no sitemap"
```

---

### Task 7: Barra de qualidade + verificação de rotas

**Files:** nenhum novo (verificação).

- [ ] **Step 1: Lint**

Run: `npm run lint`
Expected: 0 erros. Corrigir o que aparecer relacionado aos arquivos novos.

- [ ] **Step 2: Suíte completa**

Run: `npx vitest run`
Expected: os testes novos verdes; total de falhas ≤ o baseline pré-existente (~12 happy-dom `[test-env]`). **Zero regressão** nova. Se algum teste que passava antes quebrou, é regressão — investigar antes de seguir.

- [ ] **Step 3: Build + confirmação das rotas SSG**

Run: `npm run build`
Expected: build OK, TypeScript limpo, e as rotas aparecem na saída do Next:
`/servicos`, `/servicos/criacao-de-sites`, `/servicos/landing-pages` (as duas últimas como estáticas geradas por `generateStaticParams`).

- [ ] **Step 4: Commit (se lint/build geraram ajustes)**

```bash
git add -A
git commit -m "chore(servicos): barra de qualidade — lint + build + suite verdes"
```

---

## Self-Review

**1. Spec coverage:**
- Escopo v1 (2 páginas + hub) → Tasks 1, 4, 5 ✅
- Copy escrito por mim → Task 1 (copy completo inline) ✅
- URL `/servicos` + filhos → Tasks 4, 5 ✅
- Nav "Serviços" → Task 6 ✅
- Preço só "a partir de" + `minPrice` no schema → Global Constraints + Tasks 2 (offerFromPlan/minPrice) e 3 (cards linkam `/planos`, sem tabela) ✅
- Data-driven `lib/services.ts` → Task 1 ✅
- Template compartilhado → Task 3 ✅
- `Service`/`FAQPage`/breadcrumb schema, `@id` graph, via `<JsonLd>` → Tasks 2, 4 ✅
- Hub `CollectionPage` + breadcrumb → Task 5 ✅
- Internal linking (serviços↔planos↔cases; nav site-wide) → Tasks 3, 6 ✅
- Sitemap → Task 6 ✅
- Testes (services, schema, template, rota, hub, sitemap) → Tasks 1–6 ✅
- Barra de qualidade / cicatriz `[quality-bar]` → Task 7 ✅

**2. Placeholder scan:** Sem TBD/TODO. Copy real e código completo em todos os steps. A única nota condicional (props de `AuroraBlack`/`Reveal`/`LiquidGlass`) aponta pro uso real existente como referência — não é placeholder de conteúdo.

**3. Type consistency:** `Service`, `getService`, `getPlansForService`, `getProjectsForService` (Task 1) usados idênticos em 3, 4, 5. `offerFromPlan`/`serviceSchema`/`faqPageSchema` (Task 2) usados idênticos em 4. `getPlanByEventSlug` (Task 1, plans.ts) consumido por `getPlansForService`. Params das rotas: `{ servico: string }` consistente entre `generateStaticParams`, `generateMetadata` e o componente.

**Nota de escopo:** este plano é um único subsistema coeso (páginas de serviço), não precisa decomposição.
