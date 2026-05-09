import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["got-scraping", "header-generator"],
  outputFileTracingIncludes: {
    '/*': [
      'node_modules/header-generator/data_files/**/*',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
  //allowedDevOrigins: ["192.168.1.7", "192.168.1.7:3000"],
};

export default nextConfig;
