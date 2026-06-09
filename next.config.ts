import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.unsplash.com", "imgix.cosmicjs.com"],
  },
  serverExternalPackages: ["kysely", "@better-auth/kysely-adapter"],
};

export default nextConfig;
