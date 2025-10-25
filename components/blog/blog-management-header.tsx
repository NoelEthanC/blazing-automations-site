"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createBlogPost } from "@/app/actions/blog";
import { title } from "process";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateArticleButton } from "../admin/create-article-button";

const BlogManagementHeader = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleCreateNewArticle = async () => {
    // Logic to create a new article can be added here
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", "Untitled");
    formData.append("content", "");
    try {
      const result = await createBlogPost(null, formData);

      if (result.success) {
        // router.push(`/admin/write/${result?.postId}`);
        router.push(`/admin/new-article/${result?.postId}`);
        toast.success("Blog post created successfully!");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">Blog Management</h1>
        <p className="text-gray-400 mt-1">
          Manage your blog posts and articles
        </p>
      </div>

      {/* <CreateArticleButton /> */}
      <Button
        onClick={handleCreateNewArticle}
        // asChild
        disabled={isLoading}
        className="bg-[#3f79ff] hover:bg-[#3f79ff]/80"
      >
        <Plus className="h-4 w-4 mr-2" />
        {isLoading ? "Creating..." : "  Create New Article"}
      </Button>
    </div>
  );
};

export default BlogManagementHeader;
