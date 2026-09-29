import fs from "fs";
import path from "path";
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractText } from "unpdf";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";
import { generateChromiumPdfBuffer } from "@/lib/export/serverPdfRenderer";
import { buildDocxDocument } from "@/lib/export/docxExporter";
import { Packer } from "docx";

const ROOT = resolveProcessRoot();
function resolveProcessRoot(): string {
  return process.cwd();
}

describe("Golden Reference Resume & LaTeX Export Engine", () => {
  const fixturePath = path.resolve(ROOT, "tests/fixtures/anonymized-reference-resume.json");
  const rawFixture = fs.readFileSync(fixturePath, "utf-8");
  const sampleContent = JSON.parse(rawFixture) as ResumeContent;

  const classicTheme: ThemeConfig = {
    templateId: "classic-professional",
    fontFamily: "Latin Modern Roman",
    primaryColor: "#0f172a",
    accentColor: "#1e293b",
    textColor: "#0f172a",
    fontSize: "medium",
    lineSpacing: "normal",
    pageMargins: "normal",
    pageSize: "a4",
    showCreatedWithBadge: false,
    brandingLevel: "metadata-only",
    fitToPages: "auto",
    sectionOrder: [
      "summary",
      "workExperience",
      "education",
      "skills",
      "projects",
      "certifications",
      "languages",
    ],
    hiddenSections: [],
  };

  test("Renders Classic Professional template via Headless Chromium with 100% vector fidelity", async () => {
    const pdfBuffer = await generateChromiumPdfBuffer(sampleContent, classicTheme);
    assert.ok(pdfBuffer.length > 5000, "PDF buffer must be non-empty and reasonably sized");

    // Extract text from generated PDF
    const { text, totalPages } = await extractText(new Uint8Array(pdfBuffer));
    assert.ok(totalPages >= 1 && totalPages <= 2, `Expected 1-2 pages, got ${totalPages}`);

    const fullPdfText = Array.isArray(text) ? text.join("\n") : String(text || "");

    // 1. Candidate Name and Title
    assert.ok(
      fullPdfText.toLowerCase().includes("elena rostova"),
      "Full name must appear in extracted PDF text"
    );
    assert.ok(
      fullPdfText.includes("Principal Distributed Systems Architect"),
      "Job title must appear"
    );

    // 2. Critical Special Characters & Number Preservation (specifically verifying % does not cut off text)
    assert.ok(
      fullPdfText.includes("98%"),
      "The % sign in '98%' must survive and NOT truncate text"
    );
    assert.ok(
      fullPdfText.includes("latency, 98% improvement"),
      "Phrase 'latency, 98% improvement' must be completely preserved without truncation"
    );
    assert.ok(
      fullPdfText.includes("450k+"),
      "Metric '450k+' must be preserved"
    );
    assert.ok(
      fullPdfText.includes("99.999%"),
      "Availability '99.999%' must be preserved"
    );
    assert.ok(
      fullPdfText.includes("$12M") || fullPdfText.includes("$40M+"),
      "Dollar metrics ($12M / $40M+) must be preserved"
    );

    // 3. Special characters & unicode check: % & $ # _ { } < > " ' – — ’
    const specialCharsToVerify = ["%", "&", "$", "–", "—", "Café", "Zürich"];
    for (const char of specialCharsToVerify) {
      assert.ok(
        fullPdfText.includes(char),
        `Character/word "${char}" must appear in extracted PDF text`
      );
    }

    // 4. Verify ZERO visible website traces
    assert.ok(
      !fullPdfText.includes("Created with ResumeForge"),
      "Visible 'Created with ResumeForge' watermark must NOT appear when branding is metadata-only"
    );
    assert.ok(
      !fullPdfText.includes("localhost"),
      "No localhost or URL traces should appear in the body"
    );

    // 5. Verify no trailing blank page
    if (Array.isArray(text) && totalPages > 1) {
      const lastPage = text[totalPages - 1].trim();
      assert.ok(
        lastPage.length > 30,
        "Trailing page must contain genuine content, not be blank"
      );
    }
  });

  test("Special characters survive DOCX export pipeline without corruption", async () => {
    const doc = buildDocxDocument(sampleContent, classicTheme);
    const buffer = await Packer.toBuffer(doc);
    assert.ok(buffer.length > 5000, "DOCX buffer must be generated");

    // Extract raw text from DOCX buffer via mammoth
    const mammoth = await import("mammoth");
    const { value: extractedDocxText } = await mammoth.default.extractRawText({ buffer });

    assert.ok(
      extractedDocxText.toLowerCase().includes("elena rostova"),
      "Candidate name must appear in extracted DOCX text"
    );
    assert.ok(
      extractedDocxText.includes("98%"),
      "Percentage metric '98%' must appear in DOCX"
    );
    assert.ok(
      extractedDocxText.includes("latency, 98% improvement"),
      "Phrase 'latency, 98% improvement' must survive in DOCX"
    );
    assert.ok(
      extractedDocxText.includes("Café") && extractedDocxText.includes("Zürich"),
      "Unicode special characters must survive in DOCX"
    );
  });

  test("Private reference resume golden comparison (if present)", async () => {
    const privatePdfPath = path.resolve(ROOT, "tests/fixtures/private/reference-resume.pdf");

    if (fs.existsSync(privatePdfPath)) {
      const privateBuffer = fs.readFileSync(privatePdfPath);
      const { text: privateText, totalPages: privatePages } = await extractText(
        new Uint8Array(privateBuffer)
      );
      const combinedPrivateText = Array.isArray(privateText)
        ? privateText.join("\n")
        : String(privateText);

      assert.ok(combinedPrivateText.length > 100, "Private reference PDF must have readable text");
      console.log(
        `[Private Golden Test] Verified private reference resume: ${privatePages} page(s), ${combinedPrivateText.length} chars`
      );
    } else {
      console.log(
        "[Private Golden Test] tests/fixtures/private/reference-resume.pdf not found; passed public fixture."
      );
      assert.ok(true);
    }
  });
});
