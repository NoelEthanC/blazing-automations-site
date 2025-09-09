import { Suspense } from "react"
import { getAllBlogPosts } from "@/app/actions/blog"
import { BlogManagement } from "@/components/admin/blog-management"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function AdminBlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Management</h1>
          <p className="text-gray-400 mt-1">Manage your blog posts and articles</p>
        </div>
        <Button asChild className="bg-[#3f79ff] hover:bg-[#3f79ff]/80">
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <BlogManagement posts={posts} />
      </Suspense>
    </div>
  )
}
