"use client";

import { useVideoFade } from "@/lib/hooks/use-video-fade";

type HeroVideoProps = {
  /** When omitted, only the black background and vignette render. */
  src?: string;
  /** Vertical translate applied to the video to crop top portion. Default 17%. */
  translateY?: string;
};

export function HeroVideo({ src, translateY = "17%" }: HeroVideoProps) {
  const setRef = useVideoFade();
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {src ? (
        <video
          ref={setRef}
          src={src}
          autoPlay
          muted
          loop
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
