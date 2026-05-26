# Aurora Black — background do case body

> Design doc. Brainstormed 2026-05-26.
> Source: `web/app/trabalhos/[slug]/page.tsx`, atualmente com body em preto chapado entre header (vídeo) e próximo capítulo (vídeo).

## Goal

Trocar o `#0A0A0A` chapado do body do case por um fundo atmosférico animado — "Aurora Black" — que combine com o vocabulário visual do site (dark cinematic, branco como único accent, motion controlada) sem usar vídeo.

## Non-goals

- Aplicar a aurora em outras páginas (home, `/sobre`, `/planos`, `/contato`). Escopo é só `web/app/trabalhos/[slug]/page.tsx`.
- Variação por seção (Brief / Processo / Resultado compartilham o mesmo fundo).
- Prop de intensidade ou variantes. Uma calibragem gravada.
- Parallax mouse-driven.
- Suporte light mode (site é dark-only v1).
- Scroll-driven animation. Motion é pure ambient.

## Visual concept

Três radial gradients brancos a baixa opacidade (5–8% no centro, fade to 0% em ~65%) flutuam por trás do conteúdo em loops longos. Sobreposição de film grain SVG em `mix-blend-mode: screen` adiciona textura cinematográfica. Vignette radial empurra os cantos pra um preto mais profundo, reforçando hierarquia. Top/bottom fade-out costuram a transição com o vídeo do header e o vídeo do próximo capítulo.

Resultado: veludo profundo com poças de luz vagando — eco do hero sem repetir o vídeo, sobriedade preservada.

## Architecture

**Novo componente:** `web/components/ambient/aurora-black.tsx`

Espelha o padrão estrutural de `web/components/ambient/ambient-video.tsx`:
- Wrapper externo: `relative isolate`.
- Container de fundo: `aria-hidden`, `pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black`.
- Dentro dele: `<div className="sticky top-0 h-screen w-full overflow-hidden">` segurando os layers (auroras `absolute inset-0`, grain `absolute inset-0`, vignette `absolute inset-0`, fades top/bottom `absolute inset-x-0`).
- Children renderizados depois do container de fundo, sem alteração de fluxo.

Renderiza **uma vez** atrás do body do case. O conteúdo (meta + Brief/Processo/Resultado + galeria) scrolla por cima sem reanimar nada.

**Integração:** em `web/app/trabalhos/[slug]/page.tsx`, envolver a `<section>` do body (linhas 83–112) num `<AuroraBlack>...</AuroraBlack>`. O header (linhas 39–81) e a "Próximo capítulo" (linhas 126–158) ficam fora.

## Layer stack (bottom → top)

1. **Base:** `bg-black` (`#0A0A0A` no token Tailwind) — wrapper.
2. **Aurora 1:** radial gradient `rgba(255,255,255,0.08)` 0% → `rgba(255,255,255,0)` 65%. Tamanho 80vw × 80vh. Posição inicial top-left negativo. `filter: blur(80px)`. Loop 42s `aurora-drift-1`.
3. **Aurora 2:** radial gradient `rgba(255,255,255,0.06)` 0% → `rgba(255,255,255,0)` 65%. Tamanho 70vw × 70vh. Posição inicial bottom-right negativo. `filter: blur(80px)`. Loop 48s `aurora-drift-2` (direção oposta).
4. **Aurora 3:** radial gradient `rgba(255,255,255,0.05)` 0% → `rgba(255,255,255,0)` 70%. Tamanho 55vw × 55vh. Posição centro-direita. `filter: blur(60px)`. Loop 55s `aurora-drift-3`.
5. **Grain:** SVG turbulence inline (mesma técnica de `ambient-video.tsx`) a `opacity: 0.05`, `mix-blend-mode: screen`.
6. **Vignette:** `radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)`.
7. **Top fade:** `linear-gradient(to bottom, #0A0A0A 0%, transparent 100%)`, altura 40px, costura com header.
8. **Bottom fade:** `linear-gradient(to top, #0A0A0A 0%, transparent 100%)`, altura 40px, costura com próximo capítulo.

## Motion spec

Três `@keyframes` declaradas em `web/app/globals.css` (mesmo lugar do `liquid-glass` atual):

```css
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
```

- Easing: `ease-in-out` em todos. Sem bounce.
- `animation-iteration-count: infinite`. Como keyframes retornam ao zero em `0%, 100%`, não precisa `alternate`.
- Drift máximo 6% de viewport. Scale entre 0.95–1.08.
- Pico de opacidade visível: 8% (Aurora 1). Teste de aceitação: frame parado vs animado lado a lado — se a diferença for óbvia, calibragem está alta demais.

## Accessibility

- `prefers-reduced-motion: reduce` → suspende as 3 animações via `@media` query. Gradients ficam em posição inicial. Grain e vignette mantidos (são estáticos).
- Aurora não carrega informação semântica. Wrapper recebe `aria-hidden="true"`.
- Contraste do texto sobre a aurora: como pico é 8% de branco difundido por blur(80px), o ganho de luminância no body é < 2% — não afeta WCAG AA do texto existente (`text-white` e `text-white/70` sobre fundo escuro).

## Performance

- Pure CSS. Zero JS no componente além do React render trivial.
- 3 layers blurradas custam ~3–6ms na primeira render, depois ficam em compositor (GPU). Aceitável.
- `contain: layout paint` no wrapper isola o componente do reflow do resto da página.
- `will-change: transform` apenas nas 3 auroras (não no wrapper, não no grain).
- Sem layout thrash: nada de top/left animado — só `transform`.

## Testing (Vitest + Testing Library)

Novo: `web/tests/components/ambient/aurora-black.test.tsx`

Casos:
1. Renderiza o wrapper com `aria-hidden="true"` e contém os 3 layers de aurora identificáveis por `data-testid`.
2. Renderiza os children passados via prop intactos.
3. Quando `matchMedia('(prefers-reduced-motion: reduce)')` retorna `matches: true`, as animações nas auroras estão desabilitadas (verificar via `getComputedStyle` ou classe condicional).

Update: `web/tests/app/trabalhos/[slug]/page.test.tsx` (ou criar se não existir)
- Verifica que `<AuroraBlack>` envolve só a seção body, não o header nem o próximo capítulo.

## File changes

| Arquivo | Tipo | Descrição |
|---|---|---|
| `web/components/ambient/aurora-black.tsx` | novo | Componente do background |
| `web/app/globals.css` | edit | Adicionar `@keyframes aurora-drift-1/2/3` e bloco `prefers-reduced-motion` |
| `web/app/trabalhos/[slug]/page.tsx` | edit | Envolver `<section>` do body em `<AuroraBlack>` |
| `web/tests/components/ambient/aurora-black.test.tsx` | novo | Test suite do componente |

## Open questions resolvidas no brainstorm

- **Intensidade:** 8% peak (não 5%, não 10%) — confirmado pelo user.
- **Camadas:** 3 — confirmado.
- **Vignette:** mantida — confirmado.
- **Escopo:** só case body — confirmado.

## Risks

- **"Gradient pulsando" (proibido no DESIGN.md):** mitigado por opacidades baixas (5–8%), loops longos (42–55s) e drift contido (4–6%). Acceptance test: comparação still vs animado.
- **Performance em mobile:** blur(80px) em 3 layers pode pesar em devices low-end. Mitigado por `contain: layout paint`, `will-change: transform`, sem JS. Se observado em QA, fallback é remover Aurora 3 em viewport < 768px.
- **Costura com vídeos de header/próximo capítulo:** mitigado por top/bottom fade-out de 40px. Pode precisar tuning na implementação.
