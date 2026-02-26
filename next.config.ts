import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // good default for Vercel/Next 15 builds
  output: "standalone",
};

export default nextConfig;
