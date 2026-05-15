import React from "react";
import { Shield, Lock, Eye, FileText, Globe, Bell } from "lucide-react";
import BackButton from "@/components/BackButton";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how Meowly protects your privacy and handles your data.",
  alternates: {
    canonical: "https://meowly.qzz.io/privacy",
  },
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-prime-dark text-gray-300 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BackButton />
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-2xl mb-6 border border-accent/20">
            <Shield className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </header>

        <div className="space-y-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
            </div>
            <p className="leading-relaxed">
              At Meowly, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
            </div>
            <p className="leading-relaxed mb-4">
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Data:</strong> We do not require users to create accounts to watch content, so we collect minimal personal data.</li>
              <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
              <li><strong>Cookies:</strong> We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-white">3. Use of Your Information</h2>
            </div>
            <p className="leading-relaxed">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Create and manage your watchlist and preferences.</li>
              <li>Improve our website and user experience.</li>
              <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
              <li>Request feedback and contact you about your use of the Site.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-white">4. Disclosure of Your Information</h2>
            </div>
            <p className="leading-relaxed">
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
              <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, such as data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-white">5. Contact Us</h2>
            </div>
            <p className="leading-relaxed">
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-white font-semibold">Meowly Support</p>
              <p className="text-accent">contact@meowtv.anonaddy.me</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
