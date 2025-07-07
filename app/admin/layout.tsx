"use client"

import type React from "react"

import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
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
        <SidebarProvider>
          <AdminSidebar />
          <main className="flex-1 bg-[#09111f] min-h-screen">
            <div className="border-b border-gray-800 p-4">
              <SidebarTrigger />
            </div>
            <div className="p-6">{children}</div>
          </main>
        </SidebarProvider>
      </SignedIn>
    </ClerkProvider>
  )
}
