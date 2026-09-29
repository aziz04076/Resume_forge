import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";
import path from "path";

const widths = [
  { name: "mobile", width: 360, height: 740 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
  { name: "wide", width: 1920, height: 1080 },
];

const themes = ["dark", "light"];
const outputDir = path.resolve("public/screenshots");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to calculate relative luminance & contrast ratio
const contrastScript = `
(() => {
  function parseRgb(colorStr) {
    if (!colorStr) return [0, 0, 0, 1];
    const match = colorStr.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
    if (!match) return [0, 0, 0, 1];
    return [
      parseInt(match[1], 10),
      parseInt(match[2], 10),
      parseInt(match[3], 10),
      match[4] !== undefined ? parseFloat(match[4]) : 1,
    ];
  }

  function getLuminance(r, g, b) {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function getEffectiveBg(el) {
    let cur = el;
    let bgColors = [];
    while (cur && cur !== document.documentElement) {
      const style = window.getComputedStyle(cur);
      const bg = style.backgroundColor;
      const [r, g, b, a] = parseRgb(bg);
      if (a > 0) {
        bgColors.push([r, g, b, a]);
        if (a === 1) break;
      }
      cur = cur.parentElement;
    }
    // Default page background if none found
    if (bgColors.length === 0) {
      const isLight = document.documentElement.classList.contains("light");
      return isLight ? [255, 255, 255, 1] : [2, 6, 23, 1]; // slate-950
    }
    // Composite backwards
    let r = bgColors[bgColors.length - 1][0];
    let g = bgColors[bgColors.length - 1][1];
    let b = bgColors[bgColors.length - 1][2];
    for (let i = bgColors.length - 2; i >= 0; i--) {
      const [cr, cg, cb, ca] = bgColors[i];
      r = Math.round(cr * ca + r * (1 - ca));
      g = Math.round(cg * ca + g * (1 - ca));
      b = Math.round(cb * ca + b * (1 - ca));
    }
    return [r, g, b, 1];
  }

  function calculateContrast(fgColor, bgColor) {
    const [fr, fg, fb, fa] = parseRgb(fgColor);
    const [br, bg, bb] = bgColor;
    // Composite foreground over background if semi-transparent
    const finalR = Math.round(fr * fa + br * (1 - fa));
    const finalG = Math.round(fg * fa + bg * (1 - fa));
    const finalB = Math.round(fb * fa + bb * (1 - fa));

    const lum1 = getLuminance(finalR, finalG, finalB);
    const lum2 = getLuminance(br, bg, bb);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return ((brightest + 0.05) / (darkest + 0.05)).toFixed(2);
  }

  const elements = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, p, span, a, button, li"));
  const samples = [];

  for (const el of elements) {
    const text = el.innerText ? el.innerText.trim() : "";
    if (!text || text.length < 3 || el.children.length > 2) continue;
    // Skip if element is not visible
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0 || rect.bottom < 0) continue;

    const style = window.getComputedStyle(el);
    const fg = style.color;
    const bg = getEffectiveBg(el);
    const contrast = calculateContrast(fg, bg);
    const fontSize = parseFloat(style.fontSize);
    const fontWeight = parseInt(style.fontWeight, 10) || 400;
    const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
    const requiredMin = isLarge ? 3.0 : 4.5;
    const pass = parseFloat(contrast) >= requiredMin;

    samples.push({
      tag: el.tagName.toLowerCase(),
      text: text.slice(0, 50),
      fg,
      bg: 'rgb(' + bg[0] + ',' + bg[1] + ',' + bg[2] + ')',
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      contrast: parseFloat(contrast),
      requiredMin,
      pass,
    });
  }

  return samples;
})();
`;

async function runAudit() {
  const browser = await chromium.launch();
  const summaryReport = {
    contrastViolations: [],
    axeResults: [],
    samples: {},
  };

  for (const theme of themes) {
    summaryReport.samples[theme] = {};
    for (const w of widths) {
      const context = await browser.newContext({
        viewport: { width: w.width, height: w.height },
        colorScheme: theme,
      });
      const page = await context.newPage();

      await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);

      await page.evaluate((th) => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(th);
        document.documentElement.style.colorScheme = th;
        try {
          localStorage.setItem("theme", th);
        } catch (e) {}
      }, theme);
      await page.waitForTimeout(600);

      // Capture after screenshot
      const screenshotPath = path.join(outputDir, `after-${theme}-${w.width}px.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Saved screenshot: ${screenshotPath}`);

      // Sample elements contrast
      const samples = await page.evaluate(contrastScript);
      const fails = samples.filter((s) => !s.pass);
      console.log(`[${theme.toUpperCase()} @ ${w.width}px] Sampled ${samples.length} elements. Contrast Fails: ${fails.length}`);
      if (fails.length > 0) {
        console.log("Sample fails:", fails.slice(0, 5));
      }
      summaryReport.samples[theme][w.name] = {
        total: samples.length,
        failsCount: fails.length,
        fails: fails.slice(0, 15),
      };

      // Run Axe color contrast
      try {
        const axeResults = await new AxeBuilder({ page })
          .withRules(["color-contrast"])
          .analyze();

        if (axeResults.violations.length > 0) {
          summaryReport.axeResults.push({
            theme,
            width: w.width,
            violationsCount: axeResults.violations.length,
            violations: axeResults.violations.map((v) => ({
              id: v.id,
              help: v.help,
              nodesCount: v.nodes.length,
              nodes: v.nodes.map((n) => ({
                html: n.html.slice(0, 100),
                summary: n.failureSummary,
              })),
            })),
          });
        }
      } catch (err) {
        console.error("Axe error:", err.message);
      }

      await page.close();
      await context.close();
    }
  }

  await browser.close();

  fs.writeFileSync(
    path.join(outputDir, "audit-detailed.json"),
    JSON.stringify(summaryReport, null, 2)
  );
  console.log("Detailed audit completed and saved to", path.join(outputDir, "audit-detailed.json"));
}

runAudit().catch(console.error);
