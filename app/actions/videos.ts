"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

// Fetch published videos for public pages
export async function getPublishedVideos() {
  try {
    const videos = await prisma.watchUsBuildVideo.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return videos
  } catch (error) {
    console.error("Failed to fetch videos:", error)
    return []
  }
}

// Fetch featured video for homepage
export async function getFeaturedVideo() {
  try {
    const video = await prisma.watchUsBuildVideo.findFirst({
      where: {
        published: true,
        featured: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return video
  } catch (error) {
    console.error("Failed to fetch featured video:", error)
    return null
  }
}

// Admin: Fetch all videos
export async function getAllVideos() {
  try {
    await requireAdmin()

    const videos = await prisma.watchUsBuildVideo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return videos
  } catch (error) {
    console.error("Failed to fetch all videos:", error)
    return []
  }
}

// Admin: Create video
export async function createVideo(prevState: any, formData: FormData) {
  try {
    await requireAdmin()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const videoUrl = formData.get("videoUrl") as string
    const thumbnail = formData.get("thumbnail") as string
    const featured = formData.get("featured") === "on"
    const published = formData.get("published") === "on"

    await prisma.watchUsBuildVideo.create({
      data: {
        title,
        description: description || null,
        videoUrl,
        thumbnail: thumbnail || null,
        featured,
        published,
      },
    })

    revalidatePath("/admin/videos")
    revalidatePath("/watch-us-build")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to create video:", error)
    return {
      success: false,
      error: "Failed to create video. Please try again.",
    }
  }
}

// Admin: Update video
export async function updateVideo(videoId: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const videoUrl = formData.get("videoUrl") as string
    const thumbnail = formData.get("thumbnail") as string
    const featured = formData.get("featured") === "on"
    const published = formData.get("published") === "on"

    await prisma.watchUsBuildVideo.update({
      where: { id: videoId },
      data: {
        title,
        description: description || null,
        videoUrl,
        thumbnail: thumbnail || null,
        featured,
        published,
      },
    })

    revalidatePath("/admin/videos")
    revalidatePath("/watch-us-build")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to update video:", error)
    return {
      success: false,
      error: "Failed to update video. Please try again.",
    }
  }
}

// Admin: Delete video
export async function deleteVideo(videoId: string) {
  try {
    await requireAdmin()

    await prisma.watchUsBuildVideo.delete({
      where: { id: videoId },
    })

    revalidatePath("/admin/videos")
    revalidatePath("/watch-us-build")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete video:", error)
    return {
      success: false,
      error: "Failed to delete video. Please try again.",
    }
  }
}
