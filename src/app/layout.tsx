import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meowly | Watch Movies & TV Shows",
  description: "Unlimited movies and TV shows for free. Inspired by Prime Video.",
  referrer: "origin",
};

import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AmbientBackground from "@/components/AmbientBackground";
import AdBlockerPopup from "@/components/AdBlockerPopup";
import Navbar from "@/components/Navbar";

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
      </body>
    </html>
  );
}
