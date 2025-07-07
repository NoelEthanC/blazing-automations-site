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
            email: true,
            createdAt: true,
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
export async function getAllResourcesForAdmin() {
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
    console.error("Failed to fetch admin resources:", error)
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

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Handle file uploads
    let thumbnailPath = null
    let resourceFilePath = null

    const thumbnailFile = formData.get("thumbnail") as File
    const resourceFile = formData.get("resourceFile") as File

    if (thumbnailFile && thumbnailFile.size > 0) {
      const thumbnailId = nanoid()
      const thumbnailExt = thumbnailFile.name.split(".").pop()
      const thumbnailFileName = `${thumbnailId}.${thumbnailExt}`

      await mkdir(join(process.cwd(), "public/uploads/thumbnails"), { recursive: true })
      const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer())
      await writeFile(join(process.cwd(), "public/uploads/thumbnails", thumbnailFileName), thumbnailBuffer)

      thumbnailPath = `/uploads/thumbnails/${thumbnailFileName}`
    }

    if (resourceFile && resourceFile.size > 0) {
      const fileId = nanoid()
      const fileExt = resourceFile.name.split(".").pop()
      const fileName = `${fileId}.${fileExt}`

      await mkdir(join(process.cwd(), "public/uploads/resources"), { recursive: true })
      const fileBuffer = Buffer.from(await resourceFile.arrayBuffer())
      await writeFile(join(process.cwd(), "public/uploads/resources", fileName), fileBuffer)

      resourceFilePath = `/uploads/resources/${fileName}`
    }

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
        filePath: resourceFilePath,
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

    // Generate new slug if title changed
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Handle file uploads (similar to create)
    const updateData: any = {
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
    }

    const thumbnailFile = formData.get("thumbnail") as File
    const resourceFile = formData.get("resourceFile") as File

    if (thumbnailFile && thumbnailFile.size > 0) {
      const thumbnailId = nanoid()
      const thumbnailExt = thumbnailFile.name.split(".").pop()
      const thumbnailFileName = `${thumbnailId}.${thumbnailExt}`

      await mkdir(join(process.cwd(), "public/uploads/thumbnails"), { recursive: true })
      const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer())
      await writeFile(join(process.cwd(), "public/uploads/thumbnails", thumbnailFileName), thumbnailBuffer)

      updateData.thumbnail = `/uploads/thumbnails/${thumbnailFileName}`
    }

    if (resourceFile && resourceFile.size > 0) {
      const fileId = nanoid()
      const fileExt = resourceFile.name.split(".").pop()
      const fileName = `${fileId}.${fileExt}`

      await mkdir(join(process.cwd(), "public/uploads/resources"), { recursive: true })
      const fileBuffer = Buffer.from(await resourceFile.arrayBuffer())
      await writeFile(join(process.cwd(), "public/uploads/resources", fileName), fileBuffer)

      updateData.filePath = `/uploads/resources/${fileName}`
      updateData.fileType = resourceFile.type
    }

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

// Admin: Get resource for editing
export async function getResourceForEdit(resourceId: string) {
  try {
    await requireAdmin()

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return resource
  } catch (error) {
    console.error("Failed to fetch resource for edit:", error)
    return null
  }
}
