import { describe, it, expect, vi } from "vitest";

// next/font/google is not available in Vitest (no Next.js runtime).
// Mock it so layout.tsx can be imported for its metadata export.
vi.mock("next/font/google", () => ({
  Archivo: () => ({ variable: "--font-display", className: "" }),
  Instrument_Serif: () => ({ variable: "--font-editorial", className: "" }),
  Inter: () => ({ variable: "--font-body", className: "" }),
}));

// next/script is a React component; stub it out.
vi.mock("next/script", () => ({ default: () => null }));

import { metadata } from "@/app/layout";

describe("root layout metadata", () => {
  it("has a URL metadataBase", () => {
    expect(metadata.metadataBase).toBeInstanceOf(URL);
  });

  it("has a title.default string", () => {
    const title = metadata.title as { default: string; template: string };
    expect(typeof title.default).toBe("string");
    expect(title.default.length).toBeGreaterThan(0);
  });

  it("has a title.template containing %s and Prumo", () => {
    const title = metadata.title as { default: string; template: string };
    expect(title.template).toContain("%s");
    expect(title.template).toContain("Prumo");
  });

  it("has a description string", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("has openGraph with type website", () => {
    expect((metadata.openGraph as { type: string }).type).toBe("website");
  });

  it("has openGraph locale pt_BR", () => {
    expect((metadata.openGraph as { locale: string }).locale).toBe("pt_BR");
  });

  it("has openGraph siteName Prumo", () => {
    expect((metadata.openGraph as { siteName: string }).siteName).toBe("Prumo");
  });

  it("has twitter card summary_large_image", () => {
    expect((metadata.twitter as { card: string }).card).toBe(
      "summary_large_image",
    );
  });
});
