import { Suspense } from "react";
import { getAllBlogPosts } from "@/app/actions/blog";
import { BlogManagement } from "@/components/admin/blog-management";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import BlogManagementHeader from "@/components/blog/blog-management-header";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="space-y-6">
      <BlogManagementHeader />

      <Suspense fallback={<div>Loading...</div>}>
        <BlogManagement posts={posts} />
      </Suspense>
    </div>
  );
}
