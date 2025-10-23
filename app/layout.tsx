import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="impact-site-verification"
          content="04962437-f4b9-4c13-8024-fe891c0f7fc3"
        />
      </head>
      <body>
        {children}

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

export const metadata = {
      generator: 'v0.app'
    };
