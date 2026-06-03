import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://meowly.qzz.io"),
  title: {
    default: "Meowly | Stream Unlimited Movies & TV Shows Online Free",
    template: "%s | Meowly"
  },
  description: "Unlimited movies and TV shows for free. Inspired by Prime Video aesthetics, Meowly offers a premium streaming experience.",
  keywords: ["movies", "tv shows", "streaming", "free movies", "watch online", "meowly", "meowtv"],
  authors: [{ name: "Meowly Team" }],
  creator: "Meowly",
  publisher: "Meowly",
  referrer: "origin",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://meowly.qzz.io",
    siteName: "Meowly",
    title: "Meowly | Stream Unlimited Movies & TV Shows Online Free",
    description: "Unlimited movies and TV shows for free. Premium streaming experience with no ads.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Meowly Cinema",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meowly | Stream Unlimited Movies & TV Shows Online Free",
    description: "Unlimited movies and TV shows for free. Premium streaming experience.",
    images: ["/icon-512.png"],
    creator: "@meowly",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Meowly Cinema",
  },
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: "MFXUidrMrxwBxIyEzqURpd37qb60RTjPyxP8ZirR4KQ",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    // other: {
    //   me: ['my-email', 'my-link'],
    // },
  },
};

import dynamic from 'next/dynamic';
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import ClientOnlyComponents from "@/components/ClientOnlyComponents";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CSBPEBZBJF"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CSBPEBZBJF');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Meowly",
              "url": "https://meowly.qzz.io",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://meowly.qzz.io/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Meowly",
              "url": "https://meowly.qzz.io",
              "logo": "https://meowly.qzz.io/icon-512.png",
              "sameAs": [
                "https://twitter.com/meowly",
                "https://github.com/utkarshgupta188/meowly"
              ]
            })
          }}
        />
      </head>
      <body className={`${plusJakartaSans.className} antialiased flex flex-col min-h-screen bg-prime-dark text-white relative`}>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <div className="flex-grow relative z-10">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
        <Footer />
        <ClientOnlyComponents />
      </body>
    </html>
  );
}

