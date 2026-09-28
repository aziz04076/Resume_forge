import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI } from "@/lib/ai/provider";
import { LINKEDIN_OPTIMIZER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { LinkedInOptimizerResponseSchema } from "@/schemas/ai.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeContent } = body;

    if (!resumeContent) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
    }

    const userPrompt = `Candidate Resume:
${JSON.stringify(resumeContent, null, 2)}

Generate 3 high-impact LinkedIn headlines, an engaging narrative About section, top 15 skills to feature, and bullet points for featured experiences.`;

    const result = await generateStructuredAI({
      systemPrompt: LINKEDIN_OPTIMIZER_SYSTEM_PROMPT,
      userPrompt,
      schema: LinkedInOptimizerResponseSchema,
      temperature: 0.4,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("LinkedIn Optimizer API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate LinkedIn profile optimization",
      },
      { status: 500 }
    );
  }
}
