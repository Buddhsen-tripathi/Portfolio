import createMDX from '@next/mdx'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

/** @type {import('next').NextConfig} */
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  }
})

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  eslint: {
    ignoreDuringBuilds: true,
  }
}

export default withMDX(nextConfig)