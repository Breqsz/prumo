import { HeroVideo } from "./hero-video";
import { HeroNav } from "./hero-nav";
import { HeroContent } from "./hero-content";
import { HeroSocial } from "./hero-social";
import { PrumoLines } from "@/components/ui/prumo-lines";

type HeroProps = {
  /** When omitted, the hero renders without a video background. */
  videoSrc?: string;
};

export function Hero({ videoSrc }: HeroProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black">
      <HeroVideo src={videoSrc} />
      <PrumoLines positions={[16, 50, 84]} />
      <HeroNav />
      <HeroContent />
      <HeroSocial />
    </div>
  );
}
