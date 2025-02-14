'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

interface BlogPost {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
}

export default function BlogList({ blogPosts }: { blogPosts: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredPosts = blogPosts.filter((post: { title: string; excerpt: string }) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Search className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
      </div>

      {/* Blog List */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow hover:bg-primary/10"
            >
              <div className="space-y-4 h-full flex flex-col">
                <div>
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <time className="text-sm text-muted-foreground">{post.date}</time>
                </div>
                <p className="text-muted-foreground flex-grow">{post.excerpt}</p>
                <Link href={`/blogs/${post.slug}`} className="text-primary hover:underline self-start">
                  Read more →
                </Link>
              </div>
            </article>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No matching blog posts found.</p>
        )}
      </div>
    </div>
  )
}