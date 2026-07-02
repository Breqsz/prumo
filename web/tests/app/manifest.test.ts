import { describe, it, expect } from "vitest";
import manifest from "@/app/manifest";

describe("manifest", () => {
  const m = manifest();

  it("has name, short_name and dark theme color", () => {
    expect(m.name).toMatch(/prumo/i);
    expect(m.short_name).toBe("Prumo");
    expect(m.theme_color).toBe("#000000");
    expect(m.background_color).toBe("#000000");
  });

  it("references at least one icon", () => {
    expect((m.icons ?? []).length).toBeGreaterThan(0);
  });
});
