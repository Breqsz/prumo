/**
 * OG image routes — unit tests.
 *
 * Satori/ImageResponse can't run in Vitest, so we mock `next/og` to a sentinel
 * and test the logic each route exercises BEFORE handing off to ImageResponse:
 *   - loadInstrumentSerif returns the bundled font as a usable ArrayBuffer
 *   - the per-slug Image() resolves project data and wires font + size into opts
 * Static exports (size/contentType/alt) are trivial re-exports and not asserted.
 * The font actually rendering (byteOffset slice correctness) is verified by the
 * real rendered PNG, not here — a unit test can't simulate Node's buffer pool.
 */

import { describe, it, expect, vi } from "vitest";

vi.mock("next/og", () => ({
  ImageResponse: class ImageResponse {
    constructor(public jsx: unknown, public opts: unknown) {}
  },
}));

import { loadInstrumentSerif } from "@/lib/og-template";
import SlugImage from "@/app/trabalhos/[slug]/opengraph-image";

type CapturedResponse = {
  jsx: { props?: { title?: string; eyebrow?: string } };
  opts: {
    width: number;
    height: number;
    fonts?: Array<{ name: string; data: ArrayBuffer; style: string }>;
  };
};

async function renderSlug(slug: string): Promise<CapturedResponse> {
  const response = await SlugImage({ params: Promise.resolve({ slug }) });
  return response as unknown as CapturedResponse;
}

describe("loadInstrumentSerif", () => {
  it("returns the bundled font as a non-empty ArrayBuffer", async () => {
    const result = await loadInstrumentSerif();
    expect(result).toBeInstanceOf(ArrayBuffer);
    expect(result.byteLength).toBeGreaterThan(0);
  });
});

describe("per-slug OG Image()", () => {
  it("uses the project title and scope for a known slug", async () => {
    const { jsx } = await renderSlug("hold-corretora");
    expect(jsx.props?.title).toBe("Hold Corretora");
    expect(jsx.props?.eyebrow).toBe(
      "Site institucional · consultoria financeira",
    );
  });

  it("falls back to 'Trabalho' / 'Prumo' for an unknown slug", async () => {
    const { jsx } = await renderSlug("nao-existe");
    expect(jsx.props?.title).toBe("Trabalho");
    expect(jsx.props?.eyebrow).toBe("Prumo");
  });

  it("wires the Instrument Serif font and OG dimensions into ImageResponse opts", async () => {
    const { opts } = await renderSlug("desafog-ai");
    expect(opts.width).toBe(1200);
    expect(opts.height).toBe(630);
    expect(opts.fonts).toHaveLength(1);
    expect(opts.fonts?.[0].name).toBe("Instrument Serif");
    expect(opts.fonts?.[0].data).toBeInstanceOf(ArrayBuffer);
    expect(opts.fonts?.[0].style).toBe("normal");
  });
});
