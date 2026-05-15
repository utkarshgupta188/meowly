import React from "react";
import { Info, Users, Heart, Zap, Globe, MessageCircle } from "lucide-react";
import BackButton from "@/components/BackButton";

export const metadata = {
  title: "About Us | The Premier Free Movie Discovery Platform",
  description: "Learn more about Meowly, the premier destination for free movie and TV show streaming discovery.",
  alternates: {
    canonical: "https://meowly.qzz.io/about",
  },
};

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-prime-dark text-gray-300 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BackButton />
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-2xl mb-6 border border-accent/20">
            <Info className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            About Meowly
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Redefining the way you discover and watch your favorite stories.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <article className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-accent/30 transition-all duration-300">
            <Zap className="h-10 w-10 text-accent mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
            <p className="text-sm leading-relaxed">
              Our mission is to provide a seamless, premium-quality streaming discovery experience for movie enthusiasts worldwide. We believe that great entertainment should be accessible to everyone, everywhere.
            </p>
          </article>
          <article className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-accent/30 transition-all duration-300">
            <Heart className="h-10 w-10 text-accent mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Built for Fans</h3>
            <p className="text-sm leading-relaxed">
              Meowly was created by movie lovers, for movie lovers. Every feature is designed with the user in mind—from our ultra-clean Prime Video-inspired interface to our lightning-fast search capabilities.
            </p>
          </article>
        </section>

        <section className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-black text-white mb-6">What Makes Us Different?</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 bg-accent/20 p-2 rounded-lg h-fit">
                <Globe className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Global Library</h4>
                <p className="text-sm text-gray-400">Access information on millions of movies and TV shows from around the world, powered by the TMDB community.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 bg-accent/20 p-2 rounded-lg h-fit">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Community Driven</h4>
                <p className="text-sm text-gray-400">We listen to our community. Many of our best features come directly from user suggestions and feedback.</p>
              </div>
            </div>
                <div className="flex gap-4">
              <div className="mt-1 bg-accent/20 p-2 rounded-lg h-fit">
                <MessageCircle className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Always Available</h4>
                <p className="text-sm text-gray-400">Our team works tirelessly to ensure Meowly remains fast and reliable, even during peak traffic hours.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-6 border-t border-white/10 pt-8 text-sm leading-relaxed">
            <p>
              Meowly was born out of a desire to create a streaming discovery platform that feels as premium as the content it showcases. 
              We noticed that most free streaming search engines were cluttered with intrusive ads, confusing layouts, and poor performance. 
              Our goal was to change that by focusing on high-quality design, lightning-fast performance, and a user-first approach.
            </p>
            <p>
              Technologically, Meowly leverages the latest in web standards, including Next.js for high-performance server-side rendering and Tailwind CSS for a sleek, responsive interface. 
              Our integration with the TMDB API allows us to provide up-to-the-minute data on millions of movies and TV shows, including detailed cast lists, high-resolution artwork, and accurate release information.
            </p>
            <p>
              We are constantly evolving, adding new features based on community feedback. 
              Whether it's improving our recommendation algorithms, enhancing our search filters, or adding support for more devices, our development cycle is driven by the needs of our users. 
              We believe that a streaming service should be invisible—it should just work, allowing you to focus entirely on the stories you love.
            </p>
          </div>
        </section>

        <section className="text-center bg-gradient-to-r from-accent/10 to-teal-500/10 border border-white/10 rounded-3xl p-10">
          <h2 className="text-2xl font-bold text-white mb-4">Have Questions?</h2>
          <p className="text-gray-400 mb-6">We're always here to help. Reach out to our support team for any inquiries or feedback.</p>
          <a href="mailto:contact@meowtv.anonaddy.me" className="inline-block bg-accent text-black font-black px-8 py-3 rounded-2xl hover:brightness-110 transition-all">
            Contact Support
          </a>
        </section>
      </div>
    </main>
  );
}
