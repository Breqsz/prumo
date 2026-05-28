import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { projects } from "@/lib/projects";

describe("sitemap", () => {
  it("includes the static routes", () => {
    const urls = sitemap().map((e) => e.url);
    for (const path of ["/planos", "/sobre", "/trabalhos", "/contato"]) {
      expect(urls.some((u) => u.endsWith(path))).toBe(true);
    }
  });

  it("includes one entry per project case", () => {
    const urls = sitemap().map((e) => e.url);
    for (const p of projects) {
      expect(urls.some((u) => u.endsWith(`/trabalhos/${p.slug}`))).toBe(true);
    }
  });
});
