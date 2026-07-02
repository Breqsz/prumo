import { describe, it, expect } from "vitest";
import {
  ORG_ID,
  WEBSITE_ID,
  organizationNode,
  webSiteNode,
  siteGraph,
  personNode,
  parsePriceBRL,
  servicesGraph,
  projectCreativeWorkNode,
  breadcrumbNode,
} from "@/lib/schema";
import { CONTACT } from "@/lib/contact-config";
import { projects } from "@/lib/projects";

describe("organizationNode", () => {
  const org = organizationNode();
  it("is a ProfessionalService with a stable @id", () => {
    expect(org["@type"]).toBe("ProfessionalService");
    expect(org["@id"]).toBe(ORG_ID);
  });
  it("carries logo, email, areaServed and sameAs", () => {
    expect(String(org.logo)).toMatch(/\/prumo-logo\.png$/);
    expect(org.email).toBe(CONTACT.email);
    expect(org.areaServed).toBe("BR");
    expect(org.sameAs).toContain(CONTACT.linkedin);
  });
});

describe("webSiteNode", () => {
  it("links publisher to the organization @id", () => {
    const site = webSiteNode();
    expect(site["@type"]).toBe("WebSite");
    expect(site["@id"]).toBe(WEBSITE_ID);
    expect(site.publisher).toEqual({ "@id": ORG_ID });
    expect(site.inLanguage).toBe("pt-BR");
  });
});

describe("siteGraph", () => {
  it("wraps organization + website in an @graph", () => {
    const g = siteGraph();
    expect(g["@context"]).toBe("https://schema.org");
    expect(Array.isArray(g["@graph"])).toBe(true);
    expect((g["@graph"] as unknown[]).length).toBe(2);
  });
});

describe("personNode", () => {
  it("describes the founder and links worksFor to the org", () => {
    const p = personNode();
    expect(p["@type"]).toBe("Person");
    expect(p.name).toMatch(/Guilherme/);
    expect(p.worksFor).toEqual({ "@id": ORG_ID });
  });
});

describe("parsePriceBRL", () => {
  it("parses BRL strings to integers", () => {
    expect(parsePriceBRL("R$ 3.750")).toBe(3750);
    expect(parsePriceBRL("a partir de R$ 18.000")).toBe(18000);
    expect(parsePriceBRL("R$ 350")).toBe(350);
    expect(parsePriceBRL("R$ 1.350")).toBe(1350);
  });
  it("returns null when there is no number", () => {
    expect(parsePriceBRL("Sob consulta")).toBeNull();
  });
});

describe("servicesGraph", () => {
  const g = servicesGraph();
  const services = g["@graph"] as Array<Record<string, unknown>>;
  it("emits one Service per plan (3 criar + 3 manter)", () => {
    expect(services.length).toBe(6);
    for (const s of services) {
      expect(s["@type"]).toBe("Service");
      expect(s.provider).toEqual({ "@id": ORG_ID });
      expect(s.areaServed).toBe("BR");
    }
  });
  it("uses price for one-time plans and priceSpecification for monthly", () => {
    const landing = services.find((s) => String(s.name).startsWith("Landing"));
    const offerL = landing?.offers as Record<string, unknown>;
    expect(offerL.price).toBe(3750);
    expect(offerL.priceCurrency).toBe("BRL");

    const manut = services.find((s) => String(s.name).startsWith("Manutenção"));
    const offerM = manut?.offers as Record<string, unknown>;
    const spec = offerM.priceSpecification as Record<string, unknown>;
    expect(spec.unitText).toBe("MONTH");
    expect(spec.price).toBe(350);
    expect(offerM.price).toBeUndefined();
  });
});

describe("projectCreativeWorkNode", () => {
  it("maps a project to a CreativeWork linked to the org", () => {
    const node = projectCreativeWorkNode(projects[0]);
    expect(node["@type"]).toBe("CreativeWork");
    expect(node.name).toBe(projects[0].title);
    expect(node.creator).toEqual({ "@id": ORG_ID });
    expect(node.datePublished).toBe(String(projects[0].year));
  });
});

describe("breadcrumbNode", () => {
  it("numbers items from 1 with name + item", () => {
    const node = breadcrumbNode([
      { name: "Início", url: "https://x/" },
      { name: "Trabalhos", url: "https://x/trabalhos" },
    ]);
    const list = node.itemListElement as Array<Record<string, unknown>>;
    expect(list[0].position).toBe(1);
    expect(list[1].position).toBe(2);
    expect(list[1].name).toBe("Trabalhos");
    expect(list[1].item).toBe("https://x/trabalhos");
  });
});
