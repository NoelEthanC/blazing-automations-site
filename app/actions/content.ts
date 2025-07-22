"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

// Fetch site content by key
export async function getSiteContent(key: string) {
  try {
    const content = await prisma.siteContent.findUnique({
      where: { key },
    })

    return content
  } catch (error) {
    console.error(`Failed to fetch content for ${key}:`, error)
    return null
  }
}

// Fetch all site content
export async function getAllSiteContent() {
  try {
    const content = await prisma.siteContent.findMany({
      orderBy: {
        key: "asc",
      },
    })

    return content
  } catch (error) {
    console.error("Failed to fetch all site content:", error)
    return []
  }
}

// Admin: Update site content
export async function updateSiteContent(prevState: any, formData: FormData) {
  try {
    await requireAdmin()

    const key = formData.get("key") as string
    const title = formData.get("title") as string
    const content = formData.get("content") as string

    // Parse additional fields based on content type
    const metadata: any = {}

    // Hero section
    if (key === "hero") {
      metadata.subtitle = formData.get("subtitle") as string
      metadata.ctaText = formData.get("ctaText") as string
      metadata.ctaUrl = formData.get("ctaUrl") as string
    }

    // Services section
    if (key === "services") {
      metadata.description = formData.get("description") as string
    }

    // Contact section
    if (key === "contact") {
      metadata.email = formData.get("email") as string
      metadata.phone = formData.get("phone") as string
      metadata.address = formData.get("address") as string
    }

    await prisma.siteContent.upsert({
      where: { key },
      update: {
        title: title || null,
        content,
        metadata,
      },
      create: {
        key,
        title: title || null,
        content,
        metadata,
      },
    })

    revalidatePath("/")
    revalidatePath("/admin/content")

    return { success: true }
  } catch (error) {
    console.error("Failed to update site content:", error)
    return {
      success: false,
      error: "Failed to update content. Please try again.",
    }
  }
}

// Admin: Delete site content
export async function deleteSiteContent(key: string) {
  try {
    await requireAdmin()

    await prisma.siteContent.delete({
      where: { key },
    })

    revalidatePath("/")
    revalidatePath("/admin/content")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete site content:", error)
    return {
      success: false,
      error: "Failed to delete content. Please try again.",
    }
  }
}
