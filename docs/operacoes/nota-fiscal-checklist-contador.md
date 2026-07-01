# NFS-e via Asaas — o que alinhar com o contador

> **Objetivo:** juntar tudo que o Asaas precisa pra emitir nota fiscal de serviço (NFS-e) automática. Enquanto o CNPJ finaliza, adiante estes pontos com o contador — assim a Tarefa 2 do plano sai rápido.
> **Nada aqui é conselho fiscal** — são as perguntas certas a fazer ao contador. Ele decide os enquadramentos.

## 1. Fechar a abertura do CNPJ
- [ ] Confirmar CNPJ **ativo** e com **CNAE de serviços** compatível (desenvolvimento de sites/software, serviços de design/digital). O contador define os CNAEs corretos.
- [ ] Confirmar **regime**: Simples Nacional. Perguntar em qual **Anexo** cai a atividade (serviço de TI costuma variar entre Anexo III e V conforme o **Fator R** — impacta a alíquota).

## 2. Habilitar emissão de NFS-e no município
- [ ] **Inscrição Municipal (CCM)** ativa na prefeitura da cidade sede.
- [ ] Cadastro no **Emissor Nacional de NFS-e** / sistema da prefeitura (obrigatório pro Simples a partir de **01/09/2026**).
- [ ] **Certificado digital e-CNPJ (A1)** se a prefeitura/Asaas exigir pra assinar a nota.
- [ ] **Login/credenciais** do sistema da prefeitura que o Asaas vai usar na integração.

## 3. Dados fiscais que o Asaas pede (campos de cadastro do serviço)
Perguntar ao contador e anotar aqui:
- [ ] **Código de serviço municipal** (item da lista da LC 116/2003) para "desenvolvimento de sites / serviços de programação": `__________`
- [ ] **Descrição do serviço** que sai na nota: `__________`
- [ ] **Alíquota de ISS** aplicável no município (%): `__________`
- [ ] Há **retenção** de ISS/IR/PIS/COFINS/CSLL em algum caso? (ex.: cliente PJ tomador) `__________`

## 4. Quando o CNPJ fechar (próximos passos, já no plano)
1. Preencher os campos da seção 3 na config fiscal do Asaas (Tarefa 2 do plano).
2. Emitir **uma NFS-e avulsa de teste** e confirmar autorização da prefeitura.
3. Ligar **NF automática** nas assinaturas e nos links de sinal (Tarefas 3 e 4).

---
Referência: NFS-e Nacional / obrigatoriedade Simples — https://www.gov.br/nfse/pt-br/noticias/nfs-e-e-simples-nacional-obrigatoriedade-de-emissao-atraves-do-emissor-nacional
