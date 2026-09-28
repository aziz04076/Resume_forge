import mammoth from "mammoth";
import { extractText } from "unpdf";

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export interface ExtractedFileResult {
  text: string;
  pageCount?: number;
  format: "pdf" | "docx" | "txt";
  isScannedSuspected?: boolean;
}

/**
 * Extracts plain text from PDF, DOCX, or TXT file buffers safely.
 */
export async function extractTextFromFileBuffer(
  buffer: Buffer,
  fileName: string
): Promise<ExtractedFileResult> {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File size (${(buffer.length / (1024 * 1024)).toFixed(1)}MB) exceeds maximum allowed size of 10MB.`
    );
  }

  if (extension === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    const rawText = result.value.trim();
    if (!rawText) {
      throw new Error("Unable to extract text from DOCX file. The document may be empty or corrupted.");
    }
    return {
      text: rawText,
      format: "docx",
    };
  }

  if (extension === "pdf") {
    const { text, totalPages } = await extractText(new Uint8Array(buffer));
    const combined = Array.isArray(text) ? text.join("\n") : String(text || "");
    const cleanText = combined.trim();

    // Check if the PDF has very little text (likely an image-only / scanned PDF)
    const isScanned = cleanText.length < 50;

    return {
      text: cleanText,
      pageCount: totalPages,
      format: "pdf",
      isScannedSuspected: isScanned,
    };
  }

  if (extension === "txt" || extension === "md" || extension === "json") {
    const text = buffer.toString("utf-8").trim();
    return {
      text,
      format: "txt",
    };
  }

  throw new Error(
    `Unsupported file format: .${extension}. Please upload a PDF (.pdf), Word document (.docx), or plain text (.txt) file.`
  );
}
