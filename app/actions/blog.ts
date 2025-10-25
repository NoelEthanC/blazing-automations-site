"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { BlogCategory } from "@prisma/client";

// Helper function to upload files to Supabase
export async function uploadFile(file: File, bucket: string, pathPrefix = "") {
  const fileExt = file.name.split(".").pop();
  const fileName = `${pathPrefix}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  return urlData.publicUrl;
}

/**
 * Delete a file from Supabase storage
 * @param publicUrl Full public URL of the file to delete
 * @param bucket Supabase storage bucket name
 */
export async function deleteFile(publicUrl: string, bucket: string) {
  try {
    // Extract the file path from the public URL
    // Supabase public URLs look like: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const url = new URL(publicUrl);
    const path = url.pathname.split(`/storage/v1/object/public/${bucket}/`)[1];

    if (!path) {
      throw new Error("Invalid public URL or bucket name");
    }

    const { data, error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error deleting file from Supabase:", error);
    throw error;
  }
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  if (!content) return 0;
  const wordsPerMinute = 200;
  const words = content?.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Public: Get published blog posts with pagination and filtering
export async function getBlogPosts({
  page = 1,
  limit = 12,
  category,
  featured,
  search,
}: {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
} = {}) {
  try {
    const where: any = { published: true };

    if (category && category !== "ALL") {
      where.category = category as BlogCategory;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return {
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return {
      posts: [],
      total: 0,
      pages: 0,
      currentPage: 1,
    };
  }
}

// Public: Get single blog post by slug
export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!post) return null;

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewsCount: { increment: 1 } },
    });

    // Get related posts
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        category: post.category,
        id: { not: post.id },
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });

    return { post, relatedPosts };
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}

// Public: Get featured blog posts
export async function getFeaturedBlogPosts(limit = 6) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true, featured: true },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    return posts;
  } catch (error) {
    console.error("Failed to fetch featured blog posts:", error);
    return [];
  }
}

// Admin: Get all blog posts
export async function getAllBlogPosts() {
  try {
    await requireAdmin();

    const posts = await prisma.blogPost.findMany({
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return posts;
  } catch (error) {
    console.error("Failed to fetch all blog posts:", error);
    return [];
  }
}

// Admin: Get single blog post for editing
export async function getBlogPostForEdit(id: string) {
  try {
    await requireAdmin();

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return post;
  } catch (error) {
    console.error("Failed to fetch blog post for edit:", error);
    return null;
  }
}

// Admin: Create new blog post
export async function createBlogPost(prevState: any, formData: FormData) {
  try {
    const user = await getCurrentUser();
    // await requireAdmin()

    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const tags = formData.get("tags") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const featured = formData.get("featured") === "on";
    const published = formData.get("published") === "on";
    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;
    const seoKeywords = formData.get("seoKeywords") as string;

    const thumbnailFile = formData.get("thumbnail") as File;

    let thumbnailPath = null;

    // Upload thumbnail if provided
    if (thumbnailFile && thumbnailFile.size > 0) {
      thumbnailPath = await uploadFile(
        thumbnailFile,
        "thumbnails",
        `thumb-${Date.now()}`
      );
    }

    // Generate slug
    const slug = generateSlug(title);

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return {
        success: false,
        error:
          "A blog post with this title already exists. Please choose a different title.",
      };
    }

    // Calculate reading time
    const readingTime = calculateReadingTime(content);

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        thumbnail: thumbnailPath,
        videoUrl: videoUrl || null,
        category: category as BlogCategory,
        tags: tags || null,
        featured,
        published,
        publishedAt: published ? new Date() : null,
        readingTime,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || null,
        authorId: user?.id,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath("/");

    return { success: true, postId: post.id };
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return {
      success: false,
      error: `Failed to create blog post. Please try again. ${error}`,
    };
  }
}

// Admin: Update blog post
export async function updateBlogPost(
  postId: string,
  prevState: any,
  formData: FormData
) {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const tags = formData.get("tags") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const featured = formData.get("featured") === "on";
    const published = formData.get("published") === "on";
    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;
    const seoKeywords = formData.get("seoKeywords") as string;

    const thumbnailFile = formData.get("thumbnail") as File;

    // Fetch current post
    const currentPost = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!currentPost) {
      return { success: false, error: "Blog post not found" };
    }

    const updateData: any = {
      title: title ? title : currentPost?.title,
      excerpt: excerpt ? excerpt : currentPost?.excerpt || null,
      content: content ? content : currentPost?.content,
      category: category ? category : (currentPost?.category as BlogCategory),
      tags: tags ? tags : currentPost?.tags || null,
      videoUrl: videoUrl ? videoUrl : currentPost?.videoUrl || null,
      featured,
      published,
      readingTime: content ? calculateReadingTime(content) : 0,
      seoTitle: seoTitle ? seoTitle : currentPost?.seoTitle || null,
      seoDescription: seoDescription
        ? seoDescription
        : currentPost?.seoDescription || null,
      seoKeywords: seoKeywords ? seoKeywords : currentPost?.seoKeywords || null,
    };

    // Handle thumbnail update
    if (thumbnailFile && thumbnailFile.size > 0) {
      const thumbnailPath = await uploadFile(
        thumbnailFile,
        "blog-thumbnails",
        `thumb-${Date.now()}`
      );
      updateData.thumbnail = thumbnailPath;
    }

    // Update slug if title changed
    if (title && title !== currentPost.title) {
      console.log("first", title, currentPost.title);
      const newSlug = generateSlug(title);
      const existingPost = await prisma.blogPost?.findUnique({
        where: { slug: newSlug },
      });

      if (existingPost && existingPost.id !== postId) {
        return {
          success: false,
          error:
            "A blog post with this title already exists. Please choose a different title.",
        };
      }

      updateData.slug = newSlug;
    }

    // Set publishedAt if publishing for the first time
    if (published && !currentPost.published) {
      updateData.publishedAt = new Date();
    }

    await prisma.blogPost.update({
      where: { id: postId },
      data: updateData,
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to update blog post:", error);
    return {
      success: false,
      error: "Failed to update blog post. Please try again.",
    };
  }
}

// Admin: Delete blog post
export async function deleteBlogPost(postId: string) {
  try {
    await requireAdmin();

    await prisma.blogPost.delete({
      where: { id: postId },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return {
      success: false,
      error: "Failed to delete blog post. Please try again.",
    };
  }
}

// Admin: Toggle blog post status
export async function toggleBlogPostStatus(
  postId: string,
  field: "published" | "featured"
) {
  try {
    await requireAdmin();

    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { [field]: true, publishedAt: true },
    });

    if (!post) {
      return { success: false, error: "Blog post not found" };
    }

    const updateData: any = {
      [field]: !post[field],
    };

    // Set publishedAt if publishing for the first time
    if (field === "published" && !post[field] && !post.publishedAt) {
      updateData.publishedAt = new Date();
    }

    await prisma.blogPost.update({
      where: { id: postId },
      data: updateData,
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to toggle blog post status:", error);
    return {
      success: false,
      error: "Failed to update blog post status.",
    };
  }
}
