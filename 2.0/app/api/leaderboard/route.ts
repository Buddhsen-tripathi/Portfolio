import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import crypto from 'crypto'

const ALLOWED_ORIGINS = (process.env.NEXT_PUBLIC_BASE_URL || '').split(',')
const RATE_LIMIT = 10
const WINDOW_MS = 60 * 1000

const rateLimitStore = new Map<string, { count: number; timestamp: number }>()

function isRateLimited(ip: string) {
    const now = Date.now()
    const record = rateLimitStore.get(ip)

    if (!record || now - record.timestamp > WINDOW_MS) {
        rateLimitStore.set(ip, { count: 1, timestamp: now })
        return false
    } else {
        if (record.count >= RATE_LIMIT) {
            return true
        } else {
            record.count += 1
            rateLimitStore.set(ip, record)
            return false
        }
    }
}

function validateOrigin(request: Request) {
    const origin = request.headers.get('origin')
    return ALLOWED_ORIGINS.includes(origin || '')
}

function getIP(request: Request) {
    const forwarded = request.headers.get('x-forwarded-for')
    return forwarded ? forwarded.split(',')[0] : 'unknown'
}

export async function GET(request: Request) {
    
    try {
        const { data, error } = await supabase
            .from('coderunner_leaderboard')
            .select('name, score, created_at')
            .order('score', { ascending: false })
            .limit(10)

        if (error) {
            console.error('Supabase GET error:', error)
            return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
        }

        return NextResponse.json(data || [])
    } catch (err) {
        console.error('Unexpected GET error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const ip = getIP(request)

    if (!validateOrigin(request)) {
        console.warn('Blocked origin:', request.headers.get('origin'))
        return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 })
    }

    if (isRateLimited(ip)) {
        console.warn(`Rate limit hit for IP: ${ip}`)
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    try {
        const { name, score } = await request.json()
        
        if (!name || 
            typeof score !== 'number' || 
            name.length > 20 || 
            score < 0 || 
            score > 100000) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        const ipHash = crypto.createHash('sha256').update(ip).digest('hex')

        // Check for recent submissions from same IP
        const { data: recentSubmissions } = await supabaseAdmin
            .from('coderunner_leaderboard')
            .select('created_at')
            .eq('ip_hash', ipHash)
            .gte('created_at', new Date(Date.now() - 30000).toISOString())
            .limit(1)

        if (recentSubmissions && recentSubmissions.length > 0) {
            return NextResponse.json(
                { error: 'Please wait before submitting again' }, 
                { status: 429 }
            )
        }

        const { data, error } = await supabaseAdmin
            .from('coderunner_leaderboard')
            .insert([{ 
                name: name.trim(),
                score,
                ip_hash: ipHash,
                user_agent: request.headers.get('user-agent') || 'unknown'
            }])
            .select('name, score, created_at')
            .single()

        if (error) {
            console.error('Supabase POST error:', error)
            return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
        }

        return NextResponse.json({ 
            success: true,
            data: {
                name: data.name,
                score: data.score,
                created_at: data.created_at
            }
        })
    } catch (err) {
        console.error('Unexpected POST error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}