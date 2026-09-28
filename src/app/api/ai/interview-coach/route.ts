import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI } from "@/lib/ai/provider";
import {
  INTERVIEW_COACH_SYSTEM_PROMPT,
  INTERVIEW_EVALUATOR_SYSTEM_PROMPT,
} from "@/lib/ai/prompts";
import {
  InterviewQuestionsResponseSchema,
  InterviewAnswerEvaluationSchema,
} from "@/schemas/ai.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = "GENERATE_QUESTIONS", resumeContent, targetRole, jobDescription, question, userTranscript } =
      body;

    if (action === "GENERATE_QUESTIONS") {
      const userPrompt = `Role: ${targetRole || "Senior Software Engineer"}
${jobDescription ? `Job Description:\n${jobDescription}\n` : ""}

Candidate Resume:
${JSON.stringify(resumeContent, null, 2)}

Generate 4-5 rigorous interview questions (behavioral, technical, system design, situational) with rationales and evaluation criteria.`;

      const result = await generateStructuredAI({
        systemPrompt: INTERVIEW_COACH_SYSTEM_PROMPT,
        userPrompt,
        schema: InterviewQuestionsResponseSchema,
        temperature: 0.3,
      });

      return NextResponse.json(result);
    } else if (action === "EVALUATE_ANSWER") {
      if (!userTranscript || !question) {
        return NextResponse.json(
          { error: "Both question and candidate userTranscript are required" },
          { status: 400 }
        );
      }

      const userPrompt = `Target Role: ${targetRole || "Software Engineer"}
Interview Question: "${question}"
Candidate Answer: "${userTranscript}"

Evaluate this answer. Score it (0-100), identify concrete strengths, weaknesses, missing key concepts, and provide an improved exemplar version.`;

      const result = await generateStructuredAI({
        systemPrompt: INTERVIEW_EVALUATOR_SYSTEM_PROMPT,
        userPrompt,
        schema: InterviewAnswerEvaluationSchema,
        temperature: 0.2,
      });

      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
    }
  } catch (error) {
    console.error("Interview Coach API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to execute interview coach engine",
      },
      { status: 500 }
    );
  }
}
