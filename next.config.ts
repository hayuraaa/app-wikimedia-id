import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/sumbangan",
        destination: "/donasi",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "dashboard.wikimedia.or.id" },
    ],
    unoptimized: true,
  },
};

export default nextConfig;