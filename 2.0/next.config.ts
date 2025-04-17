import type { NextConfig } from "next";
import withMDX from "@next/mdx";

const nextConfig: NextConfig = withMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  eslint: {
    ignoreDuringBuilds: true,
  },
});

export default nextConfig;

// PDFKit polyfill for Next.js
nextConfig.webpack = (config, { isServer }) => {
  if (!isServer) {
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/')
    };
  }
  return config;
};