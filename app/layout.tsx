import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body>
        {children}

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

export const metadata = {
  generator: "Noel Ethan",
};
