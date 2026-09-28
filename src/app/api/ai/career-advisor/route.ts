import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput, MissingAPIKeyError } from "@/lib/ai/provider";
import { CAREER_ADVISOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { CareerAdvisorResponseSchema } from "@/schemas/ai.schema";
import { checkRateLimit, validateInputSize } from "@/lib/ai/rateLimiter";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const rateCheck = await checkRateLimit(req, session?.user?.id);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: rateCheck.error }, { status: rateCheck.statusCode || 429 });
    }

    const body = await req.json();
    const { resumeContent, targetRole = "" } = body;

    if (!resumeContent) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
    }

    if (!validateInputSize(resumeContent)) {
      return NextResponse.json({ error: "Input exceeds maximum allowed length" }, { status: 400 });
    }

    const userPrompt = `Candidate Resume Data:
${wrapUntrustedInput("resume_content", resumeContent)}
${targetRole ? `Desired Target Trajectory: ${targetRole}` : ""}

Provide a personalized career acceleration and skill gap roadmap with target roles, compensation ranges, readiness percentages, and phased timeline.`;

    const result = await generateStructuredAI({
      systemPrompt: CAREER_ADVISOR_SYSTEM_PROMPT,
      userPrompt,
      schema: CareerAdvisorResponseSchema,
      temperature: 0.3,
    });

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": String(rateCheck.limit),
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (error) {
    console.error("Career Advisor API error:", error);
    if (error instanceof MissingAPIKeyError) {
      return NextResponse.json({ error: error.message, isMissingKey: true }, { status: 401 });
    }
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate career roadmap",
      },
      { status: 500 }
    );
  }
}
