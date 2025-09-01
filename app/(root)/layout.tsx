import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blazing Automations |  AI Agents & Web Solutions",
  description:
    "Empower your business with AI-driven automation, intelligent chatbots, and modern web development. We build custom workflows and smart systems that scale with your growth.",
  keywords:
    "AI automation, business automation, workflow automation, AI agents, custom chatbots, intelligent systems, web development, modern websites, productivity tools, digital transformation, n8n automation",
  metadataBase: new URL("https://blazingautomations.com"), // Replace with your actual domain
  openGraph: {
    title: "Blazing Automations | Smarter Workflows, AI Agents & Web Solutions",
    description:
      "Turn chaos into clarity with intelligent automation. Discover how Blazing Automations helps you build scalable systems and stunning websites.",
    url: "https://www.blazingautomations.com",
    siteName: "Blazing Automations",
    images: [
      {
        url: "/og-image.png", // Host this image in your public folder
        width: 1200,
        height: 630,
        alt: "Blazing Automations Banner",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blazing Automations | AI Automation & Web Solutions",
    description:
      "Boost productivity and scale your business with powerful AI tools, custom workflows, and professional websites.",
    images: ["/og-image.png"],
    creator: "@noelethan_dev", // Optional if you have a Twitter handle
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
