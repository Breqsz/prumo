# /planos "Palco" — design spec

**Data:** 2026-07-01
**Topic:** Reformulação visual da página `/planos` do site Prumo
**Status:** Aprovado (direção + interação). Pendente review da spec pelo dono.

---

## Contexto

A página `/planos` (`web/app/planos/page.tsx`) hoje empilha `PlanosHero → OneTimeGrid (3 cards) → MonthlyGrid (3 cards) → CustomStrip → PlanosFaq → FinalCta`, tudo sobre `AmbientVideo` com spotlight.

Diagnóstico (validado com o dono): a página está "muito dark e simples", mas o problema de fundo é **conversão e clareza**, não só estética —

- **6 cards visualmente idênticos** (`PlanCard`) causam paralisia; o olho não sabe onde pousar.
- **"Criar" e "Manter" empilhados** parecem 6 opções concorrentes, quando são **duas decisões separadas** (comprar um site / mantê-lo depois).
- **Zero destaque real do plano-âncora** (Institucional / Crescimento).
- **Todo card puxa pra `/contato` com o mesmo peso** — sem degrau de compromisso.

A estética dark é decisão de marca registrada no **ADR 0001** (dark only, accent branco puro, hierarquia por opacidade/escala/glass, "não introduzir cor sem nova conversa"). A direção escolhida respeita o ADR **integralmente — nenhum novo ADR é necessário**.

Direção aprovada (de um brainstorm de 5): **#2 "Palco / Spotlight"** — um plano por vez iluminado no centro do palco, os outros escurecidos nas laterais, com **interação jukebox** (clicar numa lateral traz o plano ao centro). Puro contraste de luz e escala, dentro do ADR.

## Objetivo

Reformular `/planos` para (1) **chamar atenção** via encenação cinematográfica; (2) tornar os planos **fáceis de entender** separando as duas decisões e trazendo comparação sob demanda; (3) **induzir à conversão** destacando o plano-âncora e criando um único CTA forte por vez.

## Não-objetivos

- **Não** adicionar cor / accent colorido (fica no dark + branco puro do ADR 0001).
- **Não** adicionar dependência de animação (`framer-motion` etc.). Motion via CSS + estado React, coerente com a filosofia zero-lib atual do projeto (efeitos custom: `StarBorder`, `ElectricBorder`, `reveal`).
- **Não** construir matriz de comparação feature-a-feature com taxonomia nova (YAGNI). A comparação v1 é os 3 cards completos lado a lado, sob demanda.
- **Não** mexer em `PlanosHero`, `CustomStrip`, `PlanosFaq`, `FinalCta`, `AmbientVideo`.
- **Não** implementar i18n aqui (fica pra fase i18n geral do site).
- **Não** alterar preços, escopos ou copy dos planos — só a apresentação. Textos seguem o que já existe.

## Arquitetura

### Página (`web/app/planos/page.tsx`)

Nova composição:

```
AmbientVideo (spotlight)
  HeroNav            (mantém)
  PlanosHero         (mantém)
  SpotlightStage     (NOVO — substitui OneTimeGrid + MonthlyGrid)
  CustomStrip        (mantém)
  PlanosFaq          (mantém)
  FinalCta           (mantém)
Footer               (mantém)
```

### Dados (`web/lib/plans.ts` — NOVO)

Os dois arrays `PLANS` estão hoje **duplicados inline** em `one-time-grid.tsx` e `monthly-grid.tsx`. Extrair para fonte única:

```ts
export type Plan = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  featured?: boolean;
  eventSlug: string;
};
export const CRIAR_PLANS: Plan[] = [ /* Landing, Institucional(featured), Branded */ ];
export const MANTER_PLANS: Plan[] = [ /* Base, Crescimento(featured), Parceria */ ];
```

Conteúdo copiado 1:1 dos arrays atuais (sem `glow`, que era um detalhe visual do card antigo). Cada conjunto tem exatamente 1 `featured` = o âncora.

### `SpotlightStage` (NOVO — client component)

Coração da reformulação. `"use client"` — precisa de estado.

**Estado:**
- `mode: "criar" | "manter"` (default `"criar"`).
- `activeSlug: string` — plano em foco. Ao trocar de `mode`, reseta para o `featured` daquele conjunto (âncora já entra no centro).

**Layout (desktop):**
- **Toggle Criar/Manter** no topo, `role="tablist"` com dois `role="tab"`. Troca o conjunto de 3 planos exibidos. Marca evento `plano_toggle`.
- **3 slots** (esquerda / centro / direita). O plano `activeSlug` ocupa o centro: maior, iluminado (glow radial branco + `ElectricBorder`). Os outros dois nas laterais: menores, `opacity ~.55`, **legíveis** (nome, preço, cadência, 2–3 features).
- **Jukebox:** clicar num card lateral define `activeSlug`. Os papéis (centro vs lateral) são derivados de `activeSlug`; a mudança de papel dispara transições CSS (`transform`, `scale`, `opacity`, glow) de ~280ms. **A ordem no DOM não muda** — apenas o styling por papel — preservando foco e leitura de tela. Marca evento `plano_focus`.
- **CTA** único e proeminente **só no card ativo** → `/contato` (preserva `data-umami-event="plano_click"` + `data-umami-event-plano={eventSlug}`).

**Layout (mobile, `< md`):**
- Vira **carrossel com CSS scroll-snap** (`scroll-snap-type: x mandatory`), 1 card centrado com "peek" dos vizinhos. Nativo, sem JS de arraste. O card no snap central recebe o styling ativo. Tocar num vizinho também rola até ele.

### `StagePlanCard` (NOVO — presentational)

Card do palco, CSS-only (sem canvas por card, diferente do `PlanCard` atual que embrulha em `StarBorder`/`ElectricBorder` — pesado pra animar 3 simultâneos).

- Props: `plan: Plan`, `state: "active" | "side"`, `onFocus: () => void`.
- `state="active"`: escala cheia, borda/gloW forte, descrição + todas as features + CTA visíveis.
- `state="side"`: escala reduzida, opacidade menor, subset legível (nome, preço, cadência, primeiras features), sem CTA (clicar no card = trazer ao centro).
- Transições CSS entre os dois estados. O glow do ativo pode reusar a estética do glow atual (`GLOW_STYLES`) via CSS.

### `PlanComparison` (NOVO — comparação sob demanda)

- Link/botão "↕ ver comparação completa dos 3 planos" abaixo do palco (`aria-expanded`).
- Expandido: os **3 cards completos, estáticos, lado a lado** (grid de 3), reusando o conteúdo dos planos do `mode` atual. Sem taxonomia de features nova.
- Colapsado por padrão. Estado local no `SpotlightStage` (ou no próprio componente).

### Componentes removidos

- `web/components/planos/one-time-grid.tsx` + `tests/components/planos/one-time-grid.test.tsx`
- `web/components/planos/monthly-grid.tsx` + `tests/components/planos/monthly-grid.test.tsx`
- `web/components/pricing/plan-card.tsx` + `tests/components/pricing/plan-card.test.tsx` — **fica órfão** após remover os dois grids (grep confirma: só eles usam `PlanCard`). Remover.

## Motion & Acessibilidade

- **`prefers-reduced-motion: reduce`** → sem slide/scale animado; troca de foco vira **cross-fade** simples (ou corte). Requisito do ADR 0001 (motion respeitando reduced-motion).
- Duração de transições ≤ 300ms (padrão da marca).
- **Toggle:** `role="tablist"`/`role="tab"`, `aria-selected`, navegação por setas ←/→, `Home`/`End`.
- **Cards do palco:** cada card lateral é focável (`button` ou `role="button"` com `tabindex`), `aria-label` claro ("Focar plano Landing"), acionável por `Enter`/`Espaço`. O card ativo expõe seu conteúdo normalmente.
- **Comparação:** botão com `aria-expanded` + `aria-controls`.
- Contraste dos cards laterais: `opacity ~.55` precisa manter texto legível sobre o `AmbientVideo` — validar contraste real (pode exigir um leve backdrop/scrim atrás do palco).

## Analytics (umami)

- **Preserva** `plano_click` (+ `data-umami-event-plano`) no CTA do card ativo.
- **Adiciona** `plano_toggle` com `data-umami-event-mode` (`criar` | `manter`).
- **Adiciona** `plano_focus` com `data-umami-event-plano` quando um card é trazido ao centro.
- Todos declarativos (`data-umami-event`), coerente com o padrão Tier 2 já existente.

## Testes (Vitest)

Novos/ajustados em `tests/components/planos/`:

- `spotlight-stage.test.tsx`:
  - Renderiza 3 planos do conjunto `criar` por default, com o `featured` ativo no centro.
  - Toggle para `manter` troca o conjunto e reseta o ativo para o `featured` de `manter`.
  - Clicar num card lateral muda o `activeSlug` (card correto passa a "active").
  - CTA aparece só no card ativo, com os `data-umami-event` corretos.
  - `PlanComparison` colapsado por default; expande ao acionar (aria-expanded).
  - Toggle expõe roles `tablist`/`tab` e `aria-selected`.
- Remover os testes dos componentes deletados (`one-time-grid`, `monthly-grid`, `plan-card`).
- Não testar animação CSS em si (jsdom não anima); testar o **estado/marcação** que dirige a animação.

## Riscos / pontos de atenção

1. **Legibilidade dos cards laterais** sobre vídeo ambient + opacidade reduzida — pode precisar de scrim. Validar visualmente no dev server.
2. **Perf do jukebox** — animar 3 cards com glow. Usar `transform`/`opacity` (compositáveis), evitar animar `width`/`box-shadow` pesado. Testar em mobile.
3. **`ElectricBorder` no card ativo durante a transição** — se pesar, aplicar só ao ativo em repouso (fade-in do border depois do slide).
4. **Quality bar não reverificada** pós-reclone — rodar `npm run lint`, `test`, `build` no `web/` ao final antes de dar por pronto.

## Sequência de implementação

1. `web/lib/plans.ts` — extrair dados (fonte única).
2. `StagePlanCard` (presentational) + seus estados/transições CSS.
3. `SpotlightStage` (estado, toggle, jukebox, mobile snap) usando `lib/plans.ts` e `StagePlanCard`.
4. `PlanComparison` (expand sob demanda).
5. Ligar em `app/planos/page.tsx`; remover `OneTimeGrid`/`MonthlyGrid` do import e da árvore.
6. Remover componentes/testes órfãos (`one-time-grid`, `monthly-grid`, `plan-card`).
7. Testes Vitest novos.
8. Quality bar: `lint` + `test` + `build` no `web/`; revisão visual no dev server (desktop + 375/414/768).
