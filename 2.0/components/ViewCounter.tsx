'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function ViewCounter({ slug, readOnly = false }: { slug: string, readOnly?: boolean }) {
  const [views, setViews] = useState<number>(0)
  const pathname = usePathname()

  useEffect(() => {
    const sessionKey = `viewed-${slug}`
    const hasViewed = sessionStorage.getItem(sessionKey)
    const isBlogPost = pathname.startsWith('/blogs/') && pathname !== '/blogs'

    const handleViews = async () => {
      try {
        // If readOnly or already viewed, just fetch the count
        if (readOnly || hasViewed || !isBlogPost) {
          const response = await fetch(`/api/views?slug=${slug}`)
          if (!response.ok) throw new Error('Failed to fetch views')
          const data = await response.json()
          setViews(data.views)
        } else {
          // Increment views if not viewed in current session
          const response = await fetch('/api/views', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug }),
          })
          if (!response.ok) throw new Error('Failed to increment views')
          const data = await response.json()
          setViews(data.views)
          sessionStorage.setItem(sessionKey, 'true')
        }
      } catch (error) {
        console.error('Error handling views:', error)
      }
    }

    handleViews()
  }, [slug, pathname, readOnly])

  return <span>{views} views</span>
}