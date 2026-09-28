import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI } from "@/lib/ai/provider";
import { RESUME_PARSER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { ParsedResumeResponseSchema } from "@/schemas/ai.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawText } = body;

    if (!rawText || typeof rawText !== "string" || rawText.trim().length < 50) {
      return NextResponse.json(
        { error: "Valid raw resume text of at least 50 characters is required for parsing" },
        { status: 400 }
      );
    }

    const userPrompt = `Raw Resume Text to Parse:
----------------------------------------
${rawText}
----------------------------------------

Extract all candidate details into structured JSON matching the ResumeContent schema. Ensure dates, contact info, and bullet points are preserved accurately.`;

    const parsedContent = await generateStructuredAI({
      systemPrompt: RESUME_PARSER_SYSTEM_PROMPT,
      userPrompt,
      schema: ParsedResumeResponseSchema,
      temperature: 0.1,
    });

    return NextResponse.json({ success: true, content: parsedContent });
  } catch (error) {
    console.error("Resume Parser error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to parse resume into structured format",
      },
      { status: 500 }
    );
  }
}
