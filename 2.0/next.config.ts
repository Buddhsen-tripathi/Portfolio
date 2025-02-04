import type { NextConfig } from "next";
const withMDX = require("@next/mdx")();

const nextConfig: NextConfig = {
  ...withMDX(),
};

export default nextConfig;