# /sobre — design spec

**Data:** 2026-05-26
**Topic:** Página `/sobre` do site Prumo
**Status:** Aprovado (estrutura). Conteúdo do dono em placeholder.

---

## Contexto

`CONTEXT.md` mapeia `/sobre` como "Você, método, processo". A rota já está referenciada no `HeroNav` (`web/components/hero/hero-nav.tsx`) mas o arquivo `web/app/sobre/page.tsx` não existe — clicar no link 404a.

Conteúdo real do dono (nome, foto, bio) está marcado como pendente em `CONTEXT.md` item 12.5. Decisão: avançamos com placeholders honestos, marcados `TODO` no código, em vez de bloquear.

Estética e stack seguem o que já está consolidado: dark cinematic, Instrument Serif + Inter, accent branco puro, liquid glass, motion sutil. Página espelha o padrão arquitetural de `/planos` (`web/app/planos/page.tsx`): wrapper `AmbientVideo` + `HeroNav` + seções + `Footer`.

## Objetivo

Entregar a página `/sobre` estruturalmente completa, integrada ao layout do site, pronta para receber conteúdo real do dono (nome, foto, bio, links sociais) sem refactor — só substituição de strings/asset.

## Não-objetivos

- Não vamos escrever copy final do manifesto (placeholder honesto, dono refina).
- Não vamos buscar/produzir foto real.
- Não vamos adicionar internacionalização — fica para a fase i18n geral do site.
- Não vamos criar novo componente de motion ou novo padrão de glass — reuso do que existe.

## Arquitetura

### Página

`web/app/sobre/page.tsx` — Server Component. Estrutura:

```tsx
<AmbientVideo srcs={AMBIENT_VIDEOS} spotlight>
  <HeroNav />
  <SobreHero />
  <Manifesto />
  <Metodo />
  <QuemAssina />
  <FinalCta />
</AmbientVideo>
<Footer />
```

Metadata: `title: "Sobre · Prumo"`, description curta sobre estúdio solo + posicionamento.

### Componentes novos

Todos em `web/components/sobre/`:

1. **`sobre-hero.tsx`** — `SobreHero`
2. **`manifesto.tsx`** — `Manifesto`
3. **`metodo.tsx`** — `Metodo`
4. **`quem-assina.tsx`** — `QuemAssina`

Componentes reusados: `HeroNav`, `AmbientVideo`, `FinalCta`, `Footer`, `Reveal`, `LiquidGlass`.

## Seções — especificação detalhada

### 1. SobreHero

- Espelha visual do `PlanosHero`: `min-h-screen`, `Reveal` wrapper, scroll hint `ChevronDown` no fundo.
- Kicker `Sobre` (uppercase, tracking-[0.3em], text-white/55, 11px).
- Heading `h1` Instrument Serif, com `<em>` em uma palavra-chave. Proposta inicial: `Um estúdio. Sem teatro.` — italic em "Sem teatro".
- Sub: 1 linha curta. Proposta: `Solo, premium e sóbrio. Honestidade vale mais que tamanho.`
- Scroll hint aponta para `#manifesto`.

### 2. Manifesto

- `<section id="manifesto">`, `max-w-3xl`, alinhamento à esquerda (não centrado — peso editorial).
- 3-4 parágrafos placeholder, texto em `text-xl md:text-2xl text-white/80`, line-height generoso.
- `<em>` Instrument Serif pontuando 2-3 frases-chave por parágrafo.
- Conteúdo placeholder cobre: o que é o Prumo, o que NÃO é, princípio de honestidade solo, princípio de sobriedade.
- Marcado `{/* TODO: copy final do manifesto */}` no JSX.

### 3. Metodo

- `<section id="metodo">`, lista vertical (não grid de cards — mais respirado).
- 4 itens fixos: Alinhamento, Desenho, Construção, Lançamento.
- Cada item: número grande (`01`, `02`...) em Instrument Serif à esquerda, título + descrição (2-3 linhas) à direita.
- Linha divisória sutil (`border-white/10`) entre itens.
- Layout responsivo: em mobile, número fica acima do texto.
- Texto descritivo é fixo (não placeholder) — reflete o método já documentado em `CONTEXT.md` seção 9.

### 4. QuemAssina

- `<section id="quem-assina">`, grid `md:grid-cols-[2fr_3fr]`, gap generoso.
- **Coluna esquerda (foto):** `LiquidGlass` com `aspect-[4/5]`, conteúdo interno: texto `Foto · placeholder` em `text-white/30 text-xs uppercase tracking-widest`, centrado. `{/* TODO: substituir por <Image> real */}`.
- **Coluna direita (texto):**
  - Kicker `Quem assina`.
  - Nome `h2` Instrument Serif: `[Seu nome aqui]`. TODO.
  - Bio: 3 linhas placeholder honestas. TODO.
  - 3 links sociais (`Instagram`, `LinkedIn`, `WhatsApp`), `href="#"`, com TODO. Estilo: lista horizontal, underline-on-hover (mesma linguagem do nav).
- Background da seção: nada além do AmbientVideo já presente — deixar respirar.

### 5. FinalCta + Footer

- Reuso direto de `<FinalCta />` e `<Footer />`. Sem modificação.

## Estados e edge cases

- Página é estática, sem dados externos, sem loading/error states.
- Acessibilidade: cada `<section>` com `aria-labelledby` apontando para o `<h2>` correspondente. SobreHero usa `aria-labelledby="sobre-hero-heading"` como o padrão de PlanosHero.
- Responsivo: mobile-first. Hero centrado em todas as larguras; Manifesto à esquerda em todas; Método empilha número-acima-de-texto em `<md`; QuemAssina empilha foto-acima-de-texto em `<md`.

## Testes

Mínimos, alinhados ao padrão do projeto (sem brittle):

- `sobre-hero.test.tsx` — renderiza o `h1`.
- `metodo.test.tsx` — renderiza os 4 títulos de passo.
- `quem-assina.test.tsx` — renderiza placeholder de nome e os 3 links sociais.

Manifesto e a página inteira não ganham teste — conteúdo é majoritariamente prosa estática, teste vira espelho da copy e quebra a cada ajuste.

## Verificação

- `npm run build` no diretório `web/` passa (Turbopack).
- `npm test` passa (incluindo os 3 testes novos).
- Navegação manual: `/` → click em "Sobre" no HeroNav → carrega `/sobre` sem 404.
- Visual: cada seção respeita a paleta (preto/branco), tipografia (Instrument Serif display + Inter body), e o AmbientVideo aparece de fundo como nas outras páginas.

## Placeholders — checklist explícito (para troca futura)

| Arquivo | O que trocar |
|---|---|
| `quem-assina.tsx` | Texto `[Seu nome aqui]` → nome real |
| `quem-assina.tsx` | Bio placeholder de 3 linhas → bio real |
| `quem-assina.tsx` | `href="#"` dos 3 links sociais → URLs reais |
| `quem-assina.tsx` | `<div>` glass placeholder → `<Image>` real com a foto |
| `manifesto.tsx` | 3-4 parágrafos placeholder → copy refinada do dono |

Todos os pontos acima marcados com `{/* TODO: ... */}` no JSX para facilitar grep.

## Fora de escopo (explícito)

- Internacionalização (PT/EN toggle).
- Animações scroll-linked complexas — só o `Reveal` padrão.
- Componente novo de social-icons — usar lista simples de links por enquanto.
- Página `/contato` — separada, plano próprio.
