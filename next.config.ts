import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photos in the seed data are hosted on dummyjson's CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.dummyjson.com" }],
  },
};

export default nextConfig;
