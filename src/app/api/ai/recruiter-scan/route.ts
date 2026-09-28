import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput, MissingAPIKeyError } from "@/lib/ai/provider";
import { RecruiterScanResponseSchema } from "@/schemas/ai.schema";
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

    const systemPrompt = `You are an elite Silicon Valley Tech Recruiter who reviews 250+ resumes daily and spends exactly 6 seconds on an initial resume skim.
Simulate what you notice first, the psychological eye-tracking path (F-pattern or Z-pattern), which sections trigger high/medium/low visual fixation, and make an instant first impression call (Strong Hire, Hire, Leaning No-Hire, No-Hire) with honest, unfiltered reasons.`;

    const userPrompt = `Target Role: ${targetRole}
Candidate Resume Data:
${wrapUntrustedInput("resume_content", resumeContent)}

Perform the 6-second recruiter skim scan and return the JSON response conforming to RecruiterScanResponseSchema.`;

    const result = await generateStructuredAI({
      systemPrompt,
      userPrompt,
      schema: RecruiterScanResponseSchema,
      temperature: 0.3,
    });

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": String(rateCheck.limit),
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (error) {
    console.error("Recruiter scan error:", error);
    if (error instanceof MissingAPIKeyError) {
      return NextResponse.json({ error: error.message, isMissingKey: true }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to execute recruiter 6-second scan" }, { status: 500 });
  }
}
