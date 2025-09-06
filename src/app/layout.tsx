import type { Metadata } from "next";
import { Literata } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const literata = Literata({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Nithyanruthyaaradana - Classical Dance Academy",
  description: "Learn classical dance forms including Bharatanatyam, Kathak, and more at our prestigious dance academy.",
  keywords: "classical dance, bharatanatyam, kathak, dance academy, dance classes, traditional dance",
  authors: [{ name: "Nithyanruthyaaradana" }],
  creator: "Nithyanruthyaaradana",
  publisher: "Nithyanruthyaaradana",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nithyanruthyaaradana.com'),
  openGraph: {
    title: "Nithyanruthyaaradana - Classical Dance Academy",
    description: "Learn classical dance forms including Bharatanatyam, Kathak, and more at our prestigious dance academy.",
    url: 'https://nithyanruthyaaradana.com',
    siteName: 'Nithyanruthyaaradana',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nithyanruthyaaradana Dance Academy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nithyanruthyaaradana - Classical Dance Academy",
    description: "Learn classical dance forms including Bharatanatyam, Kathak, and more at our prestigious dance academy.",
    images: ['/images/twitter-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B0000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://via.placeholder.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DanceSchool",
              "name": "Nithyanruthyaaradana",
              "description": "Classical Dance Academy offering Bharatanatyam, Kathak, and other traditional dance forms",
              "url": "https://nithyanruthyaaradana.com",
              "logo": "https://nithyanruthyaaradana.com/logo.png",
              "image": "https://nithyanruthyaaradana.com/images/academy.jpg",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service"
              },
              "sameAs": [
                "https://facebook.com/nithyanruthyaaradana",
                "https://instagram.com/nithyanruthyaaradana"
              ]
            })
          }}
        />
      </head>
      <body className={literata.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
