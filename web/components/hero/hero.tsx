import { HeroVideo } from "./hero-video";
import { HeroNav } from "./hero-nav";
import { HeroContent } from "./hero-content";
import { HeroSocial } from "./hero-social";

type HeroProps = {
  /**
   * Ordered playlist of background videos. The hero advances through them
   * and loops back to the first when the last clip ends.
   */
  videoSrcs?: string[];
};

export function Hero({ videoSrcs }: HeroProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black">
      <HeroVideo srcs={videoSrcs} />
      <HeroNav />
      <HeroContent />
      <HeroSocial />
    </div>
  );
}
