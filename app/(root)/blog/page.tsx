import { Suspense } from "react"
import type { Metadata } from "next"
import { getBlogPosts } from "@/app/actions/blog"
import { BlogFilters } from "@/components/blog/blog-filters"
import { BlogGrid } from "@/components/blog/blog-grid"
import { BlogPagination } from "@/components/blog/blog-pagination"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Blog - Automation Insights & Tutorials",
  description:
    "Discover the latest automation tutorials, case studies, and system prompts to supercharge your business workflows.",
  openGraph: {
    title: "Blog - Automation Insights & Tutorials | Blazing Automations",
    description:
      "Discover the latest automation tutorials, case studies, and system prompts to supercharge your business workflows.",
    type: "website",
  },
}

interface BlogPageProps {
  searchParams: {
    page?: string
    category?: string
    search?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Number.parseInt(searchParams.page || "1")
  const category = searchParams.category
  const search = searchParams.search

  const { posts, total, pages, currentPage } = await getBlogPosts({
    page,
    category,
    search,
    limit: 12,
  })

  return (
    <div className="min-h-screen bg-[#09111f] pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Automation{" "}
            <span className="bg-gradient-to-r from-[#ca6678] to-[#fcbf5b] bg-clip-text text-transparent">Insights</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the latest automation tutorials, case studies, and system prompts to supercharge your business
            workflows.
          </p>
        </div>

        {/* Filters */}
        <Suspense fallback={<div className="h-16 bg-gray-800 rounded-lg animate-pulse mb-8" />}>
          <BlogFilters currentCategory={category} currentSearch={search} />
        </Suspense>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-400">
            {search ? `Search results for "${search}" - ` : ""}
            {total} {total === 1 ? "article" : "articles"} found
          </p>
        </div>

        {/* Blog Grid */}
        <Suspense fallback={<BlogGridSkeleton />}>
          <BlogGrid posts={posts} />
        </Suspense>

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-12">
            <BlogPagination currentPage={currentPage} totalPages={pages} category={category} search={search} />
          </div>
        )}
      </div>
    </div>
  )
}

function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-xl overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-6">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
