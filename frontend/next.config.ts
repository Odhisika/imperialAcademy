import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const rules = [];
    if (process.env.NODE_ENV === 'development') {
      rules.push({
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      });
    }
    rules.push({
      source: '/uploads/:path*',
      destination: 'http://localhost:3001/uploads/:path*',
    });
    return rules;
  },
};

export default nextConfig;
