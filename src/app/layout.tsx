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
  title: "Meowly | Watch Movies & TV Shows",
  description: "Unlimited movies and TV shows for free. Inspired by Prime Video.",
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Meowly Cinema",
  },
  formatDetection: {
    telephone: false,
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

