"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, ArrowLeft, Play, ExternalLink } from "lucide-react"
import { DownloadModal } from "./download-modal"
import Link from "next/link"
import { trackEvent } from "@/lib/analytics"
import { events } from "@/lib/eventRegistry"

interface Resource {
  id: string
  title: string
  description: string
  slug: string
  category: string
  tool: string
  thumbnail: string | null
  fileUrl: string | null
  downloadCount: number
  createdAt: Date
  updatedAt: Date
  author: {
    firstName: string | null
    lastName: string | null
  } | null
}

interface ResourceDetailClientProps {
  resource: Resource
  relatedResources: Resource[]
}

export function ResourceDetailClient({ resource, relatedResources }: ResourceDetailClientProps) {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

  // Track resource view on component mount
  useEffect(() => {
    trackEvent(...Object.values(events.resources.view(resource.slug)))
  }, [resource.slug])

  const handleDownloadClick = () => {
    setIsDownloadModalOpen(true)
  }

  const handleRelatedResourceClick = (relatedResource: Resource) => {
    trackEvent(...Object.values(events.resources.view(relatedResource.slug)))
  }

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/resources" className="text-[#3f79ff] hover:text-[#2563eb] flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Resources
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400">{resource.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Resource Preview */}
            <div className="relative mb-8">
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                {resource.thumbnail ? (
                  <img
                    src={resource.thumbnail || "/placeholder.svg"}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Download className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Resource Preview</p>
                    </div>
                  </div>
                )}
                {/* PROMO Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold px-3 py-1">
                    PROMO
                  </Badge>
                </div>
              </div>
            </div>

            {/* Resource Details */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 mb-4">
                  {resource.category}
                </Badge>
                <h1 className="text-4xl font-bold text-white mb-4">{resource.title}</h1>
                <p className="text-gray-300 text-lg leading-relaxed">{resource.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleDownloadClick}
                  className="bg-[#3f79ff] hover:bg-[#2563eb] text-white px-8 py-3 text-lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Template
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg bg-transparent"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch the Setup Guide
                </Button>
              </div>

              {/* Resource Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{resource.downloadCount}</div>
                  <div className="text-sm text-gray-400">Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{resource.tool}</div>
                  <div className="text-sm text-gray-400">Tool</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">Free</div>
                  <div className="text-sm text-gray-400">Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-400">Published</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Resource Info Card */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Resource Details</h3>
                <Separator className="bg-gray-700" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">File Type:</span>
                    <span className="text-white">JSON(zipped)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Tool:</span>
                    <span className="text-white">{resource.tool}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Downloads:</span>
                    <span className="text-white">{resource.downloadCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Published:</span>
                    <span className="text-white">{new Date(resource.createdAt).toLocaleDateString()}</span>
                  </div>
                  {resource.author && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Author:</span>
                      <span className="text-white">
                        {resource.author.firstName} {resource.author.lastName}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Related Resources */}
            {relatedResources.length > 0 && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">More Templates You'll Love</h3>
                  <div className="space-y-4">
                    {relatedResources.slice(0, 5).map((relatedResource) => (
                      <Link
                        key={relatedResource.id}
                        href={`/resources/${relatedResource.slug}`}
                        onClick={() => handleRelatedResourceClick(relatedResource)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors group"
                      >
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                          {relatedResource.thumbnail ? (
                            <img
                              src={relatedResource.thumbnail || "/placeholder.svg"}
                              alt={relatedResource.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Download className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium group-hover:text-[#3f79ff] transition-colors truncate">
                            {relatedResource.title}
                          </h4>
                          <p className="text-gray-400 text-sm">Template</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-[#3f79ff] transition-colors" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        resourceTitle={resource.title}
        resourceSlug={resource.slug}
      />
    </div>
  )
}
