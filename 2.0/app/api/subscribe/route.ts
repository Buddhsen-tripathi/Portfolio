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

    // Convert the email to lowercase and trim whitespace
    const lowerEmail = email.trim().toLowerCase()

    // Check if the email already exists in the newsletter_subscribers table
    const { data: existingEmail, error: selectError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', lowerEmail)
      .maybeSingle()

    if (selectError) {
      console.error('Error checking subscription:', selectError)
      return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Subscription already exists' },
        { status: 400 }
      )
    }

    // Insert the email as a new subscription email
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert([{ email: lowerEmail }])

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully!'
    })
  } catch (err: any) {
    console.error('Error in subscribe API route:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}