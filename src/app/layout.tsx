import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://meowly.qzz.io"),
  title: {
    default: "Meowly | Watch Movies & TV Shows",
    template: "%s | Meowly"
  },
  description: "Unlimited movies and TV shows for free. Inspired by Prime Video aesthetics, Meowly offers a premium streaming experience.",
  keywords: ["movies", "tv shows", "streaming", "free movies", "watch online", "meowly", "meowtv"],
  authors: [{ name: "Meowly Team" }],
  creator: "Meowly",
  publisher: "Meowly",
  referrer: "origin",
  alternates: {
    canonical: "/",
  },
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
    title: "Meowly | Watch Movies & TV Shows",
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
    title: "Meowly | Watch Movies & TV Shows",
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

import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AmbientBackground from "@/components/AmbientBackground";
import AdBlockerPopup from "@/components/AdBlockerPopup";
import Navbar from "@/components/Navbar";
import PwaRegister from "@/components/PwaRegister";
import DomainRedirectPopup from "@/components/DomainRedirectPopup";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased flex flex-col min-h-screen bg-prime-dark text-white relative`}>
        <AmbientBackground />
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <div className="flex-grow relative z-10">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
        <Footer />
        <AdBlockerPopup />
        <PwaRegister />
        <DomainRedirectPopup />
      </body>
    </html>
  );
}

