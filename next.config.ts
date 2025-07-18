import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
        pathname: "/**", // permite todas las rutas
      },
      {
        protocol: "https",
        hostname: "logo.moralis.io",
        pathname: "/**", // permite todas las rutas
      },
    ],
  },
};

export default nextConfig;
