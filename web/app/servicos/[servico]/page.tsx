import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroNav } from "@/components/hero/hero-nav";
import { Footer } from "@/components/footer/footer";
import { ServicePage } from "@/components/servicos/service-page";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";
import { SERVICES, getService, getPlansForService } from "@/lib/services";
import { serviceSchema, faqPageSchema, breadcrumbNode } from "@/lib/schema";

type PageProps = {
  params: Promise<{ servico: string }>;
};

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ servico: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { servico } = await params;
  const service = getService(servico);
  if (!service) return { title: "Serviço não encontrado" };
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/servicos/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `/servicos/${service.slug}`,
    },
  };
}

export default async function ServicoPage({ params }: PageProps) {
  const { servico } = await params;
  const service = getService(servico);
  if (!service) notFound();

  const breadcrumb = breadcrumbNode([
    { name: "Início", url: `${SITE_URL}/` },
    { name: "Serviços", url: `${SITE_URL}/servicos` },
    { name: service.navLabel, url: `${SITE_URL}/servicos/${service.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={serviceSchema(service, getPlansForService(service))} />
      <JsonLd data={faqPageSchema(service.faq)} />
      <HeroNav />
      <ServicePage service={service} />
      <Footer />
    </>
  );
}
