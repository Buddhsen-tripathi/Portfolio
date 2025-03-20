'use client'

import { useEffect, useState } from 'react'

export default function ViewCounter({ slug, readOnly = false }: { slug: string, readOnly?: boolean }) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    const sessionKey = `viewed-${slug}`
    const hasViewed = sessionStorage.getItem(sessionKey)

    const fetchViews = async () => {
      try {
        const res = await fetch(`/api/views?slug=${slug}`)
        const data = await res.json()
        
        if (!res.ok) {
          // If no entry exists, create it
          const createRes = await fetch('/api/views', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug }),
          })
          const createData = await createRes.json()
          if (createRes.ok) {
            setViews(createData.views)
            return
          }
          throw new Error(data.error || 'Failed to fetch views')
        }
        
        setViews(data.views)
      } catch (error) {
        console.error('Error fetching views:', error)
        // Try to create entry if fetch fails
        try {
          const createRes = await fetch('/api/views', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug }),
          })
          const createData = await createRes.json()
          if (createRes.ok) {
            setViews(createData.views)
            return
          }
        } catch (createError) {
          console.error('Error creating view entry:', createError)
          setViews(0)
        }
      }
    }

    const incrementViews = async () => {
      try {
        const res = await fetch('/api/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug }),
        })
        const data = await res.json()
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to increment views')
        }
        
        setViews(data.views)
        sessionStorage.setItem(sessionKey, 'true')
      } catch (error) {
        console.error('Error incrementing views:', error)
        setViews(0)
      }
    }

    if (readOnly || hasViewed) {
      fetchViews()
    } else {
      incrementViews()
    }
  }, [slug, readOnly])

  return <span>{views !== null ? `${views} views` : 'Loading...'}</span>
}