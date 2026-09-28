import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI } from "@/lib/ai/provider";
import { JD_MATCHER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { JDMatcherResponseSchema } from "@/schemas/ai.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeContent, jobDescription, jobTitle = "Target Position" } = body;

    if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim() === "") {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }

    if (!resumeContent) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
    }

    const userPrompt = `Target Job Title: ${jobTitle}

Target Job Description:
${jobDescription}

Candidate Resume Data (JSON):
${JSON.stringify(resumeContent, null, 2)}

Perform a thorough ATS keyword and skill gap match analysis between the resume and the Job Description.`;

    const result = await generateStructuredAI({
      systemPrompt: JD_MATCHER_SYSTEM_PROMPT,
      userPrompt,
      schema: JDMatcherResponseSchema,
      temperature: 0.2,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI JD Matcher error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to run JD Matcher analysis",
      },
      { status: 500 }
    );
  }
}
