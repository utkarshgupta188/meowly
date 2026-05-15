import React from "react";
import { Gavel, Scale, AlertCircle, CheckCircle, ShieldCheck, HelpCircle } from "lucide-react";
import BackButton from "@/components/BackButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions for using Meowly.",
  alternates: {
    canonical: "https://meowly.qzz.io/terms",
  },
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-prime-dark text-gray-300 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BackButton />
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-2xl mb-6 border border-amber-500/20">
            <Gavel className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400 text-lg">
            Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </header>

        <div className="space-y-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-white">1. Agreement to Terms</h2>
            </div>
            <p className="leading-relaxed">
              By accessing or using Meowly, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-white">2. Use License</h2>
            </div>
            <p className="leading-relaxed mb-4">
              Meowly is a streaming search engine that provides links to content hosted on third-party servers. We do not host any copyrighted material on our own servers.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The service is for personal, non-commercial use only.</li>
              <li>You may not use the service for any illegal or unauthorized purpose.</li>
              <li>You must not transmit any worms or viruses or any code of a destructive nature.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-6 w-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-white">3. Disclaimer</h2>
            </div>
            <p className="leading-relaxed">
              The materials on Meowly's website are provided on an 'as is' basis. Meowly makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-white">4. Content & DMCA</h2>
            </div>
            <p className="leading-relaxed">
              Meowly does not host any media files. We strictly act as a search engine. We respond to clear notices of alleged copyright infringement. For more information, please visit our <a href="/dmca" className="text-accent hover:underline">DMCA page</a>.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="h-6 w-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-white">5. Governing Law</h2>
            </div>
            <p className="leading-relaxed">
              These terms and conditions are governed by and construed in accordance with international laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
