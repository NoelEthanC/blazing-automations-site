import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "../globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Blazing Automations - Auth",
    template: "%s | Blazing Automations",
  },
  description:
    "Transform your business with premium Make.com, Zapier, and n8n automation templates. Save hours of setup time with our professionally crafted workflows.",
  keywords: [
    "automation",
    "make.com",
    "zapier",
    "n8n",
    "make money online",
    "ai agent",
    "workflows",
    "business automation",
    "AI automation",
    "web development",
    "social media automation",
    "automation consulting",
    "workflow optimization",
    "integration services",
    "automation tools",
    "digital transformation",
    "ai automation",
    "youtube automation",
  ],
  authors: [{ name: "Blazing Automations" }],
  creator: "Blazing Automations",
  publisher: "Blazing Automations",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://blazingautomations.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blazingautomations.com",
    siteName: "Blazing Automations",
    title: "Blazing Automations -  AI Automation & Web Solutions",
    description:
      "Transform your business with premium Make.com, Zapier, and n8n automation templates. Save hours of setup time with our professionally crafted workflows.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Blazing Automations - Premium Automation Templates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blazing Automations - Premium Automation Templates & Resources",
    description:
      "Transform your business with premium Make.com, Zapier, and n8n automation templates. Save hours of setup time with our professionally crafted workflows.",
    images: ["/opengraph-image.png"],
    creator: "@noelethan_dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: `${process.env.NEXT_PUBLIC_GA_ID || ""}`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
          {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
