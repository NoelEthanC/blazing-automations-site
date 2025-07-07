"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import type { ContactFormData, LeadFilters } from "@/lib/types"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContactForm(data: ContactFormData) {
  try {
    // Create contact submission
    const submission = await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company || null,
        message: data.message,
      },
    })

    // Create lead entry
    await prisma.lead.create({
      data: {
        email: data.email,
        name: data.name,
        company: data.company || null,
        message: data.message,
        source: "CONTACT_FORM",
      },
    })

    // Send notification email
    if (process.env.RESEND_API_KEY) {
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
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to submit contact form:", error)
    throw new Error("Failed to submit form")
  }
}

export async function getLeads(filters: LeadFilters = {}) {
  await requireAdmin()

  const { source, status, search, page = 1, limit = 20 } = filters

  const where: any = {}

  if (source && source !== "ALL") {
    where.source = source
  }

  if (status && status !== "ALL") {
    where.status = status
  }

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
    ]
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        assignedTo: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.lead.count({ where }),
  ])

  return {
    leads,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  }
}

export async function updateLeadStatus(id: string, status: string) {
  await requireAdmin()

  await prisma.lead.update({
    where: { id },
    data: { status: status as any },
  })
}

export async function assignLead(id: string, userId: string) {
  await requireAdmin()

  await prisma.lead.update({
    where: { id },
    data: { assignedToId: userId },
  })
}

export async function exportLeads(filters: LeadFilters = {}) {
  await requireAdmin()

  const { source, status, search } = filters
  const where: any = {}

  if (source && source !== "ALL") {
    where.source = source
  }

  if (status && status !== "ALL") {
    where.status = status
  }

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
    ]
  }

  const leads = await prisma.lead.findMany({
    where,
    include: {
      assignedTo: true,
    },
    orderBy: { createdAt: "desc" },
  })

  // Convert to CSV format
  const csvHeaders = ["Email", "Name", "Company", "Source", "Status", "Assigned To", "Created At"]
  const csvRows = leads.map((lead) => [
    lead.email,
    lead.name || "",
    lead.company || "",
    lead.source,
    lead.status,
    lead.assignedTo ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName}` : "",
    lead.createdAt.toISOString(),
  ])

  const csvContent = [csvHeaders, ...csvRows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

  return csvContent
}
