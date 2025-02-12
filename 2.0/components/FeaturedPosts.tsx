import Link from 'next/link'
import { getAllBlogPosts } from '@/app/blogs/utils'
import { BsArrowRight } from 'react-icons/bs'

export default async function FeaturedPosts() {
  // Await the asynchronous function call to fetch blog posts
  const blogPosts = await getAllBlogPosts()

  return (
    <section>
      <h2 className="text-3xl font-bold mb-4">Recent Blogs</h2>
      <div className="space-y-8">
        {blogPosts.slice(0, 2).map((post) => (
          <div key={post.slug} className="bg-card rounded-lg overflow-hidden shadow-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="mb-4 text-muted-foreground">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{post.date}</span>
                <Link href={`/blogs/${post.slug}`} className="text-primary hover:underline">
                  Read more →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center w-full">
        <Link href="/blogs" className="w-full">
          <div className="w-full bg-card text-card-foreground rounded-lg shadow-md hover:shadow-lg transition-all py-3 flex items-center justify-center gap-2 dark:hover:bg-primary-foreground dark:hover:text-primary">
            <span>View more</span>
            <BsArrowRight className="inline-block" />
          </div>
        </Link>
      </div>
    </section>
  )
}
