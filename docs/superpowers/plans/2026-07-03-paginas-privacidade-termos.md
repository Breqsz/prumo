# Páginas de Privacidade e Termos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar as páginas `/privacidade` e `/termos` (hoje 404, linkadas no footer) com conteúdo LGPD honesto e fiel ao que o site coleta.

**Architecture:** Um componente de apresentação compartilhado (`LegalPage` + `LegalSection`) renderiza o shell (HeroNav + título + Footer) e a tipografia de leitura; cada rota fornece o conteúdo em JSX. Reaproveita `CONTACT.legalName/cnpj` de `lib/contact-config.ts`. Sem AmbientVideo (páginas leves).

**Tech Stack:** Next.js App Router, React, TypeScript, TailwindCSS, Vitest + Testing Library.

## Global Constraints

- Conteúdo em **PT-BR**. Fiel ao código: form via Resend (email-only, sem banco), Umami cookieless, **sem cookies**, operadores Resend/Vercel/Umami com transferência internacional (EUA).
- Controlador: `CONTACT.legalName` = "Guilherme Rocha Bianchini Desenvolvimento de Software LTDA", `CONTACT.cnpj` = "67.822.658/0001-50" (importar de `@/lib/contact-config`, nunca hardcodar o número).
- Contato do titular (LGPD): **prumonetwork@gmail.com**. Foro (Termos): **São Paulo/SP**.
- Data de atualização: **3 de julho de 2026**.
- Título display: classe `font-display` (Instrument Serif), padrão de `sobre-hero.tsx`. Corpo `text-white/70`.
- Página pública **não** carrega aviso "não revisado por advogado".
- Cada task termina com teste passando + commit. Mensagens de commit no padrão Conventional Commits em PT-BR.

---

### Task 1: Componente compartilhado `LegalPage` + `LegalSection`

**Files:**
- Create: `web/components/legal/legal-page.tsx`
- Test: `web/tests/components/legal/legal-page.test.tsx`

**Interfaces:**
- Produces:
  - `LegalPage({ eyebrow: string, title: string, updatedAt: string, children: ReactNode }): JSX.Element` — shell com HeroNav, eyebrow, `<h1>` title, "Última atualização: {updatedAt}", container de conteúdo (`text-white/70`), Footer.
  - `LegalSection({ heading: string, children: ReactNode }): JSX.Element` — `<section>` com `<h2>` + children.

- [ ] **Step 1: Write the failing test**

```tsx
// web/tests/components/legal/legal-page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

describe("LegalPage", () => {
  it("renders eyebrow, title as h1, the last-updated date and section headings", () => {
    render(
      <LegalPage
        eyebrow="Privacidade"
        title="Política de Privacidade"
        updatedAt="3 de julho de 2026"
      >
        <LegalSection heading="1. Seção teste">
          <p>Conteúdo de teste.</p>
        </LegalSection>
      </LegalPage>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /política de privacidade/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/última atualização: 3 de julho de 2026/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /seção teste/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/conteúdo de teste/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web && npx vitest run tests/components/legal/legal-page.test.tsx`
Expected: FAIL — não resolve `@/components/legal/legal-page`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// web/components/legal/legal-page.tsx
import type { ReactNode } from "react";
import { HeroNav } from "@/components/hero/hero-nav";
import { Footer } from "@/components/footer/footer";
import { Reveal } from "@/components/ui/reveal";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  updatedAt: string;
  children: ReactNode;
};

export function LegalPage({ eyebrow, title, updatedAt, children }: LegalPageProps) {
  return (
    <>
      <HeroNav />
      <main className="relative px-6 pt-28 pb-32 md:pt-40 md:pb-48">
        <Reveal className="mx-auto flex max-w-3xl flex-col gap-4">
          <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
            {eyebrow}
          </span>
          <h1 className="font-display text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
            {title}
          </h1>
          <p className="text-sm text-white/45">Última atualização: {updatedAt}</p>
        </Reveal>
        <div className="mx-auto mt-16 flex max-w-3xl flex-col gap-10 text-white/70">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-semibold text-white md:text-2xl">
        {heading}
      </h2>
      {children}
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web && npx vitest run tests/components/legal/legal-page.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add web/components/legal/legal-page.tsx web/tests/components/legal/legal-page.test.tsx
git commit -m "feat(legal): componente compartilhado LegalPage + LegalSection"
```

---

### Task 2: Página `/privacidade`

**Files:**
- Create: `web/app/privacidade/page.tsx`
- Test: `web/tests/app/privacidade-page.test.tsx`

**Interfaces:**
- Consumes: `LegalPage`, `LegalSection` (Task 1); `CONTACT` de `@/lib/contact-config`.
- Produces: `PrivacidadePage` (default export) + `metadata`.

- [ ] **Step 1: Write the failing test**

```tsx
// web/tests/app/privacidade-page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PrivacidadePage from "@/app/privacidade/page";

describe("PrivacidadePage", () => {
  it("renders the H1", () => {
    render(<PrivacidadePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /política de privacidade/i }),
    ).toBeInTheDocument();
  });

  it("identifies the controller by CNPJ", () => {
    render(<PrivacidadePage />);
    expect(screen.getByText(/67\.822\.658\/0001-50/)).toBeInTheDocument();
  });

  it("exposes the data-subject contact email", () => {
    render(<PrivacidadePage />);
    const link = screen.getByRole("link", { name: /prumonetwork@gmail\.com/i });
    expect(link).toHaveAttribute("href", "mailto:prumonetwork@gmail.com");
  });

  it("states that no cookies are used", () => {
    render(<PrivacidadePage />);
    expect(screen.getByText(/não utilizamos cookies/i)).toBeInTheDocument();
  });

  it("names the third-party operators", () => {
    render(<PrivacidadePage />);
    expect(screen.getByText(/Resend/)).toBeInTheDocument();
    expect(screen.getByText(/Vercel/)).toBeInTheDocument();
    expect(screen.getByText(/Umami/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web && npx vitest run tests/app/privacidade-page.test.tsx`
Expected: FAIL — não resolve `@/app/privacidade/page`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// web/app/privacidade/page.tsx
import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { CONTACT } from "@/lib/contact-config";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a Prumo coleta, usa e protege seus dados. Política de privacidade em conformidade com a LGPD.",
  alternates: { canonical: "/privacidade" },
  openGraph: { url: "/privacidade" },
};

const link = "text-white underline underline-offset-4 hover:text-white/80";
const strong = "font-medium text-white";

export default function PrivacidadePage() {
  return (
    <LegalPage
      eyebrow="Privacidade"
      title="Política de Privacidade"
      updatedAt="3 de julho de 2026"
    >
      <LegalSection heading="1. Quem somos">
        <p className="leading-relaxed">
          Esta política descreve como a Prumo trata os dados pessoais coletados
          neste site. O controlador dos dados é{" "}
          <strong className={strong}>{CONTACT.legalName}</strong>, inscrita no
          CNPJ {CONTACT.cnpj}, responsável pela marca Prumo. Contato para
          assuntos de privacidade:{" "}
          <a className={link} href="mailto:prumonetwork@gmail.com">
            prumonetwork@gmail.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="2. Quais dados coletamos">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li className="leading-relaxed">
            <strong className={strong}>Dados que você nos envia:</strong> ao
            preencher o formulário de contato, coletamos nome, email, telefone
            (opcional), empresa ou projeto e as informações que você descreve
            sobre o trabalho (tipo de projeto, faixa de orçamento, prazo,
            referências, mensagem e como nos encontrou).
          </li>
          <li className="leading-relaxed">
            <strong className={strong}>Dados de navegação:</strong> usamos o
            Umami para entender o uso do site (páginas visitadas, origem do
            acesso, tipo de dispositivo) de forma agregada e sem cookies, sem
            identificar você individualmente.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Para que usamos">
        <p className="leading-relaxed">
          Usamos os dados do formulário exclusivamente para responder ao seu
          contato, entender sua necessidade e elaborar uma proposta. A base legal
          é o interesse em adotar procedimentos preliminares relacionados a um
          possível contrato, a seu pedido, e o seu consentimento ao enviar o
          formulário (LGPD, Art. 7). As estatísticas de navegação, por serem
          agregadas, servem apenas para melhorar o site.
        </p>
      </LegalSection>

      <LegalSection heading="4. Com quem compartilhamos">
        <p className="leading-relaxed">
          Não vendemos nem alugamos seus dados. Para operar o site, contamos com
          fornecedores que atuam como operadores:
        </p>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li className="leading-relaxed">
            <strong className={strong}>Resend</strong> — envio do email gerado
            pelo formulário;
          </li>
          <li className="leading-relaxed">
            <strong className={strong}>Vercel</strong> — hospedagem do site e
            registros de acesso;
          </li>
          <li className="leading-relaxed">
            <strong className={strong}>Umami</strong> — medição de tráfego
            agregada.
          </li>
        </ul>
        <p className="leading-relaxed">
          Esses fornecedores podem processar dados em servidores fora do Brasil
          (Estados Unidos), o que caracteriza transferência internacional de
          dados (LGPD, Art. 33). Selecionamos fornecedores com padrões adequados
          de segurança.
        </p>
      </LegalSection>

      <LegalSection heading="5. Por quanto tempo guardamos">
        <p className="leading-relaxed">
          Mantemos os dados do seu contato pelo tempo necessário para atendê-lo
          e, se aplicável, manter o histórico do relacionamento. Você pode
          solicitar a exclusão a qualquer momento.
        </p>
      </LegalSection>

      <LegalSection heading="6. Cookies">
        <p className="leading-relaxed">
          <strong className={strong}>Não utilizamos cookies de rastreamento.</strong>{" "}
          Nossa medição de audiência (Umami) funciona sem cookies e sem
          identificar visitantes individualmente.
        </p>
      </LegalSection>

      <LegalSection heading="7. Seus direitos">
        <p className="leading-relaxed">
          Nos termos da LGPD (Art. 18), você pode solicitar: confirmação da
          existência de tratamento; acesso aos dados; correção; anonimização,
          bloqueio ou eliminação; portabilidade; informação sobre
          compartilhamento; e revogação do consentimento. Para exercer qualquer
          direito, escreva para{" "}
          <a className={link} href="mailto:prumonetwork@gmail.com">
            prumonetwork@gmail.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="8. Segurança">
        <p className="leading-relaxed">
          Adotamos medidas técnicas e administrativas razoáveis para proteger
          seus dados. Ainda assim, nenhum sistema é completamente imune, e não
          podemos garantir segurança absoluta.
        </p>
      </LegalSection>

      <LegalSection heading="9. Alterações desta política">
        <p className="leading-relaxed">
          Podemos atualizar esta política periodicamente. A versão vigente estará
          sempre nesta página, com a data de atualização no topo.
        </p>
      </LegalSection>

      <LegalSection heading="10. Contato">
        <p className="leading-relaxed">
          Dúvidas sobre esta política ou sobre seus dados:{" "}
          <a className={link} href="mailto:prumonetwork@gmail.com">
            prumonetwork@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web && npx vitest run tests/app/privacidade-page.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add web/app/privacidade/page.tsx web/tests/app/privacidade-page.test.tsx
git commit -m "feat(privacidade): pagina /privacidade (LGPD, fiel ao codigo)"
```

---

### Task 3: Página `/termos`

**Files:**
- Create: `web/app/termos/page.tsx`
- Test: `web/tests/app/termos-page.test.tsx`

**Interfaces:**
- Consumes: `LegalPage`, `LegalSection` (Task 1); `next/link`.
- Produces: `TermosPage` (default export) + `metadata`.

- [ ] **Step 1: Write the failing test**

```tsx
// web/tests/app/termos-page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TermosPage from "@/app/termos/page";

describe("TermosPage", () => {
  it("renders the H1", () => {
    render(<TermosPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /termos de uso/i }),
    ).toBeInTheDocument();
  });

  it("sets the venue (foro) to São Paulo", () => {
    render(<TermosPage />);
    expect(screen.getByText(/São Paulo\/SP/)).toBeInTheDocument();
  });

  it("asserts intellectual property ownership", () => {
    render(<TermosPage />);
    expect(screen.getByText(/propriedade intelectual/i)).toBeInTheDocument();
  });

  it("clarifies that sending the form is not a contract", () => {
    render(<TermosPage />);
    expect(
      screen.getByText(/não constitui, por si só, contrato de prestação de serviços/i),
    ).toBeInTheDocument();
  });

  it("links to the privacy policy", () => {
    render(<TermosPage />);
    const link = screen.getByRole("link", { name: /política de privacidade/i });
    expect(link).toHaveAttribute("href", "/privacidade");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web && npx vitest run tests/app/termos-page.test.tsx`
Expected: FAIL — não resolve `@/app/termos/page`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// web/app/termos/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de uso do site da Prumo: propriedade intelectual, uso adequado e condições gerais.",
  alternates: { canonical: "/termos" },
  openGraph: { url: "/termos" },
};

const link = "text-white underline underline-offset-4 hover:text-white/80";
const strong = "font-medium text-white";

export default function TermosPage() {
  return (
    <LegalPage eyebrow="Termos" title="Termos de Uso" updatedAt="3 de julho de 2026">
      <LegalSection heading="1. Objeto e aceitação">
        <p className="leading-relaxed">
          Estes Termos regem o uso do site da Prumo. Ao acessar e navegar, você
          concorda com as condições abaixo. Se não concordar, não utilize o site.
        </p>
      </LegalSection>

      <LegalSection heading="2. Natureza do site">
        <p className="leading-relaxed">
          Este é um site institucional e informativo, que apresenta serviços,
          planos e trabalhos da Prumo. As informações, preços e planos têm
          caráter informativo e{" "}
          <strong className={strong}>
            podem ser alterados a qualquer momento, sem aviso prévio
          </strong>
          . Nada aqui constitui oferta vinculante ou proposta comercial firme.
        </p>
      </LegalSection>

      <LegalSection heading="3. Propriedade intelectual">
        <p className="leading-relaxed">
          Todo o conteúdo do site — textos, identidade visual, a marca "Prumo",
          layout e código — pertence à Guilherme Rocha Bianchini Desenvolvimento
          de Software LTDA ou a seus licenciadores. É proibida a reprodução,
          distribuição ou uso sem autorização prévia por escrito.
        </p>
      </LegalSection>

      <LegalSection heading="4. Uso adequado">
        <p className="leading-relaxed">
          Você concorda em não usar o site para fins ilícitos, não tentar
          comprometer sua segurança ou disponibilidade, não realizar coleta
          automatizada massiva (scraping) e não sobrecarregar a infraestrutura.
        </p>
      </LegalSection>

      <LegalSection heading="5. Formulário de contato">
        <p className="leading-relaxed">
          Ao enviar o formulário, você declara que as informações são verídicas
          e que está autorizado a fornecê-las. O envio inicia um contato
          comercial e{" "}
          <strong className={strong}>
            não constitui, por si só, contrato de prestação de serviços
          </strong>{" "}
          — eventual contratação será formalizada em proposta e contrato
          específicos.
        </p>
      </LegalSection>

      <LegalSection heading="6. Serviços e links de terceiros">
        <p className="leading-relaxed">
          O site pode direcionar a serviços de terceiros (por exemplo, WhatsApp e
          redes sociais). Não nos responsabilizamos pelo conteúdo,
          disponibilidade ou políticas desses serviços.
        </p>
      </LegalSection>

      <LegalSection heading="7. Isenção de garantias">
        <p className="leading-relaxed">
          O site é fornecido "no estado em que se encontra". Não garantimos
          disponibilidade ininterrupta, ausência de erros ou adequação a um
          propósito específico.
        </p>
      </LegalSection>

      <LegalSection heading="8. Limitação de responsabilidade">
        <p className="leading-relaxed">
          Na máxima extensão permitida pela legislação, a Prumo não se
          responsabiliza por danos indiretos, incidentais ou consequentes
          decorrentes do uso ou da impossibilidade de uso do site.
        </p>
      </LegalSection>

      <LegalSection heading="9. Privacidade">
        <p className="leading-relaxed">
          O tratamento de dados pessoais coletados no site segue a nossa{" "}
          <Link className={link} href="/privacidade">
            Política de Privacidade
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection heading="10. Alterações destes Termos">
        <p className="leading-relaxed">
          Podemos revisar estes Termos a qualquer momento. A versão vigente
          estará sempre nesta página, com a data de atualização no topo.
        </p>
      </LegalSection>

      <LegalSection heading="11. Legislação e foro">
        <p className="leading-relaxed">
          Estes Termos são regidos pela legislação brasileira. Fica eleito o foro
          da comarca de <strong className={strong}>São Paulo/SP</strong> para
          dirimir eventuais controvérsias, com renúncia a qualquer outro, por
          mais privilegiado que seja.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web && npx vitest run tests/app/termos-page.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add web/app/termos/page.tsx web/tests/app/termos-page.test.tsx
git commit -m "feat(termos): pagina /termos (IP, uso adequado, foro SP)"
```

---

### Task 4: Sitemap + verificação final

**Files:**
- Modify: `web/app/sitemap.ts:11-18` (adicionar duas entradas em `staticRoutes`)
- Modify: `web/tests/app/sitemap.test.ts:12` (incluir os dois paths no loop)

**Interfaces:**
- Consumes: rotas `/privacidade` e `/termos` (Tasks 2 e 3).

- [ ] **Step 1: Update the sitemap test (failing)**

Em `web/tests/app/sitemap.test.ts`, trocar a linha do loop de rotas estáticas:

```tsx
    for (const path of ["/", "/planos", "/trabalhos", "/contato", "/sobre", "/privacidade", "/termos"]) {
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web && npx vitest run tests/app/sitemap.test.ts`
Expected: FAIL — `expected [...] to contain "<SITE_URL>/privacidade"`.

- [ ] **Step 3: Add the routes to the sitemap**

Em `web/app/sitemap.ts`, dentro de `staticRoutes`, após a entrada `/sobre` (linha 17) e antes do `]`:

```ts
    { url: `${SITE_URL}/privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/termos`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
```

- [ ] **Step 4: Run the sitemap test to verify it passes**

Run: `cd web && npx vitest run tests/app/sitemap.test.ts`
Expected: PASS.

- [ ] **Step 5: Full verification — suite, types, lint, build**

Run: `cd web && npx vitest run && npx tsc --noEmit && npm run lint && npm run build`
Expected: todos os testes passam; typecheck sem erros novos; lint limpo; build conclui sem erro. As rotas `/privacidade` e `/termos` aparecem como estáticas na saída do build.

> Nota: se `npx tsc --noEmit` acusar erros **pré-existentes** em `tests/components/trabalhos/project-reel.test.tsx` (propriedade `gallery`), eles não são deste trabalho — não corrigir aqui, apenas confirmar que nenhum erro novo foi introduzido nos arquivos tocados.

- [ ] **Step 6: Commit**

```bash
git add web/app/sitemap.ts web/tests/app/sitemap.test.ts
git commit -m "feat(sitemap): inclui /privacidade e /termos"
```

---

## Verificação manual (após as 4 tasks)

1. `cd web && npm run dev`, abrir `/privacidade` e `/termos` — conferir render, tipografia e navegação (HeroNav + Footer).
2. Clicar em "Privacidade" e "Termos" no footer — não devem mais dar 404.
3. Dar **F5 com o scroll no rodapé** — a barra de copyright/CNPJ deve aparecer (regressão do fix anterior do `Reveal`).
4. No `/termos`, clicar em "Política de Privacidade" — deve levar a `/privacidade`.

## Follow-ups (fora deste plano)

- Revisão jurídica antes do pagamento (Asaas) ir ao ar.
- Trocar `LEAD_TO` na Vercel para `prumonetwork@gmail.com`.
