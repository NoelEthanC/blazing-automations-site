import { auth } from "@clerk/nextjs/server"
import { prisma } from "./prisma"

export async function requireAdmin() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  // Sync user with database if not exists
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      email: "admin@blazingautomations.com", // This should come from Clerk
      role: "ADMIN",
    },
  })

  if (user.role !== "ADMIN") {
    throw new Error("Admin access required")
  }

  return user
}

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return await prisma.user.findUnique({
    where: { clerkId: userId },
  })
}
