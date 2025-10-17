import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupDuplicateUsers() {
  console.log("🔍 Checking for duplicate users...");

  // 1. Group users by email and find duplicates
  const duplicates = await prisma.user.groupBy({
    by: ["email"],
    _count: { email: true },
    having: {
      email: { _count: { gt: 1 } },
    },
  });

  if (duplicates.length === 0) {
    console.log("✅ No duplicate users found.");
    return;
  }

  console.log(`⚠️ Found ${duplicates.length} duplicate email(s).`);

  for (const dup of duplicates) {
    const { email } = dup;
    console.log(`\n🧩 Resolving duplicates for: ${email}`);

    // 2. Fetch all users with this email
    const users = await prisma.user.findMany({
      where: { email },
      orderBy: { createdAt: "asc" }, // Keep the oldest one
    });

    // 3. Keep the first, delete others
    const keep = users[0];
    const toDelete = users.slice(1);

    for (const user of toDelete) {
      console.log(
        `   🗑️ Deleting duplicate user: ${user.id} (clerkId: ${user.clerkId})`
      );

      // Reassign ownership of related data if needed
      await prisma.resource.updateMany({
        where: { authorId: user.id },
        data: { authorId: keep.id },
      });
      await prisma.blogPost.updateMany({
        where: { authorId: user.id },
        data: { authorId: keep.id },
      });

      // Delete duplicate user
      await prisma.user.delete({ where: { id: user.id } });
    }

    console.log(`   ✅ Kept user: ${keep.id} (clerkId: ${keep.clerkId})`);
  }

  console.log("\n🎉 Cleanup complete!");
}

cleanupDuplicateUsers()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
