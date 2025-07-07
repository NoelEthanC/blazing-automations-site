import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function saveUploadedFile(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Create unique filename
  const timestamp = Date.now()
  const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

  // Ensure upload directory exists
  const uploadDir = join(process.cwd(), "public", "uploads", folder)
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  // Save file
  const filePath = join(uploadDir, filename)
  await writeFile(filePath, buffer)

  // Return public URL path
  return `/uploads/${folder}/${filename}`
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}
