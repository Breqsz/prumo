# Prumo — Roadmap sequenciado

> Data: 2026-05-28
> Sequenciado por **leverage de receita** (o que destrava cliente primeiro), não por esforço de implementação.
> Funil: ser achado → gerar confiança → converter no CTA → fechar na conversa → cobrar → reter.

## Estado atual (2026-05-28)

- Páginas no ar (localhost / preview): `/`, `/planos`, `/trabalhos` + `/trabalhos/[slug]`, `/sobre`, `/contato` (form de briefing via Resend).
- Todos os CTAs apontam pra `/contato`.
- **Cases são REAIS** (não placeholders) — credibilidade de portfólio OK.
- SEO: apenas `title`/`description` global em `layout.tsx`. Sem metadata por página, OG images, `metadataBase`, sitemap, robots, structured data ou canonical.
- Analytics: nenhum pacote instalado.
- Stack: Next.js 16.2.6 (App Router, breaking changes vs. versões antigas — ler `node_modules/next/dist/docs/` antes de codar) + React 19 + Tailwind v4 + TS strict + Vitest.

## Tiers

### Tier 0 — Estar no ar (blocker)
- **Domínio + deploy de produção.** Sem isso não há indexação nem link real pra compartilhar. Passo 1 absoluto.
- Débito: 12 testes brittle pré-existentes — não bloqueia receita, conserto oportunista.

### Tier 1 — Credibilidade
- Cases reais — **JÁ OK** (cases no site são reais).
- Foto + bio reais em `/sobre` — verificar se ainda há placeholder.
- Sinais de confiança: depoimentos (se houver), garantia/processo explícito.

### Tier 2 — Ser achado (discovery) — **EM DESENHO**
- Analytics + tracking de conversão (Vercel Analytics + eventos nos CTAs). Vem antes de qualquer otimização.
- SEO técnico: metadata por página, `metadataBase`, OG images, sitemap, robots, structured data (Service/LocalBusiness schema), canonical.
- Conteúdo `/notas` (blog MDX) — autoridade + orgânico. Esforço contínuo.

### Tier 3 — Reduzir atrito de conversão
- Decisão agendamento: Cal.com real como alternativa ao form, ou form-only?
- Lead handling: persistir leads (hoje só dispara email via Resend), auto-reply, qualificação.
- Mobile/perf polish (review mobile pendente).

### Tier 4 — Cobrança (downstream)
Gateway escolhido: **Mercado Pago** (nativo BR, Pix + parcelado + assinatura). Híbrido por tier:
- **Landing**: Checkout Pro one-time — self-service de **sinal/reserva** (ex. 30%), não o projeto inteiro. Dispara briefing.
- **Branded / custom**: link de pagamento gerado por negócio fechado (sinal + saldo), enviado no WhatsApp. Sem checkout público.
- **Mensais**: Assinaturas (Preapproval) — só pra cliente com site já entregue (manutenção como produto avulso).

### Tier 5 — Pós-venda / escala (prematuro pra solo agora)
- Portal do cliente (status de projeto, faturas, pedidos de alteração) — amarra com planos mensais.
- i18n PT/EN — só se mirar internacional.

## Sequência recomendada

Tier 0 (ir pro ar) → Tier 1 (verificar bio) → **Tier 2 (analytics + SEO)** → Tier 3 → Tier 4 (pagamento) → Tier 5.

Pagamento é legítimo mas downstream: cobrança importa quando o negócio já está fechando, e estúdio solo fecha na conversa de qualquer jeito. Construir checkout antes de tráfego + prova é polir o cockpit antes do avião ter motor.

## Decisão atual
Primeiro sub-projeto a desenhar: **Tier 2 — analytics + SEO** (executável sem depender de conteúdo novo do dono).
