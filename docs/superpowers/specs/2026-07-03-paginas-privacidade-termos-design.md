# Design — Páginas de Privacidade e Termos (Prumo)

**Data:** 2026-07-03
**Status:** aprovado (design) — aguardando revisão do spec
**Escopo:** criar `/privacidade` e `/termos` no site institucional da Prumo, hoje linkadas no footer mas inexistentes (404).

---

## 1. Contexto e realidade do site

Levantamento do que o site **de fato** coleta (base para o conteúdo — nada de template genérico):

- **Formulário de briefing** (`/contato`, `app/contato/actions.ts`): nome, email, telefone, empresa/projeto, tipo de projeto, faixa de orçamento, prazo, referência, mensagem, "como encontrou". Entregue **por email via Resend**. **Não há banco de dados** — o lead não é persistido (email-only).
- **Analytics: Umami** (`app/layout.tsx`) — **cookieless**, agregado, sem PII. Só carrega se as env vars existirem.
- **Fontes**: self-hosted via `next/font` — sem request ao Google Fonts.
- **Sem cookies, sem login, sem pagamento** (Asaas é spec futura, não existe no código).

**Consequência de design:** a política correta é **curta e verdadeira**. Um template inflado (cookies, remarketing, contas) seria pior — descreveria o que o site não faz.

### Operadores reais (que a política nomeia honestamente)
- **Resend** (envio do email do formulário) — EUA.
- **Vercel** (hospedagem, logs de acesso) — EUA.
- **Umami** (análise de tráfego agregada).
- Resend + Vercel = **transferência internacional** de dados (LGPD Art. 33).

### Teto de responsabilidade (registro interno)
Conteúdo redigido de boa-fé, alinhado à LGPD, fiel ao código — **não é parecer jurídico**. Modelo escolhido: **híbrido (C)** — publica agora para matar o 404 e dar base sólida; **revisar por advogado antes do pagamento (Asaas) entrar**, quando o risco sobe (dado financeiro + contrato real). Esse caráter "versão inicial" fica **só neste spec** — a página pública não carrega aviso de "não revisado", apenas a data de atualização.

---

## 2. Decisões fixadas

| Item | Decisão | Razão |
|---|---|---|
| Origem do conteúdo | Híbrido (C): eu redijo agora, revisão jurídica antes do pagamento | Mata 404 já; risco sobe só com checkout |
| Escopo | As duas páginas | Ambas linkadas no footer |
| Foro (Termos) | São Paulo/SP | Domicílio informado pelo usuário |
| Contato do titular (LGPD) | prumonetwork@gmail.com | Mesmo inbox dos leads; centraliza |
| Endereço físico | Omitido | Email já é canal suficiente na LGPD; adicionar quando houver |
| Aviso "não revisado" na página | Não | Não é praxe; destrói confiança |
| "Última atualização" | 3 de julho de 2026 | Data da redação |
| Cookies | Declarar que **não usamos** | Verdadeiro e diferencial |

---

## 3. Arquitetura (Abordagem A)

Componente de apresentação compartilhado + conteúdo em JSX por página. Reaproveita `CONTACT.legalName/cnpj/email` de `lib/contact-config.ts` (fonte única — nenhum dado solto).

### Arquivos
| Arquivo | Responsabilidade |
|---|---|
| `web/components/legal/legal-page.tsx` | **Novo.** Chrome compartilhado: shell da página (mesmo Nav/Footer das outras rotas), título display, "Última atualização", tipografia de leitura (prose hand-rolled em Tailwind — sem assumir plugin typography), link "voltar ao início". Props: `{ title, updatedAt, children }`. |
| `web/app/privacidade/page.tsx` | **Novo.** `metadata` + `<LegalPage>` com o conteúdo da seção 4. |
| `web/app/termos/page.tsx` | **Novo.** `metadata` + `<LegalPage>` com o conteúdo da seção 5. |
| `web/app/sitemap.ts` | **Editar.** Adicionar as duas rotas (priority baixa ~0.3, changeFrequency yearly). |
| `web/tests/components/legal/legal-page.test.tsx` | **Novo.** Renderiza título + data + children. |
| `web/tests/app/privacidade-page.test.tsx` | **Novo.** Renderiza controlador (CNPJ), contato LGPD, menção a "sem cookies", operadores. |
| `web/tests/app/termos-page.test.tsx` | **Novo.** Renderiza foro (São Paulo), propriedade intelectual, "envio ≠ contrato". |

### Contrato do componente `LegalPage`
- **O que faz:** renderiza uma página legal com aparência consistente com o resto do site (dark, premium, largura de leitura confortável).
- **Como usar:** `<LegalPage title="..." updatedAt="...">{seções em JSX}</LegalPage>`.
- **Depende de:** o mesmo shell de página (Nav + Footer) usado por `/sobre` e `/contato` — verificar o padrão de composição na implementação e seguir igual.

### Notas de implementação
- Verificar como `/sobre` compõe Nav + conteúdo + Footer e replicar (consistência de navegação).
- Tipografia: definir estilos de `h2`, `p`, `ul/li`, `a` dentro do `LegalPage` (ou um wrapper com classes utilitárias). Título display no padrão Instrument Serif; corpo em Inter, `text-white/70`, `leading-relaxed`, espaçamento generoso entre seções.
- Metadata por página (title/description). Rotas permanecem indexáveis.

---

## 4. Conteúdo — `/privacidade` (Política de Privacidade)

> Título: **Política de Privacidade** · Última atualização: 3 de julho de 2026

**1. Quem somos**
Esta política descreve como a Prumo trata os dados pessoais coletados neste site. O controlador dos dados é **Guilherme Rocha Bianchini Desenvolvimento de Software LTDA**, inscrita no CNPJ **67.822.658/0001-50**, responsável pela marca Prumo. Contato para assuntos de privacidade: **prumonetwork@gmail.com**.

**2. Quais dados coletamos**
- **Dados que você nos envia:** ao preencher o formulário de contato, coletamos nome, email, telefone (opcional), empresa ou projeto e as informações que você descreve sobre o trabalho (tipo de projeto, faixa de orçamento, prazo, referências, mensagem e como nos encontrou).
- **Dados de navegação:** usamos o Umami para entender o uso do site (páginas visitadas, origem do acesso, tipo de dispositivo) de forma **agregada e sem cookies**, sem identificar você individualmente.

**3. Para que usamos**
Usamos os dados do formulário exclusivamente para responder ao seu contato, entender sua necessidade e elaborar uma proposta. A base legal é o interesse em adotar procedimentos preliminares relacionados a um possível contrato, a seu pedido, e o seu consentimento ao enviar o formulário (LGPD, Art. 7). As estatísticas de navegação, por serem agregadas, servem apenas para melhorar o site.

**4. Com quem compartilhamos**
Não vendemos nem alugamos seus dados. Para operar o site, contamos com fornecedores que atuam como operadores:
- **Resend** — envio do email gerado pelo formulário;
- **Vercel** — hospedagem do site e registros de acesso;
- **Umami** — medição de tráfego agregada.

Esses fornecedores podem processar dados em servidores fora do Brasil (Estados Unidos), o que caracteriza **transferência internacional de dados** (LGPD, Art. 33). Selecionamos fornecedores com padrões adequados de segurança.

**5. Por quanto tempo guardamos**
Mantemos os dados do seu contato pelo tempo necessário para atendê-lo e, se aplicável, manter o histórico do relacionamento. Você pode solicitar a exclusão a qualquer momento.

**6. Cookies**
**Não utilizamos cookies de rastreamento.** Nossa medição de audiência (Umami) funciona sem cookies e sem identificar visitantes individualmente.

**7. Seus direitos**
Nos termos da LGPD (Art. 18), você pode solicitar: confirmação da existência de tratamento; acesso aos dados; correção; anonimização, bloqueio ou eliminação; portabilidade; informação sobre compartilhamento; e revogação do consentimento. Para exercer qualquer direito, escreva para **prumonetwork@gmail.com**.

**8. Segurança**
Adotamos medidas técnicas e administrativas razoáveis para proteger seus dados. Ainda assim, nenhum sistema é completamente imune, e não podemos garantir segurança absoluta.

**9. Alterações desta política**
Podemos atualizar esta política periodicamente. A versão vigente estará sempre nesta página, com a data de atualização no topo.

**10. Contato**
Dúvidas sobre esta política ou sobre seus dados: **prumonetwork@gmail.com**.

---

## 5. Conteúdo — `/termos` (Termos de Uso)

> Título: **Termos de Uso** · Última atualização: 3 de julho de 2026

**1. Objeto e aceitação**
Estes Termos regem o uso do site da Prumo. Ao acessar e navegar, você concorda com as condições abaixo. Se não concordar, não utilize o site.

**2. Natureza do site**
Este é um site institucional e informativo, que apresenta serviços, planos e trabalhos da Prumo. As informações, preços e planos têm caráter informativo e **podem ser alterados a qualquer momento, sem aviso prévio**. Nada aqui constitui oferta vinculante ou proposta comercial firme.

**3. Propriedade intelectual**
Todo o conteúdo do site — textos, identidade visual, a marca "Prumo", layout e código — pertence à Guilherme Rocha Bianchini Desenvolvimento de Software LTDA ou a seus licenciadores. É proibida a reprodução, distribuição ou uso sem autorização prévia por escrito.

**4. Uso adequado**
Você concorda em não usar o site para fins ilícitos, não tentar comprometer sua segurança ou disponibilidade, não realizar coleta automatizada massiva (scraping) e não sobrecarregar a infraestrutura.

**5. Formulário de contato**
Ao enviar o formulário, você declara que as informações são verídicas e que está autorizado a fornecê-las. **O envio inicia um contato comercial e não constitui, por si só, contrato de prestação de serviços** — eventual contratação será formalizada em proposta e contrato específicos.

**6. Serviços e links de terceiros**
O site pode direcionar a serviços de terceiros (por exemplo, WhatsApp e redes sociais). Não nos responsabilizamos pelo conteúdo, disponibilidade ou políticas desses serviços.

**7. Isenção de garantias**
O site é fornecido "no estado em que se encontra". Não garantimos disponibilidade ininterrupta, ausência de erros ou adequação a um propósito específico.

**8. Limitação de responsabilidade**
Na máxima extensão permitida pela legislação, a Prumo não se responsabiliza por danos indiretos, incidentais ou consequentes decorrentes do uso ou da impossibilidade de uso do site.

**9. Privacidade**
O tratamento de dados pessoais coletados no site segue a nossa [Política de Privacidade](/privacidade).

**10. Alterações destes Termos**
Podemos revisar estes Termos a qualquer momento. A versão vigente estará sempre nesta página, com a data de atualização no topo.

**11. Legislação e foro**
Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de **São Paulo/SP** para dirimir eventuais controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.

---

## 6. Testes (barra de qualidade)

- `legal-page.test.tsx`: renderiza `title`, `updatedAt` e `children`.
- `privacidade-page.test.tsx`: contém CNPJ do controlador, contato `prumonetwork@gmail.com`, afirmação de "sem cookies", nomes dos operadores (Resend/Vercel/Umami).
- `termos-page.test.tsx`: contém foro "São Paulo", cláusula de propriedade intelectual, e a separação "envio ≠ contrato".
- Lint + typecheck + build limpos.

## 7. Fora de escopo (YAGNI)

- CMS/MDX para conteúdo legal.
- Banner de consentimento de cookies (não há cookies).
- Endereço físico / encarregado formal (DPO) — reavaliar quando entrar pagamento.
- Conteúdo sobre pagamento/dados financeiros — entra junto com o Asaas.

## 8. Follow-ups conhecidos (não bloqueiam esta entrega)

- **Revisão jurídica antes do pagamento (Asaas) ir ao ar.**
- Trocar a env var `LEAD_TO` na Vercel para `prumonetwork@gmail.com` (pendência separada).
