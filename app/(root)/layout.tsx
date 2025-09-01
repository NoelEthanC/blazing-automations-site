import type React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blazing Automations - AI Automation & Web Solutions",
  description:
    "Transforming businesses with AI automation and web solutions that work for you.",
  keywords:
    "AI automation, web development, business automation, digital transformation",
  authors: [{ name: "Blazing Automations" }],
  creator: "Blazing Automations",
  publisher: "Blazing Automations",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blazingautomations.com",
    title: "Blazing Automations - AI Automation & Web Solutions",
    description:
      "Transforming businesses with AI automation and web solutions that work for you.",
    siteName: "Blazing Automations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blazing Automations - AI Automation & Web Solutions",
    description:
      "Transforming businesses with AI automation and web solutions that work for you.",
    creator: "@blazingauto",
  },
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    // Render without Clerk if not configured
    return (
      <html lang="en">
        <body className={`${inter.className}  antialiased`}>
          <Header />
          {children}
          <Footer />
          {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en">
        <body className={`${inter.className}  antialiased`}>
          <Header />
          {children}
          <Footer />
          {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
