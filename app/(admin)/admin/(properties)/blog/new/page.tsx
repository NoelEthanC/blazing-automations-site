import { BlogForm } from "@/components/admin/blog-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Article</h1>
          <p className="text-gray-400 mt-1">Write and publish a new blog post</p>
        </div>
      </div>

      <BlogForm />
    </div>
  )
}
