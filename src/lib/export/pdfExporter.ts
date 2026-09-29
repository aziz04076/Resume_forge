import React from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";
import { ResumePdfDocument } from "./pdfTextRenderer";

/**
 * Universal PDF exporter:
 * 1. Tries high-fidelity server-side Chromium endpoint (/api/export/pdf) for 1:1 WYSIWYG parity
 * 2. Falls back to client-side @react-pdf/renderer if offline or server endpoint is unreachable
 */
export async function exportToClientPdf(
  content: ResumeContent,
  themeConfig: ThemeConfig,
  fileName = "Resume.pdf"
): Promise<void> {
  const safeName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;

  try {
    const response = await fetch("/api/export/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, themeConfig, fileName: safeName }),
    });

    if (response.ok) {
      const blob = await response.blob();
      saveAs(blob, safeName);
      return;
    }
  } catch (err) {
    console.warn("Server PDF export unavailable, using client vector fallback:", err);
  }

  // Client-side fallback via @react-pdf/renderer
  const docElement = React.createElement(ResumePdfDocument, { content, themeConfig });
  const pdfInstance = pdf(docElement as unknown as Parameters<typeof pdf>[0]);
  const blob = await pdfInstance.toBlob();
  saveAs(blob, safeName);
}

/**
 * Clean Print Flow:
 * Generates the clean PDF and prints it via an invisible iframe or direct print
 * ensuring ZERO browser headers, footers, localhost URLs, or page numbers appear.
 */
export async function triggerCleanPrint(
  content: ResumeContent,
  themeConfig: ThemeConfig
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const response = await fetch("/api/export/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, themeConfig }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);

      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.src = pdfUrl;

      document.body.appendChild(iframe);

      iframe.onload = () => {
        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch {
            window.open(pdfUrl, "_blank");
          }
          setTimeout(() => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(pdfUrl);
          }, 60000);
        }, 300);
      };
      return;
    }
  } catch (err) {
    console.warn("Clean PDF print failed, falling back to window.print():", err);
  }

  window.print();
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
