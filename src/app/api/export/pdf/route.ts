import { NextRequest, NextResponse } from "next/server";
import { generateChromiumPdfBuffer } from "@/lib/export/serverPdfRenderer";
import { ResumeContentSchema, ThemeConfigSchema } from "@/schemas/resume.schema";
import { z } from "zod";

const ExportPdfRequestSchema = z.object({
  content: ResumeContentSchema,
  themeConfig: ThemeConfigSchema,
  fileName: z.string().optional().default("Resume.pdf"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ExportPdfRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid resume export payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { content, themeConfig, fileName } = parsed.data;

    // Generate pristine, 100% WYSIWYG vector PDF via headless Chromium
    const pdfBuffer = await generateChromiumPdfBuffer(content, themeConfig);

    const safeName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeName)}"`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("PDF Export Route Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
