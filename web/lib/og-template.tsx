import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Loads the Instrument Serif Regular TTF from the static font file bundled
 * in the repo at app/_fonts/InstrumentSerif-Regular.ttf.
 *
 * The doc recommends readFile + process.cwd() for Node.js runtime OG routes.
 * Only ttf/otf/woff are supported by Satori; ttf is preferred for speed.
 *
 * Node Buffers can be backed by a shared memory pool, so `.buffer` may include
 * bytes beyond the file (wrong byteOffset/byteLength) and corrupt the font.
 * We return a correctly-sliced ArrayBuffer to avoid this.
 */
export async function loadInstrumentSerif(): Promise<ArrayBuffer> {
  const buffer = await readFile(
    join(process.cwd(), "app/_fonts/InstrumentSerif-Regular.ttf"),
  );
  // Slice to exact file bytes — avoids shared-pool byteOffset/byteLength issues
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

/**
 * Branded OG card for Prumo.
 * All text-bearing divs use display:flex — required by Satori.
 */
export function OgCard({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0A0A0A",
        padding: "80px",
      }}
    >
      {/* Eyebrow / wordmark top */}
      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: 8,
          textTransform: "uppercase",
        }}
      >
        {eyebrow ?? "Prumo"}
      </div>

      {/* Main title */}
      <div
        style={{
          display: "flex",
          fontFamily: "Instrument Serif",
          fontSize: 84,
          color: "#FFFFFF",
          lineHeight: 1.05,
          letterSpacing: -2,
        }}
      >
        {title}
      </div>

      {/* Wordmark bottom */}
      <div
        style={{
          display: "flex",
          fontSize: 30,
          color: "#FFFFFF",
          letterSpacing: 2,
        }}
      >
        Prumo
      </div>
    </div>
  );
}
