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
