import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput, MissingAPIKeyError } from "@/lib/ai/provider";
import { z } from "zod";
import { checkRateLimit } from "@/lib/ai/rateLimiter";
import { auth } from "@/auth";

const FollowUpEmailResponseSchema = z.object({
  subject: z.string(),
  body: z.string(),
  keyFollowUpTips: z.array(z.string()),
  recommendedSendTiming: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const rateCheck = await checkRateLimit(req, session?.user?.id);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: rateCheck.error }, { status: rateCheck.statusCode || 429 });
    }

    const body = await req.json();
    const {
      company,
      position,
      interviewerName = "Hiring Manager",
      notes = "",
      emailType = "THANK_YOU_POST_INTERVIEW",
    } = body;

    if (!company || !position) {
      return NextResponse.json({ error: "Company and position are required" }, { status: 400 });
    }

    const systemPrompt = `You are an Executive Career Coach and Recruiter.
Draft a professional, compelling follow-up email.
Email Type Options:
- THANK_YOU_POST_INTERVIEW: Send within 24h, references specific conversation topics, reinforces fit.
- STATUS_FOLLOW_UP: Send 5-7 business days post-interview or application without updates.
- OFFER_NEGOTIATION: Professional inquiry regarding flexibility in base, equity, or sign-on bonus.`;

    const userPrompt = `Email Purpose: ${emailType}
Target Company: ${company}
Position: ${position}
Interviewer/Contact: ${interviewerName}
Context/Interview Notes:
${wrapUntrustedInput("notes", notes)}

Generate the email conforming strictly to the schema.`;

    const result = await generateStructuredAI({
      systemPrompt,
      userPrompt,
      schema: FollowUpEmailResponseSchema,
      temperature: 0.3,
    });

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": String(rateCheck.limit),
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (error) {
    console.error("Follow-up email error:", error);
    if (error instanceof MissingAPIKeyError) {
      return NextResponse.json({ error: error.message, isMissingKey: true }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to generate follow-up email" }, { status: 500 });
  }
}
