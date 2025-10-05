"use server";

import { prisma } from "@/lib/prisma";
import {
  sendEmail,
  generateDownloadEmailTemplate,
  sendDownloadLinkEmail,
} from "@/lib/email";
import {
  createDownloadToken,
  generateDownloadToken,
  sendDownloadEmail,
  validateEmail,
} from "@/lib/download-utils";

export interface DownloadResult {
  success: boolean;
  downloadUrl?: string;
  message?: string;
  error?: string;
}

export async function downloadResourceAction(
  formData: FormData
): Promise<DownloadResult> {
  try {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const action = formData.get("action") as "download_now" | "send_email";
    const resourceSlug = formData.get("resourceSlug") as string;

    // Validate email
    if (!email || !validateEmail(email)) {
      return {
        success: false,
        error: "Please enter a valid email address",
      };
    }

    // Find resource
    const resource = await prisma.resource.findUnique({
      where: { slug: resourceSlug, published: true },
    });

    if (!resource) {
      return {
        success: false,
        error: "Resource not found",
      };
    }

    if (!resource.filePath) {
      return {
        success: false,
        error: "Resource file not available",
      };
    }

    // Generate download token
    const downloadToken = await createDownloadToken(resource.id, email);
    // const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/download/${downloadToken}`;
    const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/resources/${resource.slug}?download_token=${downloadToken}`;

    // Log download
    await prisma.resourceDownload.create({
      data: {
        email,
        resourceId: resource.id,
        name: name || "Mate",
        action: action === "download_now" ? "DOWNLOAD" : "EMAIL",
        token: downloadToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send email if requested
    if (action === "send_email") {
      await sendDownloadLinkEmail(resource.title, email, downloadUrl);
      return {
        success: true,
        message: "Download link sent to your email!",
      };
    }

    // Return download URL for immediate download
    return {
      success: true,
      downloadUrl,
      message: "Download starting...",
    };
  } catch (error) {
    console.error("Download action failed:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
