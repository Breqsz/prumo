import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { projects } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";
import { SERVICES } from "@/lib/services";

describe("sitemap", () => {
  const entries = sitemap();

  it("includes every static route", () => {
    const urls = entries.map((e) => e.url);
    for (const path of ["/", "/planos", "/trabalhos", "/contato", "/sobre", "/privacidade", "/termos"]) {
      expect(urls).toContain(`${SITE_URL}${path}`);
    }
  });

  it("includes every project detail route", () => {
    for (const p of projects) {
      expect(
        entries.some((e) => e.url === `${SITE_URL}/trabalhos/${p.slug}`),
      ).toBe(true);
    }
  });

  it("sets priority and changeFrequency on every entry", () => {
    for (const e of entries) {
      expect(typeof e.priority).toBe("number");
      expect(e.changeFrequency).toBeDefined();
    }
  });

  it("gives the home page the highest priority", () => {
    const home = entries.find((e) => e.url === `${SITE_URL}/`);
    expect(home?.priority).toBe(1);
  });

  it("includes the servicos hub and every service child", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain(`${SITE_URL}/servicos`);
    for (const s of SERVICES) {
      expect(urls).toContain(`${SITE_URL}/servicos/${s.slug}`);
    }
  });
});
