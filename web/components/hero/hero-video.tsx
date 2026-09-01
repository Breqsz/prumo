"use client";

import { useVideoFade } from "@/lib/hooks/use-video-fade";
import { useIsWideViewport } from "@/lib/hooks/use-is-wide-viewport";

type HeroVideoProps = {
  /**
   * Ordered video sources. When the playlist has more than one entry,
   * the hero advances to the next clip when the current one ends
   * (wrapping back to the first). When omitted or empty, only the
   * black background and vignette render.
   */
  srcs?: string[];
  /**
   * Vertical translate applied to the video as a centering nudge.
   * Default 0% — relies on object-cover to fill. Use small positive
   * value to bias the visible crop downward, negative to bias upward.
   */
  translateY?: string;
};

export function HeroVideo({ srcs, translateY = "0%" }: HeroVideoProps) {
  const setRef = useVideoFade({ srcs });
  const isWide = useIsWideViewport();
  // `isWide` aqui é a proteção real contra download em celular — não o
  // `preload="none"` abaixo. Com autoPlay + setRef chamando el.play() ao
  // montar, o navegador busca o vídeo assim que o elemento existe no DOM,
  // ignorando preload. Remover `isWide` desta condição volta o download
  // mesmo com preload="none" intacto.
  const hasSrc = isWide && !!srcs && srcs.length > 0;
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {hasSrc ? (
        // NOTE: no `loop` attribute on purpose — native loop bypasses our
        // `onEnded` handler in useVideoFade, which drives the fade-out/in
        // across both single-clip reset and playlist advance.
        // src is set by setRef from `srcs[0]`, then mutated on `ended`.
        <video
          ref={setRef}
          src={srcs![0]}
          autoPlay
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          // iOS-only attribute; React doesn't type it but it's required for
          // older webkit autoplay-inline behavior. Cast keeps TS strict happy.
          {...({ "webkit-playsinline": "true" } as Record<string, string>)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: `translateY(${translateY})`, opacity: 0 }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 70%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 60%), radial-gradient(ellipse 50% 40% at 20% 30%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 70%), linear-gradient(180deg, #000 0%, #0a0a0a 60%, #050505 100%)",
          }}
        />
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}
