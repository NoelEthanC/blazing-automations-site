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
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return null;
  }

  try {
    const user = await currentUser();
    if (!user) return null;

    const email = user.emailAddresses[0]?.emailAddress || "";

    // Try to find existing user by clerkId or email
    let dbUser = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId: user.id }, { email }],
      },
    });

    if (dbUser) {
      // Update existing
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          clerkId: user.id, // ensure sync
          email,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          role: "ADMIN",
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new user if none exists
      dbUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          role: "ADMIN",
        },
      });
    }

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
