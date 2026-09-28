import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI } from "@/lib/ai/provider";
import { COVER_LETTER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { CoverLetterResponseSchema } from "@/schemas/ai.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      resumeContent,
      jobDescription,
      companyName = "Target Company",
      roleTitle = "Target Role",
      tone = "professional and confident",
    } = body;

    if (!resumeContent) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
    }

    const userPrompt = `Role: ${roleTitle}
Company: ${companyName}
Desired Tone: ${tone}

Job Description:
${jobDescription || "Standard senior role in modern software engineering and leadership."}

Candidate Resume:
${JSON.stringify(resumeContent, null, 2)}

Write an exceptional, high-converting cover letter tailored to this role and company.`;

    const result = await generateStructuredAI({
      systemPrompt: COVER_LETTER_SYSTEM_PROMPT,
      userPrompt,
      schema: CoverLetterResponseSchema,
      temperature: 0.4,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Cover Letter Generator error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate cover letter",
      },
      { status: 500 }
    );
  }
}
