"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileVideo, Play, Star, Video, Workflow } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import Link from "next/link";
import { getFeaturedResources } from "@/app/actions/resources";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { Resource } from "@prisma/client";
import { Router } from "next/router";
import { use } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "../ui/tooltip";

// Mock data as fallback
const mockResources = [
  {
    id: "customer-onboarding",
    slug: "customer-onboarding",
    title: "Customer Onboarding Flow",
    description: "Complete welcome series with progress tracking",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "MAKE_TEMPLATES",
    hasGuide: true,
    downloadsCount: 0,
  },
  {
    id: "social-media-scheduler",
    slug: "social-media-scheduler",
    title: "Social Media Scheduler",
    description: "Multi-platform content automation",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "ZAPIER_TEMPLATES",
    hasGuide: false,
    downloadsCount: 0,
  },
  {
    id: "invoice-automation",
    slug: "invoice-automation",
    title: "Invoice Automation",
    description: "Complete billing and payment reminders",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "N8N_TEMPLATES",
    hasGuide: true,
    downloadsCount: 0,
  },
];

export function FeaturedResourcesSection({
  featuredResource,
}: {
  featuredResource: Resource | undefined;
}) {
  const router = useRouter();
  // Try to fetch real data, fallback to mock data
  // let resources = await getFeaturedResources();

  // if (resources.length === 0) {
  //   resources = mockResources as any;
  // }
  // const featuredResource = mockResources[2] as any;

  return (
    <AnimatedSection className="py-28 bg-[#09111f]" id="featured-resource">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-center mb-16">
            <h2 className="font-sora font-bold text-4xl md:text-5xl text-white mb-6">
              Download Our Latest{" "}
              <span className="gradient-text">AI Workflows</span>
            </h2>
            <p className="font-inter text-xl text-slate-text max-w-3xl mx-auto">
              Get instant access to our proven automation templates and start
              building today.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <Card className="relative bg-secondary-blue/50 backdrop-blur-sm border border-secondary-blue/30 overflow-hidden group hover:border-secondary-blue/60 transition-all duration-500">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-light-blue/10 rounded-full blur-xl opacity-60"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Badge className="bg-sunray/20 text-sunray border-sunray/30">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                  {featuredResource?.category && (
                    <Badge
                      variant="outline"
                      className="border-gray-text/30 text-slate-text"
                    >
                      {featuredResource?.category}
                    </Badge>
                  )}
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Free
                  </Badge>
                </div>
                <div>
                  <h3 className="font-space-grotesk font-bold text-2xl text-white mb-3">
                    {featuredResource?.title}
                  </h3>
                  <p className="text-slate-text leading-relaxed">
                    {featuredResource?.description}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() =>
                      router.push(`/resources/${featuredResource?.slug}`)
                    }
                    className="gradient-upstream text-white font-work-sans font-semibold"
                  >
                    <Download className="mr-2 w-4 h-4" />
                    Download Free
                  </Button>
                  <Button
                    variant="outline"
                    className="border-light-blue text-light-blue hover:bg-light-blue hover:text-white"
                  >
                    <Link href={`/resources`} className="flex items-center">
                      <Workflow className="mr-2 w-4 h-4" />
                      Get More Templates
                    </Link>
                  </Button>
                  {featuredResource?.hasGuide && (
                    <Button
                      variant="outline"
                      className="border-light-blue text-light-blue hover:bg-light-blue hover:text-white"
                    >
                      <Link
                        href={`${featuredResource?.guideUrl}`}
                        className="flex items-center"
                      >
                        <FileVideo className="mr-2 w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={`${featuredResource?.thumbnail || "/placeholder.svg?height=200&width=300"}`}
                    alt={`${featuredResource?.title}`}
                    width={640}
                    height={360}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {resources.slice(0, 3).map((resource) => (
            <Card
              key={resource.id}
              className="bg-gray-800/50 border-gray-700 hover:border-[#3f79ff] transition-all duration-300 overflow-hidden group"
            >
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-800">
                  <img
                    src={resource.thumbnail || "/placeholder.svg?height=200&width=300"}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#ca6678] text-white text-xs font-medium px-2 py-1 rounded">
                      {resource.category.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{resource.title}</h3>
                  <p className="text-gray-400 mb-4">{resource.description}</p>

                  <div className="flex gap-2">
                    <Button asChild size="sm" className="bg-[#3f79ff] hover:bg-[#3f79ff]/80 text-white flex-1">
                      <Link href={`/resources/${resource.slug}`}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Link>
                    </Button>

                    {resource.hasGuide && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      >
                        <Link href={`/resources/${resource.slug}#guide`}>
                          <Play className="h-4 w-4 mr-2" />
                          Guide
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div> */}

        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-[#3f79ff] text-[#3f79ff] hover:bg-[#3f79ff] hover:text-white bg-transparent"
          >
            <Link href="/resources">View All Resources</Link>
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
}
