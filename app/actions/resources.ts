"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { saveUploadedFile, validateFileType, validateFileSize } from "@/lib/file-upload"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Resend } from "resend"
import type { ResourceDownloadData } from "@/lib/types"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function getResources(filters?: {
  category?: string
  search?: string
  featured?: boolean
  published?: boolean
  page?: number
  limit?: number
}) {
  const { category, search, featured, published = true, page = 1, limit = 12 } = filters || {}

  const where: any = { published }

  if (category && category !== "ALL") {
    where.category = category
  }

  if (featured !== undefined) {
    where.featured = featured
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  const [resources, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      include: {
        author: true,
        downloads: true,
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.resource.count({ where }),
  ])

  return {
    resources,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  }
}

export async function getResourceBySlug(slug: string) {
  const resource = await prisma.resource.findUnique({
    where: { slug, published: true },
    include: {
      author: true,
      downloads: true,
    },
  })

  return resource
}

export async function createResource(formData: FormData) {
  const user = await requireAdmin()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const longDescription = formData.get("longDescription") as string
  const category = formData.get("category") as string
  const tool = formData.get("tool") as string
  const hasGuide = formData.get("hasGuide") === "true"
  const guideUrl = formData.get("guideUrl") as string
  const featured = formData.get("featured") === "true"
  const published = formData.get("published") === "true"

  // Handle file uploads
  const thumbnailFile = formData.get("thumbnail") as File
  const resourceFile = formData.get("resourceFile") as File

  let thumbnailPath: string | null = null
  let filePath: string | null = null

  // Validate and save thumbnail
  if (thumbnailFile && thumbnailFile.size > 0) {
    if (!validateFileType(thumbnailFile, ["image/jpeg", "image/png", "image/webp"])) {
      throw new Error("Invalid thumbnail file type. Only JPEG, PNG, and WebP are allowed.")
    }
    if (!validateFileSize(thumbnailFile, 5)) {
      throw new Error("Thumbnail file size must be less than 5MB.")
    }
    thumbnailPath = await saveUploadedFile(thumbnailFile, "thumbnails")
  }

  // Validate and save resource file
  if (resourceFile && resourceFile.size > 0) {
    if (!validateFileType(resourceFile, ["application/json", "application/zip", "application/pdf"])) {
      throw new Error("Invalid resource file type. Only JSON, ZIP, and PDF are allowed.")
    }
    if (!validateFileSize(resourceFile, 50)) {
      throw new Error("Resource file size must be less than 50MB.")
    }
    filePath = await saveUploadedFile(resourceFile, "resources")
  }

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  // Check if slug already exists
  const existingResource = await prisma.resource.findUnique({
    where: { slug },
  })

  if (existingResource) {
    throw new Error("A resource with this title already exists. Please choose a different title.")
  }

  const resource = await prisma.resource.create({
    data: {
      title,
      slug,
      description,
      longDescription: longDescription || null,
      thumbnail: thumbnailPath,
      filePath,
      fileType: resourceFile?.type || null,
      tool: tool || null,
      category: category as any,
      hasGuide,
      guideUrl: guideUrl || null,
      featured,
      published,
      authorId: user.id,
    },
  })

  revalidatePath("/resources")
  revalidatePath("/admin/resources")
  redirect("/admin/resources")
}

export async function updateResource(id: string, formData: FormData) {
  const user = await requireAdmin()

  const resource = await prisma.resource.findUnique({
    where: { id },
  })

  if (!resource) {
    throw new Error("Resource not found")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const longDescription = formData.get("longDescription") as string
  const category = formData.get("category") as string
  const tool = formData.get("tool") as string
  const hasGuide = formData.get("hasGuide") === "true"
  const guideUrl = formData.get("guideUrl") as string
  const featured = formData.get("featured") === "true"
  const published = formData.get("published") === "true"

  // Handle file uploads
  const thumbnailFile = formData.get("thumbnail") as File
  const resourceFile = formData.get("resourceFile") as File

  let thumbnailPath = resource.thumbnail
  let filePath = resource.filePath
  let fileType = resource.fileType

  // Update thumbnail if new file provided
  if (thumbnailFile && thumbnailFile.size > 0) {
    if (!validateFileType(thumbnailFile, ["image/jpeg", "image/png", "image/webp"])) {
      throw new Error("Invalid thumbnail file type. Only JPEG, PNG, and WebP are allowed.")
    }
    if (!validateFileSize(thumbnailFile, 5)) {
      throw new Error("Thumbnail file size must be less than 5MB.")
    }
    thumbnailPath = await saveUploadedFile(thumbnailFile, "thumbnails")
  }

  // Update resource file if new file provided
  if (resourceFile && resourceFile.size > 0) {
    if (!validateFileType(resourceFile, ["application/json", "application/zip", "application/pdf"])) {
      throw new Error("Invalid resource file type. Only JSON, ZIP, and PDF are allowed.")
    }
    if (!validateFileSize(resourceFile, 50)) {
      throw new Error("Resource file size must be less than 50MB.")
    }
    filePath = await saveUploadedFile(resourceFile, "resources")
    fileType = resourceFile.type
  }

  // Generate new slug if title changed
  let slug = resource.slug
  if (title !== resource.title) {
    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if new slug already exists
    const existingResource = await prisma.resource.findUnique({
      where: { slug: newSlug },
    })

    if (existingResource && existingResource.id !== id) {
      throw new Error("A resource with this title already exists. Please choose a different title.")
    }

    slug = newSlug
  }

  await prisma.resource.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      longDescription: longDescription || null,
      thumbnail: thumbnailPath,
      filePath,
      fileType,
      tool: tool || null,
      category: category as any,
      hasGuide,
      guideUrl: guideUrl || null,
      featured,
      published,
    },
  })

  revalidatePath("/resources")
  revalidatePath("/admin/resources")
  redirect("/admin/resources")
}

export async function deleteResource(id: string) {
  await requireAdmin()

  await prisma.resource.delete({
    where: { id },
  })

  revalidatePath("/resources")
  revalidatePath("/admin/resources")
}

export async function recordResourceDownload(data: ResourceDownloadData) {
  const { email, resourceId, action } = data

  // Record the download
  await prisma.resourceDownload.create({
    data: {
      email,
      resourceId,
      action: action as any,
    },
  })

  // Increment download count
  await prisma.resource.update({
    where: { id: resourceId },
    data: {
      downloadsCount: {
        increment: 1,
      },
    },
  })

  // Send email with download link
  if (process.env.RESEND_API_KEY) {
    try {
      const resource = await prisma.resource.findUnique({
        where: { id: resourceId },
      })

      if (resource) {
        await resend.emails.send({
          from: "resources@blazingautomations.com",
          to: email,
          subject: `Your ${resource.title} Download`,
          html: `
            <h2>Thanks for downloading ${resource.title}!</h2>
            <p>You can download your resource using the link below:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}${resource.filePath}" 
               style="background: #3f79ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Download ${resource.title}
            </a>
            <p>If you have any questions, feel free to reach out to our team.</p>
          `,
        })
      }
    } catch (error) {
      console.error("Failed to send download email:", error)
    }
  }

  return { success: true }
}
