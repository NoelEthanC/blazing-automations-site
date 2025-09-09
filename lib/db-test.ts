import { prisma } from "./prisma"

export async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log("✅ Database connected successfully")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

export async function initializeDatabase() {
  try {
    // Test connection first
    await testDatabaseConnection()

    // Check if tables exist by trying to count users
    const userCount = await prisma.user.count()
    console.log(`📊 Current user count: ${userCount}`)

    return true
  } catch (error) {
    console.error("Database initialization error:", error)
    return false
  }
}
