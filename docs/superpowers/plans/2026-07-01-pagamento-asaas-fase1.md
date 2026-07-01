# Pagamento via Asaas — Fase 1 (zero-código) — Plano de Implementação

> **Natureza deste plano:** operacional, não de código. A Fase 1 é executada **no painel do Asaas** pelo dono + contador. Não há build/test de software. Cada tarefa termina num **entregável verificável** (conta aprovada, nota autorizada, cobrança de teste paga). O único artefato de repositório é o runbook da Tarefa 5, que o Claude cria e commita.
>
> **Spec de origem:** `docs/superpowers/specs/2026-07-01-pagamento-asaas-design.md`

**Goal:** Deixar o Prumo faturando os 6 planos com **NFS-e automática** via Asaas, sem tocar no código do site.

**Arquitetura:** Assinatura Asaas para os 3 planos mensais; link de pagamento por milestone 50/50 para os 3 projetos one-time; NFS-e automática em ambos. Site inalterado — cobrança entra após a conversa consultiva.

**Ferramentas:** Painel Asaas (produção + sandbox), Emissor Nacional/prefeitura, contador.

## Global Constraints (valem para todas as tarefas)

- **Regime:** Simples Nacional (ME). Confirmar enquadramento com o contador conforme o faturamento sobe.
- **Preços (fonte: `web/lib/plans.ts`, verbatim):** Manutenção R$ 350/mês · Crescimento R$ 1.350/mês · Parceria R$ 3.000/mês (contrato 6 meses) · Landing R$ 3.750 · Institucional R$ 8.500 · Branded a partir de R$ 18.000.
- **Milestone one-time:** 50% sinal (dispara o projeto) + 50% saldo (na aprovação do preview). Nunca cobrança integral antecipada.
- **Método preferencial:** PIX. Cartão só sob pedido do cliente (2,99% + R$0,49 pesa em ticket alto).
- **Site:** nenhuma mudança de código nesta fase. CTAs seguem "Agendar conversa" → `/contato`.
- **Segurança:** nenhuma chave de API do Asaas commitada no repo. Fase 1 não usa API; se gerar chave para teste, guardar fora do git.

---

### Tarefa 1: Abrir e aprovar a conta Asaas PJ

**Responsável:** dono
**Depende de:** CNPJ ativo.

- [ ] **Passo 1:** Criar conta PJ no Asaas com o CNPJ do Prumo (https://www.asaas.com/).
- [ ] **Passo 2:** Enviar documentação de verificação (CNPJ, dados bancários da conta que recebe os repasses).
- [ ] **Passo 3:** Configurar a **chave PIX de recebimento / conta de saque** para onde o dinheiro é liberado.
- [ ] **Passo 4 (verificação):** Conta aprovada e painel de produção acessível. Sandbox (`sandbox.asaas.com`) também acessível para testes sem transação real.

**Entregável:** conta Asaas PJ ativa e aprovada.

---

### Tarefa 2: Setup fiscal — habilitar emissão de NFS-e

**Responsável:** dono + **contador** (caminho crítico — sem isto nada emite nota).
**Depende de:** Tarefa 1.

- [ ] **Passo 1:** Com o contador, reunir: **inscrição municipal** ativa, **código de serviço do município** (item da lista de serviços da prefeitura), **descrição do serviço** e **alíquota de ISS** aplicável.
- [ ] **Passo 2:** Confirmar com o contador que o CNPJ está apto ao **Emissor Nacional NFS-e** (obrigatório para o Simples a partir de 01/09/2026).
- [ ] **Passo 3:** No painel Asaas, na configuração fiscal/notas, cadastrar o serviço com os dados do Passo 1 (equivalem aos campos `municipalServiceId`, `municipalServiceCode`, `municipalServiceName` da API).
- [ ] **Passo 4:** Conectar a integração da prefeitura no Asaas (certificado digital / credenciais do município, conforme exigência local).
- [ ] **Passo 5 (verificação):** Emitir **uma NFS-e avulsa de teste** (valor pequeno, cliente de teste) e confirmar que ela é **autorizada pela prefeitura** (status "autorizada", com número e link do PDF). Se a prefeitura exigir homologação, concluir esse trâmite antes de seguir.

**Entregável:** NFS-e de teste autorizada — a emissão automática das próximas tarefas passa a funcionar.

---

### Tarefa 3: Cadastrar os 3 planos mensais como assinaturas com NF automática

**Responsável:** dono
**Depende de:** Tarefa 2.

- [ ] **Passo 1:** No **sandbox**, criar um cliente de teste (com CPF/CNPJ + endereço — exigidos para a nota).
- [ ] **Passo 2:** Criar uma **assinatura** de teste para esse cliente com ciclo **mensal** e valor de um dos planos (ex.: Manutenção R$ 350).
- [ ] **Passo 3:** Na seção de assinaturas, **ligar a emissão automática de NFS-e por ciclo**, vinculando ao serviço fiscal cadastrado na Tarefa 2.
- [ ] **Passo 4 (verificação sandbox):** Simular o pagamento da primeira cobrança e confirmar que **a cobrança é marcada como paga E a NFS-e é gerada automaticamente**.
- [ ] **Passo 5:** Repetir o modelo de configuração para os três valores reais em produção quando houver cliente: **Manutenção R$ 350**, **Crescimento R$ 1.350**, **Parceria R$ 3.000** (para Parceria, registrar o contrato de 6 meses — ciclo mensal, compromisso de 6 cobranças).
- [ ] **Passo 6 (verificação):** Um print/checklist confirmando que os três valores e a NF automática estão prontos para uso.

**Entregável:** modelo de assinatura mensal com NFS-e automática validado, pronto para aplicar a clientes reais em ~2 min.

---

### Tarefa 4: Definir o modelo de link de sinal 50% para projetos one-time

**Responsável:** dono
**Depende de:** Tarefa 2.

- [ ] **Passo 1:** No sandbox, criar um **link de pagamento** avulso com valor de sinal = 50% de um projeto: **Landing → R$ 1.875**, **Institucional → R$ 4.250**, **Branded → a partir de R$ 9.000** (sob medida).
- [ ] **Passo 2:** Configurar o link para **PIX** e ativar a **emissão de NFS-e na cobrança**, vinculada ao serviço fiscal da Tarefa 2.
- [ ] **Passo 3 (verificação sandbox):** Pagar o link de teste e confirmar **pagamento recebido + NFS-e emitida**.
- [ ] **Passo 4:** Documentar os valores de sinal (50%) e de saldo (50%) de cada plano one-time para não recalcular na hora:
  - Landing R$ 3.750 → sinal R$ 1.875 / saldo R$ 1.875
  - Institucional R$ 8.500 → sinal R$ 4.250 / saldo R$ 4.250
  - Branded (≥ R$ 18.000) → sinal ≥ R$ 9.000 / saldo ≥ R$ 9.000 (por orçamento)
- [ ] **Passo 5 (verificação):** Modelo de link de sinal testado e valores documentados.

**Entregável:** modelo de link de sinal 50% (com NF) pronto para gerar por projeto.

---

### Tarefa 5: Runbook operacional (artefato de repositório — Claude cria)

**Responsável:** Claude cria o doc; dono usa no dia a dia.
**Depende de:** Tarefas 3 e 4 (para refletir a config real).

- [ ] **Passo 1:** Criar `docs/operacoes/cobranca-asaas.md` com o fluxo pós-conversa:
  1. Cliente fechou → identificar se é **mensal** (assinatura) ou **projeto** (link de sinal 50%).
  2. Criar no painel a assinatura (Tarefa 3) **ou** o link de sinal (Tarefa 4).
  3. Enviar o link por WhatsApp/email. Cliente paga PIX.
  4. Asaas emite NFS-e automática e notifica o pagamento.
  5. Projeto: na **aprovação do preview**, gerar o **2º link (saldo 50%)** e enviar.
  Incluir a tabela de sinais/saldos da Tarefa 4 e um lembrete "PIX preferencial, cartão só sob pedido".
- [ ] **Passo 2 (verificação):** Doc revisado, valores conferidos contra `web/lib/plans.ts`.
- [ ] **Passo 3 (commit):**

```bash
cd E:/projetos_breq/prumo
git add -- docs/operacoes/cobranca-asaas.md
git commit -m "docs: runbook de cobranca Asaas (fase 1)"
```

**Entregável:** runbook versionado que torna a cobrança um processo repetível de ~2 min.

---

### Tarefa 6: Registrar a decisão na Wiki (ADR) — opcional, recomendado

**Responsável:** Claude (autonomia de Wiki permite sem confirmação).
**Depende de:** nada além da decisão já tomada.

- [ ] **Passo 1:** Via skill `breq-register-decision`, criar ADR 0003 no namespace `projects/prumo-digital/decisions/`: "Pagamento + NFS-e via Asaas (em vez de Stripe/AbacatePay)". Resumir: problema (Simples ME precisa de NF; gateways puros não emitem), decisão (Asaas bundled), consequências (fase 1 zero-código; fase 2 API; email-only vs Supabase adiado).
- [ ] **Passo 2:** Atualizar `projects/prumo-digital/current-status.md` com a pendência "Fase 1 Asaas em setup".
- [ ] **Passo 3 (verificação):** ADR criado e índice de decisões atualizado.

**Entregável:** decisão rastreável na fonte da verdade do Breq.

---

## Critérios de "pronto" — Fase 1

- [ ] Conta Asaas PJ aprovada (Tarefa 1).
- [ ] NFS-e de teste autorizada pela prefeitura (Tarefa 2).
- [ ] 3 assinaturas mensais com NF automática validadas (Tarefa 3).
- [ ] Modelo de link de sinal 50% com NF validado (Tarefa 4).
- [ ] Runbook `docs/operacoes/cobranca-asaas.md` commitado (Tarefa 5).
- [ ] ADR 0003 registrado na Wiki (Tarefa 6).

## Fora desta fase (vai para o plano da Fase 2)
Integração via API no site, webhook `app/api/webhooks/asaas/route.ts`, checkout nativo, e a decisão **email-only vs Supabase** para persistir estado. Ganha plano próprio quando a Fase 1 estiver rodando.
