import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "imgix.cosmicjs.com"],
  },
  serverExternalPackages: [
    "better-auth",
    "@better-auth/core",
    "@better-auth/kysely-adapter",
    "kysely",
    "drizzle-orm",
  ],
};

export default nextConfig;