"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Download, Play } from "lucide-react";
import { Resource } from "@prisma/client";

export function ResourcesGrid({
  resources,
  searchTerm,
  selectedCategory,
  currentPage,
  totalPages,
}: {
  resources: Resource[];
  searchTerm: string;
  selectedCategory: string;
  currentPage: number;
  totalPages: number;
}) {
  return (
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

      {resources.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-lg mb-4">
            No resources found matching your criteria
          </div>
          <Button
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.delete("search");
              params.delete("category");
              window.location.search = params.toString();
            }}
            variant="outline"
            className="border-[#3f79ff] text-[#3f79ff] hover:bg-[#3f79ff] hover:text-white bg-transparent"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-12 space-x-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <Link
                key={pageNum}
                href={`?pageNo=${pageNum}${
                  searchTerm ? `&search=${searchTerm}` : ""
                }${selectedCategory && selectedCategory !== "All" ? `&category=${selectedCategory}` : ""}`}
                scroll={false}
              >
                <Button
                  variant={pageNum === currentPage ? "default" : "outline"}
                  className={`px-4 py-2 ${
                    pageNum === currentPage
                      ? "bg-[#3f79ff] text-white"
                      : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {pageNum}
                </Button>
              </Link>
            )
          )}
        </div>
      )}
    </>
  );
}
