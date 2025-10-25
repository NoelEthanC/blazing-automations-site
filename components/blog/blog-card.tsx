import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye } from "lucide-react";

const categoryLabels = {
  TUTORIALS_GUIDES: "Tutorials & Guides",
  CASE_STUDIES: "Case Studies",
  SYSTEM_PROMPTS: "System Prompts",
};

const categoryColors = {
  TUTORIALS_GUIDES: "bg-[#3f79ff]/20 text-[#3f79ff] border-[#3f79ff]/30",
  CASE_STUDIES: "bg-[#ca6678]/20 text-[#ca6678] border-[#ca6678]/30",
  SYSTEM_PROMPTS: "bg-[#fcbf5b]/20 text-[#fcbf5b] border-[#fcbf5b]/30",
};

interface BlogCardProps {
  post: any;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#ca6678] to-[#fcbf5b] flex items-center justify-center">
              <div className="text-4xl">📝</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />

          {/* Featured Badge */}
          {post.featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-[#fcbf5b] text-gray-900 font-medium">
                Featured
              </Badge>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Category */}
          <Badge
            variant="secondary"
            className={`mb-3 ${categoryColors[post.category]}`}
          >
            {categoryLabels[post.category]}
          </Badge>

          {/* Title */}
          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#3f79ff] transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{post.publishedAt?.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{post.readingTime}m</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{post.viewsCount}</span>
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700">
            <div className="w-8 h-8 bg-gradient-to-br from-[#ca6678] to-[#fcbf5b] rounded-full flex items-center justify-center text-white text-sm font-medium">
              {post.author.firstName?.[0]}
              {post.author.lastName?.[0]}
            </div>
            <span className="text-sm text-gray-400">
              {post.author.firstName}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
