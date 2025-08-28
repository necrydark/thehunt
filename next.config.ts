import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static-cdn.jtvnw.net",
        port: "",
      },
    ],
  },
  typedRoutes: true /* No dead links anymore */,
};

export default nextConfig;
