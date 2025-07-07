"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Play, Filter } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import Link from "next/link"
import { staggerFadeIn } from "@/lib/animations"
import { getResources } from "@/app/actions/resources"
import type { ResourceWithAuthor } from "@/lib/types"

const categories = ["ALL", "TEMPLATE", "GUIDE", "TOOL", "EBOOK"]

function ResourcesContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [resources, setResources] = useState<ResourceWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadResources()
  }, [searchTerm, selectedCategory, currentPage])

  useEffect(() => {
    if (resources.length > 0) {
      staggerFadeIn(".resource-card", 0.1)
    }
  }, [resources])

  const loadResources = async () => {
    setLoading(true)
    try {
      const result = await getResources({
        category: selectedCategory,
        search: searchTerm || undefined,
        page: currentPage,
        limit: 12,
      })
      setResources(result.resources)
      setTotal(result.total)
    } catch (error) {
      console.error("Failed to load resources:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#09111f] pt-16">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-[#09111f] to-[#0f1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Free Resources</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Download templates, guides, and tools to supercharge your business growth.
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
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category)
                    setCurrentPage(1)
                  }}
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
              {total} resource{total !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <AnimatedSection className="py-20 bg-[#09111f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-gray-800/50 border-gray-700 animate-pulse">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gray-700" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-700 rounded w-full" />
                      <div className="h-3 bg-gray-700 rounded w-2/3" />
                      <div className="flex gap-2">
                        <div className="h-8 bg-gray-700 rounded flex-1" />
                        <div className="h-8 bg-gray-700 rounded w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources.map((resource) => (
                  <Card
                    key={resource.id}
                    className="resource-card bg-gray-800/50 border-gray-700 hover:border-[#3f79ff] transition-all duration-300 overflow-hidden group"
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-800">
                        <img
                          src={resource.thumbnail || "/placeholder.svg?height=200&width=300"}
                          alt={resource.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-[#ca6678] text-white">{resource.category}</Badge>
                        </div>
                        {resource.featured && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-[#fcbf5b] text-[#09111f]">Featured</Badge>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#3f79ff] transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-gray-400 mb-4 line-clamp-2">{resource.description}</p>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>Downloads: {resource.downloadsCount}</span>
                          {resource.tool && <span>Tool: {resource.tool}</span>}
                        </div>

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

              {resources.length === 0 && !loading && (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-lg mb-4">No resources found matching your criteria</div>
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("ALL")
                      setCurrentPage(1)
                    }}
                    variant="outline"
                    className="border-[#3f79ff] text-[#3f79ff] hover:bg-[#3f79ff] hover:text-white bg-transparent"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {total > 12 && (
                <div className="flex justify-center items-center space-x-4 mt-16">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent disabled:opacity-50"
                  >
                    ← Previous
                  </Button>
                  <div className="flex space-x-2">
                    {Array.from({ length: Math.ceil(total / 12) }).map((_, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        onClick={() => setCurrentPage(i + 1)}
                        className={
                          currentPage === i + 1
                            ? "bg-[#3f79ff] hover:bg-[#3f79ff]/80 text-white"
                            : "border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        }
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === Math.ceil(total / 12)}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent disabled:opacity-50"
                  >
                    Next →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </AnimatedSection>
    </main>
  )
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09111f] pt-16" />}>
      <ResourcesContent />
    </Suspense>
  )
}
