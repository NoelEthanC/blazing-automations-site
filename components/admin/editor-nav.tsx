"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Header from "./Header";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MoreHorizontal, Pencil, Save } from "lucide-react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toggleBlogPostStatus, updateBlogPost } from "@/app/actions/blog";
import { toast } from "sonner";

const EditorNav = ({ roomId, currentUserType, post, isPending }: any) => {
  const [documentTitle, setDocumentTitle] = useState(post?.title || "untitled");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(post?.title || "");
  const [category, setCategory] = useState(post?.category || "");
  const [isPublished, setIsPublished] = useState(post?.published || "");
  const [isFeatured, setIsFeatured] = useState(post?.featured || "");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // TODO: UNDERSTAND THIS FUNCTION & SYNC IT TO THE WHOLE FORM
  const updatePostHandler = async () => {
    const formData = new FormData();
    formData.set("title", title);
    formData.set("category", category);

    setLoading(true);
    try {
      const result = await updateBlogPost(post?.id, null, formData);
      if (result.success) {
        toast.success("Blog post updated successfully!", { duration: 1000 });
      }
    } catch (error) {
      toast.error(`${error}` || "Something went wrong");
      console.log("error", error);
      // throw error;
    } finally {
      setLoading(false);
      setEditing(false);
    }
  };
  const updateStatusHandler = async (field: "featured" | "published") => {
    setLoading(true);
    try {
      const result = await toggleBlogPostStatus(post?.id, field);
      console.log("result", result);
      if (result.success) {
        toast.success("Status updated successfully!", { duration: 1000 });
        if (field === "published") {
          setIsPublished(!isPublished);
        } else if (field === "featured") {
          setIsFeatured(!isFeatured);
        }
      }
    } catch (error) {
      toast.error(`${error}` || "Something went wrong");
      console.log("error", error);
      // throw error;
    } finally {
      setLoading(false);
      setEditing(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        editing
      ) {
        // TODO: UPDATE THIS
        // console.log("documentTitle", documentTitle);
        // updateDocument(roomId, documentTitle);
        //  await updatePostHandler();
        // setEditing(false);
      }
    };
    // const handleSave = (e: KeyboardEvent) => {
    //       if (e.key === "Enter" && editing) {
    //         e.preventDefault(); // prevent accidental form submit
    //         updatePostHandler();
    //       }
    //     handleSave()

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [title, category, isPublished, isFeatured]);
  return (
    <div>
      <div className="collaborative-room">
        <Header>
          <div
            ref={containerRef}
            className="flex  items-center justify-center gap-2"
          >
            {editing && !loading ? (
              <Input
                type="text"
                value={title}
                defaultValue={post?.title}
                name="title"
                ref={inputRef}
                placeholder="Enter a title"
                disabled={loading}
                onFocus={() => setEditing(true)}
                className="bg-midnight-blue outline-none focus:border-0 border-0 max-w-lg min-w-40 w-full"
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // prevent accidental form submit
                    updatePostHandler();
                  }
                }}
              />
            ) : (
              <p onClick={() => setEditing(true)} className="document-title">
                {title}
              </p>
            )}

            <Button
              variant={"ghost"}
              size={`icon`}
              onClick={() => setEditing(true)}
              className="pointer"
            >
              <Pencil size={3} />
            </Button>

            {loading && <p className="text-sm text-gray-400">saving...</p>}
          </div>
          <div className="flex flex-1 w-full justify-end items-center gap-3 sm:gap-4">
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"}>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white p-4">
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor="featured" className="text-gray-300">
                        Featured
                      </Label>
                      <Switch
                        id="featured"
                        name="featured"
                        defaultChecked={post?.featured}
                        onCheckedChange={() => updateStatusHandler("featured")}
                        checked={isFeatured === "true" || isFeatured === true}
                      />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-midnight-blue focus:bg-transparent">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-300">
                        Category *
                      </Label>
                      <Select
                        name="category"
                        defaultValue={post?.category || "TUTORIALS_GUIDES"}
                        required
                        onValueChange={(value) => {
                          setCategory(value);
                        }}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="TUTORIALS_GUIDES">
                            Tutorials & Guides
                          </SelectItem>
                          <SelectItem value="CASE_STUDIES">
                            Case Studies
                          </SelectItem>
                          <SelectItem value="SYSTEM_PROMPTS">
                            System Prompts
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="published" className="text-gray-300">
                Pub.
              </Label>
              <Switch
                id="published"
                name="published"
                onCheckedChange={() => updateStatusHandler("published")}
                defaultChecked={post?.title?.published}
                checked={isPublished === "true" || isPublished === true}
                className="
                data-[state=checked]:bg-green-500 
                data-[state=checked]:border-green-500
                data-[state=unchecked]:bg-gray-700 
                data-[state=unchecked]:border-gray-600"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                // onClick={updatePostHandler}
                type="submit"
                disabled={isPending || loading}
                className="bg-[#3f79ff] hover:bg-[#3f79ff]/80"
              >
                {isPending || loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {post ? "Update " : "Save "}
                  </>
                )}
              </Button>
            </div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </Header>
        {/* <Editor roomId={roomId} currentUserType={currentUserType} /> */}
      </div>
    </div>
  );
};

export default EditorNav;
