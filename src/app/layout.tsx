import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatterbox Teams | Modern Team Communication",
  description: "Chatterbox Teams is the simplest way for modern teams to communicate. Fast, secure, and built for high-performance collaboration.",
  keywords: ["team chat", "collaboration tool", "modern communication", "chatterbox teams", "secure messaging", "real-time chat"],
  authors: [{ name: "Chatterbox Teams" }],
  openGraph: {
    title: "Chatterbox Teams | Modern Team Communication",
    description: "The simplest way to communicate. Fast, secure, and clear.",
    url: "https://chatterboxteams.com",
    siteName: "Chatterbox Teams",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chatterbox Teams | Modern Team Communication",
    description: "The simplest way to communicate. Fast, secure, and clear.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-inter antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
