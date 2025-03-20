// app/api/views/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
    const { slug } = await req.json();
    if (!slug) {
        return NextResponse.json({ error: 'No slug provided' }, { status: 400 });
    }

    console.log("Slug received:", slug);

    // First ensure slug exists (upsert logic)
    const { error: upsertError } = await supabase
        .from('views')
        .upsert({ slug, count: 1 }, { onConflict: 'slug' });

    if (upsertError) {
        console.error("Upsert Error:", upsertError);
        return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    // Increment the count after upsert
    const { error: rpcError } = await supabase.rpc('increment_view_count', { post_slug: slug });

    if (rpcError) {
        console.error("RPC Error:", rpcError);
        return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'View logged successfully' });
}
