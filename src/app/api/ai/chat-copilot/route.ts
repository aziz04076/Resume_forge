import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI } from "@/lib/ai/provider";
import { COPILOT_CHAT_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { CopilotMessageResponseSchema } from "@/schemas/ai.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, resumeContent, conversationHistory = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const userPrompt = `Current Live Resume Data:
${JSON.stringify(resumeContent, null, 2)}

User Instruction / Question:
"${message}"

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

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Copilot Chat error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate copilot reply",
      },
      { status: 500 }
    );
  }
}
