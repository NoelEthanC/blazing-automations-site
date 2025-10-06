import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function requireAuth() {
  // If Clerk is not configured, return null
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return null;
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

export async function getCurrentUser() {
  // If Clerk is not configured, return null
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return null;
  }

  try {
    const user = await currentUser();

    console.log("currentUser", user);
    if (!user) {
      return null;
    }

    // Sync user with database
    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        role: "ADMIN",
        updatedAt: new Date(),
      },
      create: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        role: "ADMIN",
      },
    });

    return dbUser;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function isAdmin() {
  // If Clerk is not configured, return false
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return false;
  }

  try {
    const user = await getCurrentUser();
    return user?.role === "ADMIN";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
export async function requireAdmin() {
  // If Clerk is not configured, return false
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return false;
  }

  try {
    const user = await getCurrentUser();
    return user?.role === "ADMIN";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
