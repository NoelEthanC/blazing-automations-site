import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

const categoryLabels = {
  TUTORIALS_GUIDES: "Tutorials & Guides",
  CASE_STUDIES: "Case Studies",
  SYSTEM_PROMPTS: "System Prompts",
}

interface RelatedArticlesProps {
  posts: any[]
}

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) return null

  return (
    <div className="bg-gray-800/50 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Related Articles</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
            <article className="bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition-colors">
              {/* Thumbnail */}
              {post.thumbnail && (
                <div className="relative h-20 mb-3 rounded overflow-hidden">
                  <Image
                    src={post.thumbnail || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Category */}
              <Badge variant="secondary" className="text-xs mb-2 bg-[#3f79ff]/20 text-[#3f79ff] border-[#3f79ff]/30">
                {categoryLabels[post.category]}
              </Badge>

              {/* Title */}
              <h4 className="text-sm font-medium text-white mb-2 line-clamp-2 group-hover:text-[#3f79ff] transition-colors">
                {post.title}
              </h4>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{post.publishedAt?.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.readingTime}m</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}
