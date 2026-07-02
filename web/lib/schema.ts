import { SITE_URL } from "@/lib/site";
import { CONTACT } from "@/lib/contact-config";
import { CRIAR_PLANS, MANTER_PLANS, type Plan } from "@/lib/plans";
import type { Project } from "@/lib/projects";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const sameAs = [CONTACT.linkedin, CONTACT.instagram].filter(
  (v): v is string => Boolean(v),
);

export function organizationNode(): Record<string, unknown> {
  return {
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: "Prumo",
    description:
      "Estúdio digital. Sites sob medida, estratégia e presença digital.",
    url: SITE_URL,
    logo: `${SITE_URL}/prumo-logo.png`,
    image: `${SITE_URL}/prumo-logo.png`,
    email: CONTACT.email,
    areaServed: "BR",
    sameAs,
  };
}

export function webSiteNode(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "Prumo",
    inLanguage: "pt-BR",
    publisher: { "@id": ORG_ID },
  };
}

export function siteGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(), webSiteNode()],
  };
}

export function personNode(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Guilherme Rocha Bianchini",
    jobTitle: "Fundador · Prumo",
    url: `${SITE_URL}/sobre`,
    email: CONTACT.email,
    worksFor: { "@id": ORG_ID },
    sameAs: [CONTACT.linkedin],
  };
}

// Preços em lib/plans.ts são strings tipo "R$ 3.750" / "a partir de R$ 18.000".
// Separador de milhar é ".", sem centavos — remover não-dígitos dá o inteiro certo.
export function parsePriceBRL(price: string): number | null {
  const digits = price.replace(/\D/g, "");
  return digits ? Number(digits) : null;
}

function serviceNode(plan: Plan): Record<string, unknown> {
  const amount = parsePriceBRL(plan.price);
  const recurring = /m[êe]s/i.test(plan.cadence);
  // "a partir de R$ X" is a floor, not an exact price — emit minPrice so we
  // don't misrepresent it (and avoid Google price-mismatch signals).
  const fromPrice = /a partir de/i.test(plan.price);
  const offers: Record<string, unknown> = {
    "@type": "Offer",
    priceCurrency: "BRL",
  };
  if (amount !== null) {
    if (recurring) {
      offers.priceSpecification = {
        "@type": "UnitPriceSpecification",
        price: amount,
        priceCurrency: "BRL",
        unitText: "MONTH",
      };
    } else if (fromPrice) {
      offers.priceSpecification = {
        "@type": "PriceSpecification",
        minPrice: amount,
        priceCurrency: "BRL",
      };
    } else {
      offers.price = amount;
    }
  }
  return {
    "@type": "Service",
    name: `${plan.name} — Prumo`,
    description: plan.description,
    provider: { "@id": ORG_ID },
    areaServed: "BR",
    offers,
  };
}

export function servicesGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [...CRIAR_PLANS, ...MANTER_PLANS].map(serviceNode),
  };
}

export function projectCreativeWorkNode(
  project: Project,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    abstract: project.summary,
    about: project.scope,
    url: `${SITE_URL}/trabalhos/${project.slug}`,
    datePublished: String(project.year),
    inLanguage: "pt-BR",
    creator: { "@id": ORG_ID },
  };
}

export type Crumb = { name: string; url: string };

export function breadcrumbNode(items: Crumb[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
