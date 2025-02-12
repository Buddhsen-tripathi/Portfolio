import FeaturedProjects from '@/components/FeaturedProjects'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SEO from '@/components/SEO'

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <SEO
              title="Projects | Buddhsen Tripathi"
              description="Read the latest articles and tutorials on technology, programming, and more."
              url="https://buddhsentripathi.com/projects"
              image='https://buddhsentripathi.com/default-image-project.webp'
            />
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      <FeaturedProjects />
      {/* Add more projects here if needed */}
    </div>
  )
}