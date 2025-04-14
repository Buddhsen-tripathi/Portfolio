import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Gemini API
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
  try {

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "API key is not configured. Please contact the administrator." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { section, currentContent } = await request.json();

    if (!section) {
      return NextResponse.json(
        { error: "Section is required" },
        { status: 400 }
      );
    }

    // Create a prompt based on the section
    const prompt = generatePrompt(section, currentContent || "");

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate content with proper error handling
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return NextResponse.json({ suggestion: text });
    } catch (modelError: any) {
      console.error("Model generation error:", modelError);
      return NextResponse.json(
        { error: "Failed to generate content. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error generating suggestion:", error);
    
    // Handle specific error types
    if (error.message && error.message.includes("403")) {
      return NextResponse.json(
        { error: "API key is invalid or has insufficient permissions. Please contact the administrator." },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to generate suggestion. Please try again later." },
      { status: 500 }
    );
  }
}

function generatePrompt(section: string, currentContent: string): string {
  const basePrompt = `You are a professional resume writer. Please provide improved content for the following ${section} section of a resume.
  Current content: "${currentContent}"
  
  Provide the complete, improved text that can be directly copied and pasted into the resume. The content should be:
  1. Professional and impactful
  2. Include quantifiable achievements where applicable
  3. Use strong action verbs
  4. Include relevant industry keywords
  5. Clear and concise
  
  Return ONLY the improved text, without any explanations or bullet points about what to change.`;

  switch (section.toLowerCase()) {
    case "summary":
      return `${basePrompt}\n\nFor the summary section, write 2-3 sentences that highlight key strengths and career objectives.`;
    case "experience":
      return `${basePrompt}\n\nFor experience entries, write 3-4 bullet points that emphasize achievements and responsibilities using strong action verbs.`;
    case "education":
      return `${basePrompt}\n\nFor education entries, include degree, institution, graduation date, and 2-3 relevant achievements or coursework.`;
    case "skills":
      return `${basePrompt}\n\nList 8-10 relevant technical and soft skills, separated by commas.`;
    case "projects":
      return `${basePrompt}\n\nWrite 2-3 bullet points describing the project, technologies used, and measurable outcomes.`;
    default:
      return basePrompt;
  }
} 