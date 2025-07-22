"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadModal } from "./download-modal";
import { Download, ChevronRight, Play, FileText, Tag } from "lucide-react";

interface ResourceDetailClientProps {
  resource: {
    id: string;
    title: string;
    slug: string;
    description: string;
    longDescription: string | null;
    thumbnail: string | null;
    category: string;
    tool: string | null;
    hasGuide: boolean;
    guideUrl: string | null;
    downloadsCount: number;
    createdAt: Date;
    author: {
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
  };
  relatedResources: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string | null;
    category: string;
    downloadsCount: number;
  }>;
}

export function ResourceDetailClient({
  resource,
  relatedResources,
}: ResourceDetailClientProps) {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const categoryLabels = {
    MAKE_TEMPLATES: "Make.com Templates",
    ZAPIER_TEMPLATES: "Zapier Templates",
    N8N_TEMPLATES: "n8n Templates",
    AUTOMATION_GUIDES: "Automation Guides",
    TOOLS_RESOURCES: "Tools & Resources",
  };

  return (
    <main className="min-h-screen bg-[#0a1628] text-white  py-32">
      {/* Breadcrumb */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              href="/resources"
              className="text-[#4f9cf9] hover:text-[#4f9cf9]/80"
            >
              Resources
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <span className="text-gray-400">{resource.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 ">
          {/* Main Content */}
          <div className="lg:col-span-8 bg-secondary-blue/10 border-[#202c42] border group rounded-xl shadow-lg overflow-hidden pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Resource Preview */}
              <div className="relative">
                <Card className="bg-secondary-blue/40 border-gray-700 rounded-r-none overflow-hidden h-full ">
                  <CardContent className="p-0 relative">
                    <div className="relative aspect-[4/4] rounded-r-none bg-gradient-to-br from-gray-700 to-gray-800">
                      {resource.thumbnail ? (
                        <Image
                          src={resource.thumbnail || "/placeholder.svg"}
                          alt={resource.title}
                          fill
                          className="object-cover h-full rounded-r-none"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="h-16 w-16 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resource Details */}
              <div className="flex flex-col justify-center space-y-6 py-4">
                {/* Category Badge */}
                <div>
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 font-medium">
                    {resource.category.toLowerCase().replace("_", " ")}
                  </Badge>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  {resource.title}
                </h1>

                {/* Description */}
                <p className="text-gray-300 text-lg leading-relaxed">
                  {resource.description}
                </p>

                {/* File Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">File Type: JSON(zipped)</span>
                  </div>
                  {resource.tool && (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Tag className="h-4 w-4" />
                      <span className="text-sm">Tool: {resource.tool}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full bg-[#4f9cf9] hover:bg-[#4f9cf9]/80 text-white font-medium py-3"
                    onClick={() => setIsDownloadModalOpen(true)}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Template
                  </Button>

                  {resource.hasGuide && resource.guideUrl && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-[#4f9cf9] text-[#4f9cf9] hover:bg-[#4f9cf9] hover:text-white bg-transparent font-medium py-3"
                      asChild
                    >
                      <a
                        href={resource.guideUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Watch the Setup Guide
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Resources */}
          <div className="lg:col-span-4">
            {relatedResources.length > 0 && (
              <Card className=" bg-transparent border-none">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">
                    More Templates You'll Love
                  </h3>
                  <div className="space-y-4">
                    {relatedResources.map((related) => (
                      <Link
                        key={related.id}
                        href={`/resources/${related.slug}`}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors group"
                      >
                        <div className="w-12 h-12 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                          {related.thumbnail ? (
                            <Image
                              src={related.thumbnail || "/placeholder.svg"}
                              alt={related.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium group-hover:text-[#4f9cf9] transition-colors text-sm leading-tight mb-1">
                            {related.title}
                          </h4>
                          <p className="text-gray-400 text-xs">Template</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        resourceTitle={resource.title}
        resourceSlug={resource.slug}
      />
    </main>
  );
}
