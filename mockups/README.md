# Mockups — Decisão de paleta accent (Hero)

Três variações do hero com a mesma estrutura (vídeo bg placeholder + liquid glass + Instrument Serif + frase âncora "Tudo começa por uma linha reta.") mudando apenas o accent color.

## Como abrir

**Recomendado:** abra `index.html` — comparador lado a lado com as três paletas em iframes.

```
E:\Projetos\Prumo\mockups\index.html
```

Ou abra cada uma separadamente em tela cheia:
- `hero-branco.html` — Paleta A (branco puro)
- `hero-azul.html` — Paleta B (azul elétrico ~#7DA3D9)
- `hero-neutro.html` — Paleta C (neutro absoluto, zero cor)

> No Windows: clique duplo no arquivo, ou arraste pro Chrome/Firefox/Edge.

## O que olhar

- **Peso visual.** Qual respira melhor? Qual te chama atenção sem cansar?
- **Linhas verticais (metáfora prumo).** Em qual paleta elas ficam mais marcantes sem virar ruído?
- **CTA principal "Agendar conversa".** Em qual paleta o botão pede pra ser clicado?
- **Hierarquia.** Em qual paleta o olho viaja na ordem certa (frase âncora → tagline → CTA)?

## Limitações do mockup

- O **vídeo de fundo** é simulado com gradient escuro. No site real vai ser um vídeo arquitetônico/geométrico (a definir).
- A **animação de fade do vídeo** (requestAnimationFrame custom 500ms in / fade out a 0.55s do fim) **não está implementada** aqui — só na versão final em Next.js.
- O **liquid glass** está implementado com o CSS real (não é shortcut), então a percepção de blur e borda é fiel ao que será no produto.

## Próximo passo

Você decide a paleta. Eu atualizo o CONTEXT.md e invoco a skill `writing-plans` pra montar o plano técnico de implementação do site completo.
