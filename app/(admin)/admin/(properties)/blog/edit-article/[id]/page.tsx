import { getBlogPostForEdit } from "@/app/actions/blog";
import { BlogForm } from "@/components/admin/lexical-blog-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const { id } = await params;
  const post = await getBlogPostForEdit(id);

  if (!post) {
    notFound();
  }

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
          <h1 className="text-3xl font-bold text-white">Edit Article</h1>
          <p className="text-gray-400 mt-1">Update your blog post</p>
        </div>
      </div>

      <BlogForm post={post} />
    </div>
  );
}
