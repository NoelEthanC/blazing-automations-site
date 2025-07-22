export interface Resource {
  id: string
  title: string
  description: string
  thumbnail: string
  fileType: string
  tool: string
  downloadUrl?: string
  hasGuide: boolean
  category: string
  createdAt: Date
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
}

export interface Lead {
  id: string
  email: string
  resourceId?: string
  source: string
  createdAt: Date
}

export interface ContactForm {
  name: string
  email: string
  message: string
  company?: string
}
