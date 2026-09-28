import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput, MissingAPIKeyError } from "@/lib/ai/provider";
import { ResumeContentSchema } from "@/schemas/resume.schema";
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
    const { resumeContent, targetLanguage = "Hindi" } = body;

    if (!resumeContent) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
    }

    if (!validateInputSize(resumeContent)) {
      return NextResponse.json({ error: "Input exceeds maximum allowed length" }, { status: 400 });
    }

    const systemPrompt = `You are a professional localization expert and multilingual technical resume translator.
Translate this resume accurately into ${targetLanguage}.
Keep company names, university names, technical keywords (e.g., React, TypeScript, Kafka, Docker), and emails in standard recognized forms.
Translate summary, job titles, achievements, and degree descriptions naturally into ${targetLanguage} while preserving all quantified metrics ($40M, 42%, etc.).
Return JSON matching the ResumeContent schema.`;

    const userPrompt = `Target Language: ${targetLanguage}
Candidate Resume Data:
${wrapUntrustedInput("resume_content", resumeContent)}

Translate this resume into ${targetLanguage}.`;

    const translatedContent = await generateStructuredAI({
      systemPrompt,
      userPrompt,
      schema: ResumeContentSchema,
      temperature: 0.1,
    });

    return NextResponse.json(
      {
        success: true,
        targetLanguage,
        translatedContent,
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rateCheck.limit),
          "X-RateLimit-Remaining": String(rateCheck.remaining),
        },
      }
    );
  } catch (error) {
    console.error("Resume translation error:", error);
    if (error instanceof MissingAPIKeyError) {
      return NextResponse.json({ error: error.message, isMissingKey: true }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to translate resume" }, { status: 500 });
  }
}
