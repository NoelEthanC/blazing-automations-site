"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DownloadModal } from "./download-modal"
import { Download, Calendar, User, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ResourceDetailClientProps {
  resource: {
    id: string
    title: string
    slug: string
    description: string
    longDescription: string | null
    thumbnail: string | null
    category: string
    tool: string | null
    hasGuide: boolean
    guideUrl: string | null
    downloadsCount: number
    createdAt: Date
    author: {
      firstName: string | null
      lastName: string | null
      email: string
    }
    downloads: Array<{
      id: string
      createdAt: Date
    }>
  }
}

export function ResourceDetailClient({ resource }: ResourceDetailClientProps) {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

  const categoryLabels = {
    MAKE_TEMPLATES: "Make.com Templates",
    ZAPIER_TEMPLATES: "Zapier Templates",
    N8N_TEMPLATES: "n8n Templates",
    AUTOMATION_GUIDES: "Automation Guides",
    TOOLS_RESOURCES: "Tools & Resources",
  }

  const authorName =
    resource.author.firstName && resource.author.lastName
      ? `${resource.author.firstName} ${resource.author.lastName}`
      : resource.author.email

  return (
    <div className="min-h-screen bg-[#09111f] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-[#3f79ff]/20 text-[#3f79ff]">
                {categoryLabels[resource.category as keyof typeof categoryLabels]}
              </Badge>
              {resource.tool && (
                <Badge variant="outline" className="border-gray-700 text-gray-300">
                  {resource.tool}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {resource.title}
            </h1>

            <p className="text-xl text-gray-300 mb-6">{resource.description}</p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>By {authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDistanceToNow(new Date(resource.createdAt))} ago</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>{resource.downloadsCount} downloads</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setIsDownloadModalOpen(true)}
                size="lg"
                className="bg-[#3f79ff] hover:bg-[#2563eb] text-white px-8"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Resource
              </Button>

              {resource.hasGuide && resource.guideUrl && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  <a href={resource.guideUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    View Guide
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Thumbnail */}
              {resource.thumbnail && (
                <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-video">
                      <Image
                        src={resource.thumbnail || "/placeholder.svg"}
                        alt={resource.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Long description */}
              {resource.longDescription && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">About This Resource</h2>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{resource.longDescription}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Resource Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Category</span>
                      <p className="text-white">{categoryLabels[resource.category as keyof typeof categoryLabels]}</p>
                    </div>
                    {resource.tool && (
                      <div>
                        <span className="text-gray-400 text-sm">Tool</span>
                        <p className="text-white">{resource.tool}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400 text-sm">Downloads</span>
                      <p className="text-white">{resource.downloadsCount}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Published</span>
                      <p className="text-white">{formatDistanceToNow(new Date(resource.createdAt))} ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Download CTA */}
              <Card className="bg-gradient-to-br from-[#3f79ff]/20 to-[#1e40af]/20 border-[#3f79ff]/30">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Ready to Download?</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Get instant access to this resource and start automating today.
                  </p>
                  <Button
                    onClick={() => setIsDownloadModalOpen(true)}
                    className="w-full bg-[#3f79ff] hover:bg-[#2563eb] text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        resourceTitle={resource.title}
        resourceSlug={resource.slug}
      />
    </div>
  )
}
