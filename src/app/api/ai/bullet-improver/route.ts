import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput, MissingAPIKeyError } from "@/lib/ai/provider";
import { BULLET_IMPROVER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { BulletImproverResponseSchema } from "@/schemas/ai.schema";
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
    const { bullet, targetRole = "Software Engineer", context = "" } = body;

    if (!bullet || typeof bullet !== "string" || bullet.trim() === "") {
      return NextResponse.json({ error: "Bullet text is required" }, { status: 400 });
    }

    if (!validateInputSize(bullet) || !validateInputSize(context)) {
      return NextResponse.json({ error: "Input exceeds maximum allowed length" }, { status: 400 });
    }

    const userPrompt = `Target Role: ${targetRole}
${context ? `Additional Context:\n${wrapUntrustedInput("context", context)}` : ""}

Original Weak Bullet:
${wrapUntrustedInput("original_bullet", bullet)}

Rewrite this bullet point using the Google XYZ ("Accomplished [X], measured by [Y], by doing [Z]") and STAR formulas. Provide 3 high-impact quantified variations.`;

    const result = await generateStructuredAI({
      systemPrompt: BULLET_IMPROVER_SYSTEM_PROMPT,
      userPrompt,
      schema: BulletImproverResponseSchema,
      temperature: 0.3,
    });

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": String(rateCheck.limit),
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (error) {
    console.error("AI Bullet Improver error:", error);
    if (error instanceof MissingAPIKeyError) {
      return NextResponse.json({ error: error.message, isMissingKey: true }, { status: 401 });
    }
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to improve bullet point with AI",
      },
      { status: 500 }
    );
  }
}
