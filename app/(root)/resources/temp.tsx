"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Play, Filter } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import Link from "next/link";
import { staggerFadeIn } from "@/lib/animations";

const resources = [
  {
    id: "customer-onboarding-flow",
    title: "Customer Onboarding Flow",
    description: "Complete welcome series with progress tracking",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Template",
    fileType: "JSON(zipped)",
    tool: "Make.com",
    hasGuide: true,
    featured: true,
  },
  {
    id: "social-media-scheduler",
    title: "Social Media Scheduler",
    description: "Multi-platform content automation",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Template",
    fileType: "JSON",
    tool: "Make.com",
    hasGuide: false,
    featured: true,
  },
  {
    id: "invoice-automation",
    title: "Invoice Automation",
    description: "Complete billing and payment reminders",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Template",
    fileType: "JSON",
    tool: "Make.com",
    hasGuide: true,
    featured: true,
  },
  {
    id: "email-marketing-automation",
    title: "Email Marketing Automation",
    description: "Advanced email sequences with triggers",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Template",
    fileType: "JSON",
    tool: "Make.com",
    hasGuide: true,
    featured: false,
  },
  {
    id: "crm-automation-suite",
    title: "Complete CRM Automation Suite",
    description:
      "Full customer relationship management automation with lead scoring, email sequences, and pipeline management. Includes 15+ pre-built workflows and integrations.",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Template",
    fileType: "JSON(zipped)",
    tool: "Make.com",
    hasGuide: true,
    featured: false,
  },
  {
    id: "alias-voluptas-sed",
    title: "Alias voluptas sed d",
    description: "Nihil ipsam alias su",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Template",
    fileType: "JSON",
    tool: "Make.com",
    hasGuide: true,
    featured: false,
  },
];

const categories = ["All", "Template", "Guide", "Tool"];

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredResources, setFilteredResources] = useState(resources);

  useEffect(() => {
    staggerFadeIn(".resource-card", 0.1);
  }, [filteredResources]);

  useEffect(() => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (resource) => resource.category === selectedCategory
      );
    }

    setFilteredResources(filtered);
  }, [searchTerm, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#09111f] pt-16">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-[#09111f] to-[#0f1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Free Resources
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Download templates, guides, and tools to supercharge your business
            growth.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-[#09111f] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-gray-400">Filter by:</span>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-[#3f79ff] hover:bg-[#3f79ff]/80"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="text-sm text-gray-400">
              {filteredResources.length} resource
              {filteredResources.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <AnimatedSection className="py-20 bg-[#09111f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <Card
                key={resource.id}
                className="resource-card bg-gray-800/50 border-gray-700 hover:border-[#3f79ff] transition-all duration-300 overflow-hidden group"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-800">
                    <img
                      src={resource.thumbnail || "/placeholder.svg"}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-[#ca6678] text-white">
                        {resource.category}
                      </Badge>
                    </div>
                    {resource.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-[#fcbf5b] text-[#09111f]">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#3f79ff] transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {resource.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>File Type: {resource.fileType}</span>
                      <span>Tool: {resource.tool}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        asChild
                        size="sm"
                        className="bg-[#3f79ff] hover:bg-[#3f79ff]/80 text-white flex-1"
                      >
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
                            <Play className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg mb-4">
                No resources found matching your criteria
              </div>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                variant="outline"
                className="border-[#3f79ff] text-[#3f79ff] hover:bg-[#3f79ff] hover:text-white bg-transparent"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {filteredResources.length > 0 && (
            <div className="flex justify-center items-center space-x-4 mt-16">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-gray-600 text-gray-500 bg-transparent"
              >
                ← Previous
              </Button>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="bg-[#3f79ff] hover:bg-[#3f79ff]/80 text-white"
                >
                  1
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-gray-600 text-gray-500 bg-transparent"
              >
                Next →
              </Button>
            </div>
          )}
        </div>
      </AnimatedSection>
    </main>
  );
}
