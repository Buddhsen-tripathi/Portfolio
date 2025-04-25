import { NextRequest, NextResponse } from 'next/server';
import Exa from 'exa-js';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Environment Variables
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
  model: "gemini-2.0-flash",
  generationConfig,
  safetySettings
});
// --- End Gemini Configuration ---

export async function POST(request: NextRequest) {
  if (!exaApiKey || !geminiApiKey) {
    return NextResponse.json({ error: 'API keys are not configured correctly on the server.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const username = body.username;

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username is required and must be a string.' }, { status: 400 });
    }

    // --- 1. Fetch Tweets with Exa ---
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    console.log(`Searching Exa for user: ${username} from ${startDate.toISOString()} to ${endDate.toISOString()}`);

    const exaResult = await exa.searchAndContents(
      `from:${username}`,
      {
        type: "keyword",
        text: true,
        includeDomains: ["x.com", "twitter.com"],
        startPublishedDate: startDate.toISOString(),
        endPublishedDate: endDate.toISOString(),
        numResults: 4
      }
    );

    console.log(`Exa API Cost: $${exaResult?.costDollars?.total || 'N/A'}`);

    // --- 2. Extract Text Content ---
    let combinedTweetsText = "";
    exaResult.results.forEach(result => {
      if (result.text) {
        combinedTweetsText+=result.text+"\n"
      }
    });

    if (!combinedTweetsText.trim()) {
      return NextResponse.json({ isSpam: false, reason: "Could not extract tweet content for analysis.", spamScore: 0, exaResults: exaResult.results, geminiAnalysis: null }, { status: 200 });
    }

    const MAX_TEXT_LENGTH = 15000;
    if (combinedTweetsText.length > MAX_TEXT_LENGTH) {
      combinedTweetsText = combinedTweetsText.substring(0, MAX_TEXT_LENGTH) + "... [truncated]";
    }

    // --- 3. Analyze with Gemini ---
    const prompt = `
        Analyze the following collection of recent tweets from the user "${username}" to determine if their activity seems like spam. Consider factors like repetitive posting, excessive promotion, irrelevant content, engagement baiting, or bot-like behavior.

        Tweets:
        ---
        ${combinedTweetsText}
        ---

        Based on the analysis, provide a JSON response with the following structure:
        {
          "isSpam": boolean,
          "reason": "string",
          "spamScore": number //Min is 1.5 and max is 10.0
        }
        Only output the JSON object.
        `;

    console.log(`Sending ${exaResult.results.length} parsed tweets to Gemini for analysis (text length: ${combinedTweetsText.length})...`);

    let geminiAnalysis = null;
    try {
      const geminiResult = await model.generateContent(prompt);
      let responseText = geminiResult.response.text();
      responseText = responseText.trim();
      if (responseText.startsWith("```json")) {
        responseText = responseText.substring(responseText.indexOf('{'));
      }
      if (responseText.endsWith("```")) {
        responseText = responseText.substring(0, responseText.lastIndexOf('}') + 1);
      }
      responseText = responseText.trim();

      try {
        geminiAnalysis = JSON.parse(responseText);
        if (typeof geminiAnalysis.isSpam !== 'boolean' || typeof geminiAnalysis.reason !== 'string' || typeof geminiAnalysis.spamScore !== 'number') {
          throw new Error("Gemini response did not match expected JSON structure after cleaning.");
        }
        geminiAnalysis.spamScore = Math.max(0, Math.min(10, geminiAnalysis.spamScore));
      } catch (parseError: any) {
        console.error("Error parsing Gemini response after cleaning:", parseError, "Cleaned response:", responseText);
        geminiAnalysis = { isSpam: false, reason: "Could not parse analysis from AI.", spamScore: -1 };
      }

    } catch (geminiError: any) {
      console.error('Error calling Gemini API:', geminiError);
      if (geminiError.message.includes('response was blocked')) {
        geminiAnalysis = { isSpam: false, reason: "Analysis blocked due to safety settings.", spamScore: -1 };
      } else {
        geminiAnalysis = { isSpam: false, reason: "Error during AI analysis.", spamScore: -1 };
      }
    }

    // --- 4. Return Result ---
    return NextResponse.json({
      isSpam: geminiAnalysis?.isSpam ?? false,
      reason: geminiAnalysis?.reason ?? "Analysis unavailable",
      spamScore: geminiAnalysis?.spamScore ?? -1,
      exaResults: exaResult.results,
      geminiAnalysis: geminiAnalysis
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in spam-or-not API:', error);
    if (error.response) {
      return NextResponse.json({ error: 'Error fetching data from Exa API.', details: error.response.data }, { status: error.response.status || 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}