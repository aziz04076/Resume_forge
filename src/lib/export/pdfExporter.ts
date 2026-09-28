import React from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";
import { ResumePdfDocument } from "./pdfTextRenderer";

/**
 * Client-side vector text PDF exporter.
 * Generates selectable, searchable, ATS-parsable vector PDF.
 */
export async function exportToClientPdf(
  content: ResumeContent,
  themeConfig: ThemeConfig,
  fileName = "Resume.pdf"
): Promise<void> {
  const docElement = React.createElement(ResumePdfDocument, { content, themeConfig });
  const pdfInstance = pdf(docElement as unknown as Parameters<typeof pdf>[0]);
  const blob = await pdfInstance.toBlob();
  saveAs(blob, fileName);
}

/**
 * Server-side / Node.js vector text PDF generator returning a Buffer.
 * Used for testing and serverless endpoints.
 */
export async function generateTextPdfBuffer(
  content: ResumeContent,
  themeConfig?: ThemeConfig
): Promise<Buffer> {
  const docElement = React.createElement(ResumePdfDocument, { content, themeConfig });
  const pdfInstance = pdf(docElement as unknown as Parameters<typeof pdf>[0]);
  const stream = await pdfInstance.toBuffer();
  const chunks: Buffer[] = [];
  for await (const chunk of stream as AsyncIterable<Uint8Array | Buffer>) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

/**
 * Fallback to standard browser print dialog with @media print CSS styling.
 */
export function printResume(): void {
  if (typeof window !== "undefined") {
    window.print();
  }
}
