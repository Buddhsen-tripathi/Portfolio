import Hero from '@/components/HeroSection'
import Skills from '@/components/Skills'
import FeaturedProjects from '@/components/FeaturedProjects'
import FeaturedPosts from '@/components/FeaturedPosts'
import Contact from '@/components/Contact'
import NewsletterSubscription from '@/components/NewsletterSubscription'

export default function Home() {
  return (
    <div className="space-y-12">
      <Hero />
      <Skills />
      <FeaturedProjects />
      <FeaturedPosts />
      <NewsletterSubscription />
      <Contact />
      </div>
  )
}