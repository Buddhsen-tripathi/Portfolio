import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const ALLOWED_ORIGINS = process.env.NEXT_PUBLIC_BASE_URL || ' ';
const RATE_LIMIT = 10; // max 10 requests
const WINDOW_MS = 60 * 1000; // per minute

// Simple in-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now - record.timestamp > WINDOW_MS) {
    // Reset window
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return false;
  } else {
    if (record.count >= RATE_LIMIT) {
      return true;
    } else {
      record.count += 1;
      rateLimitStore.set(ip, record);
      return false;
    }
  }
}

function validateOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return ALLOWED_ORIGINS.includes(origin || '');
}

function getIP(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0] : 'unknown';
}

export async function GET(request: Request) {
  const ip = getIP(request);

  if (!validateOrigin(request)) {
    console.warn('Blocked origin:', request.headers.get('origin'));
    return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
  }

  if (isRateLimited(ip)) {
    console.warn(`Rate limit hit for IP: ${ip}`);
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  console.log('GET /api/leaderboard from', ip);

  try {
    const { data, error } = await supabase
      .from('coderunner_leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Supabase GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error('Unexpected GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const ip = getIP(request);

  if (!validateOrigin(request)) {
    console.warn('Blocked origin:', request.headers.get('origin'));
    return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
  }

  if (isRateLimited(ip)) {
    console.warn(`Rate limit hit for IP: ${ip}`);
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  console.log('POST /api/leaderboard from', ip);

  try {
    const { name, score } = await request.json();
    if (!name || typeof score !== 'number') {
      return NextResponse.json({ error: 'Invalid name or score' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('coderunner_leaderboard')
      .insert([{ name, score }])
      .select()
      .single();

    if (error) {
      console.error('Supabase POST error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, inserted: data });
  } catch (err) {
    console.error('Unexpected POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}