import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.unsplash.com", "imgix.cosmicjs.com"],
  },
  serverExternalPackages: ["better-auth", "@better-auth/core", "drizzle-orm"],
};

export default nextConfig;
