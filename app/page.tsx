import { HeroSection } from "@/components/sections/hero-section"
import { ToolsMarquee } from "@/components/sections/tools-marquee"
import { ServicesSection } from "@/components/sections/services-section"
import { WatchUsBuildSection } from "@/components/sections/watch-us-build-section"
import { FeaturedResourcesSection } from "@/components/sections/featured-resources-section"
import { WhyChooseSection } from "@/components/sections/why-choose-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { ContactSection } from "@/components/sections/contact-section"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#09111f]">
      <HeroSection />
      <ToolsMarquee />
      <ServicesSection />
      <WatchUsBuildSection />
      <FeaturedResourcesSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <ContactSection />
    </main>
  )
}
