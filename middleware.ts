import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { syncClerkUser } from "@/lib/auth"

const isProtectedRoute = createRouteMatcher(["/admin(.*)"])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()

    // Sync Clerk user with database on protected route access
    try {
      await syncClerkUser()
    } catch (error) {
      console.error("Failed to sync user:", error)
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
