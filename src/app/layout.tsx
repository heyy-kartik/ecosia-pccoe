import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Poppins, DM_Sans, Red_Hat_Display, Unbounded } from "next/font/google";
export const metadata: Metadata = {
  title: "Ecosia PCCOE - Educational Platform",
  description: "Age-appropriate educational content platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
