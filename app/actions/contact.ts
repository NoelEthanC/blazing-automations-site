"use server"

import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { revalidatePath } from "next/cache"

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const message = formData.get("message") as string

    // Validate required fields
    if (!name || !email || !message) {
      return {
        success: false,
        error: "Please fill in all required fields.",
      }
    }

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        company: company || null,
        message,
        status: "NEW",
      },
    })

    // Send notification email to admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@blazingautomations.com",
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <hr>
          <p><small>Submission ID: ${submission.id}</small></p>
        `,
      })
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError)
      // Don't fail the entire submission if email fails
    }

    // Send confirmation email to user
    try {
      await sendEmail({
        to: email,
        subject: "Thank you for contacting Blazing Automations",
        html: `
          <h2>Thank you for your message!</h2>
          <p>Hi ${name},</p>
          <p>We've received your message and will get back to you within 24 hours.</p>
          <p>Here's a copy of what you sent:</p>
          <blockquote style="border-left: 4px solid #3f79ff; padding-left: 16px; margin: 16px 0;">
            ${message.replace(/\n/g, "<br>")}
          </blockquote>
          <p>Best regards,<br>The Blazing Automations Team</p>
        `,
      })
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError)
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    }
  } catch (error) {
    console.error("Contact form submission failed:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}

// Admin: Get all contact submissions
export async function getContactSubmissions() {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return submissions
  } catch (error) {
    console.error("Failed to fetch contact submissions:", error)
    return []
  }
}

// Admin: Update contact submission status
export async function updateContactStatus(submissionId: string, status: string) {
  try {
    await prisma.contactSubmission.update({
      where: { id: submissionId },
      data: { status: status as any },
    })

    revalidatePath("/admin/contacts")

    return { success: true }
  } catch (error) {
    console.error("Failed to update contact status:", error)
    return {
      success: false,
      error: "Failed to update status.",
    }
  }
}
