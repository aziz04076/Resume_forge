import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput, MissingAPIKeyError } from "@/lib/ai/provider";
import { JD_MATCHER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { JDMatcherResponseSchema } from "@/schemas/ai.schema";
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
    const { resumeContent, jobDescription, jobTitle = "Target Position" } = body;

    if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim() === "") {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }

    if (!resumeContent) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
    }

    if (!validateInputSize(jobDescription) || !validateInputSize(resumeContent)) {
      return NextResponse.json({ error: "Input exceeds maximum allowed length" }, { status: 400 });
    }

    const userPrompt = `Target Job Title: ${jobTitle}

Target Job Description:
${wrapUntrustedInput("job_description", jobDescription)}

Candidate Resume Data (JSON):
${wrapUntrustedInput("resume_content", resumeContent)}

Perform a thorough ATS keyword and skill gap match analysis between the resume and the Job Description.`;

    const result = await generateStructuredAI({
      systemPrompt: JD_MATCHER_SYSTEM_PROMPT,
      userPrompt,
      schema: JDMatcherResponseSchema,
      temperature: 0.2,
    });

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": String(rateCheck.limit),
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (error) {
    console.error("AI JD Matcher error:", error);
    if (error instanceof MissingAPIKeyError) {
      return NextResponse.json({ error: error.message, isMissingKey: true }, { status: 401 });
    }
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to run JD Matcher analysis",
      },
      { status: 500 }
    );
  }
}
