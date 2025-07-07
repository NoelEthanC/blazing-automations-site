"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateSiteContentAction(prevState: any, formData: FormData) {
  try {
    await requireAdmin()

    const section = formData.get("section") as string
    const title = formData.get("title") as string
    const subtitle = formData.get("subtitle") as string
    const description = formData.get("description") as string
    const content = formData.get("content") as string
    const ctaText = formData.get("ctaText") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string

    // Prepare content data based on section
    let contentData: any = {}

    switch (section) {
      case "hero":
        contentData = {
          title,
          subtitle,
          ctaText,
        }
        break
      case "services":
        contentData = {
          title,
          description,
        }
        break
      case "about":
        contentData = {
          title,
          content,
        }
        break
      case "contact":
        contentData = {
          email,
          phone,
          address,
        }
        break
    }

    // Upsert content
    await prisma.siteContent.upsert({
      where: { key: section },
      update: {
        title: title || null,
        content: JSON.stringify(contentData),
        metadata: contentData,
      },
      create: {
        key: section,
        title: title || null,
        content: JSON.stringify(contentData),
        metadata: contentData,
      },
    })

    revalidatePath("/")
    revalidatePath("/admin/content")

    return { success: true }
  } catch (error) {
    console.error("Content update failed:", error)
    return {
      success: false,
      error: "Failed to update content. Please try again.",
    }
  }
}
