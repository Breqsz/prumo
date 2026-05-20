# PRUMO — Contexto do Projeto

> **Arquivo de contexto persistente.** Sempre que voltar ao projeto, ler este arquivo primeiro.
> Última atualização: 2026-05-20

---

## 1. O que é o Prumo

**Prumo** é uma marca de prestação de serviços digitais que vende sites e presença digital.

- **Marca visual:** `Prumo` (sozinho como logo) + tagline `Sites, estratégia e presença digital.`
- **NÃO usar** `Prumo Digital` cravado em logo — separar o nome da tagline é o que dá ar premium.
- **Razão por trás do nome:** "prumo" = linha de prumo, instrumento de precisão e verticalidade. Vira metáfora central do branding (alinhamento, precisão, fundação).

---

## 2. Operação real (não fingir o que não é)

- **Solo** — apenas o dono. Pode contratar freelas pontuais no futuro.
- Posicionamento de **estúdio premium**, não "agência inflada".
- Dono aparece no site: nome + foto + bio curta. Honestidade > teatro de agência.

---

## 3. Posicionamento (Caminho A escolhido)

- O site posiciona por **OBJETIVO do cliente**, não por setor.
- Hero fala "vender mais / profissionalizar / lançar", **não** "sites para advogados/restaurantes/etc."
- Cliente **não quer nichar** mas o site não pode soar genérico — resolve com copy focado em resultado e estética premium que filtra perfil.
- **Tom de voz:** técnico e sóbrio (linha Linear, Vercel, Cyberflow). Frases curtas, vocabulário preciso, zero gracinha de agência.

> **Discordância documentada:** profissionalmente eu recomendaria nichar. Cliente optou por gen­éri­co; respeitamos a decisão e mitigamos com copy/estética.

---

## 4. Ofertas (benchmark BR 2026, A CONFIRMAR pelo cliente)

### One-time (criação)
| Plano | Preço | Escopo | Prazo |
|---|---|---|---|
| **Landing** | R$ 3.500 | Página única de alta conversão, 1 idioma | 10 dias |
| **Institucional** | R$ 8.500 | Até 6 páginas, CMS leve, formulário | 21 dias |
| **Branded** | a partir de R$ 18.000 | Projeto custom, identidade integrada, animações sob medida, CMS robusto | 30-45 dias |

### Mensais (recorrente)
| Plano | Preço | Escopo |
|---|---|---|
| **Base** | R$ 397/mês | Hospedagem + backups + atualizações + 2h de alterações/mês |
| **Crescimento** | R$ 997/mês | Base + 6h/mês design/dev + SEO básico + suporte prioritário |
| **Parceria** | R$ 2.500/mês | Crescimento + 12h/mês + reunião estratégica mensal + relatório métrico + A/B tests |

### Custom
Projetos sob demanda. Mínimo sugerido R$ 25.000. Reunião obrigatória de briefing antes de orçar.

> **PENDENTE:** preços e escopos precisam ser confirmados pelo cliente.

---

## 5. Stack que o Prumo entrega AOS CLIENTES

Misto, decidido por projeto:
- **Código sob medida** (Next.js/React) para projetos premium e custom.
- **No-code premium** (Framer/Webflow) para Landing/Institucional rápidos.
- O site comunica como "escolhemos a melhor stack pra cada projeto" — não oscila entre duas marcas.

---

## 6. Stack DESTE site (o Prumo em si)

- **Next.js 15+ (App Router) + TypeScript + Tailwind CSS**
- Deploy: **Vercel**
- **i18n:** PT-BR principal + EN como toggle
- **Conteúdo:** MDX local na v1, Sanity quando crescer
- **Analytics:** Vercel Analytics (Plausible/GA4 depois se cliente exigir)

---

## 7. Conversão

- **Calendly / Cal.com** como CTA principal (`Agendar conversa`)
- **WhatsApp** como botão flutuante secundário (dúvida rápida)
- **Formulário** em `/contato` como fallback / qualificação

---

## 8. Identidade visual

> **REVISÃO 2026-05-20:** cliente trocou de "light editorial" para **DARK CINEMATIC**. Manteve posicionamento/estratégia/CTA — só a estética mudou.

- **Dark mode only** na v1. Estética cinematográfica.
- **Estética:** dark cinematic premium — vídeo de fundo em hero, elementos com **liquid glass**, tipografia editorial em serifa display sobre fundo preto. Referências de vocabulário visual: hero "Asme" (vídeo bg + glass + Instrument Serif), com posicionamento e copy próprios do Prumo.
- **Paleta base:**
  - Fundo: preto / quase-preto (`#000000` ou `#0A0A0A`)
  - Texto: branco / off-white (`#FFFFFF` / `#F5F5F5`)
  - Glass: `rgba(255, 255, 255, 0.01)` com `backdrop-filter: blur(4px)` e borda inset linear-gradient (spec completa no item 14)
- **Accent: BRANCO PURO** (decidido 2026-05-20)
  - Único "accent" do sistema é o próprio branco (`#FFFFFF` / `#F5F5F5`) sobre preto
  - Estilo Apple dark / Linear dark — máxima sobriedade premium
  - Hierarquia construída por: opacidade do branco (100% / 70% / 55% / 35%), tamanho tipográfico, intensidade do glass, espaçamento
  - NÃO introduzir cor adicional sem nova conversa
- **Tipografia:**
  - **Display: Instrument Serif** (Google Fonts, regular + italic) — confirmado
  - **Corpo: Inter** (sans premium neutra)
- **Detalhe assinatura:** linhas verticais finas brancas com baixa opacidade (~10-20%) em momentos chave (metáfora do prumo). Continua sendo elemento de marca.
- **Motion:** cinematic **mas controlado**.
  - Hero: vídeo de fundo em loop com sistema custom de fade (500ms requestAnimationFrame fade-in no load/loop start, fade-out quando faltam 0.55s pro fim — não usar CSS transitions pra isso, usar JS)
  - Resto do site: motion sutil (reveals on-scroll fade-up, hovers refinados, <300ms)
  - PROIBIDO: gradientes pulsando, neon glow excessivo, parallax barulhento
- **Liquid Glass:** elemento de UI assinatura. Usar em CTAs principais, navbar/menu, cards de planos, botões secundários. Não em tudo — moderação.
- **Ícones:** **lucide-react** (escolhido pelo cliente).

### Referências enviadas pelo cliente
- https://agenciavime.com/criacao-de-site/
- https://cyberflow-pi.vercel.app
- https://motionsites.ai
- Hero spec "Asme" (vídeo bg + liquid glass + Instrument Serif) — vocabulário visual desejado

> Cliente mudou de light editorial para dark cinematic após brainstorming. Posicionamento e estratégia mantidos integralmente.

---

## 9. Arquitetura do site

### Páginas
```
/                       Home (one-page longa com seções ancoradas)
/trabalhos              Lista de cases
/trabalhos/[slug]       Case individual
/planos                 Página dedicada (SEO + cliente que busca preço)
/sobre                  Você, método, processo
/contato                Calendly + WhatsApp + formulário
/blog                   FASE 2 — NÃO na v1
```

### Seções da Home (ordem definida)
1. **Hero** — frase âncora + CTA "Agendar conversa"
2. **Prova rápida** — logos / contagem / trabalhos em destaque
3. **O que resolvemos** — 3 cards: Vender mais / Profissionalizar / Lançar
4. **Como o Prumo trabalha** — processo em 4 passos (Alinhamento → Desenho → Construção → Lançamento)
5. **Trabalhos selecionados** — 3-4 cases em grid
6. **Planos** — resumo dos 3+3+custom, CTA pra `/planos`
7. **Quem está por trás** — você, bio, foto
8. **FAQ** — objeções comuns
9. **CTA final + footer**

---

## 10. Domínio (ainda NÃO comprado)

Ordem de preferência a verificar quando for fazer deploy:
1. `prumo.com.br` (palavra comum — provavelmente ocupado)
2. `prumo.studio`
3. `prumo.design`
4. `prumo.digital`
5. `noprumo.com.br` (play de palavras)
6. `estudioprumo.com.br`

---

## 11. Status atual

- [x] Brainstorming e definições estratégicas
- [x] Design proposto e aprovado
- [x] Spec/plano de implementação (`docs/superpowers/plans/2026-05-20-prumo-foundation-hero.md`)
- [x] Setup do projeto Next.js 16 + Tailwind 4 + Vitest (em `web/`)
- [x] Identidade visual final (paleta dark, accent branco, Instrument Serif + Inter)
- [x] **Plano 1 executado: Foundation + Hero** — 20/20 testes passando, `npm run build` (Turbopack) verde, Hero composto (vídeo opcional + linhas prumo + navbar glass + content + social)
- [ ] Deploy preview no Vercel ← próximo passo manual (`cd web && npx vercel`)
- [ ] Plano 2: Home sections (3 objetivos, processo, cases, planos resumo, FAQ, footer)
- [ ] Plano 3: Páginas internas (`/planos`, `/sobre`, `/contato`, `/trabalhos`)
- [ ] Plano 4: i18n PT/EN + analytics + polish prod
- [ ] Conteúdo (copy final, fotos, cases reais)
- [ ] Compra de domínio
- [ ] Reunião com cliente sobre objetivo de marca/empresa (cliente pediu marcar)

---

## 12. Pendências / decisões pro cliente

1. **Reunião** pra discutir objetivo de marca/empresa em profundidade (cliente pediu).
2. **Confirmação** dos preços e escopos dos 3+3 planos.
3. ~~Accent color~~ → **DECIDIDO:** Branco puro (Paleta A).
4. **Listar** cases reais que ele tem (pessoais + profissionais) pra montar seção de trabalhos.
5. **Foto profissional** + bio curta dele pra seção "Quem está por trás".
6. ~~Frase âncora do hero~~ → **DECIDIDA:** "Tudo começa por uma linha reta." (sub: "Sites, estratégia e presença digital para marcas que valorizam precisão.")
7. **Vídeo de fundo do hero** — escolher um clip arquitetônico/geométrico (puxando metáfora prumo). NÃO genérico de "cidade tech". Drop em `web/public/hero.mp4` e setar `videoSrc="/hero.mp4"` em `web/app/page.tsx`.
8. **Calendly URL real** — atualmente CTA aponta pra `https://cal.com/` placeholder.
9. **Perfis de WhatsApp / Instagram / LinkedIn reais** — hrefs ainda são stubs.
10. **Mobile visual review** — checar em DevTools a 375 / 414 / 768px e ajustar se necessário.

---

## 13. Princípios não-negociáveis deste projeto

- **Honestidade no copy.** Solo é solo. Não fingir time, não inflar.
- **Dark cinematic com sobriedade.** Vídeo bg + liquid glass no hero. Resto do site mantém elegância, sem virar parque de diversões.
- **Caminho A (por objetivo).** Não introduzir nichos por setor sem nova conversa.
- **Brutalmente honesto + pragmático** no diálogo com o cliente. Sem floreios, sem agradar gratuito.
- **Stack Next.js, não Vite.** Mesmo se referências futuras vierem em Vite, mantemos Next.js pela combinação de SSR/SEO/i18n.

---

## 14. Especificação técnica do Hero (referência base, adaptar pro Prumo)

> Esta é a spec técnica do efeito visual desejado, adaptada pra estrutura/conteúdo do Prumo. Marca, copy, CTAs e estrutura permanecem do Prumo.

### Background Video
- `<video>` full-screen, `muted`, `autoPlay`, `loop`, `playsInline`, `object-cover`, posicionado `absolute inset-0`
- Container externo: `min-h-screen bg-black overflow-hidden`
- Vídeo deslocado verticalmente: `translate-y-[17%]` (ou ajustar conforme vídeo escolhido)
- **Vídeo a ser escolhido/produzido** — sugestão: imagens arquitetônicas, linhas, geometria precisa (puxando metáfora prumo). Evitar genéricos de "cidade tech".
- Sistema custom de fade em JS (não CSS):
  - 500ms requestAnimationFrame fade-in no load/loop start
  - 500ms fade-out quando faltam 0.55s pro fim
  - Flag `fadingOutRef` previne re-trigger de fade-out
  - No `ended`: opacidade → 0, após 100ms reseta `currentTime = 0`, dá play, fade-in
  - Cada novo fade cancela o frame anterior pra não competir

### Liquid Glass (.liquid-glass)
```css
background: rgba(255, 255, 255, 0.01);
background-blend-mode: luminosity;
backdrop-filter: blur(4px);
-webkit-backdrop-filter: blur(4px);
border: none;
box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
position: relative;
overflow: hidden;
```
Pseudo `::before` cria borda gradient (1.4px) com mask trick `xor/exclude` pra renderizar só borda.

### Tipografia Hero
- `@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap')`
- Heading: `font-family: 'Instrument Serif', serif` (inline ou via Tailwind config)
- Tamanho: `text-5xl md:text-6xl lg:text-7xl` (ajustável)

### Estrutura do Hero (versão Prumo, ADAPTADA)
- **Navbar** (rounded-full max-w-5xl, liquid-glass): logo "Prumo" + nav (Trabalhos, Planos, Sobre, Contato) + CTA principal "Agendar conversa" em liquid-glass rounded-full
- **Conteúdo central:**
  - Heading display: frase âncora do Prumo (a definir entre 3 opções)
  - Sub-heading: tagline curta "Sites, estratégia e presença digital."
  - CTAs duplos: primário (liquid glass "Agendar conversa") + secundário ("Ver trabalhos")
  - **NÃO** colocar email signup — não somos newsletter
- **Footer do hero (canto inferior):** ícones sociais (Instagram, LinkedIn, WhatsApp) em liquid-glass circular

### Stack técnico
- **Next.js 15 (App Router)** + TypeScript + Tailwind CSS 3
- `lucide-react` para ícones
- **NÃO** usar Vite (mesmo a referência tendo Vite — Next entrega o mesmo visual com SSR/SEO/i18n nativos)
