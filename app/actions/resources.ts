"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { nanoid } from "nanoid"

// Fetch all published resources
export async function getPublishedResources() {
  try {
    const resources = await prisma.resource.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            downloads: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return resources
  } catch (error) {
    console.error("Failed to fetch resources:", error)
    return []
  }
}

// Fetch featured resources for homepage
export async function getFeaturedResources() {
  try {
    const resources = await prisma.resource.findMany({
      where: {
        published: true,
        featured: true,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            downloads: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    })

    return resources
  } catch (error) {
    console.error("Failed to fetch featured resources:", error)
    return []
  }
}

// Fetch single resource by slug
export async function getResourceBySlug(slug: string) {
  try {
    const resource = await prisma.resource.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        downloads: {
          select: {
            id: true,
            createdAt: true,
            email: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    })

    return resource
  } catch (error) {
    console.error("Failed to fetch resource:", error)
    return null
  }
}

// Admin: Fetch all resources
export async function getAllResources() {
  try {
    await requireAdmin()

    const resources = await prisma.resource.findMany({
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            downloads: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return resources
  } catch (error) {
    console.error("Failed to fetch all resources:", error)
    return []
  }
}

// Admin: Create new resource
export async function createResource(prevState: any, formData: FormData) {
  try {
    const user = await requireAdmin()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const longDescription = formData.get("longDescription") as string
    const category = formData.get("category") as string
    const tool = formData.get("tool") as string
    const hasGuide = formData.get("hasGuide") === "on"
    const guideUrl = formData.get("guideUrl") as string
    const featured = formData.get("featured") === "on"
    const published = formData.get("published") === "on"

    // Handle file uploads
    const thumbnailFile = formData.get("thumbnail") as File
    const resourceFile = formData.get("resourceFile") as File

    let thumbnailPath = null
    let filePath = null

    // Upload thumbnail
    if (thumbnailFile && thumbnailFile.size > 0) {
      const thumbnailDir = join(process.cwd(), "public", "uploads", "thumbnails")
      await mkdir(thumbnailDir, { recursive: true })

      const thumbnailExt = thumbnailFile.name.split(".").pop()
      const thumbnailName = `${nanoid()}.${thumbnailExt}`
      const thumbnailFullPath = join(thumbnailDir, thumbnailName)

      const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer())
      await writeFile(thumbnailFullPath, thumbnailBuffer)

      thumbnailPath = `/uploads/thumbnails/${thumbnailName}`
    }

    // Upload resource file
    if (resourceFile && resourceFile.size > 0) {
      const resourceDir = join(process.cwd(), "public", "uploads", "resources")
      await mkdir(resourceDir, { recursive: true })

      const resourceExt = resourceFile.name.split(".").pop()
      const resourceName = `${nanoid()}.${resourceExt}`
      const resourceFullPath = join(resourceDir, resourceName)

      const resourceBuffer = Buffer.from(await resourceFile.arrayBuffer())
      await writeFile(resourceFullPath, resourceBuffer)

      filePath = `/uploads/resources/${resourceName}`
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Create resource
    const resource = await prisma.resource.create({
      data: {
        title,
        slug,
        description,
        longDescription: longDescription || null,
        category: category as any,
        tool: tool || null,
        hasGuide,
        guideUrl: guideUrl || null,
        featured,
        published,
        thumbnail: thumbnailPath,
        filePath,
        fileType: resourceFile?.type || null,
        authorId: user.id,
      },
    })

    revalidatePath("/admin/resources")
    revalidatePath("/resources")
    revalidatePath("/")

    return { success: true, resourceId: resource.id }
  } catch (error) {
    console.error("Failed to create resource:", error)
    return {
      success: false,
      error: "Failed to create resource. Please try again.",
    }
  }
}

// Admin: Update resource
export async function updateResource(resourceId: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const longDescription = formData.get("longDescription") as string
    const category = formData.get("category") as string
    const tool = formData.get("tool") as string
    const hasGuide = formData.get("hasGuide") === "on"
    const guideUrl = formData.get("guideUrl") as string
    const featured = formData.get("featured") === "on"
    const published = formData.get("published") === "on"

    // Handle file uploads
    const thumbnailFile = formData.get("thumbnail") as File
    const resourceFile = formData.get("resourceFile") as File

    const updateData: any = {
      title,
      description,
      longDescription: longDescription || null,
      category: category as any,
      tool: tool || null,
      hasGuide,
      guideUrl: guideUrl || null,
      featured,
      published,
    }

    // Upload new thumbnail if provided
    if (thumbnailFile && thumbnailFile.size > 0) {
      const thumbnailDir = join(process.cwd(), "public", "uploads", "thumbnails")
      await mkdir(thumbnailDir, { recursive: true })

      const thumbnailExt = thumbnailFile.name.split(".").pop()
      const thumbnailName = `${nanoid()}.${thumbnailExt}`
      const thumbnailFullPath = join(thumbnailDir, thumbnailName)

      const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer())
      await writeFile(thumbnailFullPath, thumbnailBuffer)

      updateData.thumbnail = `/uploads/thumbnails/${thumbnailName}`
    }

    // Upload new resource file if provided
    if (resourceFile && resourceFile.size > 0) {
      const resourceDir = join(process.cwd(), "public", "uploads", "resources")
      await mkdir(resourceDir, { recursive: true })

      const resourceExt = resourceFile.name.split(".").pop()
      const resourceName = `${nanoid()}.${resourceExt}`
      const resourceFullPath = join(resourceDir, resourceName)

      const resourceBuffer = Buffer.from(await resourceFile.arrayBuffer())
      await writeFile(resourceFullPath, resourceBuffer)

      updateData.filePath = `/uploads/resources/${resourceName}`
      updateData.fileType = resourceFile.type
    }

    // Update slug if title changed
    updateData.slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    await prisma.resource.update({
      where: { id: resourceId },
      data: updateData,
    })

    revalidatePath("/admin/resources")
    revalidatePath("/resources")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to update resource:", error)
    return {
      success: false,
      error: "Failed to update resource. Please try again.",
    }
  }
}

// Admin: Delete resource
export async function deleteResource(resourceId: string) {
  try {
    await requireAdmin()

    await prisma.resource.delete({
      where: { id: resourceId },
    })

    revalidatePath("/admin/resources")
    revalidatePath("/resources")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete resource:", error)
    return {
      success: false,
      error: "Failed to delete resource. Please try again.",
    }
  }
}

// Admin: Toggle resource status
export async function toggleResourceStatus(resourceId: string, field: "published" | "featured") {
  try {
    await requireAdmin()

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { [field]: true },
    })

    if (!resource) {
      return { success: false, error: "Resource not found" }
    }

    await prisma.resource.update({
      where: { id: resourceId },
      data: {
        [field]: !resource[field],
      },
    })

    revalidatePath("/admin/resources")
    revalidatePath("/resources")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to toggle resource status:", error)
    return {
      success: false,
      error: "Failed to update resource status.",
    }
  }
}
