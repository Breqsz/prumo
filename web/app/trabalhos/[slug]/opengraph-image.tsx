import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, OgCard, loadInstrumentSerif } from "@/lib/og-template";
import { getProject } from "@/lib/projects";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Trabalho · Prumo";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  const font = await loadInstrumentSerif();
  return new ImageResponse(
    <OgCard title={project?.title ?? "Trabalho"} eyebrow={project?.scope ?? "Prumo"} />,
    { ...OG_SIZE, fonts: [{ name: "Instrument Serif", data: font, style: "normal" }] },
  );
}
