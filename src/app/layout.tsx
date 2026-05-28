import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kundai Pixel | Creative Studio",
  description: "Premium creative studio by Kundai Guvaza - Photography, Design & Visual Art",
  keywords: ["creative studio", "photography", "design", "visual art", "kundai pixel"],
  openGraph: {
    title: "Kundai Pixel | Creative Studio",
    description: "Premium creative studio by Kundai Guvaza",
    images: ["https://i.ibb.co/kgPDwfqw/2.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}