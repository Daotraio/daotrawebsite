import { Hero } from "@/components/home/hero";
import { CommissionCalculator } from "@/components/home/commission-calculator";
import { VerticalSections } from "@/components/home/vertical-sections";
import { DualPath } from "@/components/home/dual-path";
import { AdvertiserMarquee } from "@/components/home/advertiser-marquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CommissionCalculator />
      <VerticalSections />
      <DualPath />
      <AdvertiserMarquee />
    </>
  );
}
