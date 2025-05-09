import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',  // Set this to a higher value as per your needs (e.g., 10 MB)
    },
  },
};

export default nextConfig;
