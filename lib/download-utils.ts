import { nanoid } from "nanoid"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

export async function generateDownloadToken(resourceId: string, email: string) {
  const token = nanoid(32)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  await prisma.resourceDownload.create({
    data: {
      token,
      email,
      resourceId,
      expiresAt,
      action: "DOWNLOAD_REQUESTED",
    },
  })

  return token
}

export async function sendDownloadEmail(resourceId: string, email: string, token: string) {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: { title: true, description: true },
  })

  if (!resource) {
    throw new Error("Resource not found")
  }

  const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/download/${token}`

  await sendEmail({
    to: email,
    subject: `Your download link for ${resource.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3f79ff;">Your Download is Ready!</h2>
        <p>Thank you for downloading <strong>${resource.title}</strong>.</p>
        <p>${resource.description}</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${downloadUrl}" 
             style="background-color: #3f79ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Download Now
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          This download link will expire in 24 hours for security reasons.
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Best regards,<br>
          The Blazing Automations Team
        </p>
      </div>
    `,
  })
}
