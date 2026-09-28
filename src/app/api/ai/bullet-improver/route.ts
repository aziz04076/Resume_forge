import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI } from "@/lib/ai/provider";
import { BULLET_IMPROVER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { BulletImproverResponseSchema } from "@/schemas/ai.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bullet, targetRole = "Software Engineer", context = "" } = body;

    if (!bullet || typeof bullet !== "string" || bullet.trim() === "") {
      return NextResponse.json({ error: "Bullet text is required" }, { status: 400 });
    }

    const userPrompt = `Target Role: ${targetRole}
${context ? `Additional Context: ${context}` : ""}
Original Weak Bullet: "${bullet}"

Rewrite this bullet point using the Google XYZ ("Accomplished [X], measured by [Y], by doing [Z]") and STAR formulas. Provide 3 high-impact quantified variations.`;

    const result = await generateStructuredAI({
      systemPrompt: BULLET_IMPROVER_SYSTEM_PROMPT,
      userPrompt,
      schema: BulletImproverResponseSchema,
      temperature: 0.3,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Bullet Improver error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to improve bullet point with AI",
      },
      { status: 500 }
    );
  }
}
