'use client'

import { useState } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

export default function MdxPreviewPage() {
  const [mdxContent, setMdxContent] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">MDX Preview Tool</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Editor</h2>
          <textarea
            value={mdxContent}
            onChange={(e) => setMdxContent(e.target.value)}
            placeholder="Write your MDX content here..."
            className="w-full h-[500px] p-4 font-mono text-sm border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card"
          />
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Preview</h2>
            <div className="prose dark:prose-invert max-w-none p-4 border rounded-lg bg-card">
              <MDXRemote
                source={mdxContent}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeHighlight],
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="text-sm text-muted-foreground">
        <h3 className="font-semibold mb-2">Supported Markdown Features:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Headers (# H1, ## H2, etc)</li>
          <li>**Bold** and *Italic* text</li>
          <li>Lists (ordered and unordered)</li>
          <li>Code blocks with syntax highlighting</li>
          <li>Tables (via remark-gfm)</li>
          <li>Links and Images</li>
        </ul>
      </div>
    </div>
  )
}