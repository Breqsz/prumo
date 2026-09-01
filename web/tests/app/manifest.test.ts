import { describe, it, expect } from "vitest";
import manifest from "@/app/manifest";

describe("manifest", () => {
  const m = manifest();

  // O ADR 0006 tinha adotado #111111, o preto do manual. Na revisão visual
  // o dono preferiu #000000 e pediu a troca — o ADR precisa ser emendado.
  it("has name, short_name and the site black", () => {
    expect(m.name).toMatch(/prumo/i);
    expect(m.short_name).toBe("Prumo");
    expect(m.theme_color).toBe("#000000");
    expect(m.background_color).toBe("#000000");
  });

  it("keeps theme_color and background_color in sync with --color-bg", () => {
    // Se um dia divergirem, a barra do navegador no mobile deixa de casar
    // com a página e aparece uma faixa de cor diferente no topo.
    expect(m.theme_color).toBe(m.background_color);
  });

  it("references at least one icon", () => {
    expect((m.icons ?? []).length).toBeGreaterThan(0);
  });
});
