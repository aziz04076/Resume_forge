import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput, MissingAPIKeyError } from "@/lib/ai/provider";
import { TailoredResumeResponseSchema } from "@/schemas/ai.schema";
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
    let { jobDescription = "" } = body;
    const { resumeContent, jobUrl } = body;

    if (!resumeContent) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
    }

    // If jobUrl is provided, fetch and extract text from the URL server-side
    if (jobUrl && typeof jobUrl === "string" && jobUrl.startsWith("http")) {
      try {
        const res = await fetch(jobUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ResumeForge/2.0",
          },
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const html = await res.text();
          // Strip HTML tags and collapse whitespace
          const text = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          jobDescription = text.slice(0, 10000);
        }
      } catch (fetchErr) {
        console.warn("Failed to fetch JD from URL:", fetchErr);
      }
    }

    if (!jobDescription || jobDescription.trim().length < 30) {
      return NextResponse.json(
        { error: "A valid Job Description text or accessible URL is required to tailor the resume." },
        { status: 400 }
      );
    }

    if (!validateInputSize(jobDescription) || !validateInputSize(resumeContent)) {
      return NextResponse.json({ error: "Input exceeds maximum allowed size" }, { status: 400 });
    }

    const systemPrompt = `You are a Principal Technical Recruiter and Career Strategist.
Your task is to tailor a candidate's resume to match a specific Job Description.

CRITICAL ANTI-HALLUCINATION RULES:
1. NEVER INVENT experience, projects, metrics, certifications, employers, or skills.
2. You may ONLY rephrase, reword, and re-order existing bullet points and summary text to naturally incorporate JD keywords and match terminology.
3. Every single change MUST be recorded in the "diffSummary" array with originalText, modifiedText, and clear justification reason.
4. Any critical skills or experience demanded by the JD that the candidate does NOT possess must NOT be inserted into the resume; place them strictly into "suggestedAdditions".
5. Return JSON adhering strictly to the TailoredResumeResponseSchema.`;

    const userPrompt = `Target Job Description:
${wrapUntrustedInput("job_description", jobDescription)}

Candidate Resume:
${wrapUntrustedInput("resume_content", resumeContent)}

Generate the tailored resume content, detailed change diffs, and flagged suggested additions.`;

    const result = await generateStructuredAI({
      systemPrompt,
      userPrompt,
      schema: TailoredResumeResponseSchema,
      temperature: 0.2,
    });

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": String(rateCheck.limit),
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (error) {
    console.error("Tailor Resume error:", error);
    if (error instanceof MissingAPIKeyError) {
      return NextResponse.json({ error: error.message, isMissingKey: true }, { status: 401 });
    }
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to tailor resume to job description",
      },
      { status: 500 }
    );
  }
}
