import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configured to fix native modules like @neplex/vectorizer
  serverExternalPackages: ['@neplex/vectorizer'],
};

export default nextConfig;
