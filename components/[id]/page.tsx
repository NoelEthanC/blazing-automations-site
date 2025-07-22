"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Download, Play, FileText, PenToolIcon as Tool, ChevronRight, X } from "lucide-react"
import Link from "next/link"
import { AnimatedSection } from "@/components/ui/animated-section"
import { submitResourceDownload } from "@/app/actions/resources"

// Mock data - in real app this would come from database
const resourceData = {
  "customer-onboarding-flow": {
    title: "Customer Onboarding Flow",
    description: "Complete welcome series with progress tracking",
    thumbnail: "/placeholder.svg?height=400&width=600",
    fileType: "JSON(zipped)",
    tool: "Make.com",
    hasGuide: true,
    category: "Template",
    longDescription: `This comprehensive customer onboarding automation template helps you create a seamless welcome experience for new customers. The flow includes automated email sequences, progress tracking, and personalized touchpoints that guide users through your product or service.

Key features include:
• Automated welcome email series
• Progress tracking dashboard
• Conditional logic based on user actions
• Integration with popular CRM systems
• Customizable templates and messaging
• Analytics and reporting capabilities`,
  },
}

const relatedResources = [
  {
    id: "social-media-scheduler",
    title: "Social Media Scheduler",
    category: "Template",
    thumbnail: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "invoice-automation",
    title: "Invoice Automation",
    category: "Template",
    thumbnail: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "email-marketing-automation",
    title: "Email Marketing Automation",
    category: "Template",
    thumbnail: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "crm-automation-suite",
    title: "Complete CRM Automation Suite",
    category: "Template",
    thumbnail: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "alias-voluptas-sed",
    title: "Alias voluptas sed d",
    category: "Template",
    thumbnail: "/placeholder.svg?height=100&width=150",
  },
]

interface ResourceDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)

  // In a real app, you'd use React.use() or await the params
  const resourceId = "customer-onboarding-flow" // Simplified for demo
  const resource = resourceData[resourceId as keyof typeof resourceData]

  if (!resource) {
    return (
      <main className="min-h-screen bg-[#09111f] pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Resource Not Found</h1>
          <Link href="/resources">
            <Button className="bg-[#3f79ff] hover:bg-[#3f79ff]/80">Back to Resources</Button>
          </Link>
        </div>
      </main>
    )
  }

  const handleDownload = async (action: "download" | "email") => {
    if (!email) return

    setIsSubmitting(true)
    try {
      await submitResourceDownload({
        email,
        resourceId,
        action,
      })
      setDownloadComplete(true)
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#09111f] pt-16">
      {/* Breadcrumb */}
      <section className="py-6 bg-[#09111f] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/resources" className="text-[#3f79ff] hover:text-[#3f79ff]/80">
              Resources
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <span className="text-gray-400">{resource.title}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatedSection>
              {/* Resource Preview */}
              <Card className="bg-gray-800/50 border-gray-700 overflow-hidden mb-8">
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-800">
                    <img
                      src={resource.thumbnail || "/placeholder.svg"}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#ca6678] text-white font-medium">{resource.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Details */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{resource.title}</h1>
                <p className="text-xl text-gray-300 mb-6">{resource.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-400 mb-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>File Type: {resource.fileType}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tool className="h-4 w-4" />
                    <span>Tool: {resource.tool}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Dialog open={isDownloadModalOpen} onOpenChange={setIsDownloadModalOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-[#3f79ff] hover:bg-[#3f79ff]/80 text-white">
                        <Download className="h-5 w-5 mr-2" />
                        Download Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Get Your Free Template</DialogTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-4 top-4 text-gray-400 hover:text-white"
                          onClick={() => setIsDownloadModalOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </DialogHeader>

                      {downloadComplete ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Download className="h-8 w-8 text-green-500" />
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">Download Ready!</h3>
                          <p className="text-gray-400 mb-4">Check your email for the download link.</p>
                          <Button
                            onClick={() => setIsDownloadModalOpen(false)}
                            className="bg-[#3f79ff] hover:bg-[#3f79ff]/80"
                          >
                            Close
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
                            <p className="text-gray-400">Enter your email address to download this template.</p>
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                              Email Address
                            </label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email address"
                              className="bg-gray-700 border-gray-600 text-white"
                              required
                            />
                          </div>

                          <div className="flex flex-col gap-3">
                            <Button
                              onClick={() => handleDownload("download")}
                              disabled={!email || isSubmitting}
                              className="bg-[#3f79ff] hover:bg-[#3f79ff]/80 text-white"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {isSubmitting ? "Processing..." : "Download Now"}
                            </Button>

                            <Button
                              onClick={() => handleDownload("email")}
                              disabled={!email || isSubmitting}
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                            >
                              📧 Send to Email
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {resource.hasGuide && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-[#3f79ff] text-[#3f79ff] hover:bg-[#3f79ff] hover:text-white bg-transparent"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Watch the Setup Guide
                    </Button>
                  )}
                </div>

                {/* Long Description */}
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line">{resource.longDescription}</div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AnimatedSection>
              <Card className="bg-gray-800/50 border-gray-700 mb-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">More Templates You'll Love</h3>
                  <div className="space-y-4">
                    {relatedResources.map((related) => (
                      <Link
                        key={related.id}
                        href={`/resources/${related.id}`}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors group"
                      >
                        <img
                          src={related.thumbnail || "/placeholder.svg"}
                          alt={related.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium group-hover:text-[#3f79ff] transition-colors truncate">
                            {related.title}
                          </h4>
                          <p className="text-gray-400 text-sm">{related.category}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </main>
  )
}
