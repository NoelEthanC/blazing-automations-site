import { createHash } from "crypto"

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function generateDownloadToken(resourceId: string, email: string): string {
  const timestamp = Date.now().toString()
  const data = `${resourceId}:${email}:${timestamp}`
  const secret = process.env.DOWNLOAD_SECRET || "default-secret-change-in-production"

  const hash = createHash("sha256")
    .update(data + secret)
    .digest("hex")

  return Buffer.from(`${data}:${hash}`).toString("base64url")
}

export function verifyDownloadToken(token: string): { resourceId: string; email: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString()
    const [resourceId, email, timestamp, hash] = decoded.split(":")

    // Check if token is expired (24 hours)
    const tokenTime = Number.parseInt(timestamp)
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000

    if (now - tokenTime > twentyFourHours) {
      return null
    }

    // Verify hash
    const data = `${resourceId}:${email}:${timestamp}`
    const secret = process.env.DOWNLOAD_SECRET || "default-secret-change-in-production"

    const expectedHash = createHash("sha256")
      .update(data + secret)
      .digest("hex")

    if (hash !== expectedHash) {
      return null
    }

    return { resourceId, email }
  } catch (error) {
    return null
  }
}
