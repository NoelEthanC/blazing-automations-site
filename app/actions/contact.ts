"use server"

import { Resend } from "resend"
import type { ContactForm } from "@/lib/types"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContactForm(data: ContactForm) {
  try {
    // Send email notification
    await resend.emails.send({
      from: "contact@blazingautomations.com",
      to: "admin@blazingautomations.com",
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    })

    // Here you would also save to database
    // await prisma.lead.create({
    //   data: {
    //     email: data.email,
    //     source: "contact_form",
    //     metadata: JSON.stringify(data)
    //   }
    // })

    return { success: true }
  } catch (error) {
    console.error("Failed to submit contact form:", error)
    throw new Error("Failed to submit form")
  }
}
