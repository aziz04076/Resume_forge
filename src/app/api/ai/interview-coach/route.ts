import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput, MissingAPIKeyError } from "@/lib/ai/provider";
import {
  INTERVIEW_COACH_SYSTEM_PROMPT,
  INTERVIEW_EVALUATOR_SYSTEM_PROMPT,
} from "@/lib/ai/prompts";
import {
  InterviewQuestionsResponseSchema,
  InterviewAnswerEvaluationSchema,
} from "@/schemas/ai.schema";
import { checkRateLimit, validateInputSize } from "@/lib/ai/rateLimiter";
import { auth } from "@/auth";

const COMMON_FILLER_WORDS = [
  "um",
  "uh",
  "like",
  "you know",
  "actually",
  "basically",
  "literally",
  "sort of",
  "kind of",
  "right",
];

function detectFillerWords(transcript: string) {
  const lower = transcript.toLowerCase();
  const detected: string[] = [];
  let totalCount = 0;

  for (const filler of COMMON_FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, "gi");
    const matches = lower.match(regex);
    if (matches && matches.length > 0) {
      detected.push(`${filler} (${matches.length}x)`);
      totalCount += matches.length;
    }
  }

  return { totalCount, detected };
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const rateCheck = await checkRateLimit(req, session?.user?.id);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: rateCheck.error }, { status: rateCheck.statusCode || 429 });
    }

    const body = await req.json();
    const { action = "GENERATE_QUESTIONS", resumeContent, targetRole, jobDescription, question, userTranscript } =
      body;

    if (action === "GENERATE_QUESTIONS") {
      if (!validateInputSize(jobDescription) || !validateInputSize(resumeContent)) {
        return NextResponse.json({ error: "Input exceeds maximum allowed length" }, { status: 400 });
      }

      const userPrompt = `Role: ${targetRole || "Senior Software Engineer"}
${jobDescription ? `Target Job Description:\n${wrapUntrustedInput("job_description", jobDescription)}\n` : ""}

Candidate Resume:
${wrapUntrustedInput("resume_content", resumeContent)}

Generate 4-5 rigorous interview questions (behavioral, technical, system design, situational) with rationales, evaluation criteria, and ideal STAR answers tailored to this candidate and target JD.`;

      const result = await generateStructuredAI({
        systemPrompt: INTERVIEW_COACH_SYSTEM_PROMPT,
        userPrompt,
        schema: InterviewQuestionsResponseSchema,
        temperature: 0.3,
      });

      return NextResponse.json(result, {
        headers: {
          "X-RateLimit-Limit": String(rateCheck.limit),
          "X-RateLimit-Remaining": String(rateCheck.remaining),
        },
      });
    } else if (action === "EVALUATE_ANSWER") {
      if (!userTranscript || !question) {
        return NextResponse.json(
          { error: "Both question and candidate userTranscript are required" },
          { status: 400 }
        );
      }

      const { totalCount: fillerWordCount, detected: fillerWordsDetected } =
        detectFillerWords(userTranscript);

      const userPrompt = `Target Role: ${targetRole || "Software Engineer"}
Interview Question:
${wrapUntrustedInput("question", question)}

Candidate Answer (from voice speech-to-text):
${wrapUntrustedInput("candidate_answer", userTranscript)}

Evaluate this answer:
1. Provide overall score (0-100) and confidence rating.
2. Provide STAR scores (Situation 0-25, Task 0-25, Action 0-25, Result 0-25).
3. Identify strengths, weaknesses, and missing key concepts.
4. Provide an exemplar improved version using quantified STAR format.`;

      const result = await generateStructuredAI({
        systemPrompt: INTERVIEW_EVALUATOR_SYSTEM_PROMPT,
        userPrompt,
        schema: InterviewAnswerEvaluationSchema,
        temperature: 0.2,
      });

      // Inject deterministic filler word metrics into evaluation
      result.fillerWordCount = fillerWordCount;
      result.fillerWordsDetected = fillerWordsDetected;

      return NextResponse.json(result, {
        headers: {
          "X-RateLimit-Limit": String(rateCheck.limit),
          "X-RateLimit-Remaining": String(rateCheck.remaining),
        },
      });
    } else {
      return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
    }
  } catch (error) {
    console.error("Interview Coach API error:", error);
    if (error instanceof MissingAPIKeyError) {
      return NextResponse.json({ error: error.message, isMissingKey: true }, { status: 401 });
    }
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to execute interview coach engine",
      },
      { status: 500 }
    );
  }
}
