import type { NextConfig } from "next";

const ONE_YEAR = "public, max-age=31536000, immutable";
const ONE_MONTH = "public, max-age=2592000";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async headers() {
    return [
      { source: "/uploads/:path*", headers: [{ key: "Cache-Control", value: ONE_YEAR }] },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: ONE_MONTH }] },
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: ONE_YEAR }] },
    ];
  },
};

export default nextConfig;
