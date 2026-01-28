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

import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "index",
  description: "a simple chatroom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-[#f6f6ef] text-black min-h-screen font-sans`}
      >
        <Header />
        <main className="container mx-auto px-1 max-w-4xl">
          {children}
        </main>
        <footer className="border-t border-[#ff6600] mt-10 py-4 text-center text-xs text-gray-600">
          <div className="space-x-2 mb-2">
            <a href="#" className="hover:underline">Guidelines</a>
            <span>|</span>
            <a href="#" className="hover:underline">FAQ</a>
            <span>|</span>
            <a href="#" className="hover:underline">Support</a>
          </div>
          <p>© {new Date().getFullYear()} index</p>
        </footer>
      </body>
    </html>
  );
}
