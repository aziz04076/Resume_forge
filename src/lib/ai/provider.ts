import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { z } from "zod";
import { env } from "@/lib/env";

export type AIProviderName = "anthropic" | "openai";

export class MissingAPIKeyError extends Error {
  constructor(provider: string) {
    super(
      `Missing ${provider.toUpperCase()}_API_KEY in environment variables. Please add your real API key in .env or settings to execute this feature.`
    );
    this.name = "MissingAPIKeyError";
  }
}

export class AIValidationError extends Error {
  constructor(message: string, public rawOutput?: string) {
    super(message);
    this.name = "AIValidationError";
  }
}

export class AITimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`AI provider request timed out after ${timeoutMs / 1000}s`);
    this.name = "AITimeoutError";
  }
}

/**
 * Prompt injection defense: Wraps untrusted user content (resumes, job descriptions, free text)
 * in safe delimiters and neutralizes matching closing tags.
 */
export function wrapUntrustedInput(tag: string, content: unknown): string {
  const text = typeof content === "object" ? JSON.stringify(content, null, 2) : String(content ?? "");
  const sanitized = text.replace(new RegExp(`</untrusted_${tag}>`, "gi"), `[escaped_tag]`);
  return `<untrusted_${tag}>\n${sanitized}\n</untrusted_${tag}>`;
}

export function getActiveProvider(): AIProviderName {
  if (env.ANTHROPIC_API_KEY && env.ANTHROPIC_API_KEY.trim() !== "") {
    return "anthropic";
  }
  if (env.OPENAI_API_KEY && env.OPENAI_API_KEY.trim() !== "") {
    return "openai";
  }
  return "anthropic";
}

export function getAnthropicClient(): Anthropic {
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new MissingAPIKeyError("anthropic");
  }
  return new Anthropic({ apiKey });
}

export function getOpenAIClient(): OpenAI {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new MissingAPIKeyError("openai");
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
  timeoutMs?: number;
}

/**
 * Extracts and cleans JSON from raw LLM output.
 */
function cleanJsonOutput(raw: string): string {
  let s = raw.trim();
  if (s.startsWith("```json")) {
    s = s.replace(/^```json\s*/, "").replace(/```$/, "").trim();
  } else if (s.startsWith("```")) {
    s = s.replace(/^```\s*/, "").replace(/```$/, "").trim();
  }
  return s;
}

/**
 * Core LLM execution with timeout, automatic retry on invalid JSON, and Zod validation.
 */
export async function generateStructuredAI<T>({
  systemPrompt,
  userPrompt,
  schema,
  preferredProvider,
  temperature = 0.2,
  maxTokens = 4096,
  timeoutMs = 25000,
}: GenerateStructuredOptions<T>): Promise<T> {
  const provider = preferredProvider || getActiveProvider();
  const anthropicModel = env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";
  const openaiModel = env.OPENAI_MODEL || "gpt-4o";

  async function executeCall(prompt: string): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      if (provider === "anthropic") {
        const anthropic = getAnthropicClient();
        const response = await anthropic.messages.create(
          {
            model: anthropicModel,
            max_tokens: maxTokens,
            temperature,
            system: `${systemPrompt}\n\nIMPORTANT: Respond ONLY with a valid JSON object matching the requested schema. Do not enclose in markdown code blocks or add conversational preamble.`,
            messages: [{ role: "user", content: prompt }],
          },
          { signal: controller.signal }
        );

        const firstBlock = response.content[0];
        if (firstBlock.type === "text") {
          return firstBlock.text;
        }
        throw new Error("Unexpected non-text response from Anthropic Claude API");
      } else {
        const openai = getOpenAIClient();
        const response = await openai.chat.completions.create(
          {
            model: openaiModel,
            temperature,
            max_tokens: maxTokens,
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: `${systemPrompt}\n\nIMPORTANT: You must return a single JSON object.`,
              },
              { role: "user", content: prompt },
            ],
          },
          { signal: controller.signal }
        );

        return response.choices[0]?.message?.content || "";
      }
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === "AbortError") {
        throw new AITimeoutError(timeoutMs);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  // Attempt 1: Initial call
  let rawContent = await executeCall(userPrompt);

  try {
    const cleaned = cleanJsonOutput(rawContent);
    const parsed = JSON.parse(cleaned);
    return schema.parse(parsed);
  } catch (initialErr) {
    console.warn("⚠️ Initial JSON validation failed. Attempting automatic repair retry...", initialErr);

    // Attempt 2: Automatic Repair with diagnostic feedback
    const repairPrompt = `The previous response failed schema validation.
Error: ${initialErr instanceof Error ? initialErr.message : "Invalid JSON"}
Previous output:
${rawContent}

Please fix the JSON to strictly conform to the expected schema without any markdown formatting.`;

    try {
      rawContent = await executeCall(repairPrompt);
      const cleaned = cleanJsonOutput(rawContent);
      const parsed = JSON.parse(cleaned);
      return schema.parse(parsed);
    } catch (retryErr) {
      console.error("❌ Retry validation also failed:", retryErr, "\nRaw output:", rawContent);
      throw new AIValidationError(
        `AI response failed strict validation after retry: ${
          retryErr instanceof Error ? retryErr.message : "Invalid JSON"
        }`,
        rawContent
      );
    }
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
  const anthropicModel = env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";
  const openaiModel = env.OPENAI_MODEL || "gpt-4o";

  if (provider === "anthropic") {
    const anthropic = getAnthropicClient();
    const stream = await anthropic.messages.stream({
      model: anthropicModel,
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
      model: openaiModel,
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
