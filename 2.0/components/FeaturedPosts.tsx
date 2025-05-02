import Link from 'next/link';
import { getAllBlogPosts } from '@/app/blogs/utils';
import { BsArrowRight } from 'react-icons/bs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ViewCounter from './ViewCounter';

export default async function FeaturedPosts() {
  const blogPosts = await getAllBlogPosts();
  const supabase = createServerComponentClient({ cookies });

  const { data: viewsData } = await supabase.from('views').select('slug, count');

  return (
    <section>
      <h2 className="text-3xl font-bold mb-4">Recent Blogs</h2>
      <div className="space-y-4">
        {blogPosts.slice(0, 2).map((post) => {
          return (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="block group"
            >
              <div className="bg-card rounded-lg overflow-hidden shadow-md group-hover:bg-primary/5  border hover:shadow-lg dark:border-gray-700 shadow-gray-200 dark:shadow-gray-800 transition-all">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground">
                    {post.excerpt && post.excerpt.length > 200
                      ? `${post.excerpt.substring(0, 200)}...`
                      : post.excerpt || ''}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-sm text-muted-foreground">{post.date}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        <ViewCounter slug={post.slug} readOnly={true} />
                      </span>
                    </div>
                    <span className="text-primary group-hover:underline ml-4">
                      Read more →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-4 flex justify-center w-full">
        <Link href="/blogs" className="w-full">
          <div className="w-full bg-card text-card-foreground rounded-lg shadow-md hover:shadow-lg border dark:border-gray-700 shadow-gray-200 dark:shadow-gray-800 transition-all py-3 flex items-center justify-center gap-2 group-hover:bg-primary/5 dark:hover:text-primary">
            <span>View more</span>
            <BsArrowRight className="inline-block" />
          </div>
        </Link>
      </div>
    </section>
  );
}
