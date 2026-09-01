import { HeroBackground } from "./hero-background";
import { HeroNav } from "./hero-nav";
import { HeroContent } from "./hero-content";
import { HeroSocial } from "./hero-social";

export function Hero() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-black">
      <HeroBackground />
      <HeroNav />
      <HeroContent />
      <HeroSocial />
    </div>
  );
}
