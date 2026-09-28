import { test, describe } from "node:test";
import assert from "node:assert";
import { extractText } from "unpdf";
import { generateTextPdfBuffer } from "../src/lib/export/pdfExporter";
import { DEFAULT_RESUME_CONTENT, DEFAULT_THEME_CONFIG } from "../src/schemas/resume.schema";

describe("Vector Text PDF Export & ATS Text Extraction", () => {
  test("should generate genuine text-based vector PDF with ATS readable content in correct reading order", async () => {
    // Generate the PDF buffer
    const buffer = await generateTextPdfBuffer(DEFAULT_RESUME_CONTENT, DEFAULT_THEME_CONFIG);

    assert.ok(buffer && buffer.length > 0, "PDF buffer must be non-empty");

    // Extract text from the PDF using unpdf (equivalent to pdftotext engine)
    const { text: pagesText } = await extractText(new Uint8Array(buffer));
    const combinedText = Array.isArray(pagesText) ? pagesText.join("\n") : String(pagesText);

    assert.ok(
      combinedText.length > 100,
      `Extracted text must have selectable words (length was ${combinedText.length})`
    );

    // 1. Candidate Full Name & Title
    assert.match(
      combinedText,
      /ALEX MORGAN/i,
      "Candidate name must be present in the extracted text"
    );
    assert.match(
      combinedText,
      /Senior Full-Stack Engineer/i,
      "Target role must be present in extracted text"
    );

    // 2. Contact details
    assert.match(combinedText, /alex\.morgan@example\.com/i, "Contact email must be extracted");
    assert.match(combinedText, /San Francisco/i, "Location must be extracted");

    // 3. Experience & Quantified Metrics
    assert.match(combinedText, /Stripe/i, "Work experience company must be present");
    assert.match(combinedText, /42%/i, "Quantified percentage metric (42%) must be extracted");
    assert.match(combinedText, /\$40M/i, "Financial impact metric ($40M) must be extracted");

    // 4. Skills & Education
    assert.match(combinedText, /TypeScript/i, "Technical skills must be extracted");
    assert.match(combinedText, /University of California, Berkeley/i, "Education institution must be extracted");

    // 5. Reading order verification: Header appears before Experience, Experience before Education
    const nameIndex = combinedText.indexOf("ALEX MORGAN");
    const stripeIndex = combinedText.indexOf("Stripe");
    const educationIndex = combinedText.indexOf("University of California, Berkeley");

    assert.ok(nameIndex !== -1, "Name must be in text");
    assert.ok(stripeIndex !== -1, "Company must be in text");
    assert.ok(educationIndex !== -1, "Education must be in text");

    assert.ok(
      nameIndex < stripeIndex,
      `Reading order violated: Name (pos ${nameIndex}) must appear before Experience (pos ${stripeIndex})`
    );
    assert.ok(
      stripeIndex < educationIndex,
      `Reading order violated: Experience (pos ${stripeIndex}) must appear before Education (pos ${educationIndex})`
    );
  });
});
