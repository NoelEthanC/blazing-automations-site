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

// add the nextjs metadata fro the dashboard here if needed

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}  antialiased`}>
        <ClerkProvider>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
          <SignedIn>
            <main>{children}</main>
          </SignedIn>
        </ClerkProvider>
      </body>
    </html>
  );
}
