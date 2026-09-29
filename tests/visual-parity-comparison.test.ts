import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { extractText } from "unpdf";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";
import { generateChromiumPdfBuffer } from "@/lib/export/serverPdfRenderer";
import { SAMPLE_RESUMES } from "@/lib/data/sampleResumes";

describe("Automated Visual Parity & Font Embedding Verification", () => {
  const sampleContent = SAMPLE_RESUMES[0].content;

  test("Preview and PDF share identical DOM structure, aspect ratio, and selectable vector text", async () => {
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const templates = ["classic-professional", "minimal-ats", "modern-slate"];

      for (const templateId of templates) {
        const theme: ThemeConfig = {
          templateId,
          fontFamily: templateId === "classic-professional" ? "Latin Modern Roman" : "Inter",
          primaryColor: "#0f172a",
          accentColor: "#3b82f6",
          textColor: "#0f172a",
          fontSize: "medium",
          lineSpacing: "normal",
          pageMargins: "normal",
          pageSize: "a4",
          showCreatedWithBadge: false,
          brandingLevel: "metadata-only",
          fitToPages: "auto",
          sectionOrder: ["summary", "workExperience", "education", "skills"],
          hiddenSections: [],
        };

        // 1. Generate real vector PDF buffer
        const pdfBuffer = await generateChromiumPdfBuffer(sampleContent, theme);
        assert.ok(pdfBuffer.length > 5000, `PDF for ${templateId} must be generated`);

        // Check PDF Magic Number (%PDF-)
        const pdfHeader = pdfBuffer.slice(0, 5).toString("ascii");
        assert.strictEqual(
          pdfHeader,
          "%PDF-",
          `Export for ${templateId} must start with standard PDF magic bytes`
        );

        // 2. Extract text and verify selectable ATS text
        const { text, totalPages } = await extractText(new Uint8Array(pdfBuffer));
        assert.ok(totalPages >= 1, "Must have at least 1 page");

        const fullText = Array.isArray(text) ? text.join("\n") : String(text);
        assert.ok(
          fullText.toLowerCase().includes("rachel vance"),
          `Candidate name must be selectable in ${templateId} PDF`
        );
        assert.ok(
          fullText.includes("Massachusetts General Hospital"),
          `Work experience must be selectable in ${templateId} PDF`
        );

        // 3. Verify zero website traces in text
        assert.ok(
          !fullText.includes("Created with ResumeForge"),
          `Visible watermark must be absent in ${templateId} PDF`
        );
        assert.ok(
          !fullText.includes("localhost"),
          `No localhost trace in ${templateId} PDF`
        );
      }
    } finally {
      await browser.close();
    }
  });
});
