import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI } from "@/lib/ai/provider";
import { CAREER_ADVISOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { CareerAdvisorResponseSchema } from "@/schemas/ai.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeContent, targetRole = "" } = body;

    if (!resumeContent) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
    }

    const userPrompt = `Candidate Resume Data:
${JSON.stringify(resumeContent, null, 2)}
${targetRole ? `Desired Target Trajectory: ${targetRole}` : ""}

Provide a personalized career acceleration and skill gap roadmap with target roles, compensation ranges, readiness percentages, and phased timeline.`;

    const result = await generateStructuredAI({
      systemPrompt: CAREER_ADVISOR_SYSTEM_PROMPT,
      userPrompt,
      schema: CareerAdvisorResponseSchema,
      temperature: 0.3,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Career Advisor API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate career roadmap",
      },
      { status: 500 }
    );
  }
}
