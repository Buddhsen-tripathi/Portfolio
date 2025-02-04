import FeaturedProjects from '@/components/FeaturedProjects'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      <h1 className="text-4xl font-bold mb-8">My Projects</h1>
      <FeaturedProjects />
      {/* Add more projects here if needed */}
    </div>
  )
}