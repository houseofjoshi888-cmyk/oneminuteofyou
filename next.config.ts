import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The experience is entirely browser-side. Static export lets Vercel serve
  // the Vinext/Vite output without looking for a standard `.next` directory.
  output: "export",
};

export default nextConfig;
