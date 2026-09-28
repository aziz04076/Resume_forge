import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput, MissingAPIKeyError } from "@/lib/ai/provider";
import { COPILOT_CHAT_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { CopilotMessageResponseSchema } from "@/schemas/ai.schema";
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
    const { message, resumeContent, conversationHistory = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!validateInputSize(message) || !validateInputSize(resumeContent)) {
      return NextResponse.json({ error: "Input exceeds maximum allowed length" }, { status: 400 });
    }

    const userPrompt = `Current Live Resume Data:
${wrapUntrustedInput("resume_content", resumeContent)}

User Instruction / Question:
${wrapUntrustedInput("user_message", message)}

${
  conversationHistory.length > 0
    ? `Recent Conversation Context:\n${JSON.stringify(conversationHistory.slice(-4))}`
    : ""
}

Assist the candidate. If the user wants to update a section, modify summary, add an experience, or change template, attach the appropriate suggestedAction with typed payload.`;

    const result = await generateStructuredAI({
      systemPrompt: COPILOT_CHAT_SYSTEM_PROMPT,
      userPrompt,
      schema: CopilotMessageResponseSchema,
      temperature: 0.3,
    });

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": String(rateCheck.limit),
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (error) {
    console.error("AI Copilot Chat error:", error);
    if (error instanceof MissingAPIKeyError) {
      return NextResponse.json({ error: error.message, isMissingKey: true }, { status: 401 });
    }
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate copilot reply",
      },
      { status: 500 }
    );
  }
}
