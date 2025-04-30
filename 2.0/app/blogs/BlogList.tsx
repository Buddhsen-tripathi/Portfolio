'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import ViewCounter from '@/components/ViewCounter';

export interface BlogPost {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  type?: string;
}

export default function BlogList({ blogPosts }: { blogPosts: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Update filter type to use BlogPost
  const filteredPosts = blogPosts.filter((post: BlogPost) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Link key={post.slug} href={`/blogs/${post.slug}`} className="block h-full">
              {/* Access properties directly from post, not post.metadata */}
              <article className="p-6 bg-card rounded-lg shadow-sm border hover:shadow-md transition-shadow hover:bg-primary/10 cursor-pointer flex flex-col h-full">
                <div className="space-y-4 flex-grow">
                  <div>
                    <h2 className="text-xl font-semibold pb-1">{post.title}</h2>
                    <time className="text-sm text-muted-foreground">{post.date}</time>
                    <span className="text-muted-foreground p-2">•</span>
                    <span className="text-muted-foreground"><ViewCounter slug={post.slug} readOnly={true} /></span>
                  </div>
                  <p className="text-muted-foreground">
                    {post.excerpt.length > 150
                      ? `${post.excerpt.substring(0, 150)}...`
                      : post.excerpt}
                  </p>
                </div>
                <span className="text-primary hover:underline self-start pt-1">Read more →</span>
              </article>
            </Link>
          ))
        ) : (
          <p className="text-center text-muted-foreground md:col-span-2">No matching blog posts found in this section.</p>
        )}
      </div>
    </div>
  );
}