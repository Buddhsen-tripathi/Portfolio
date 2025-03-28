'use client'

import React, { useState } from 'react'

export default function NewsletterSubscription() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || 'Unable to subscribe. Please try again later.')
            }
            setSuccess(true)
            setEmail('')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="group block p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-black dark:border-gray-700 shadow-gray-200 dark:shadow-gray-800">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Never Miss a <span className='text-red-600'>Blog</span></h2>
            <p className="mb-4 text-sm text-muted-foreground dark:text-gray-400">
                It’s <span className='text-green-600'>free!</span> Get notified instantly whenever a new post drops. Stay updated, stay ahead.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-950 dark:text-white"
                    required
                />
                <div className="flex items-center gap-8 mt-4">
                    {(error || success) && (
                        <p className="text-s">
                            {error ? (
                                <span className="text-red-600">{error}</span>
                            ) : (
                                <span className="text-green-600">Subscribed successfully!</span>
                            )}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="ml-auto bg-primary text-white dark:text-black px-4 py-2 rounded hover:bg-primary-dark focus:outline-none"
                    >
                        {loading ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </div>
            </form>
        </div>
    )
}