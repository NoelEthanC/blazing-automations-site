import HeroSection from "@/components/sections/hero-section";
import { ToolsMarquee } from "@/components/sections/tools-marquee";
import ServicesSection from "@/components/sections/services-section";
import { WatchUsBuildSection } from "@/components/sections/watch-us-build-section";
import { FeaturedResourcesSection } from "@/components/sections/featured-resources-section";
import WhyChooseSection from "@/components/sections/why-choose-section";
import HowItWorksSection from "@/components/sections/how-it-works-section";
import { ContactSection } from "@/components/sections/contact-section";
import { getFeaturedResources } from "../actions/resources";
import { Resource } from "@/lib/types";

export default async function HomePage() {
  const resources = await getFeaturedResources();
  return (
    <main className="min-h-screen bg-[#09111f]">
      <HeroSection />
      <ToolsMarquee />
      <ServicesSection />
      <WatchUsBuildSection />
      <FeaturedResourcesSection featuredResource={resources[0]} />
      <WhyChooseSection />
      {/* <HowItWorksSection /> */}
      <ContactSection />
    </main>
  );
}
