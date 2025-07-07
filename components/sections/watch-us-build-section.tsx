"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Users, Clock } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import Link from "next/link"
import { getFeaturedVideo } from "@/app/actions/videos"

// Mock data as fallback
const mockVideo = {
  id: "mock-video",
  title: "Building a Complete CRM Automation",
  description: "Watch as we build a comprehensive CRM automation from scratch using Make.com",
  videoUrl: "https://youtube.com/watch?v=example",
  thumbnail: "/placeholder.svg?height=300&width=500",
  featured: true,
  published: true,
}

export function WatchUsBuildSection() {
  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadVideo() {
      try {
        const featuredVideo = await getFeaturedVideo()

        if (featuredVideo) {
          setVideo(featuredVideo)
        } else {
          // Use mock data as fallback
          setVideo(mockVideo)
        }
      } catch (error) {
        console.error("Failed to load featured video:", error)
        setVideo(mockVideo)
      } finally {
        setLoading(false)
      }
    }

    loadVideo()
  }, [])

  if (loading) {
    return (
      <AnimatedSection className="py-20 bg-gradient-to-br from-[#09111f] to-[#0f1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="h-6 bg-gray-700 rounded w-1/2 mb-6 animate-pulse" />
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-6 animate-pulse" />
              <div className="h-4 bg-gray-700 rounded w-full mb-2 animate-pulse" />
              <div className="h-4 bg-gray-700 rounded w-2/3 mb-8 animate-pulse" />
              <div className="flex gap-4">
                <div className="h-10 bg-gray-700 rounded w-32 animate-pulse" />
                <div className="h-10 bg-gray-700 rounded w-32 animate-pulse" />
              </div>
            </div>
            <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </AnimatedSection>
    )
  }

  return (
    <AnimatedSection className="py-20 bg-gradient-to-br from-[#09111f] to-[#0f1a2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3f79ff]/20 text-[#3f79ff] text-sm font-medium mb-6">
              <Users className="h-4 w-4 mr-2" />
              Live Building Sessions | Tips for beginners
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              See how we build powerful automations - join 300+ other learners
            </h2>

            <p className="text-xl text-gray-400 mb-8">
              We show our live automation projects with step-by-step breakdowns so you can learn exactly how we approach
              each project.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#ca6678] to-[#fcbf5b] hover:from-[#b85a6a] hover:to-[#e6ac52] text-white font-medium"
              >
                <Link href="/watch-us-build">Subscribe • Free Content</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#3f79ff] text-[#3f79ff] hover:bg-[#3f79ff] hover:text-white bg-transparent"
              >
                <Link href="/resources">View All Resources</Link>
              </Button>
            </div>
          </div>

          <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {video?.thumbnail && (
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20" />
                <Button
                  asChild
                  size="lg"
                  className="relative z-10 bg-[#3f79ff] hover:bg-[#3f79ff]/80 text-white rounded-full w-16 h-16"
                >
                  <Link href={video?.videoUrl || "#"}>
                    <Play className="h-6 w-6 ml-1" />
                  </Link>
                </Button>

                {/* Video preview overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 rounded-lg p-3">
                    <h4 className="text-white font-medium mb-1">{video?.title || "Featured Video"}</h4>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>45 min tutorial</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedSection>
  )
}
