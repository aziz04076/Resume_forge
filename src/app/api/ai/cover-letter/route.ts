import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput, MissingAPIKeyError } from "@/lib/ai/provider";
import { COVER_LETTER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { CoverLetterResponseSchema } from "@/schemas/ai.schema";
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

    if (!validateInputSize(jobDescription) || !validateInputSize(resumeContent)) {
      return NextResponse.json({ error: "Input exceeds maximum allowed length" }, { status: 400 });
    }

    const userPrompt = `Role: ${roleTitle}
Company: ${companyName}
Desired Tone: ${tone}

Job Description:
${wrapUntrustedInput("job_description", jobDescription || "Standard senior role in modern engineering and leadership.")}

Candidate Resume:
${wrapUntrustedInput("resume_content", resumeContent)}

Instructions:
1. Conduct simulated/referenced company research for ${companyName}.
2. Cite 2-3 genuine facts or initiatives about ${companyName} in companyInsights and weave them organically into the letter.
3. Write an exceptional, high-converting cover letter tailored to this role and company.`;

    const result = await generateStructuredAI({
      systemPrompt: COVER_LETTER_SYSTEM_PROMPT,
      userPrompt,
      schema: CoverLetterResponseSchema,
      temperature: 0.4,
    });

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": String(rateCheck.limit),
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (error) {
    console.error("Cover Letter Generator error:", error);
    if (error instanceof MissingAPIKeyError) {
      return NextResponse.json({ error: error.message, isMissingKey: true }, { status: 401 });
    }
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate cover letter",
      },
      { status: 500 }
    );
  }
}
