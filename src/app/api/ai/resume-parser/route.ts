import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput } from "@/lib/ai/provider";
import { RESUME_PARSER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { ParsedResumeResponseSchema } from "@/schemas/ai.schema";
import { extractTextFromFileBuffer } from "@/lib/parser/fileTextExtractor";
import { checkRateLimit, validateInputSize } from "@/lib/ai/rateLimiter";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const rateCheck = await checkRateLimit(req, session?.user?.id);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: rateCheck.error }, { status: rateCheck.statusCode || 429 });
    }

    const contentType = req.headers.get("content-type") || "";
    let rawTextToParse = "";

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload (PDF, DOCX, TXT)
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file was uploaded in the 'file' field" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const extracted = await extractTextFromFileBuffer(buffer, file.name);

      if (extracted.isScannedSuspected) {
        return NextResponse.json(
          {
            error:
              "This PDF appears to be a scanned image with no selectable text. Please upload a standard vector/text PDF or Word DOCX file.",
          },
          { status: 422 }
        );
      }

      rawTextToParse = extracted.text;
    } else {
      // Handle JSON body with raw text
      const body = await req.json().catch(() => ({}));
      rawTextToParse = body.rawText || "";
    }

    if (!rawTextToParse || rawTextToParse.trim().length < 50) {
      return NextResponse.json(
        { error: "Valid raw resume text of at least 50 characters is required for parsing" },
        { status: 400 }
      );
    }

    if (!validateInputSize(rawTextToParse)) {
      return NextResponse.json({ error: "Resume content exceeds maximum allowed length" }, { status: 400 });
    }

    const userPrompt = `Please parse the following candidate resume into structured JSON:
${wrapUntrustedInput("resume_text", rawTextToParse)}

Extract all candidate details into structured JSON matching the ResumeContent schema. Ensure dates, contact info, and bullet points are preserved accurately.`;

    const parsedContent = await generateStructuredAI({
      systemPrompt: RESUME_PARSER_SYSTEM_PROMPT,
      userPrompt,
      schema: ParsedResumeResponseSchema,
      temperature: 0.1,
    });

    return NextResponse.json(
      {
        success: true,
        content: parsedContent,
        extractedLength: rawTextToParse.length,
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rateCheck.limit),
          "X-RateLimit-Remaining": String(rateCheck.remaining),
        },
      }
    );
  } catch (error) {
    console.error("Resume Parser error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to parse resume into structured format",
      },
      { status: 500 }
    );
  }
}
