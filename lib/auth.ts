import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return userId;
}

export async function requireAdmin() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check if user exists in database and is admin
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    throw new Error("Admin access required");
  }

  return dbUser;
}

export async function getCurrentUser() {
  const user = await currentUser();

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
}
