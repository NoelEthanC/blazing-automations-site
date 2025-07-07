"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface ResourceDownloadData {
  email: string
  resourceId: string
  action: "download" | "email"
}

export async function submitResourceDownload(data: ResourceDownloadData) {
  try {
    // Send email with download link
    await resend.emails.send({
      from: "resources@blazingautomations.com",
      to: data.email,
      subject: "Your Free Template Download",
      html: `
        <h2>Thanks for downloading our template!</h2>
        <p>You can download your template using the link below:</p>
        <a href="https://blazingautomations.com/downloads/${data.resourceId}" 
           style="background: #3f79ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Download Template
        </a>
        <p>If you have any questions, feel free to reach out to our team.</p>
      `,
    })

    // Here you would also save to database
    // await prisma.lead.create({
    //   data: {
    //     email: data.email,
    //     resourceId: data.resourceId,
    //     source: "resource_download"
    //   }
    // })

    return { success: true }
  } catch (error) {
    console.error("Failed to process resource download:", error)
    throw new Error("Failed to process download")
  }
}
