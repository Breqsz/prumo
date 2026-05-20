"use client";

import { useVideoFade } from "@/lib/hooks/use-video-fade";

type HeroVideoProps = {
  /** When omitted, only the black background and vignette render. */
  src?: string;
  /**
   * Vertical translate applied to the video as a centering nudge.
   * Default 0% — relies on object-cover to fill. Use small positive
   * value to bias the visible crop downward, negative to bias upward.
   */
  translateY?: string;
};

export function HeroVideo({ src, translateY = "0%" }: HeroVideoProps) {
  const setRef = useVideoFade();
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {src ? (
        // NOTE: no `loop` attribute on purpose — native loop bypasses our
        // `onEnded` handler in useVideoFade, which drives the fade-out/in
        // across the loop boundary. Letting `ended` fire is what reactivates
        // the rAF fade cycle.
        <video
          ref={setRef}
          src={src}
          autoPlay
          muted
          playsInline
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
