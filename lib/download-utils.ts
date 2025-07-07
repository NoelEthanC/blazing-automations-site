import crypto from "crypto"

const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET || "your-secret-key"

export function generateDownloadToken(resourceId: string, email: string): string {
  const payload = {
    resourceId,
    email,
    timestamp: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }

  const payloadString = JSON.stringify(payload)
  const signature = crypto.createHmac("sha256", DOWNLOAD_SECRET).update(payloadString).digest("hex")

  return Buffer.from(JSON.stringify({ payload, signature })).toString("base64url")
}

export function verifyDownloadToken(token: string): { resourceId: string; email: string } | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64url").toString())
    const { payload, signature } = decoded

    // Verify signature
    const expectedSignature = crypto.createHmac("sha256", DOWNLOAD_SECRET).update(JSON.stringify(payload)).digest("hex")

    if (signature !== expectedSignature) {
      return null
    }

    // Check expiration
    if (Date.now() > payload.expiresAt) {
      return null
    }

    return {
      resourceId: payload.resourceId,
      email: payload.email,
    }
  } catch (error) {
    return null
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
