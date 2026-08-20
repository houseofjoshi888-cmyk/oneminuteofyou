import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sites serves the Vinext application through its Cloudflare Worker so all
  // 5,200 token routes remain dynamic without generating duplicate HTML files.
};

export default nextConfig;
