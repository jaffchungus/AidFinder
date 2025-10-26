import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AidFinder",
  description: "Connect people in need with helpers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-bg min-h-screen antialiased">{children}</body>
    </html>
  );
}
