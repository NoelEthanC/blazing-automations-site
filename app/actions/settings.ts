"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateSettingsAction(prevState: any, formData: FormData) {
  try {
    await requireAdmin()

    const category = formData.get("category") as string

    // Prepare settings data based on category
    const settings: Record<string, any> = {}

    if (category === "general") {
      settings.siteName = formData.get("siteName") as string
      settings.siteUrl = formData.get("siteUrl") as string
      settings.maintenanceMode = formData.get("maintenanceMode") === "on"
      settings.analyticsEnabled = formData.get("analyticsEnabled") === "on"
    }

    if (category === "email") {
      settings.smtpHost = formData.get("smtpHost") as string
      settings.smtpPort = formData.get("smtpPort") as string
      settings.fromEmail = formData.get("fromEmail") as string
      settings.replyTo = formData.get("replyTo") as string
    }

    if (category === "api") {
      settings.resendApiKey = formData.get("resendApiKey") as string
      settings.analyticsId = formData.get("analyticsId") as string
      settings.clerkKey = formData.get("clerkKey") as string
    }

    // Save each setting
    for (const [key, value] of Object.entries(settings)) {
      if (value !== null && value !== undefined && value !== "") {
        await prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      }
    }

    revalidatePath("/admin/settings")

    return { success: true }
  } catch (error) {
    console.error("Settings update failed:", error)
    return {
      success: false,
      error: "Failed to update settings. Please try again.",
    }
  }
}

export async function getSettings() {
  try {
    const settings = await prisma.setting.findMany()

    const settingsMap: Record<string, string> = {}
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value
    })

    return settingsMap
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return {}
  }
}
