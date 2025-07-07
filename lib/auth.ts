"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return user
}

export async function requireAdmin() {
  const user = await requireAuth()

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/")
  }

  return user
}

export async function syncClerkUser() {
  const { userId, user: clerkUser } = await auth()

  if (!userId || !clerkUser) {
    return null
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (existingUser) {
    return existingUser
  }

  // Create new user from Clerk data
  const newUser = await prisma.user.create({
    data: {
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      role: "USER", // Default role, can be changed in admin
    },
  })

  return newUser
}
