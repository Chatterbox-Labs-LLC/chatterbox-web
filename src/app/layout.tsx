import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chatterboxteams.com"),
  title: {
    default: "Chatterbox Teams | The Simplest Team Communication Platform",
    template: "%s | Chatterbox Teams"
  },
  description: "Chatterbox Teams is the fastest, most secure team communication platform. Experience clear, simple, and high-performance collaboration for modern teams.",
  keywords: [
    "chatterbox teams", 
    "chatterbox", 
    "team communication", 
    "business chat", 
    "secure messaging", 
    "collaboration software", 
    "team collaboration", 
    "modern workplace", 
    "chat for teams"
  ],
  authors: [{ name: "Chatterbox Teams" }],
  creator: "Chatterbox Teams",
  publisher: "Chatterbox Teams",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Chatterbox Teams | The Simplest Team Communication Platform",
    description: "Experience the simplest way to communicate. Fast, secure, and built for teams that move quickly.",
    url: "https://chatterboxteams.com",
    siteName: "Chatterbox Teams",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chatterbox Teams - Communication Simplified",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chatterbox Teams | The Simplest Team Communication Platform",
    description: "Fast, secure, and simple team communication. The future of collaboration.",
    images: ["/og-image.png"],
    creator: "@chatterboxteams",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://chatterboxteams.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Chatterbox Teams",
              "applicationCategory": "CommunicationApplication",
              "operatingSystem": "Web, Windows, macOS, Linux, iOS, Android",
              "description": "The simplest way for modern teams to communicate. Fast, secure, and clear.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Chatterbox Teams",
                "url": "https://chatterboxteams.com"
              }
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-inter antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
