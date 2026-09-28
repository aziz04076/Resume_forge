import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { z } from "zod";

export type AIProviderName = "anthropic" | "openai";

export function getActiveProvider(): AIProviderName {
  if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim() !== "") {
    return "anthropic";
  }
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== "") {
    return "openai";
  }
  return "anthropic"; // default primary
}

export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "Missing ANTHROPIC_API_KEY in environment variables. Please add your real Anthropic Claude API key to .env to use this feature."
    );
  }
  return new Anthropic({ apiKey });
}

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "Missing OPENAI_API_KEY in environment variables. Please add your real OpenAI API key to .env to use this feature."
    );
  }
  return new OpenAI({ apiKey });
}

interface GenerateStructuredOptions<T> {
  systemPrompt: string;
  userPrompt: string;
  schema: z.ZodType<T>;
  preferredProvider?: AIProviderName;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Executes a real LLM completion with strict Zod schema validation and JSON extraction.
 */
export async function generateStructuredAI<T>({
  systemPrompt,
  userPrompt,
  schema,
  preferredProvider,
  temperature = 0.2,
  maxTokens = 4096,
}: GenerateStructuredOptions<T>): Promise<T> {
  const provider = preferredProvider || getActiveProvider();

  let rawContent = "";

  if (provider === "anthropic") {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: maxTokens,
      temperature,
      system: `${systemPrompt}\n\nIMPORTANT: Respond ONLY with a valid JSON object matching the requested schema. Do not enclose in markdown code blocks or add conversational preamble.`,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const firstBlock = response.content[0];
    if (firstBlock.type === "text") {
      rawContent = firstBlock.text;
    } else {
      throw new Error("Unexpected non-text response from Anthropic Claude API");
    }
  } else {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\nIMPORTANT: You must return a single JSON object.`,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    rawContent = response.choices[0]?.message?.content || "";
  }

  // Extract JSON if wrapped in markdown code blocks
  let jsonString = rawContent.trim();
  if (jsonString.startsWith("```json")) {
    jsonString = jsonString.replace(/^```json\s*/, "").replace(/```$/, "").trim();
  } else if (jsonString.startsWith("```")) {
    jsonString = jsonString.replace(/^```\s*/, "").replace(/```$/, "").trim();
  }

  try {
    const parsed = JSON.parse(jsonString);
    return schema.parse(parsed);
  } catch (error) {
    console.error("Zod Validation or JSON parse error:", error, "\nRaw Output:", rawContent);
    throw new Error(
      `AI response failed strict validation: ${error instanceof Error ? error.message : "Invalid JSON"}`
    );
  }
}

/**
 * Real streaming completion helper returning a standard ReadableStream of text chunks.
 */
export async function streamAICompletion(
  systemPrompt: string,
  userPrompt: string,
  preferredProvider?: AIProviderName
): Promise<ReadableStream<Uint8Array>> {
  const provider = preferredProvider || getActiveProvider();
  const encoder = new TextEncoder();

  if (provider === "anthropic") {
    const anthropic = getAnthropicClient();
    const stream = await anthropic.messages.stream({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      temperature: 0.3,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    return new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });
  } else {
    const openai = getOpenAIClient();
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    return new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });
  }
}
