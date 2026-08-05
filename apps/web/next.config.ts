import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'theinfected.app' },
      { protocol: 'https', hostname: 'www.theinfected.app' },
    ],
  },
};

export default nextConfig;
