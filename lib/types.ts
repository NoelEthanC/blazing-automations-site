import type { Resource, ResourceDownload, Lead, User, WatchUsBuildVideo } from "@prisma/client"

export type ResourceWithAuthor = Resource & {
  author: User
  downloads: ResourceDownload[]
}

export type LeadWithAssignee = Lead & {
  assignedTo?: User | null
}

export type VideoWithAuthor = WatchUsBuildVideo & {
  author: User
}

export interface ResourceFormData {
  title: string
  description: string
  longDescription?: string
  category: string
  tool?: string
  hasGuide: boolean
  guideUrl?: string
  featured: boolean
  published: boolean
}

export interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
}

export interface ResourceDownloadData {
  email: string
  resourceId: string
  action: "DOWNLOAD" | "EMAIL"
}

export interface VideoFormData {
  title: string
  description: string
  videoUrl: string
  duration?: string
  featured: boolean
  published: boolean
}

export interface LeadFilters {
  source?: string
  status?: string
  search?: string
  page?: number
  limit?: number
}
