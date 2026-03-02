import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import BackToTop from "@/components/BackToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aetheris Vision | High-End Technical Consulting",
  description: "Advanced AI/ML weather prediction algorithms, operational meteorology, and federal contracting solutions.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  void nonce; // available for explicit <Script nonce={nonce}> usage if needed
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.className} bg-black text-gray-100 antialiased min-h-screen selection:bg-gray-800 selection:text-white`}
      >
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
