import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["got-scraping", "header-generator"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;
