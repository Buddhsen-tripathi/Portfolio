import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAllBlogPosts, type BlogPost } from './utils'
import BlogList from './BlogList'
import BackToTopButton from '@/components/BacktoTopButton'
import NewsletterSubscription from '@/components/NewsletterSubscription'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function BlogPage() {
  const allPosts: BlogPost[] = await getAllBlogPosts()

  // Filter posts based on the 'type' property directly
  const technicalPosts = allPosts.filter(post => post.type !== 'personal');
  const personalPosts = allPosts.filter(post => post.type === 'personal');

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <meta name="title" content="Blogs - Buddhsen Tripathi" />
      <meta name="description" content="Read the latest articles, tutorials, and personal thoughts on technology, programming, and more." />
      <meta property="og:url" content="https://buddhsentripathi.com/blogs" />
      <meta property="og:image" content="https://buddhsentripathi.com/default-image-blogs.webp" />
      <title>Blogs - Buddhsen Tripathi</title>

      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <header className="space-y-2">
        <h1 className="text-4xl font-bold">Blogs </h1>
        <p className="text-muted-foreground">Latest articles and tutorials </p>
      </header>

      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
        </TabsList>

        <TabsContent value="technical">
          {technicalPosts.length > 0 ? (
            <BlogList blogPosts={technicalPosts} />
          ) : (
            <p className="text-center text-muted-foreground italic py-4">No technical articles published yet.</p>
          )}
        </TabsContent>

        <TabsContent value="personal">
          {personalPosts.length > 0 ? (
            <BlogList blogPosts={personalPosts} />
          ) : (
            <p className="text-center text-muted-foreground italic py-4">No personal blogs published yet.</p>
          )}
        </TabsContent>
      </Tabs>

      <NewsletterSubscription/>

      <BackToTopButton />
    </div>
  )
}