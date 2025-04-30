import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import matter from 'gray-matter'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import remarkfrontmatter from 'remark-frontmatter'
import RelatedBlogs from '@/components/RelatedBlogs'
import BackToTopButton from '@/components/BacktoTopButton'
import ReadAloudButton from './ReadAloudButton'
import ViewCounter from '@/components/ViewCounter'
import { getReadingTime } from '@/lib/utils'
import NewsletterSubscription from '@/components/NewsletterSubscription'
import SocialShare from '../SocialShare'

interface BlogPostData {
  title: string
  excerpt: string
  date: string
  slug: string
}

// Fetch the list of slugs (paths to blog posts)
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'app/blogs/posts')
  const filenames = fs.readdirSync(postsDirectory)

  const slugs = filenames
    .filter((filename) => filename.endsWith('.md') || filename.endsWith('.mdx'))
    .map((filename) => ({
      slug: filename.replace(/\.mdx?$/, ''),
    }))

  return slugs
}

// Function to fetch the blog post content
async function getBlogPost(slug: string) {
  const filePath = path.join(process.cwd(), 'app/blogs/posts', `${slug}.mdx`)

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { content, data } = matter(fileContents)

    return {
      content,
      data: data as BlogPostData,
    }
  } catch (error) {
    console.error('Error reading file:', filePath)
    return {
      content: '',
      data: { title: 'Post Not Found', date: '', excerpt: '', slug },
    }
  }
}

export type paramsType = Promise<{ slug: string }>;

// Blog Post component that renders the content
export default async function BlogPost({ params }: { params: paramsType }) {
  // Fetch the blog content and data
  const { content, data } = await getBlogPost((await params).slug)

  return (
    <div className="space-y-8">
      <meta name="title" content={`${data.title} - Buddhsen Tripathi`} />
      <meta name="description" content={`${data.excerpt}`} />
      <meta property="og:url" content={`https://buddhsentripathi.com/blogs/${data.slug}`} />
      <meta property="og:image" content="https://buddhsentripathi.com/default-image-blogs.webp" />
      <title>{`${data.title} - Buddhsen Tripathi`}</title>

      <div className="flex justify-between items-center">
        <Link href="/blogs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blogs
        </Link>
        <ReadAloudButton content={content} />
      </div>

      <h1 className="text-3xl font-bold">{data.title}</h1>
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>{data.date}</span>
        <span>•</span>
        <ViewCounter slug={data.slug} readOnly={false} />
        <span>•</span>
        <span>{getReadingTime(content)} min read</span>
      </div>
      {/* Render the MDX content */}
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            rehypePlugins: [rehypeHighlight],
            remarkPlugins: [remarkGfm, remarkfrontmatter],
          },
        }}
        components={{
          SocialShare: SocialShare
        }}
      />
      {/* Newsletter subscription component */}
      <NewsletterSubscription />

      <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />

      {/* Related Blogs component */}
      <RelatedBlogs currentSlug={(await params).slug} currentTitle={data.title} />

      {/* Back to Top button */}
      <BackToTopButton />
    </div>
  )
}
