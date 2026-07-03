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
