# Home para o indicado — reforma de conversão

> Design doc. Brainstormed 2026-08-31.
> Branch: `feat/home-indicado`, criada a partir de `feat/marca-2026-duas-vozes` (`05e6c65`), ainda não mergeada no `main`.
> Source: `web/app/page.tsx`, `web/lib/projects.ts`, `web/lib/contact-config.ts`, `web/components/cta/final-cta.tsx`, `web/components/hero/hero-video.tsx`, `web/components/ambient/ambient-video.tsx`, `web/app/trabalhos/[slug]/page.tsx`.

## Contexto — por que esta reforma existe

Dois fatos levantados em 2026-08-31, e é deles que tudo decorre:

1. **O site está no ar desde 2026-07-03 e não gerou um único contato.**
2. **100% dos clientes históricos (Hold, To Do Green, e os projetos próprios) vieram de indicação ou rede pessoal.** Nenhum veio de canal.

A conclusão é que o prumoestudio.com.br **não é canal de aquisição — é peça de fechamento.** O cenário real de uso não é "alguém pesquisa no Google e acha a Prumo". É: *alguém indica o Breq, manda o link no WhatsApp, e a pessoa abre no celular, no 4G, e decide em ~30 segundos se vale chamar.*

A home hoje foi desenhada para o cenário oposto — tráfego frio, SEO, funil próprio. Esta reforma realinha o site ao canal que já funciona.

Ironia registrada porque é instrutiva: o case da Hold em `web/lib/projects.ts` descreve o briefing dela como *"um site que confirmasse credibilidade pra quem já chega indicado"*. O diagnóstico foi aplicado ao cliente e não a si mesmo.

## Goal

Realinhar a home ao visitante indicado: **prova antes de preço**, WhatsApp como caminho primário, peso de página compatível com 4G, e remoção do texto de rascunho que hoje está em produção.

## Non-goals

- i18n PT/EN (segue não existindo; sem demanda EN).
- Asaas fase 2 — bloqueado no fiscal, fora do controle desta branch.
- Reescrever `/planos`. O Palco (ADR 0002) permanece intacto.
- Mexer em preços. O ADR 0003 segue valendo integralmente.
- SEO novo. As fases A e B ficam como estão.
- Produzir vídeo ou fotografia nova (a linguagem P&B do manual 2026 é sessão separada).
- Tocar no `main` ou disparar deploy. Merge é decisão do dono, depois de revisão visual.

## Decisões

### D1 — Ordem da home: prova antes de preço

De `Hero → PlanosTeaser → FinalCta → FAQ → Footer` para:

| # | Seção | Mudança |
|---|---|---|
| 1 | Hero | Aliviado: fundo estático no celular, vídeo só no desktop |
| 2 | **Prova — 4 cases** | **Entra** |
| 3 | **Serviços em resumo** | **Entra** — três linhas, link para `/servicos` |
| 4 | PlanosTeaser | Desce da 2ª para a 4ª posição |
| 5 | FAQ | Inalterado |
| 6 | FinalCta | Ganha WhatsApp como ação primária |
| 7 | Footer | Inalterado |

Racional: o indicado precisa responder três perguntas nesta ordem — *isso é sério* → *já fez coisa boa* → *falar com ele é fácil*. Preço não está entre as três. Hoje é a segunda coisa que ele vê, antes de qualquer prova, o que transforma a tabela num filtro aplicado cedo demais.

### D2 — Quatro cases na home, portfólio pessoal fora

Entram: **Hold Corretora**, **To Do Green**, **Desafog.ai**, **BeReading**.

Fica fora: **Software Engineer Portfolio** (`slug: breq-dev`). É o portfólio pessoal da marca *Breq*, voltado a recrutador, dentro do site do estúdio *Prumo* — mistura duas marcas e fala com o público errado.

O case continua existindo em `/trabalhos` nesta reforma. Removê-lo também de lá é recomendação registrada, não implementada aqui — é decisão de portfólio, não de conversão.

A seleção da home é explícita, não derivada de `projects.slice(0, 4)`, para que a ordem de `/trabalhos` possa mudar sem alterar a home por acidente.

### D3 — `outcome` vira opcional, e o placeholder sai de produção

Hoje `web/app/trabalhos/[slug]/page.tsx:113` renderiza `<Block title="Resultado" body={project.outcome} />` incondicionalmente. Quatro dos cinco cases contêm um colchete de anotação interna, e ele está **visível em produção agora** — confirmado ao vivo em `prumoestudio.com.br/trabalhos/hold-corretora`.

Três mudanças:

1. `outcome` passa a `outcome?: string` em `Project`.
2. O bloco "Resultado" só renderiza quando há conteúdo. O problema deixa de poder voltar por esquecimento.
3. Onde há substância real (Hold, To Do Green), texto honesto sobre o que existe: entregue, no ar, em uso. **Nenhum número inventado.** Onde não há resultado real (Desafog, BeReading, breq-dev), o campo fica ausente e o bloco some.

Os textos novos são propostos nesta branch e dependem de aprovação do dono antes do merge — é copy sobre clientes reais.

### D4 — CTA final com dois caminhos

`FinalCta` hoje oferece um botão único: *"Agendar conversa" → `/contato`*. A copy promete calendário e entrega formulário.

Passa a oferecer:
- **Primário:** WhatsApp, com mensagem pré-preenchida.
- **Secundário, discreto:** *"prefiro escrever"* → `/contato`. O formulário e o fluxo Resend permanecem intactos.

A mensagem pré-preenchida é padronizada numa constante única em `web/lib/contact-config.ts`. Hoje ela varia por lugar: vazia em `hero-social.tsx`, `"Oi! Vim do site da Prumo."` em `quem-assina.tsx`, outra em `contato-channels.tsx`.

O botão de WhatsApp recebe `data-umami-event` próprio. Sem isso, mover o CTA principal para fora do formulário significaria perder a única medição de conversão que existe.

### D5 — Peso: poster, carregamento sob demanda e recompressão

Medido no repo:

| Rota | Vídeo baixado | Detalhe |
|---|---|---|
| Home | ≈ 27,5 MB | `hero` 6,2 + `hero-2` 4,3 + `hero-3` 5,7 + `ambient` 3,1 + `ambient-2` 8,2 |
| `/planos` | ≈ 22 MB | `planos-1.mp4` sozinho tem **19 MB** |
| `/contato` | ≈ 4,3 MB | `contato.mp4` |

Causas no código: `preload="auto"` em `hero-video.tsx:37` e `ambient-video.tsx:66`, e **zero ocorrências de `poster=`** no projeto inteiro. O `prefers-reduced-motion` está correto e não é o problema.

Tratamento, em três itens com dependências diferentes:

1. **`preload="none"` e vídeo suprimido em viewport pequeno.** Abaixo de `md` (768px, breakpoint padrão do Tailwind já usado no projeto) o vídeo não é montado: o fundo é a camada estática que já existe sob ele — preto `#111111` e os efeitos CSS do próprio site, `aurora-black` inclusive. Nenhum asset novo, nenhuma ferramenta externa. **É o item que resolve o cenário do indicado**, e vai primeiro.
2. **`poster` em todo `<video>`,** para o desktop não abrir em preto liso enquanto o arquivo chega. Um poster precisa ser um arquivo de imagem extraído do clipe — o que **também exige ffmpeg**, ou captura manual quadro a quadro. Depende da mesma autorização do item 3.
3. **Recompressão dos oito arquivos.** Um fundo abstrato em loop não precisa de 19 MB.

`ffmpeg` **não está instalado nesta máquina** (`command -v ffmpeg` → vazio). Os itens 2 e 3 dependem dele; o item 1 não. A instalação será pedida ao dono, nunca executada por conta própria.

## Arquitetura

**Novos arquivos**
- `web/components/home/prova.tsx` — a faixa de 4 cases. Recebe a lista pronta; não busca dados por conta própria.
- `web/components/home/servicos-resumo.tsx` — três linhas + link para `/servicos`.
- `web/lib/home-content.ts` — a seleção explícita dos 4 slugs da home, isolada de `projects.ts`.

**Arquivos alterados**
- `web/app/page.tsx` — nova ordem.
- `web/lib/projects.ts` — `outcome` opcional; textos de resultado; remoção dos colchetes.
- `web/app/trabalhos/[slug]/page.tsx` — bloco "Resultado" condicional.
- `web/components/cta/final-cta.tsx` — dois caminhos, evento umami.
- `web/lib/contact-config.ts` — constante de mensagem padrão.
- `web/components/hero/hero-video.tsx` e `web/components/ambient/ambient-video.tsx` — poster e `preload`.
- `web/public/*.mp4` — recomprimidos na fase 4.

A `Prova` recebe dados prontos e não conhece `projects.ts` — dá para testá-la com quatro objetos falsos, sem carregar o catálogo real.

## Testes

Vitest, seguindo os ~45 arquivos existentes. TDD: teste antes da implementação.

1. **Guard permanente contra rascunho** — nenhum campo renderizável de `projects.ts` contém `[Substituir` ou `STUB`. Esse teste sozinho impede a classe inteira de bug de voltar.
2. `outcome` ausente ⇒ o bloco "Resultado" não é renderizado.
3. A home renderiza as seções na ordem de D1.
4. A `Prova` mostra os 4 cases escolhidos e **não** mostra `breq-dev`.
5. `FinalCta` expõe um link `wa.me` com mensagem pré-preenchida e um link para `/contato`.
6. Nenhum `<video>` usa `preload="auto"`, e abaixo de `md` o elemento de vídeo não é montado. O teste de `poster` entra junto com a fase 4.

**Barra de qualidade.** Medir o baseline **antes** de tocar em qualquer arquivo — aprendizado da sessão 2026-08-24. O baseline conhecido da branch base é lint 0 erros / 8 warnings, build OK, **237/248** com 11 falhas da cicatriz `[test-env]` (happy-dom/IntersectionObserver). Ao fim, o número de falhas não pode subir.

## Riscos

- **A branch carrega duas decisões.** Herda a marca 2026 não aprovada. Se o dono rejeitar a marca, a reforma vem junto — mitigado por `05e6c65` estar isolado e ser revertível.
- **Recompressão pode descaracterizar.** O ADR 0002 desenhou o motion do Palco de propósito. A comparação visual antes/depois é obrigatória; qualidade perdida é motivo para refazer o encode, não para aceitar.
- **A prova depende de imagens que ninguém revisou em 375px.** Os PNGs de `public/Hold`, `public/ToDo`, `public/Desafog` e `public/bereading` nunca foram vistos em tela pequena.
- **Esta reforma não traz visitante.** Ela conserta o que acontece quando alguém chega. Sem trabalho de indicação ativa, o silêncio continua — mais bonito e mais leve.

## Ordem de execução

0. **Placeholder fora de produção** (D3) — item urgente, independente do resto.
1. Peso no celular: `preload="none"` + vídeo suprimido abaixo de `md` (D5, item 1). Sem dependência externa.
2. Home: `Prova`, `ServicosResumo`, nova ordem (D1, D2).
3. CTA duplo e mensagem padronizada (D4).
4. Poster e recompressão (D5, itens 2 e 3) — **bloqueado até o dono autorizar a instalação do ffmpeg**.
5. QA mobile 375/414/768 com a branch rodando.

As fases 0 a 3 entregam a reforma inteira sem depender de nada externo. A fase 4 é melhoria de desktop e de tamanho de repo, e pode esperar.

## Pendências do dono

- Revisão visual da marca 2026, ainda não feita. Vale para as duas decisões acumuladas na branch.
- Aprovar os textos de "Resultado" de Hold e To Do Green antes do merge.
- Autorizar (ou não) a instalação do ffmpeg.
- **E-mail público é `guilherme@breq.com.br`.** O estúdio Prumo, no domínio `prumoestudio.com.br`, responde de outro domínio. Correção é operacional, fora desta branch.
- O `overview.md` da Wiki promete um botão flutuante de WhatsApp que **não existe no código**, e lista preços antigos, divergentes do ADR 0003 e do que está no ar.
