import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Basic email validation (you can use a more robust solution if needed)
    if (!email || !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Insert the email into your newsletter subscribers table
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert([{ email: email.trim() }])
    
    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch (err: any) {
    console.error('Error in subscribe API route:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}