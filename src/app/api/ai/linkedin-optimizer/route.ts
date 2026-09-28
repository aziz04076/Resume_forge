import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput, MissingAPIKeyError } from "@/lib/ai/provider";
import { LINKEDIN_OPTIMIZER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { LinkedInOptimizerResponseSchema } from "@/schemas/ai.schema";
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
    const { resumeContent } = body;

    if (!resumeContent) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
    }

    if (!validateInputSize(resumeContent)) {
      return NextResponse.json({ error: "Input exceeds maximum allowed length" }, { status: 400 });
    }

    const userPrompt = `Candidate Resume:
${wrapUntrustedInput("resume_content", resumeContent)}

Generate 3 high-impact LinkedIn headlines, an engaging narrative About section, top 15 skills to feature, and bullet points for featured experiences.`;

    const result = await generateStructuredAI({
      systemPrompt: LINKEDIN_OPTIMIZER_SYSTEM_PROMPT,
      userPrompt,
      schema: LinkedInOptimizerResponseSchema,
      temperature: 0.4,
    });

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": String(rateCheck.limit),
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (error) {
    console.error("LinkedIn Optimizer API error:", error);
    if (error instanceof MissingAPIKeyError) {
      return NextResponse.json({ error: error.message, isMissingKey: true }, { status: 401 });
    }
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate LinkedIn profile optimization",
      },
      { status: 500 }
    );
  }
}
