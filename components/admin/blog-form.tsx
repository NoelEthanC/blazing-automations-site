"use client";

import type React from "react";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost, updateBlogPost } from "@/app/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Save } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import RichTextEditor from "@/app/(admin)/admin/(blog)/write/editor/_components/RichTextEditor";
import EditorNav from "./editor-nav";
import { format } from "path";
import { BlogPost } from "@prisma/client";
import { Switch } from "../ui/switch";
import MarkdownEditor from "@/app/(admin)/admin/(blog)/write/markdown/_components/MarkdownEditor";
import { useDebouncedCallback } from "use-debounce";

interface BlogFormProps {
  post?: BlogPost;
}

const AUTOSAVE_DELAY = 2000;
// const STORAGE_KEY = "markdown-editor-content";
// const TITLE_STORAGE_KEY = "markdown-editor-title";

export function BlogForm({ post }: BlogFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPublished, setIsPublished] = useState(post?.published || false);
  const [isFeatured, setIsFeatured] = useState(post?.featured || false);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    post?.thumbnail || null
  );

  const [markdown, setMarkdown] = useState(post?.content || "");

  // switch view mode shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Normalize key to lowercase for consistency
      const key = e.key.toLowerCase();

      // CTRL + S → Save
      if ((e.ctrlKey || e.metaKey) && key === "s") {
        e.preventDefault();
        e.stopPropagation(); // stop it from reaching browser’s handler
        console.log("Saving blog post...");
        // your save logic here...
      }

      // CTRL + SHIFT + P → Toggle Preview
      if (e.altKey && e.shiftKey && key === "p") {
        e.preventDefault();
        e.stopPropagation();
        setViewMode((prev) => (prev === "edit" ? "preview" : "edit"));
      }
    };

    // 👇 use capture phase to beat browser defaults
    window.addEventListener("keydown", handleKeyDown, true);

    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);
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

  const handleSave = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.set("content", markdown);

    console.log("formData", [...formData.entries()]);
    // return;
    startTransition(async () => {
      try {
        const result = await updateBlogPost(post.id, null, formData);

        if (result.success) {
          toast.success(
            post
              ? "Blog post updated successfully!"
              : "Blog post created successfully!"
          );
          // router.push("/admin/blog");
        } else {
          toast.error(result.error || "Something went wrong");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };
  console.log("post.published", post.published);
  const handleEditorialChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const ref = formRef.current;
      // console.log("Handling editorial change.);
      const formEl = formRef.current;
      if (!formEl) return;
      const formData = new FormData(formEl);
      setMarkdown(value);
      console.log("Editorial change handled:", formData);
      formData.set("content", markdown);
      console.log("new form", [...formData.entries()]);
      // return;
      startTransition(async () => {
        try {
          const result = await updateBlogPost(post.id, null, formData);

          if (result.success) {
            // toast.success(
            //   post
            //     ? "Blog post updated successfully!"
            //     : "Blog post created successfully!"
            // );
            // localStorage.removeItem(STORAGE_KEY);
            // console.log("✅ Draft removed after save");
            // router.push("/admin/blog");
          } else {
            toast.error(result.error || "Something went wrong");
          }
        } catch (error) {
          toast.error("Something went wrong");
        }
      });
    },
    2000
  );

  return (
    <form onSubmit={handleSave} ref={formRef} className="space-y-6">
      {/* Action Buttons */}
      <EditorNav
        post={post}
        isPending={isPending}
        viewMode={viewMode}
        setViewMode={setViewMode}
        handleSave={handleSave}
      />

      <div className="flex items-center justify-between pt-6 border-t border-gray-700"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <MarkdownEditor
            markdown={markdown as string}
            name="content"
            setMarkdown={setMarkdown}
            placeholder="Start writing here..."
            viewMode={viewMode}
            setViewMode={setViewMode}
            handleEditorialChange={handleEditorialChange}
          />
        </div>

        {/* </form> */}
        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {/* <Label htmlFor="excerpt" className="text-gray-300"> */}
                Excerpt
                {/* </Label> */}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="excerpt"
                name="excerpt"
                defaultValue={post?.excerpt as string}
                rows={6}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Brief description of the article..."
              />
            </CardContent>
          </Card>
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
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 data-[state=on]:bg-green-500 transition-colors"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform data-[state=on]:translate-x-6 translate-x-1" />
                </Switch>
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
                <Select
                  name="category"
                  defaultValue={post?.category ?? "TUTORIALS_GUIDES"}
                  required
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
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
                  defaultValue={post?.videoUrl as string}
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
                  defaultValue={post?.seoTitle as string}
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
                  defaultValue={post?.seoDescription as string}
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
                  defaultValue={post?.seoKeywords as string}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              <div>
                <Label htmlFor="tags" className="text-gray-300">
                  Tags
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={post?.tags as string}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="automation, make.com, zapier"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Separate tags with commas
                </p>
              </div>
            </CardContent>
          </Card>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // alert for confirmation first
              confirm("Do you really want to cancel?");
              router.push("/admin/blog");
            }}
            className="border-gray-600 text-gray-300 bg-red-400 w-full hover:bg-red-700"
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
