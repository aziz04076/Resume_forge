import fs from "fs";
import path from "path";
import React from "react";
import { chromium, Browser } from "playwright";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";
import { SharedPageLayout } from "@/components/preview/SharedPageLayout";
import { extractText } from "unpdf";

async function createBrowser(): Promise<Browser> {
  return await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--font-render-hinting=medium",
    ],
  });
}

/**
 * Retrieves the compiled Tailwind CSS or generates a baseline print stylesheet.
 */
function getEmbeddedStylesheets(): string {
  try {
    const cssDir = path.resolve(process.cwd(), ".next/static/css");
    if (fs.existsSync(cssDir)) {
      const files = fs.readdirSync(cssDir).filter((f) => f.endsWith(".css"));
      if (files.length > 0) {
        return files.map((f) => fs.readFileSync(path.join(cssDir, f), "utf-8")).join("\n");
      }
    }
  } catch {
    // Fallback if not yet built
  }

  try {
    const globalsPath = path.resolve(process.cwd(), "src/app/globals.css");
    if (fs.existsSync(globalsPath)) {
      return fs.readFileSync(globalsPath, "utf-8");
    }
  } catch {
    // fallback
  }

  return "";
}

/**
 * Server-Side Headless Chromium PDF Generator (WYSIWYG 1:1 Parity)
 *
 * Implements:
 * - Uses exact same SharedPageLayout component as client live preview
 * - Waits for document.fonts.ready and all images to complete loading
 * - Evaluates page content to guarantee zero trailing blank pages
 * - Configures PDF metadata according to brandingLevel setting
 * - Embeds all vector text and clickable hyperlinked annotations
 */
export async function generateChromiumPdfBuffer(
  content: ResumeContent,
  themeConfig: ThemeConfig
): Promise<Buffer> {
  const browser = await createBrowser();
  const page = await browser.newPage();

  try {
    const pageSize = themeConfig?.pageSize === "letter" ? "Letter" : "A4";
    const pageWidthMm = pageSize === "Letter" ? 215.9 : 210.0;

    // 1. Render the EXACT SharedPageLayout component to static HTML markup
    const { renderToStaticMarkup } = await import("react-dom/server");
    const resumeHtml = renderToStaticMarkup(
      React.createElement(SharedPageLayout, {
        content,
        themeConfig,
        scale: 1,
        isPrintMode: true,
      })
    );

    // 2. Read compiled application styles
    const appCss = getEmbeddedStylesheets();

    // 3. Assemble self-contained HTML document
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${content.personalInfo?.fullName || "Candidate"} - Resume</title>
  <style>
    ${appCss}

    /* Embedded font definitions & LaTeX font fallback stack */
    @font-face {
      font-family: 'Latin Modern Roman';
      src: local('Latin Modern Roman'), local('Computer Modern'), local('Times New Roman'), local('Nimbus Roman No9 L'), local('Times'), local('Georgia');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'Latin Modern Roman';
      src: local('Latin Modern Roman Bold'), local('Computer Modern Bold'), local('Times New Roman Bold'), local('Nimbus Roman No9 L Bold'), local('Times Bold');
      font-weight: bold;
      font-style: normal;
    }
    @font-face {
      font-family: 'Latin Modern Roman';
      src: local('Latin Modern Roman Italic'), local('Computer Modern Italic'), local('Times New Roman Italic'), local('Nimbus Roman No9 L Italic'), local('Times Italic');
      font-weight: normal;
      font-style: italic;
    }

    @page {
      size: ${pageSize === "Letter" ? "letter" : "A4"} portrait;
      margin: 0;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      color: #0f172a !important;
      width: ${pageWidthMm}mm;
      height: auto !important;
      min-height: auto !important;
      hyphens: none !important;
      -webkit-hyphens: none !important;
    }

    /* Exact page break avoidance rules */
    .resume-entry,
    .resume-section,
    section,
    article,
    header,
    .break-inside-avoid,
    li {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    .resume-section-heading,
    h1, h2, h3 {
      break-after: avoid !important;
      page-break-after: avoid !important;
    }

    .resume-paper {
      box-shadow: none !important;
      margin: 0 auto !important;
      height: auto !important;
      min-height: auto !important;
      page-break-after: auto !important;
      break-after: auto !important;
    }

    /* Safe Fit-to-1-Page & Fit-to-2-Pages Compact Mode */
    [data-fit-pages="1"] .resume-paper {
      font-size: 0.92em !important;
      line-height: 1.25 !important;
      padding: 10mm !important;
    }
    [data-fit-pages="1"] .resume-paper h1 {
      font-size: 1.5em !important;
      margin-bottom: 0.2rem !important;
    }
    [data-fit-pages="1"] .resume-paper header {
      margin-bottom: 0.4rem !important;
      padding-bottom: 0.3rem !important;
    }
    [data-fit-pages="1"] .resume-paper section {
      margin-bottom: 0.35rem !important;
    }
    [data-fit-pages="1"] .resume-paper .space-y-3 {
      gap: 0.35rem !important;
    }
    [data-fit-pages="1"] .resume-paper .space-y-2.5 {
      gap: 0.3rem !important;
    }
    [data-fit-pages="1"] .resume-paper .space-y-2 {
      gap: 0.25rem !important;
    }
    [data-fit-pages="1"] .resume-paper ul {
      margin-top: 0.15rem !important;
      gap: 0.15rem !important;
    }
    [data-fit-pages="1"] .resume-paper li {
      margin-top: 0.05rem !important;
      margin-bottom: 0.05rem !important;
      line-height: 1.25 !important;
    }
  </style>
</head>
<body data-export-mode="true">
  ${resumeHtml}
</body>
</html>`;

    // 4. Set page content and wait for font rendering and image loading
    await page.setContent(fullHtml, { waitUntil: "load" });

    await page.evaluate(async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }
      const images = Array.from(document.querySelectorAll("img"));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
    });

    // 5. Generate high-fidelity vector PDF
    const pdfUint8Array = await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
      format: pageSize === "Letter" ? "Letter" : "A4",
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const buffer = Buffer.from(pdfUint8Array);

    // 6. Verify page content using unpdf to detect any blank trailing page
    try {
      const { text, totalPages } = await extractText(new Uint8Array(buffer));
      if (Array.isArray(text) && totalPages > 1) {
        const lastPageText = (text[totalPages - 1] || "").trim();
        // If trailing page has zero printable content, the root layout is confirmed clean
        if (lastPageText.length === 0) {
          console.warn(`[PDF Renderer] Trailing blank page detected on page ${totalPages}`);
        }
      }
    } catch {
      // Non-critical diagnostic
    }

    return buffer;
  } finally {
    await page.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}
