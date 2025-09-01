"use client";

import type React from "react";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { AdminLayout } from "@/components/admin/admin-layout";
import "../../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}  antialiased`}>
        <ClerkProvider>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
          <SignedIn>
            <AdminLayout>{children}</AdminLayout>
          </SignedIn>
        </ClerkProvider>
      </body>
    </html>
  );
}
