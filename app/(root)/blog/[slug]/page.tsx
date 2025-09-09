import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBlogPostBySlug } from "@/app/actions/blog"
import { BlogContent } from "@/components/blog/blog-content"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { RelatedArticles } from "@/components/blog/related-articles"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye, User } from "lucide-react"
import Image from "next/image"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const data = await getBlogPostBySlug(params.slug)

  if (!data?.post) {
    return {
      title: "Post Not Found",
    }
  }

  const { post } = data

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || `Read ${post.title} on Blazing Automations blog`,
    keywords: post.seoKeywords?.split(",").map((k) => k.trim()),
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || `Read ${post.title} on Blazing Automations blog`,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [`${post.author.firstName} ${post.author.lastName}`],
      images: post.thumbnail ? [post.thumbnail] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || `Read ${post.title} on Blazing Automations blog`,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const data = await getBlogPostBySlug(params.slug)

  if (!data?.post) {
    notFound()
  }

  const { post, relatedPosts } = data

  const categoryLabels = {
    TUTORIALS_GUIDES: "Tutorials & Guides",
    CASE_STUDIES: "Case Studies",
    SYSTEM_PROMPTS: "System Prompts",
  }

  return (
    <div className="min-h-screen bg-[#09111f] pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Table of Contents - Left Sidebar */}
          <aside className="lg:col-span-2 order-2 lg:order-1">
            <div className="sticky top-32">
              <TableOfContents content={post.content} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-8 order-1 lg:order-2">
            <article className="bg-gray-800/50 rounded-2xl overflow-hidden">
              {/* Hero Image */}
              {post.thumbnail && (
                <div className="relative h-64 md:h-80">
                  <Image
                    src={post.thumbnail || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                </div>
              )}

              <div className="p-6 md:p-8">
                {/* Category Badge */}
                <Badge variant="secondary" className="bg-[#3f79ff]/20 text-[#3f79ff] border-[#3f79ff]/30 mb-4">
                  {categoryLabels[post.category]}
                </Badge>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>

                {/* Excerpt */}
                {post.excerpt && <p className="text-xl text-gray-300 mb-6 leading-relaxed">{post.excerpt}</p>}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mb-8 pb-8 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>
                      {post.author.firstName} {post.author.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{post.publishedAt?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readingTime} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{post.viewsCount} views</span>
                  </div>
                </div>

                {/* Video Embed */}
                {post.videoUrl && (
                  <div className="mb-8">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={post.videoUrl}
                        title={post.title}
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Content */}
                <BlogContent content={post.content} />

                {/* Tags */}
                {post.tags && (
                  <div className="mt-8 pt-8 border-t border-gray-700">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.split(",").map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          </main>

          {/* Related Articles - Right Sidebar */}
          <aside className="lg:col-span-2 order-3">
            <div className="sticky top-32">
              <RelatedArticles posts={relatedPosts} />
            </div>
          </aside>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.thumbnail,
            author: {
              "@type": "Person",
              name: `${post.author.firstName} ${post.author.lastName}`,
            },
            publisher: {
              "@type": "Organization",
              name: "Blazing Automations",
            },
            datePublished: post.publishedAt?.toISOString(),
            dateModified: post.updatedAt.toISOString(),
          }),
        }}
      />
    </div>
  )
}
