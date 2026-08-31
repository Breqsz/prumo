"use client";

import type { ReactNode } from "react";
import { useVideoFade } from "@/lib/hooks/use-video-fade";
import { useIsWideViewport } from "@/lib/hooks/use-is-wide-viewport";
import { Spotlight } from "@/components/ambient/spotlight";

type AmbientVideoProps = {
  /**
   * Ordered playlist of background video sources. The same fade pattern as
   * the hero applies: 500ms fade-in on load, fade-out 550ms before the clip
   * ends, advance to next src, wrap on the last clip. See `useVideoFade`.
   */
  srcs: string[];
  /**
   * Sections to render on top of the ambient background. The bg is a sticky
   * full-viewport layer behind these children; sections themselves should
   * have transparent backgrounds so the video shows through.
   */
  children: ReactNode;
  /**
   * Adds a breathing cinematic spotlight on top of the video/black layers.
   * Opt-in so the home stays untouched.
   */
  spotlight?: boolean;
  /**
   * Fade-in/out duration in ms. Default 500. Use a smaller value (e.g. 250)
   * when looping a single clip and you want the seam barely perceptible.
   */
  fadeDurationMs?: number;
  /**
   * Time before video.duration to trigger the fade-out, in ms. Default 550.
   * Should track fadeDurationMs so the dimming completes by clip end.
   */
  fadeOutLeadMs?: number;
};

const GRAIN_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")";

export function AmbientVideo({
  srcs,
  children,
  spotlight = false,
  fadeDurationMs,
  fadeOutLeadMs,
}: AmbientVideoProps) {
  const setRef = useVideoFade({
    srcs,
    durationMs: fadeDurationMs,
    fadeOutLeadMs,
  });
  const isWide = useIsWideViewport();

  return (
    <div className="relative isolate">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black"
      >
        <div className="sticky top-0 h-dvh w-full overflow-hidden">
          {/* `isWide` é a proteção real contra download em celular — não o
              preload="none" abaixo. Com autoPlay + setRef chamando el.play()
              ao montar, o navegador busca o vídeo assim que o elemento
              existe no DOM, ignorando preload. Remover este `isWide` volta
              o download mesmo com preload="none" intacto. */}
          {isWide && (
            <video
              ref={setRef}
              src={srcs[0]}
              autoPlay
              muted
              playsInline
              preload="none"
              disablePictureInPicture
              {...({ "webkit-playsinline": "true" } as Record<string, string>)}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                opacity: 0,
                filter:
                  "blur(6px) brightness(0.55) saturate(0.65) contrast(1.05)",
                transform: "scale(1.06)",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/75 to-black/80" />
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-screen"
            style={{ backgroundImage: GRAIN_SVG }}
          />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
          {spotlight && <Spotlight />}
        </div>
      </div>
      {children}
    </div>
  );
}
