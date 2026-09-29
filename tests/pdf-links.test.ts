import { test, describe } from "node:test";
import assert from "node:assert";
import { extractText } from "unpdf";
import { generateTextPdfBuffer } from "../src/lib/export/pdfExporter";
import { generateDocxBuffer } from "../src/lib/export/docxExporter";
import { normalizeUrl, getDisplayLinkText, normalizePhoneUri } from "../src/lib/utils/urlHelper";
import { DEFAULT_RESUME_CONTENT, DEFAULT_THEME_CONFIG, ResumeContent } from "../src/schemas/resume.schema";

describe("PDF & DOCX Link and Contact Behavior", () => {
  test("normalizeUrl should strip tracking params and neutralize unsafe schemes", () => {
    // Strips tracking params
    const dirty = "https://www.linkedin.com/in/alexmorgan?utm_source=twitter&utm_medium=social&fbclid=IwAR0123&ref=share";
    const cleaned = normalizeUrl(dirty);
    assert.strictEqual(cleaned, "https://linkedin.com/in/alexmorgan");

    // Neutralizes javascript:
    assert.strictEqual(normalizeUrl("javascript:alert(1)"), "");
    assert.strictEqual(normalizeUrl("data:text/html,test"), "");

    // Preserves valid protocols
    assert.strictEqual(normalizeUrl("alexmorgan.dev"), "https://alexmorgan.dev");
    assert.strictEqual(normalizeUrl("mailto:alex@example.com"), "mailto:alex@example.com");
    assert.strictEqual(normalizeUrl("tel:+15551234567"), "tel:+15551234567");
  });

  test("getDisplayLinkText should format platform name or clean URL according to toggle", () => {
    const rawLinkedIn = "https://www.linkedin.com/in/alexmorgan?utm_source=copy";
    // When showFullUrl is false: platform name only
    assert.strictEqual(getDisplayLinkText(rawLinkedIn, false), "LinkedIn");
    // When showFullUrl is true: cleaned domain and path without protocol or tracking
    assert.strictEqual(getDisplayLinkText(rawLinkedIn, true), "linkedin.com/in/alexmorgan");

    const rawGithub = "github.com/alexmorgan";
    assert.strictEqual(getDisplayLinkText(rawGithub, false), "GitHub");
    assert.strictEqual(getDisplayLinkText(rawGithub, true), "github.com/alexmorgan");
  });

  test("normalizePhoneUri formats telephone number safely for tel: scheme", () => {
    assert.strictEqual(normalizePhoneUri("+1 (555) 234-5678"), "tel:+15552345678");
    assert.strictEqual(normalizePhoneUri("01234 567890"), "tel:01234567890");
  });

  test("PDF with showFullUrlAsText: false renders platform names without tracking params", async () => {
    const contentWithDirtyLinks: ResumeContent = {
      ...DEFAULT_RESUME_CONTENT,
      personalInfo: {
        ...DEFAULT_RESUME_CONTENT.personalInfo,
        linkedin: "https://www.linkedin.com/in/alexmorgan?utm_source=linkedin_share&fbclid=987654",
        github: "https://github.com/alexmorgan?ref=resume_review",
        showFullUrlAsText: false,
      },
    };

    const buffer = await generateTextPdfBuffer(contentWithDirtyLinks, DEFAULT_THEME_CONFIG);
    assert.ok(buffer && buffer.length > 0, "PDF buffer must be generated");

    const { text: pagesText } = await extractText(new Uint8Array(buffer));
    const extracted = Array.isArray(pagesText) ? pagesText.join("\n") : String(pagesText);

    // Platform names must appear
    assert.match(extracted, /LinkedIn/i, "LinkedIn label must be extracted in PDF");
    assert.match(extracted, /GitHub/i, "GitHub label must be extracted in PDF");

    // Tracking query strings must NEVER appear in extracted text
    assert.strictEqual(extracted.includes("utm_source"), false, "Tracking utm_source must not appear");
    assert.strictEqual(extracted.includes("fbclid"), false, "Tracking fbclid must not appear");
    assert.strictEqual(extracted.includes("ref=resume_review"), false, "Tracking ref must not appear");
  });

  test("PDF with showFullUrlAsText: true renders cleaned full URL without tracking params", async () => {
    const contentWithToggledUrl: ResumeContent = {
      ...DEFAULT_RESUME_CONTENT,
      personalInfo: {
        ...DEFAULT_RESUME_CONTENT.personalInfo,
        linkedin: "https://www.linkedin.com/in/alexmorgan?utm_source=linkedin_share",
        showFullUrlAsText: true,
      },
    };

    const buffer = await generateTextPdfBuffer(contentWithToggledUrl, DEFAULT_THEME_CONFIG);
    assert.ok(buffer && buffer.length > 0, "PDF buffer must be generated");

    const { text: pagesText } = await extractText(new Uint8Array(buffer));
    const extracted = Array.isArray(pagesText) ? pagesText.join("\n") : String(pagesText);

    assert.match(extracted, /linkedin\.com\/in\/alexmorgan/i, "Cleaned full URL must be in text when toggle is ON");
    assert.strictEqual(extracted.includes("utm_source"), false, "Tracking params must still be stripped when toggle is ON");
  });

  test("DOCX exporter generates valid buffer with external hyperlinks", async () => {
    const content: ResumeContent = {
      ...DEFAULT_RESUME_CONTENT,
      personalInfo: {
        ...DEFAULT_RESUME_CONTENT.personalInfo,
        linkedin: "linkedin.com/in/alexmorgan",
        github: "github.com/alexmorgan",
      },
    };

    const docxBuffer = await generateDocxBuffer(content);
    assert.ok(docxBuffer && docxBuffer.length > 0, "DOCX buffer must be non-empty");
  });
});
