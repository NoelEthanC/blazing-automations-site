"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Play } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import Link from "next/link"

const featuredResources = [
  {
    id: "customer-onboarding",
    title: "Customer Onboarding Flow",
    description: "Complete welcome series with progress tracking",
    thumbnail: "/placeholder.svg?height=200&width=300",
    type: "Template",
    hasGuide: true,
  },
  {
    id: "social-media-scheduler",
    title: "Social Media Scheduler",
    description: "Multi-platform content automation",
    thumbnail: "/placeholder.svg?height=200&width=300",
    type: "Template",
    hasGuide: false,
  },
  {
    id: "invoice-automation",
    title: "Invoice Automation",
    description: "Complete billing and payment reminders",
    thumbnail: "/placeholder.svg?height=200&width=300",
    type: "Template",
    hasGuide: true,
  },
]

export function FeaturedResourcesSection() {
  return (
    <AnimatedSection className="py-20 bg-[#09111f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get instant access to our proven automation templates and start building today!
          </h2>
          <p className="text-xl text-gray-400">No fluff! Just resources available at the moment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredResources.map((resource) => (
            <Card
              key={resource.id}
              className="bg-gray-800/50 border-gray-700 hover:border-[#3f79ff] transition-all duration-300 overflow-hidden group"
            >
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-800">
                  <img
                    src={resource.thumbnail || "/placeholder.svg"}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#ca6678] text-white text-xs font-medium px-2 py-1 rounded">
                      {resource.type}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{resource.title}</h3>
                  <p className="text-gray-400 mb-4">{resource.description}</p>

                  <div className="flex gap-2">
                    <Button asChild size="sm" className="bg-[#3f79ff] hover:bg-[#3f79ff]/80 text-white flex-1">
                      <Link href={`/resources/${resource.id}`}>
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
                        <Link href={`/resources/${resource.id}#guide`}>
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
        </div>

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
  )
}
