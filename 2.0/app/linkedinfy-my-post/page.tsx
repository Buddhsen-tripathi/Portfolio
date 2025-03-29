'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ViewCounter from '@/components/ViewCounter'

export default function LinkedinfyMyPostPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.length > 700) {
      setError('Input must be 700 characters or less.')
      return
    }
    setLoading(true)
    setError('')
    setOutput('')
    try {
      const res = await fetch('/api/linkedinfy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post: input }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something broke.')
      } else {
        setOutput(data.linkedinPost)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full p-6">
      {/* Navigation bar */}
      <nav className="flex items-center justify-between mb-6">
        <Link href="/projects" className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <ViewCounter slug="linkedinfy-my-post" readOnly={false} />
        </div>
      </nav>
      <h1 className="text-3xl font-bold text-center mb-6 mt-16">Linkedinfy My Post</h1>
      
      <div className="bg-card p-6 border rounded-lg shadow-md dark:bg-black dark:border-gray-300 w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your post (max 700 characters)"
            maxLength={700}
            className="border border-gray-300 dark:border-gray-600 rounded p-3 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white resize-none w-full"
            rows={6}
          />
          <div className="flex items-center justify-end gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white w-full dark:text-black px-4 py-2 rounded hover:bg-primary-dark transition-colors"
            >
              {loading ? 'LinkedInfy-ing...' : 'LinkedInfy'}
            </button>
          </div>
        </form>
      </div>
      
      {error && (
        <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
      )}

      {output && (
        <div className="mt-6 border p-6 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700 w-full">
          <h2 className="text-2xl font-bold mb-4">Optimized LinkedIn Post</h2>
          <p className="text-base leading-relaxed dark:text-gray-200">{output}</p>
        </div>
      )}
    </div>
  )
}