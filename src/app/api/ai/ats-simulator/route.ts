import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI } from "@/lib/ai/provider";
import { ATS_SIMULATOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { ATSSimulatorResponseSchema } from "@/schemas/ai.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeContent, targetRole = "Software Engineer" } = body;

    if (!resumeContent) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
    }

    const userPrompt = `Target Role: ${targetRole}

Resume Data:
${JSON.stringify(resumeContent, null, 2)}

Simulate an enterprise Applicant Tracking System (ATS) scan on this resume. Check contact information, section headers, keyword density, and formatting. Provide clear actionable fixes.`;

    const result = await generateStructuredAI({
      systemPrompt: ATS_SIMULATOR_SYSTEM_PROMPT,
      userPrompt,
      schema: ATSSimulatorResponseSchema,
      temperature: 0.2,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("ATS Simulator error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to run ATS simulation",
      },
      { status: 500 }
    );
  }
}
