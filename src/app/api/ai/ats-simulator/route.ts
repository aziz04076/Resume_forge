import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput, MissingAPIKeyError } from "@/lib/ai/provider";
import { ATS_SIMULATOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { ATSSimulatorResponseSchema } from "@/schemas/ai.schema";
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
    const { resumeContent, targetRole = "Software Engineer" } = body;

    if (!resumeContent) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
    }

    if (!validateInputSize(resumeContent)) {
      return NextResponse.json({ error: "Input exceeds maximum allowed length" }, { status: 400 });
    }

    const userPrompt = `Target Role: ${targetRole}

Resume Data:
${wrapUntrustedInput("resume_content", resumeContent)}

Simulate an enterprise Applicant Tracking System (ATS) scan on this resume. Check contact information, section headers, keyword density, and formatting. Provide clear actionable fixes.`;

    const result = await generateStructuredAI({
      systemPrompt: ATS_SIMULATOR_SYSTEM_PROMPT,
      userPrompt,
      schema: ATSSimulatorResponseSchema,
      temperature: 0.2,
    });

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": String(rateCheck.limit),
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (error) {
    console.error("ATS Simulator error:", error);
    if (error instanceof MissingAPIKeyError) {
      return NextResponse.json({ error: error.message, isMissingKey: true }, { status: 401 });
    }
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to run ATS simulation",
      },
      { status: 500 }
    );
  }
}
