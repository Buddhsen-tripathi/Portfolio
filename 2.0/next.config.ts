import type { NextConfig } from "next";
const withMDX = require("@next/mdx")();

const nextConfig: NextConfig = {
  ...withMDX(),
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;