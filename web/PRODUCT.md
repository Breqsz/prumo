# PRODUCT.md — Prumo

> Sourced from `../CONTEXT.md` (the canonical project doc). Update there first, then re-derive here.

## Register

**brand** — this is a studio's own marketing site. The design IS the product. Identity-driven, not utility-driven. Treat surfaces (hero, planos, sobre) as expressive, not as admin chrome.

## Users

- **Founders and decision-makers** (CEO, CMO, dono de empresa) procurando um estúdio para construir site + presença digital com cuidado real, não agência inflada.
- Perfis premium: valorizam precisão, sobriedade, honestidade. Detectam template e fogem.
- Vêm por indicação, por busca direta, ou por LinkedIn/Instagram. Já estão num momento de querer profissionalizar a marca.
- Não são techies. São donos de negócio. O site precisa comunicar competência sem jargão.

## Product purpose

Prumo é um **estúdio digital solo** que vende sites, estratégia e presença digital. O dono executa pessoalmente; pode trazer freelas pontuais.

O site existe para:
1. **Filtrar e qualificar** prospects — quem chega ao Calendly já está alinhado com o tom premium.
2. **Comunicar posicionamento por OBJETIVO do cliente** ("vender mais / profissionalizar / lançar"), não por setor.
3. **Mostrar trabalhos** sem inflar (cases reais, mesmo que poucos).
4. **Apresentar planos transparentes** (3 one-time + 3 recorrentes + custom) com preços visíveis — ato político contra o "fale com vendas".
5. **Honrar a operação solo**: o dono aparece (nome, foto, bio). Honestidade > teatro de agência.

## Brand personality

Cinco palavras-âncora, com efeitos visuais derivados:

- **Preciso** — alinhamento rigoroso, sem ornamento gratuito, espaços que respiram com intenção.
- **Sóbrio** — paleta restringida ao branco-sobre-preto. Hierarquia por opacidade, tamanho e peso, nunca por cor.
- **Cinematográfico** — vídeo em loop no hero, motion controlado, profundidade via liquid glass. Premium-feel sem ser ostentatório.
- **Editorial** — tipografia serifa display (Instrument Serif) carrega a voz; Inter para corpo. Frase curta vale mais que parágrafo.
- **Honesto** — copy direto, sem jargão de agência, sem "transformamos sonhos". Tom Linear/Vercel/Cyberflow.

Tradução em código: dark cinematic com vídeo bg no hero, liquid glass como vocabulário de UI assinatura (CTAs, navbar, cards de planos), Instrument Serif para display, hierarquia 100% monocromática.

## Anti-references

O que o Prumo **não pode parecer**, mesmo por acidente:

- **Agência inflada brasileira** — gradiente roxo-azul, "transformamos negócios", time stock photo, "+200 clientes felizes". Toda essa estética é veneno.
- **SaaS landing page cliché** — hero com mockup de dashboard à direita, três cards de feature idênticos com ícone-+-título-+-texto, "Trusted by" com logos genéricos.
- **Crypto/AI bro neon** — fundo preto + neon roxo/verde + gradiente animado pulsando. Dark mode existe aqui por razão editorial, não por tribal signaling.
- **Webflow template marketplace** — cards arredondados idênticos, hero stack centralizado, "Get Started" gradient. Aparência de comprado pronto.
- **Glassmorphism gratuito** — liquid glass aqui é específico (CTAs, navbar, cards de planos), não decoração espalhada. Glass em tudo = glass em nada.
- **Linhas verticais como muleta** — `PrumoLines` existe no código mas foi removido do hero porque competia com vídeo + título. Não reintroduzir como elemento padrão; uso pontual ok (uma linha lateral única como divisor).

A referência visual aprovada é o hero "Asme" (vídeo bg + liquid glass + Instrument Serif). Posicionamento, copy e arquitetura são do Prumo. **Não copiar o conteúdo da Asme — só o vocabulário visual.**

## Strategic principles

1. **Caminho A: posicionar por objetivo do cliente, não por setor.** Hero fala "vender mais / profissionalizar / lançar". Cliente recusou nichar; mitigamos com copy estratégico e estética que filtra perfil.
2. **Honestidade no copy.** Solo é solo. Não fingir time, não usar "nós" inflado, não inflar números.
3. **Dark cinematic com sobriedade.** Vídeo bg + liquid glass no hero. Resto do site mantém elegância sem virar parque de diversões.
4. **Preço visível.** Os 3+3 planos aparecem com valores. Custom é "sob demanda" com mínimo sugerido. Ato político contra opacidade de agências.
5. **Stack Next.js, não Vite.** Mesmo se referências futuras vierem em Vite, mantemos Next.js pela combinação SSR/SEO/i18n.
6. **CTAs: Calendly principal + WhatsApp flutuante secundário + formulário em /contato como fallback.**

## Tone of voice

- Técnico e sóbrio (linha Linear, Vercel, Cyberflow).
- Frases curtas, vocabulário preciso.
- Zero gracinha de agência, zero emoji decorativo, zero "vamos juntos transformar".
- Português BR principal, EN como toggle. Tradução EN mantém mesma sobriedade — não traduzir literalmente; reescrever no registro.
- **Sem em dashes.** Vírgula, dois-pontos, ponto.

## Surfaces (sections of the site)

Em `/` (one-page longa):

1. **Hero** — vídeo bg + Instrument Serif "Tudo começa por uma linha reta." + sub "Sites, estratégia e presença digital para marcas que valorizam precisão." + CTA glass "Agendar conversa" + CTA secundário "Ver trabalhos" + nav glass rounded-full topo + sociais glass canto inferior.
2. **Prova rápida** — logos / contagem / trabalhos em destaque.
3. **O que resolvemos** — 3 blocos: Vender mais / Profissionalizar / Lançar. **Não devem ser 3 cards idênticos** com ícone+título+texto; resolver com tipografia editorial e composição assimétrica.
4. **Como o Prumo trabalha** — processo em 4 passos (Alinhamento → Desenho → Construção → Lançamento). Numerado, editorial.
5. **Trabalhos selecionados** — 3-4 cases em grid. Imagem + nome + uma linha de contexto.
6. **Planos** — resumo 3 one-time + 3 recorrentes + custom. CTA pra `/planos`. Liquid glass em cards.
7. **Quem está por trás** — foto, nome, bio curta do dono. Sem teatro.
8. **FAQ** — objeções comuns. Tipografia editorial, sem accordion clichê se possível.
9. **CTA final + footer.**

Páginas internas: `/trabalhos`, `/trabalhos/[slug]`, `/planos`, `/sobre`, `/contato`. Blog é fase 2.
