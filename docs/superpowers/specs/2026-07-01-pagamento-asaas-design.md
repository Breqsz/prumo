# Design — Pagamento + Nota Fiscal via Asaas

> **Data:** 2026-07-01 · **Status:** aprovado (brainstorming) · **Projeto:** Prumo
> **Substitui:** intenção inicial de "trocar Stripe por AbacatePay" — ver seção 1.

---

## 1. Contexto e decisão

A pergunta original era "substituir o Stripe pelo AbacatePay". Investigação revelou dois fatos que redirecionaram a decisão:

1. **Não existe Stripe no Prumo.** O site é uma landing de marca sem backend de pagamento: só um Server Action (`app/contato/actions.ts`) que dispara email via Resend. Não há banco, auth nem contas de usuário. Logo, não é uma *troca* — é **adicionar pagamento online onde não havia**.
2. **A restrição real é fiscal.** O dono é **Simples Nacional (ME)** e precisa **emitir NFS-e** (nota de serviço) por CNPJ. NFS-e Nacional passa a ser obrigatória pro Simples em **01/09/2026**. Nem o Stripe nem o AbacatePay emitem nota fiscal — seria um subsistema à parte (API de NF + webhook) a construir e manter.

**Decisão: usar o Asaas**, que junta **pagamento + emissão automática de NFS-e** no mesmo sistema. Elimina a integração de nota separada que qualquer gateway "puro" exigiria. Trade-off aceito: abre-se mão do AbacatePay (PIX marginalmente mais barato) em troca do problema fiscal resolvido nativo.

Custos Asaas (referência 2026-07-01): conta PJ sem mensalidade; PIX R$1,99/transação recebida (R$0,99 nos 3 primeiros meses, 30 grátis/mês); boleto R$1,99; cartão 2,99% + R$0,49; **NFS-e R$0,49/nota**. Para os tickets do Prumo (R$350–18.000), taxa flat de PIX é ruído (~0,05%); **cartão evitado em ticket alto** (2,99% pesa).

---

## 2. Escopo

**No escopo:**
- Cobrança recorrente dos 3 planos mensais (Manutenção, Crescimento, Parceria) via **assinatura Asaas** com NFS-e automática por ciclo.
- Cobrança dos projetos one-time (Landing, Institucional, Branded) via **links de pagamento por milestone 50/50**, com NF por cobrança.
- Emissão automática de NFS-e em ambos.

**Fora do escopo (agora):**
- Checkout self-serve público em projetos custom (contraria o funil consultivo — briefing obrigatório antes de cobrar).
- Preço público de projetos Custom (segue sem preço, orçamento sob demanda).
- Persistência de estado de pagamento no site (sem banco hoje — ver seção 6, decisão adiada).
- i18n do fluxo de pagamento.

---

## 3. Faseamento

### Fase 1 — Zero-código (agora)
Asaas configurado **no painel**. O **site não muda** — CTAs seguem "Agendar conversa". O pagamento entra **depois da conversa**: o dono gera link/assinatura no painel e envia por WhatsApp/email. NFS-e automática.

Racional: respeita o funil consultivo, coloca o negócio faturando com nota em dias, e valida o fluxo real antes de investir em código.

### Fase 2 — Integração no site (depois)
Checkout nativo no Prumo via API Asaas + webhook. Só quando a Fase 1 estiver rodando e o volume justificar. Design de alto nível na seção 5; plano de implementação detalhado só quando for executar.

---

## 4. Fase 1 — especificação

### 4.1 Setup fiscal (bloqueador — resolver com contador, uma vez)
Pré-requisito para qualquer NFS-e automática. Necessário no Asaas:
- **Inscrição municipal** ativa.
- **Código de serviço do município** + **descrição do serviço** + **alíquota de ISS**.
- Nos termos da API: `municipalServiceId`, `municipalServiceCode`, `municipalServiceName`.

Sem isso, nenhuma nota é emitida. É setup único; depois toda cobrança/assinatura emite sozinha.

### 4.2 Mapa dos planos → estruturas Asaas

| Plano | Preço | Estrutura Asaas | Nota fiscal |
|---|---|---|---|
| Manutenção | R$ 350/mês | Assinatura mensal | NFS-e automática por ciclo |
| Crescimento | R$ 1.350/mês | Assinatura mensal | NFS-e automática por ciclo |
| Parceria | R$ 3.000/mês (contrato 6 meses) | Assinatura mensal | NFS-e automática por ciclo |
| Landing | R$ 3.750 | 2 links: sinal 50% + saldo 50% | NF por cobrança |
| Institucional | R$ 8.500 | 2 links: sinal 50% + saldo 50% | NF por cobrança |
| Branded | a partir de R$ 18.000 | Orçamento → links sob medida (50/50) | NF por cobrança |
| Custom | sem preço público | Briefing → orçamento → link manual | NF por cobrança |

O **milestone 50/50** (`CONTEXT.md` §4): 1º link = sinal, dispara o projeto; na aprovação do preview, 2º link = saldo. Nunca cobrança integral antecipada.

### 4.3 Fluxo operacional
1. Cliente agenda conversa pelo site (fluxo atual, inalterado) → briefing.
2. Fechado → dono cria no painel Asaas: **assinatura** (mensal) ou **link de sinal** (projeto).
3. Link enviado por WhatsApp/email → cliente paga **PIX** (preferencial).
4. Asaas emite **NFS-e automática** e notifica o pagamento.
5. Projeto: na aprovação do preview, cria/envia o 2º link (saldo).

### 4.4 Impacto no site
**Nenhuma mudança de código na Fase 1.** Os CTAs de plano (`components/planos/stage-plan-card.tsx` e demais) continuam apontando para `/contato`.

### 4.5 Critérios de "pronto" — Fase 1
- [ ] Conta Asaas PJ criada e verificada.
- [ ] Setup fiscal concluído (inscrição municipal + código de serviço + ISS) e uma NFS-e de teste emitida com sucesso.
- [ ] 3 assinaturas recorrentes criadas (valores conforme tabela) com NFS-e automática ligada.
- [ ] Modelo de link de sinal 50% validado com uma cobrança real (ou sandbox).
- [ ] Fluxo operacional documentado para o dono (passo a passo do painel).

---

## 5. Fase 2 — integração no site (design alto nível)

Objetivo: checkout nativo no Prumo, sem sair para o painel.

- **Webhook:** `app/api/webhooks/asaas/route.ts` — recebe eventos de pagamento (ex.: cobrança confirmada), valida a origem/segurança do request antes de agir.
- **Criação de cobrança:** Server Action (padrão do `contato/actions.ts`) chamando a API Asaas para criar cliente → cobrança/assinatura → retornar link/checkout.
- **Segredos:** `ASAAS_API_KEY` no server; **nunca** `NEXT_PUBLIC_`. Token de webhook idem. (Segue o standard `devops/git-and-secrets.md` da Wiki.)
- **Coleta de dados fiscais:** para NFS-e é preciso CPF/CNPJ + endereço do pagador — a fase 2 precisa capturar isso no fluxo (ou confiar no cadastro que o cliente preenche no checkout hospedado do Asaas).

### 5.1 Decisão adiada — onde guardar estado
O site **não tem banco**. Na Fase 2, escolher:
- **Email-only:** webhook confirma pagamento e dispara email via Resend, sem persistir. Mais simples; sem histórico consultável no site.
- **Introduzir Supabase:** guardar `customer_id`, `subscription_id`, status. Mais robusto; adiciona um subsistema.

Recomendação preliminar: começar **email-only** e só introduzir Supabase se surgir necessidade real de painel/histórico. Decisão formal quando a Fase 2 for planejada.

---

## 6. Riscos e considerações

- **Setup fiscal é o gargalo real**, não o código. Depende do contador e da prefeitura. Sem ele, a NF não sai — é o primeiro item do caminho crítico da Fase 1.
- **Teto de faturamento:** ticket de R$3.750–18.000 acumula rápido; validar enquadramento ME/Simples com o contador conforme o volume cresce.
- **Cartão em ticket alto:** 2,99% + R$0,49 pesa (ex.: ~R$112 em R$3.750). Direcionar projetos para **PIX**; oferecer cartão só sob pedido.
- **Dependência de fornecedor:** Asaas concentra pagamento + nota. Aceitável pelo ganho operacional; a lógica de negócio (planos em `lib/plans.ts`) permanece no código, então migrar de gateway no futuro não reescreve o produto.
- **Reforma Tributária / NFS-e Nacional (09/2026):** confirmar com contador que o setup do Asaas está aderente ao Emissor Nacional.

---

## 7. Próximo passo
Plano de implementação detalhado da **Fase 1** (checklist operacional do painel Asaas + coordenação fiscal), via skill `writing-plans`. A Fase 2 ganha plano próprio quando for executada.

## 8. Referências
- `CONTEXT.md` §4 (ofertas, milestone 50/50) e §7 (conversão).
- `web/lib/plans.ts` (dados canônicos dos planos).
- Asaas — preços: https://www.asaas.com/precos-e-taxas · nota fiscal: https://www.asaas.com/nota-fiscal · docs NFS-e: https://docs.asaas.com/docs/emitindo-notas-fiscais-de-servico
- NFS-e Nacional / Simples (obrigatoriedade 09/2026): https://www.gov.br/nfse/pt-br/noticias/nfs-e-e-simples-nacional-obrigatoriedade-de-emissao-atraves-do-emissor-nacional
