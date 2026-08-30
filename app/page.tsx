import { Hero } from "@/components/home/hero";
import { StatsStrip } from "@/components/home/stats-strip";
import { VerticalSections } from "@/components/home/vertical-sections";
import { DualPath } from "@/components/home/dual-path";
import { AdvertiserMarquee } from "@/components/home/advertiser-marquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <VerticalSections />
      <DualPath />
      <AdvertiserMarquee />
    </>
  );
}
