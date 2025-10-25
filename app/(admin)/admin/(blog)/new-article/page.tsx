import { getBlogPostForEdit } from "@/app/actions/blog";
import { BlogForm } from "@/components/admin/blog-form";
import EditorNav from "@/components/admin/editor-nav";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

export default async function NewBlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = await getBlogPostForEdit(id);

  return (
    <div className="space-y-6">
      <BlogForm post={post} />
    </div>
  );
}
