'use client'

import { useEffect } from 'react'

export default function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    console.log("fetching views API")
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
  }, [slug])

  return null
}