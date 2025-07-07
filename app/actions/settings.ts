"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateSettingsAction(prevState: any, formData: FormData) {
  try {
    await requireAdmin()

    const category = formData.get("category") as string

    // Get all form data
    const settings: Array<{ key: string; value: string; type: string }> = []

    for (const [key, value] of formData.entries()) {
      if (key !== "category" && value) {
        let type = "string"

        // Determine type based on key name or value
        if (key.includes("Port") || key.includes("Count")) {
          type = "number"
        } else if (key.includes("Mode") || key.includes("Enabled")) {
          type = "boolean"
        } else if (key.includes("Email")) {
          type = "email"
        } else if (key.includes("Url") || key.includes("URL")) {
          type = "url"
        }

        settings.push({
          key: `${category}_${key}`,
          value: value.toString(),
          type,
        })
      }
    }

    // Upsert all settings
    for (const setting of settings) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: {
          value: setting.value,
          type: setting.type,
        },
        create: {
          key: setting.key,
          value: setting.value,
          type: setting.type,
        },
      })
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
