"use client"

import { useState } from "react"
import { deleteBlogPost, toggleBlogPostStatus } from "@/app/actions/blog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff, Star, StarOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const categoryLabels = {
  TUTORIALS_GUIDES: "Tutorials & Guides",
  CASE_STUDIES: "Case Studies",
  SYSTEM_PROMPTS: "System Prompts",
}

interface BlogManagementProps {
  posts: any[]
}

export function BlogManagement({ posts }: BlogManagementProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleToggleStatus = async (postId: string, field: "published" | "featured") => {
    setLoading(postId)
    try {
      const result = await toggleBlogPostStatus(postId, field)
      if (result.success) {
        toast.success(`Post ${field} status updated successfully`)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update post status")
      }
    } catch (error) {
      toast.error("Failed to update post status")
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    setLoading(postId)
    try {
      const result = await deleteBlogPost(postId)
      if (result.success) {
        toast.success("Blog post deleted successfully")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete blog post")
      }
    } catch (error) {
      toast.error("Failed to delete blog post")
    } finally {
      setLoading(null)
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800/50 rounded-xl">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-white mb-2">No blog posts yet</h3>
        <p className="text-gray-400 mb-6">Create your first blog post to get started.</p>
        <Button asChild className="bg-[#3f79ff] hover:bg-[#3f79ff]/80">
          <Link href="/admin/blog/new">Create First Post</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-gray-300">Title</TableHead>
            <TableHead className="text-gray-300">Category</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Views</TableHead>
            <TableHead className="text-gray-300">Published</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} className="border-gray-700">
              <TableCell>
                <div>
                  <div className="font-medium text-white flex items-center gap-2">
                    {post.title}
                    {post.featured && <Star className="h-4 w-4 text-[#fcbf5b] fill-current" />}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {post.readingTime} min read • {post.author.firstName} {post.author.lastName}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-[#3f79ff]/20 text-[#3f79ff] border-[#3f79ff]/30">
                  {categoryLabels[post.category]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={post.published ? "default" : "secondary"}
                    className={post.published ? "bg-green-600" : "bg-gray-600"}
                  >
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-gray-300">{post.viewsCount}</span>
              </TableCell>
              <TableCell>
                <span className="text-gray-400 text-sm">
                  {post.publishedAt ? post.publishedAt.toLocaleDateString() : "Not published"}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={loading === post.id}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/blog/edit/${post.id}`} className="flex items-center">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleStatus(post.id, "published")}
                      className="flex items-center"
                    >
                      {post.published ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Publish
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleStatus(post.id, "featured")}
                      className="flex items-center"
                    >
                      {post.featured ? (
                        <>
                          <StarOff className="h-4 w-4 mr-2" />
                          Remove from Featured
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          Add to Featured
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(post.id)}
                      className="flex items-center text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
