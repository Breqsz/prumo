import { Hero } from "@/components/hero/hero";

const HERO_VIDEOS = [
  "/hero.mp4", // low-angle building exterior (Pexels 7065802)
  "/hero-2.mp4", // dark hallway with light on ceiling (Pexels 19217898)
  "/hero-3.mp4", // dark hallway with light on floor (Pexels 19217895)
];

export default function HomePage() {
  return <Hero videoSrcs={HERO_VIDEOS} />;
}
