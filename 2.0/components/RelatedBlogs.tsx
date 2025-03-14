import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import matter from 'gray-matter'

interface BlogPost {
  title: string
  excerpt: string
  date: string
  slug: string
}

interface RelatedBlogsProps {
  currentSlug: string
  currentTitle: string
}

async function getAllPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), 'app/blogs/posts')
  const filenames = fs.readdirSync(postsDirectory)

  const posts = filenames
    .filter((filename) => filename.endsWith('.md') || filename.endsWith('.mdx'))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)
      
      return {
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        slug: filename.replace(/\.mdx?$/, ''),
      }
    })

  return posts
}

function jaccardSimilarity(str1: string, str2: string): number {
  const set1 = new Set(str1.split(' '))
  const set2 = new Set(str2.split(' '))
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  return intersection.size / union.size
}

export default async function RelatedBlogs({ currentSlug, currentTitle }: RelatedBlogsProps) {
  const allPosts = await getAllPosts()
  const relatedPosts = allPosts
    .filter(post => post.slug !== currentSlug)
    .map(post => ({
      ...post,
      similarity: jaccardSimilarity(currentTitle, post.title)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blogs/${post.slug}`}
            className="group block p-6 border rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-black dark:border-gray-700 shadow-gray-200 dark:shadow-gray-800"
          >
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors dark:text-white">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2 dark:text-gray-400">
              {post.excerpt}
            </p>
            <p className="mt-2 text-xs text-muted-foreground dark:text-gray-500">
              {post.date}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}