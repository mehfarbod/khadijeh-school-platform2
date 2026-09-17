import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  // Cap static-generation workers: on many-CPU CI containers the default
  // (cores - 1) workers exhaust memory and get OOM-killed mid build.
  experimental: { cpus: 2 },
};

export default nextConfig;
