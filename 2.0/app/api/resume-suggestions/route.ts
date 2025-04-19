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

    // Get the model - Updated to use the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate content with proper error handling
    try {
      const result = await model.generateContent(prompt);

      if (!result.response) {
        throw new Error("No response received from the model");
      }

      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from the model");
      }

      return NextResponse.json({ suggestion: text });
    } catch (modelError: any) {
      console.error("Model generation error:", modelError);
      return NextResponse.json(
        { error: modelError?.message || "Failed to generate content. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error generating suggestion:", error);

    // Handle specific error types
    if (error.message?.includes("403")) {
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
  const baseInstruction = `You are an expert resume writing assistant. Your task is to refine or generate content for the "${section}" section of a user's resume.
Focus on creating professional, concise, and impactful text that highlights skills and achievements effectively. Use strong action verbs.
Current content provided by the user (if any): "${currentContent}"

Please provide ONLY the improved or generated text suitable for direct inclusion in the resume. Do not include explanations, introductory phrases, or markdown formatting like bullet points unless specifically requested for that section.`;

  switch (section.toLowerCase()) {
    case "summary":
      return `${baseInstruction}\n\nGenerate a compelling professional summary (2-4 sentences) that encapsulates the candidate's key qualifications, experience level, and career goals.`;
    case "experience":
      return `${baseInstruction}\n\nRefine the provided job description or generate 3-5 bullet points for a professional role. Each point should start with a strong action verb and detail responsibilities and quantifiable achievements where possible (e.g., "Managed project X, resulting in Y% improvement").`;
    case "education":
      return `${baseInstruction}\n\nFormat the education entry clearly. Include Degree Name, Major/Field of Study, Institution Name, and Graduation Date (or Expected Date). If relevant, add 1-2 bullet points for honors, relevant coursework, or significant academic projects.`;
    case "skills":
      return `${baseInstruction}\n\nGenerate a comma-separated list of 10-15 relevant technical skills and soft skills suitable for a professional resume. Example: "Project Management, Data Analysis, Communication, Leadership, Microsoft Office Suite, Specific Software/Tool".`;
    case "projects":
      return `${baseInstruction}\n\nDescribe a personal or professional project. Include the project name, 2-3 bullet points detailing the project's purpose, your contributions, methods/tools used, and any measurable outcomes or key features. Start bullet points with action verbs.`;
    case "certifications":
      return `${baseInstruction}\n\nFormat the certification entry. Include the Certification Name, Issuing Organization, and Date Received.`;
    default:
      return `${baseInstruction}\n\nPlease generate appropriate content for the "${section}" section of a resume.`;
  }
}