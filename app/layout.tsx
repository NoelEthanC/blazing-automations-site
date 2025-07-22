import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blazing Automations - AI Automation & Web Solutions",
  description:
    "Transform your business with AI automation and web solutions that work for you. Custom workflows, chatbots, and business websites.",
  keywords:
    "AI automation, business automation, web development, chatbots, workflows",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <body
          className={`${inter.className} bg-[#09111f] text-white antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
