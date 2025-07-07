import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "./prisma"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return userId
}

export async function requireAdmin() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect("/sign-in")
  }

  // Sync user with database
  const user = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    },
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      role: "USER", // Default role, manually promote to ADMIN in database
    },
  })

  if (user.role !== "ADMIN") {
    redirect("/")
  }

  return user
}

export async function getCurrentUser() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return null
  }

  const user = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    },
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      role: "USER",
    },
  })

  return user
}
