# DESIGN.md — Prumo

> Visual system. Sourced from `../CONTEXT.md` §8 + §14. Authoritative on visual decisions.

## Theme

**Dark only, v1.** Cinematic premium. Cena física: founder/CEO olhando o site num MacBook à noite, café ao lado, decidindo se vale agendar reunião. Não é "dark mode tech porque é legal" — é editorial sobre fundo preto, igual catálogo de exposição premium ou trailer de filme.

## Palette (OKLCH-tinted, no #000 / #fff straight)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0A0A` (effectively `oklch(0.12 0 0)`) | Página inteira. Fundo cinematic. Evitar `#000` puro — o `#0A0A0A` lê como preto mas tem matéria. |
| `--text` | `#FFFFFF` (texto-100) | Headings display, copy de máxima ênfase. |
| `--text-70` | `rgba(255,255,255,0.70)` | Subheads, copy de corpo dominante. |
| `--text-55` | `rgba(255,255,255,0.55)` | Metadata, captions, support text. |
| `--text-35` | `rgba(255,255,255,0.35)` | Labels, hint text, divisores tipográficos. |
| `--glass-bg` | `rgba(255,255,255,0.01)` | Background dos elementos liquid glass. |
| `--glass-border` | gradient `rgba(255,255,255,0.15) → rgba(255,255,255,0.04)` | Borda inset 1.4px via mask xor/exclude. |
| `--glass-shadow-inset` | `inset 0 1px 1px rgba(255,255,255,0.10)` | Highlight sutil topo do glass. |

**Color strategy: Restrained.** Único "accent" é o próprio branco sobre preto. Hierarquia 100% por opacidade do branco + tamanho tipográfico + intensidade do glass + espaçamento. **Não introduzir hue adicional** sem renegociar identidade.

## Typography

O site fala com **duas vozes** (ADR 0006). A regra abaixo não é preferência —
sem ela o sistema degrada para "duas fontes aleatórias", que é pior do que
qualquer uma das duas sozinha.

- **`font-display` — Archivo condensada** (`wdth 74`, `wght 800`). A voz da marca.
  Títulos que **afirmam**: nomes de serviço, títulos de seção das páginas internas,
  preços, perguntas do FAQ, títulos legais.
  Substituta aberta da Neue Haas Grotesk W16 do manual, que é licenciada pela
  Monotype por pageview. Trocar a licença mexe só em `app/fonts.ts`.
- **`font-editorial` — Instrument Serif** (regular + italic). A voz editorial.
  Frases que carregam o **itálico assinatura** — `Preço *transparente*`,
  `Um estúdio. *Sem teatro.*`, a frase rotativa do hero, os numerais decorativos.
- **`font-body` — Inter.** Parágrafos, UI, labels, nav, CTAs.

### Como escolher, na prática

> **A frase tem um `<em>` em itálico?** Então ela é editorial, inteira — título e ênfase.
> **É uma afirmação seca, sem ênfase?** Então é a voz da marca.

Esse teste não foi inventado: é a divisão que já existia no código quando a marca
nova chegou. O itálico da Instrument Serif é a assinatura do site, e a Archivo não
tem itálico com esse caráter — misturar as duas dentro da mesma frase quebra as duas.

**Nunca** trocar a fonte do `h1` do hero sem redesenhar o `RotatingPhrase` junto:
ele posiciona as frases em absoluto sobre um sizer invisível e usa `whitespace-nowrap`,
então depende da métrica exata da Instrument Serif.

Pairing ratio mínimo: 1.5 entre níveis. Escala canônica para hero / sections:

| Step | Token sugerido | Tailwind ref |
|---|---|---|
| Display XL (hero) | `text-5xl md:text-6xl lg:text-7xl` **editorial** | letter-spacing tight `-0.02em` |
| Display L (section H1) | `text-4xl md:text-5xl` **display**, ou editorial se houver itálico | tight |
| Heading | `text-2xl md:text-3xl` **display** ou Inter weight 500 | normal |
| Body | `text-base md:text-lg` Inter weight 400 | line-height 1.55, line-length 60–72ch |
| Caption / label | `text-xs uppercase tracking-[0.18em]` Inter weight 500, text-35 | metadata, eyebrows |

Italic Instrument Serif é arma poderosa para single-word emphasis em headings. Usar com economia.

## Cor

Fundo `#111111` (o preto do manual, não `#000000` puro) e branco como accent de
hierarquia — o ADR 0001 segue valendo: hierarquia por opacidade, escala e agora
largura de tipo, nunca por cor decorativa.

O amarelo da marca `#F5B400` (`--color-plumb`) tem **um único papel: marcar estado**.
Hoje isso significa o anel de foco de teclado. Nunca usar em texto corrido, em área
grande, nem como enfeite — a exceção ao "accent = branco puro" foi aberta nominalmente
para estado e só para isso.

## Layout & rhythm

- **Container max-width:** `max-w-5xl` (1024px) para nav e blocos de conteúdo, `max-w-6xl` para grids amplas. Hero pode estourar.
- **Espaçamento vertical entre seções:** generoso. Mínimo `py-24 md:py-32`. Permitir respiração editorial.
- **Não envolver tudo em card.** Maior parte das seções vive direto sobre o preto. Cards (liquid glass) ficam para: navbar, CTA primário, cards de planos, sociais do hero. Em outros lugares: type + espaço bastam.
- **Grids:** preferir assimetria editorial. 3 colunas idênticas é o último recurso. Em "O que resolvemos", evitar 3 cards idênticos — tentar composição vertical numerada ou layout assimétrico (1 grande + 2 menores em peso visual via type scale).

## Liquid glass (signature element)

Especificação canônica (de `globals.css` ou utility class `.liquid-glass`):

```css
background: rgba(255, 255, 255, 0.01);
background-blend-mode: luminosity;
backdrop-filter: blur(4px);
-webkit-backdrop-filter: blur(4px);
border: none;
box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.10);
position: relative;
overflow: hidden;
```

`::before` cria borda gradient 1.4px via mask xor/exclude.

**Onde usar:**
- Navbar (rounded-full max-w-5xl no topo do hero).
- CTA principal "Agendar conversa" (rounded-full).
- Botões sociais do hero (circular icon buttons).
- Cards de planos.

**Onde NÃO usar:**
- Em todo lugar. Glass perde valor se for fundo padrão.
- Sobre fundos sem profundidade (sem vídeo / sem imagem por trás) — o glass precisa de algo para "filtrar".

## Hero video

- `<video>` full-screen, `muted autoPlay loop playsInline`, `object-cover`, `absolute inset-0`.
- Container: `min-h-screen bg-black overflow-hidden`.
- `translate-y-[17%]` (ajustar por vídeo).
- **Fade system em JS, não CSS:**
  - 500ms requestAnimationFrame fade-in no load/loop start.
  - 500ms fade-out quando faltam 0.55s pro fim.
  - Flag `fadingOutRef` previne re-trigger.
  - No `ended`: opacidade → 0, após 100ms reseta `currentTime = 0`, dá play, fade-in.
  - Novo fade cancela frame anterior.
- Vídeo a definir: arquitetônico/geométrico (linhas, geometria precisa, metáfora prumo). **Evitar:** genérico "cidade tech", drone shots cliché, imagens de pessoas no escritório.

## Motion

- Hero: vídeo bg em loop + fade JS (acima).
- Resto do site: motion sutil. Reveals on-scroll com fade-up <300ms. Hovers refinados (CTA glass clareia 1–2%, scale 1.01, duração 200ms ease-out).
- **Proibido:** gradientes pulsando, neon glow, parallax barulhento, animação infinita decorativa, scroll-jacking.
- Easing: ease-out-quart / quint / expo. Sem bounce.

## Icons

`lucide-react`. Stroke 1.5px padrão. Cor inherit (geralmente white-70 ou white-100). Tamanho default 18–20px, hero pode ir até 24px.

## Components present

Inventário current (pre-live):
- `Hero` — full-screen com vídeo opcional, navbar glass, content (heading + sub + CTAs), social icons.
- `Navbar` — rounded-full glass, max-w-5xl.
- `PrumoLines` — linhas verticais brancas finas. **Removido do hero;** disponível para uso pontual em outras seções (ex: única linha lateral como divisor).
- Layout root com Instrument Serif + Inter como CSS variables.

## What's still TBD

- Cor de "estado de erro" / "feedback positivo" — ainda não definida. Quando precisar, derivar via opacity do branco ou via uma única hue muito dessaturada (não introduzir verde/vermelho saturado).
- Sistema de divisores entre seções — atualmente puro espaço vertical. Se ficar fraco, considerar single `<hr>` Instrument-Serif-numbered ou linha 1px white/10.
- Footer ainda não construído — manterá mesma sobriedade.
