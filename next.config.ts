import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/projects",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/industries",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
