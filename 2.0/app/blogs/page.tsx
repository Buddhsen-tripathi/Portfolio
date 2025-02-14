import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAllBlogPosts } from './utils'
import BlogList from './BlogList'

export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts()

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <meta name="title" content="Blogs - Buddhsen Tripathi" />
      <meta name="description" content="Read the latest articles and tutorials on technology, programming, and more." />
      <meta property="og:url" content="https://buddhsentripathi.com/blogs" />
      <meta property="og:image" content="https://buddhsentripathi.com/default-image-blogs.webp" />
      <title>Blogs - Buddhsen Tripathi</title>

      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <header className="space-y-2">
        <h1 className="text-4xl font-bold">Blogs</h1>
        <p className="text-muted-foreground">Latest articles and tutorials</p>
      </header>

      {/* Pass blog posts to client component */}
      <BlogList blogPosts={blogPosts} />
    </div>
  )
}