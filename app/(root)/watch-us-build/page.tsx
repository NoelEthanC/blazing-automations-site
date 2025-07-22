import { getPublishedVideos } from "@/app/actions/videos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"

// Mock data as fallback
const mockVideos = [
  {
    id: "1",
    title: "Building a Complete CRM Automation",
    description: "Watch as we build a comprehensive CRM automation from scratch using Make.com",
    videoUrl: "https://youtube.com/watch?v=example1",
    thumbnail: "/placeholder.svg?height=300&width=500",
    createdAt: new Date("2024-01-15"),
    featured: true,
    published: true,
  },
  {
    id: "2",
    title: "Social Media Automation Setup",
    description: "Learn how to automate your social media posting across multiple platforms",
    videoUrl: "https://youtube.com/watch?v=example2",
    thumbnail: "/placeholder.svg?height=300&width=500",
    createdAt: new Date("2024-01-10"),
    featured: false,
    published: true,
  },
]

export default async function WatchUsBuildPage() {
  // Try to fetch real data, fallback to mock data
  let videos = await getPublishedVideos()

  if (videos.length === 0) {
    videos = mockVideos as any
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Watch Us Build
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Learn automation by watching our live building sessions. See exactly how we approach each project from start
            to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors overflow-hidden"
            >
              <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-800">
                {video.thumbnail && (
                  <img
                    src={video.thumbnail || "/placeholder.svg?height=300&width=500"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#3f79ff] hover:bg-[#3f79ff]/80 text-white rounded-full w-16 h-16"
                  >
                    <Link href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Play className="h-6 w-6 ml-1" />
                    </Link>
                  </Button>
                </div>
                {video.featured && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-[#ca6678] text-white">Featured</Badge>
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-white">{video.title}</CardTitle>
              </CardHeader>

              <CardContent>
                {video.description && <p className="text-gray-300 mb-4 line-clamp-3">{video.description}</p>}

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch Video
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No videos available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
