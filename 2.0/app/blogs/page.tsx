import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAllBlogPosts } from './utils'

export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts()

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <header className="space-y-2">
        <h1 className="text-4xl font-bold">Blogs</h1>
        <p className="text-muted-foreground">Latest articles and tutorials</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {blogPosts.map((post) => (
          <article 
            key={post.slug}
            className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-4 h-full flex flex-col">
              <div>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <time className="text-sm text-muted-foreground">{post.date}</time>
              </div>
              <p className="text-muted-foreground flex-grow">{post.excerpt}</p>
              <Link
                href={`/blogs/${post.slug}`}
                className="text-primary hover:underline self-start"
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}