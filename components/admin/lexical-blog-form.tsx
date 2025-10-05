"use client";

import type React from "react";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost, updateBlogPost } from "@/app/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { LexicalEditor } from "./lexical-editor";

interface BlogFormProps {
  post?: any;
}

export function BlogForm({ post }: BlogFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewMode, setPreviewMode] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    post?.thumbnail || null
  );
  const [content, setContent] = useState(post?.content || "");

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    formData.set("content", content);

    startTransition(async () => {
      try {
        const result = post
          ? await updateBlogPost(post.id, null, formData)
          : await createBlogPost(null, formData);

        if (result.success) {
          toast.success(
            post
              ? "Blog post updated successfully!"
              : "Blog post created successfully!"
          );
          router.push("/admin/blog");
        } else {
          toast.error(result.error || "Something went wrong");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Article Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">
                  Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={post?.title}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter article title..."
                />
              </div>

              <div>
                <Label htmlFor="excerpt" className="text-gray-300">
                  Excerpt
                </Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  defaultValue={post?.excerpt}
                  rows={3}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Brief description of the article..."
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-gray-300">
                  Content *
                </Label>
                <LexicalEditor
                  initialContent={post?.content}
                  onChange={setContent}
                  placeholder="Write your article content using the rich text editor..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  Use the toolbar above to format your content. The editor
                  supports headings, lists, quotes, code blocks, and more.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published" className="text-gray-300">
                  Published
                </Label>
                <Switch
                  id="published"
                  name="published"
                  defaultChecked={post?.published}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured" className="text-gray-300">
                  Featured
                </Label>
                <Switch
                  id="featured"
                  name="featured"
                  defaultChecked={post?.featured}
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-300">
                  Category *
                </Label>
                <Select name="category" defaultValue={post?.category} required>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="TUTORIALS_GUIDES">
                      Tutorials & Guides
                    </SelectItem>
                    <SelectItem value="CASE_STUDIES">Case Studies</SelectItem>
                    <SelectItem value="SYSTEM_PROMPTS">
                      System Prompts
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags" className="text-gray-300">
                  Tags
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={post?.tags}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="automation, make.com, zapier"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Separate tags with commas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="thumbnail" className="text-gray-300">
                  Thumbnail Image
                </Label>
                <div className="mt-2">
                  {thumbnailPreview && (
                    <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={thumbnailPreview || "/placeholder.svg"}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      id="thumbnail"
                      name="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="videoUrl" className="text-gray-300">
                  Video URL
                </Label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  defaultValue={post?.videoUrl}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="https://youtube.com/embed/..."
                />
                <p className="text-xs text-gray-400 mt-1">YouTube embed URL</p>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle" className="text-gray-300">
                  SEO Title
                </Label>
                <Input
                  id="seoTitle"
                  name="seoTitle"
                  defaultValue={post?.seoTitle}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Custom title for search engines"
                />
              </div>

              <div>
                <Label htmlFor="seoDescription" className="text-gray-300">
                  SEO Description
                </Label>
                <Textarea
                  id="seoDescription"
                  name="seoDescription"
                  defaultValue={post?.seoDescription}
                  rows={3}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Description for search engines"
                />
              </div>

              <div>
                <Label htmlFor="seoKeywords" className="text-gray-300">
                  SEO Keywords
                </Label>
                <Input
                  id="seoKeywords"
                  name="seoKeywords"
                  defaultValue={post?.seoKeywords}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/blog")}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Cancel
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-[#3f79ff] hover:bg-[#3f79ff]/80"
          >
            {isPending ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {post ? "Update Article" : "Create Article"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
