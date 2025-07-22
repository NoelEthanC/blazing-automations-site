import { Suspense } from "react";
// import { getPublishedResources } from "@/actions/resources";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ResourcesHeader } from "./_components/resources-header";
import { ResourcesFilters } from "./_components/resources-filters";
import { ResourcesGrid } from "./_components/resources-grid";
import {
  getFilteredResources,
  getPublishedResources,
} from "@/app/actions/resources";
import Image from "next/image";

export const metadata = {
  title: "Free Automation & AI Resources | Blazing Automations",
  description:
    "Explore a curated collection of automation, AI agent, and web development resources powered by n8n, make.com and more. Filter by category and find tools to supercharge your workflows.",
  keywords: [
    "automation tools",
    "AI agents",
    "n8n resources",
    "Zapier tutorials",
    "Make.com",
    "Airtable templates",
    "workflow automation",
    "developer tools",
    "free automation resources",
    "Blazing Automations",
  ],
  openGraph: {
    title: "Free Automation & AI Resources | Blazing Automations",
    description:
      "Unlock high-quality tools and guides for automating your business. Explore free templates, guides, and integrations from n8n, Zapier, and more.",
    url: "https://blazingautomations.com/resources",
    images: [
      {
        url: "https://blazingautomations.com/images/n8n-ai-agent.png",
        width: 1200,
        height: 630,
        alt: "AI and automation resources background image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Automation & AI Resources",
    description:
      "Discover free tools and resources to automate your work and build AI-powered systems.",
    images: ["https://blazingautomations.com/images/n8n-ai-agent.png"],
  },
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    category?: string;
    pageNo: Number;
  };
}) {
  const { search, category, pageNo } = await searchParams;
  const searchQuery = search || "";
  const selectedCategory = category || "All";
  const page = Number(pageNo || 1);

  const { resources, totalPages, currentPage } = await getFilteredResources({
    search,
    category,
    page,
    perPage: 1, // or 6 or any number
  });

  return (
    <main className="min-h-screen bg-[#09111f] ">
      <section className="relative pt-28 pb-10 overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/n8n-ai-agent.png"
          alt="Resources background"
          fill
          className="object-cover object-center fix inset-0 z-0"
          priority
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-midnight-blue/50 to-midnight-blue/90 pointer-events-none" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ResourcesHeader search={searchQuery} />
        </div>
      </section>

      <section className="py-8 bg-[#09111f] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ResourcesFilters
            category={selectedCategory || "All"}
            resourcesCount={resources.length}
          />
        </div>
      </section>

      <AnimatedSection className="py-20 bg-[#09111f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="text-white">Loading...</div>}>
            <ResourcesGrid
              resources={resources}
              searchTerm={searchQuery}
              selectedCategory={selectedCategory}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </Suspense>
        </div>
      </AnimatedSection>
    </main>
  );
}
