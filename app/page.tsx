import { Hero } from "@/components/home/hero";
import { Mission } from "@/components/home/mission";
import { VerticalSections } from "@/components/home/vertical-sections";
import { DualPath } from "@/components/home/dual-path";
import { AdvertiserMarquee } from "@/components/home/advertiser-marquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Mission />
      <VerticalSections />
      <DualPath />
      <AdvertiserMarquee />
    </>
  );
}
