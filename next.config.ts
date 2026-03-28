import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard/hospitales",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;