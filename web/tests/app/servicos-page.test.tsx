import { describe, it, expect } from "vitest";
import {
  generateStaticParams,
  generateMetadata,
} from "@/app/servicos/[servico]/page";

describe("servicos/[servico] generateStaticParams", () => {
  it("returns both service slugs", async () => {
    const params = await generateStaticParams();
    expect(params).toEqual([
      { servico: "criacao-de-sites" },
      { servico: "landing-pages" },
    ]);
  });
});

describe("servicos/[servico] generateMetadata", () => {
  it("sets a per-service canonical", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ servico: "landing-pages" }),
    });
    expect(meta.alternates?.canonical).toBe("/servicos/landing-pages");
    expect(String(meta.title)).toMatch(/Landing/i);
  });
  it("falls back to a not-found title for unknown slugs", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ servico: "nope" }),
    });
    expect(String(meta.title)).toMatch(/não encontrado/i);
  });
});
