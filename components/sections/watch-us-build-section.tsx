// "use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Users, Clock, ExternalLink } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import Link from "next/link";
import { getFeaturedVideo } from "@/app/actions/videos";

export function WatchUsBuildSection() {
  // const featuredVideo = await getFeaturedVideo();

  const videoData = {
    title: "Building a Complete CRM Automation",
    description:
      "See how we build powerful automations - join 300+ other learners",
    videoUrl: "https://www.youtube.com/watch?v=9tvUSxXrKnA",
  };

  const extractYouTubeId = (url: string) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-]{11})/
    );
    return match ? match[1] : "";
  };

  const videoId = extractYouTubeId(videoData.videoUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <div id="watch-us-build" className="py-12">
      <AnimatedSection className="py-28 bg-midnight-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-midnight-blue text-[#3f79ff] text-sm font-medium mb-6">
                <Users className="h-4 w-4 mr-2" />
                Live Building Sessions | Tips for beginners
              </div>

              <div className="text-3xl md:text-4xl font-bold text-white mb-6">
                <>
                  See how we build powerful automations
                  <span className="bg-gradient-to-r from-flower-pink  to-sunray bg-clip-text text-transparent">
                    {" "}
                    – join 100+ other learners
                  </span>
                </>
              </div>

              <p className="text-xl text-gray-400 mb-8">
                We show our live automation projects with step-by-step
                breakdowns so you can learn exactly how we approach each
                project.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r md:text-base rounded-full from-[#ca6678] to-[#fcbf5b] hover:from-[#b85a6a] hover:to-[#e6ac52] text-white font-medium"
                >
                  <Link
                    target="_blank"
                    className="flex items-center justify-center gap-2 font-bold"
                    href="https://www.youtube.com/@BlazingAutomations"
                  >
                    Subscribe • Free Content
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* ✅ Iframe version instead of react-youtube */}
            <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
                  <iframe
                    src={embedUrl}
                    title={videoData.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-md"
                  ></iframe>

                  {/* Video overlay info */}
                  {/* <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 rounded-lg p-3">
                    <h4 className="text-white font-medium mb-1">
                      {videoData.title}
                    </h4>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>45 min tutorial</span>
                    </div>
                  </div>
                </div> */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
