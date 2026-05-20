import { HeroVideo } from "./hero-video";
import { HeroNav } from "./hero-nav";
import { HeroContent } from "./hero-content";
import { HeroSocial } from "./hero-social";

type HeroProps = {
  /** When omitted, the hero renders without a video background. */
  videoSrc?: string;
};

export function Hero({ videoSrc }: HeroProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black">
      <HeroVideo src={videoSrc} />
      <HeroNav />
      <HeroContent />
      <HeroSocial />
    </div>
  );
}
