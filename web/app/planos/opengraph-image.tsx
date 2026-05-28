import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, OgCard, loadInstrumentSerif } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Planos · Prumo";

export default async function Image() {
  const font = await loadInstrumentSerif();
  return new ImageResponse(
    <OgCard title="Planos" eyebrow="Prumo" />,
    { ...OG_SIZE, fonts: [{ name: "Instrument Serif", data: font, style: "normal" }] },
  );
}
