import FeaturedProjects from '@/components/FeaturedProjects'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <meta name="title" content="Projects - Buddhsen Tripathi" />
      <meta name="description" content="Read the latest articles and tutorials on technology, programming, and more." />
      <meta property="og:url" content="https://buddhsentripathi.com/projects" />
      <meta property="og:image" content="https://buddhsentripathi.com/default-image-project.webp" />
      <title>Projects - Buddhsen Tripathi</title>
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      <FeaturedProjects />
      {/* Add more projects here if needed */}
    </div>
  )
}