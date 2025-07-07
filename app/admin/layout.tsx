"use client"

import type React from "react"

import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import { AdminLayout } from "@/components/admin/admin-layout"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <AdminLayout>{children}</AdminLayout>
      </SignedIn>
    </ClerkProvider>
  )
}
