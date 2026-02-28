import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.className} bg-black text-gray-100 antialiased min-h-screen selection:bg-gray-800 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
