import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Users, Clock } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import Link from "next/link";
import { getFeaturedVideo } from "@/app/actions/videos";

export async function WatchUsBuildSection() {
  // Try to fetch real featured video, fallback to mock data
  const featuredVideo = await getFeaturedVideo();

  const videoData = featuredVideo || {
    title: "Building a Complete CRM Automation",
    description:
      "See how we build powerful automations - join 300+ other learners",
    thumbnail: "/placeholder.svg?height=400&width=600",
    videoUrl: "#",
  };

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
              {videoData.description ||
                "See how we build powerful automations - join 300+ other learners"}
            </h2>

            <p className="text-xl text-gray-400 mb-8">
              We show our live automation projects with step-by-step breakdowns
              so you can learn exactly how we approach each project.
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
                {videoData.thumbnail && (
                  <img
                    src={videoData.thumbnail || "/placeholder.svg"}
                    alt={videoData.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20" />
                <Button
                  asChild
                  size="lg"
                  className="relative z-10 bg-[#3f79ff] hover:bg-[#3f79ff]/80 text-white rounded-full w-16 h-16"
                >
                  <Link href={videoData.videoUrl || "/watch-us-build"}>
                    <Play className="h-6 w-6 ml-1" />
                  </Link>
                </Button>

                {/* Video preview overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 rounded-lg p-3">
                    <h4 className="text-white font-medium mb-1">
                      {videoData.title}
                    </h4>
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
  );
}
