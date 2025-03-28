import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: Request) {
  try {
    const { post } = await request.json()
    if (!post || post.length > 700) {
      return NextResponse.json(
        { error: 'Invalid input: Post must be provided and under 700 characters.' },
        { status: 400 }
      )
    }
    
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 })
    }
    
    // Initialize the Gemini client using the official package
    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 150,
      responseModalities: [],
      responseMimeType: 'text/plain',
    }

    const promptProcessed = process.env.NEXT_PUBLIC_PROMPT + post
    console.log('Prompt:', promptProcessed)
    
    // Start a chat session with the prompt
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [{ text: promptProcessed }],
        },
      ],
    })
    
    const result = await chatSession.sendMessage('')
    
    const linkedinPost = result.response.text() || 'No output generated'
    
    return NextResponse.json({ linkedinPost })
  } catch (err: any) {
    console.error('Linkedinfy API error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}