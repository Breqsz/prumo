import { describe, it, expect } from "vitest";
import {
  SERVICES,
  getService,
  getPlansForService,
  getProjectsForService,
} from "@/lib/services";

describe("SERVICES", () => {
  it("has the two v1 services with unique slugs", () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(slugs).toEqual(["criacao-de-sites", "landing-pages"]);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every service has the required non-empty fields", () => {
    for (const s of SERVICES) {
      expect(s.h1.length).toBeGreaterThan(0);
      expect(s.metaTitle.length).toBeGreaterThan(0);
      expect(s.metaDescription.length).toBeGreaterThan(0);
      expect(s.intro.length).toBeGreaterThan(80);
      expect(s.benefits.length).toBeGreaterThanOrEqual(4);
      expect(s.process.length).toBeGreaterThanOrEqual(3);
      expect(s.faq.length).toBeGreaterThanOrEqual(4);
    }
  });
});

describe("getService", () => {
  it("finds by slug and returns undefined otherwise", () => {
    expect(getService("landing-pages")?.slug).toBe("landing-pages");
    expect(getService("nope")).toBeUndefined();
  });
});

describe("related resolvers", () => {
  it("resolves every relatedPlanSlug to a real plan", () => {
    for (const s of SERVICES) {
      const plans = getPlansForService(s);
      expect(plans.length).toBe(s.relatedPlanSlugs.length);
      expect(plans.every(Boolean)).toBe(true);
    }
  });
  it("resolves every relatedProjectSlug to a real project", () => {
    for (const s of SERVICES) {
      const projs = getProjectsForService(s);
      expect(projs.length).toBe(s.relatedProjectSlugs.length);
      expect(projs.every(Boolean)).toBe(true);
    }
  });
});
