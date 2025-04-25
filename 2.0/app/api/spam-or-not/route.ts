import { NextRequest, NextResponse } from 'next/server';
import Exa from 'exa-js';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { RateLimiterMemory } from 'rate-limiter-flexible'; 
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const exaApiKey = process.env.EXA_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!exaApiKey) {
    console.error("EXA_API_KEY environment variable is not set.");
}
if (!geminiApiKey) {
    console.error("GEMINI_API_KEY environment variable is not set.");
}

const exa = new Exa(exaApiKey);
const genAI = new GoogleGenerativeAI(geminiApiKey || "fallback-gemini-key");

// --- Rate Limiter Configuration ---
const rateLimiter = new RateLimiterMemory({
    points: 5, // Allow 5 requests...
    duration: 20, // ...per 20 seconds per unique key (IP + Origin)
});
// --- End Rate Limiter Configuration ---

// --- Gemini Configuration ---
const generationConfig = {
    temperature: 0.5,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Use a supported model like 1.5-flash
    generationConfig,
    safetySettings
});
// --- End Gemini Configuration ---

const CACHE_TTL_HOURS = 24;

export async function POST(request: NextRequest) {

    // --- Rate Limiting Check ---
    const requestHeaders = await headers(); 
    const origin = requestHeaders.get('origin') ?? 'unknown_origin';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown_ip';

    const allowedOrigins = [
        'http://localhost:3000',
        'https://www.buddhsentripathi.com',
        'https://buddhsentripathi.com'
        // Add any other origins that should bypass rate limiting
    ];

    // --- Origin Check ---
    // Block requests from origins not in the allowed list
    if (!allowedOrigins.includes(origin)) {
        console.warn(`Blocked request from disallowed origin: ${origin} (IP: ${ip})`);
        return NextResponse.json({ error: 'Forbidden: Invalid origin' }, { status: 403 });
    }
    // --- End Origin Check ---

    // --- Rate Limiting Check (Now only applies to allowed origins) ---
    // Create a combined key using IP and the allowed origin
    const rateLimitKey = `${ip}_${origin}`;

    try {
        // Apply rate limiting even for allowed origins
        await rateLimiter.consume(rateLimitKey);
    } catch (rejRes: any) {
        console.warn(`Rate limit exceeded for ALLOWED Key: ${rateLimitKey} (IP: ${ip}, Origin: ${origin})`);
        const secs = Math.ceil(rejRes?.msBeforeNext / 1000) || 1;
        return NextResponse.json({ error: 'Too Many Requests' }, {
            status: 429,
            headers: {
                'Retry-After': String(secs),
            },
        });
    }
    // --- End Rate Limiting Check ---

    if (!exaApiKey || !geminiApiKey) {
        return NextResponse.json({ error: 'API keys are not configured correctly on the server.' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const username = body.username;

        if (!username || typeof username !== 'string') {
            return NextResponse.json({ error: 'Username is required and must be a string.' }, { status: 400 });
        }

        // --- 1. Check Supabase Cache ---
        const cacheCutoff = new Date();
        cacheCutoff.setHours(cacheCutoff.getHours() - CACHE_TTL_HOURS);

        const { data: cachedData, error: cacheError } = await supabaseAdmin
            .from('spam_analysis_cache') // Ensure this table exists in your Supabase project
            .select('result, last_checked_at')
            .eq('username', username)
            .single();

        if (cacheError && cacheError.code !== 'PGRST116') { // PGRST116: Row not found
                console.error('Error checking Supabase cache:', cacheError);
                // Log error but proceed to fetch fresh data
        }

        if (cachedData && new Date(cachedData.last_checked_at) > cacheCutoff) {
                console.log(`Cache hit for username: ${username}`);
                // Add a flag to indicate the response is from cache
                const cachedResult = { ...(cachedData.result as object), fromCache: true };
                return NextResponse.json(cachedResult, { status: 200 });
        }
        console.log(`Cache miss or expired for username: ${username}`);
        // --- End Cache Check ---


        // --- 2. Fetch Tweets with Exa (if not cached) ---
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30); // Look back 30 days

        console.log(`Searching Exa for user: ${username} from ${startDate.toISOString()} to ${endDate.toISOString()}`);

        const exaResult = await exa.searchAndContents(
            `from:${username}`,
            {
                type: "keyword",
                text: true,
                includeDomains: ["x.com", "twitter.com"],
                startPublishedDate: startDate.toISOString(),
                endPublishedDate: endDate.toISOString(),
                numResults: 10 // Fetch more results for better analysis
            }
        );

        console.log(`Exa API Cost: $${exaResult?.costDollars?.total || 'N/A'}`);

        // --- 3. Extract Text Content ---
        let combinedTweetsText = "";
        exaResult.results.forEach(result => {
            if (result.text) {
                combinedTweetsText += result.text + "\n---\n"; // Add separator
            }
        });

        if (!combinedTweetsText.trim()) {
            // Even if no tweets found, cache this negative result to avoid repeated checks
            const noTweetsResult = {
                    isSpam: false,
                    reason: "No recent tweet content found for analysis.",
                    spamScore: 0,
                    exaResults: exaResult.results,
                    geminiAnalysis: null,
                    fromCache: false
            };
             const { error: upsertError } = await supabaseAdmin
                .from('spam_analysis_cache')
                .upsert({
                        username: username,
                        result: noTweetsResult,
                        last_checked_at: new Date().toISOString(),
                });
             if (upsertError) console.error('Error caching no-tweet result:', upsertError);
             else console.log(`Cached no-tweet result for username: ${username}`);

            return NextResponse.json(noTweetsResult, { status: 200 });
        }

        const MAX_TEXT_LENGTH = 15000; // Gemini Pro has context limits
        if (combinedTweetsText.length > MAX_TEXT_LENGTH) {
            combinedTweetsText = combinedTweetsText.substring(0, MAX_TEXT_LENGTH) + "... [truncated]";
        }

        // --- 4. Analyze with Gemini (if not cached) ---
        const prompt = `
                Analyze the following collection of recent tweets (separated by '---') from the user "${username}" to determine if their activity seems like spam. Consider factors like repetitive posting of identical or near-identical content, excessive promotion (especially affiliate links or low-quality products), irrelevant replies or mentions, engagement baiting (e.g., "like if you agree"), posting frequency, and overall bot-like behavior. Provide a confidence score for your assessment.

                Tweets:
                ---
                ${combinedTweetsText}
                ---

                Based ONLY on the provided tweets, provide a JSON response with the following structure:
                {
                    "isSpam": boolean, // true if likely spam, false otherwise
                    "reason": "string",
                    "spamScore": number // A score from 1.0 to 10.0 indicating confidence in spam likelihood 
                }
                Only output the JSON object. Do not include any introductory text or backticks.
                `;

        console.log(`Sending ${exaResult.results.length} parsed tweets to Gemini for analysis (text length: ${combinedTweetsText.length})...`);

        let geminiAnalysis: { isSpam: boolean; reason: string; spamScore: number } | null = null;
        try {
            const geminiResult = await model.generateContent(prompt);
            let responseText = geminiResult.response.text();
            // Clean potential markdown formatting
            responseText = responseText.trim().replace(/^```json\s*|\s*```$/g, '');

            try {
                geminiAnalysis = JSON.parse(responseText);
                // Validate structure
                if (!geminiAnalysis || typeof geminiAnalysis.isSpam !== 'boolean' || typeof geminiAnalysis.reason !== 'string' || typeof geminiAnalysis.spamScore !== 'number') {
                    throw new Error("Gemini response did not match expected JSON structure after cleaning.");
                }
                // Clamp score
                geminiAnalysis.spamScore = Math.max(0, Math.min(10, geminiAnalysis.spamScore));
            } catch (parseError: any) {
                console.error("Error parsing Gemini response after cleaning:", parseError, "Cleaned response:", responseText);
                // Fallback if parsing fails
                geminiAnalysis = { isSpam: false, reason: "Could not parse analysis from AI.", spamScore: -1 };
            }

        } catch (geminiError: any) {
            console.error('Error calling Gemini API:', geminiError);
            if (geminiError.message?.includes('response was blocked')) {
                geminiAnalysis = { isSpam: false, reason: "Analysis blocked due to safety settings.", spamScore: -1 };
            } else {
                geminiAnalysis = { isSpam: false, reason: "Error during AI analysis.", spamScore: -1 };
            }
        }

        // --- 5. Prepare Final Result ---
         const finalResult = {
            isSpam: geminiAnalysis?.isSpam ?? false,
            reason: geminiAnalysis?.reason ?? "Analysis unavailable",
            spamScore: geminiAnalysis?.spamScore ?? -1,
            exaResults: exaResult.results, // Consider omitting this from cache if large
            geminiAnalysis: geminiAnalysis, // Contains the core analysis
            fromCache: false // Indicate it's a fresh result
        };


        // --- 6. Store Result in Supabase Cache ---
        const { error: upsertError } = await supabaseAdmin
            .from('spam_analysis_cache')
            .upsert({
                    username: username,
                    result: finalResult, // Store the entire result object
                    last_checked_at: new Date().toISOString(),
            });

        if (upsertError) {
                console.error('Error saving result to Supabase cache:', upsertError);
                // Don't fail the request, just log the caching error
        } else {
                console.log(`Cached result for username: ${username}`);
        }
        // --- End Cache Store ---


        // --- 7. Return Result ---
        return NextResponse.json(finalResult, { status: 200 });

    } catch (error: any) {
        console.error('Error in spam-or-not API:', error);
        // Check if it's an Exa API error
        if (error.response && error.response.data) {
             console.error('Exa API Error Details:', error.response.data);
             return NextResponse.json({ error: 'Error fetching data from Exa API.', details: error.response.data }, { status: error.response.status || 500 });
        }
        // General error
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}