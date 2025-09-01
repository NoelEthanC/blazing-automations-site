import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Blazing Automations - AI Automation & Web Solutions",
  description:
    "Transform your business with AI automation and web solutions that work for you. Custom workflows, chatbots, and business websites.",
  keywords: "AI automation, business automation, web development, chatbots, workflows",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!clerkPublishableKey) {
    console.warn("Clerk publishable key is missing. Authentication features will be disabled.")
    return (
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <body className={`${inter.className} bg-[#09111f] text-white antialiased`}>{children}</body>
      </html>
    )
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <body className={`${inter.className} bg-[#09111f] text-white antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
