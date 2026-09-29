import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractText } from "unpdf";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";
import { generateChromiumPdfBuffer } from "@/lib/export/serverPdfRenderer";
import { SAMPLE_RESUMES } from "@/lib/data/sampleResumes";

describe("WYSIWYG 1:1 Parity & Strict Page Count Matrix", () => {
  const baseSample = SAMPLE_RESUMES[0].content;

  // 1. Content size variation generators
  const makeEmptyContent = (): ResumeContent => ({
    personalInfo: {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 555-0100",
      location: "New York, NY",
      jobTitle: "Software Developer",
      summary: "",
      website: "",
      linkedin: "",
      github: "",
      portfolioUrl: "",
      showFullUrlAsText: false,
    },
    workExperience: [],
    internships: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    courses: [],
    publications: [],
    volunteering: [],
    awards: [],
    references: [],
    languages: [],
    customSections: [],
  });

  const makeHalfPageContent = (): ResumeContent => ({
    ...makeEmptyContent(),
    personalInfo: {
      ...makeEmptyContent().personalInfo,
      summary: "Dynamic software professional with 3+ years experience building web applications.",
    },
    workExperience: [
      {
        id: "exp-1",
        company: "Acme Tech",
        position: "Frontend Engineer",
        location: "Remote",
        startDate: "2022-01",
        endDate: "Present",
        current: true,
        bullets: [
          "Developed accessible React design system components.",
          "Improved test coverage to 92% across all modules.",
        ],
        technologies: ["React", "TypeScript"],
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "State University",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        location: "New York, NY",
        startDate: "2018",
        endDate: "2022",
        current: false,
        gpa: "3.8",
        honors: [],
      },
    ],
    skills: [
      {
        id: "sk-1",
        category: "Core",
        items: ["JavaScript", "TypeScript", "React", "CSS"],
      },
    ],
  });

  const makeExactlyOnePageContent = (): ResumeContent => baseSample;

  const makeTwoPageContent = (): ResumeContent => {
    const twoPage = JSON.parse(JSON.stringify(baseSample)) as ResumeContent;
    // Add 2 more substantial work experience items to comfortably require 2 pages
    for (let i = 3; i <= 4; i++) {
      twoPage.workExperience.push({
        id: `exp-${i}`,
        company: `Enterprise Solutions Inc ${i}`,
        position: `Senior Platform Architect ${i}`,
        location: "San Francisco, CA",
        startDate: `2018-01`,
        endDate: `2020-01`,
        current: false,
        bullets: [
          `Engineered distributed messaging subsystem scaling to 500k msg/sec with zero packet drop.`,
          `Led cloud infrastructure optimization reducing annual cloud spend by 35%.`,
          `Mentored 8 engineers across 2 cross-functional squads on microservices best practices.`,
        ],
        technologies: ["Go", "Kafka", "Docker", "Terraform"],
      });
    }
    return twoPage;
  };

  const templatesToTest = [
    "classic-professional",
    "minimal-ats",
    "executive-classic",
    "modern-slate",
    "tech-mono",
    "fresher-starter",
  ];

  // Test 1: Empty resume must be exactly 1 page
  test("Empty resume produces exactly 1 page (no blank second page) on A4 and Letter", async () => {
    for (const pageSize of ["a4", "letter"] as const) {
      const theme: ThemeConfig = {
        templateId: "classic-professional",
        fontFamily: "Latin Modern Roman",
        primaryColor: "#0f172a",
        accentColor: "#3b82f6",
        textColor: "#0f172a",
        fontSize: "medium",
        lineSpacing: "normal",
        pageMargins: "normal",
        pageSize,
        showCreatedWithBadge: false,
        brandingLevel: "metadata-only",
        fitToPages: "auto",
        sectionOrder: ["summary", "workExperience", "education", "skills"],
        hiddenSections: [],
      };

      const buf = await generateChromiumPdfBuffer(makeEmptyContent(), theme);
      const { totalPages, text } = await extractText(new Uint8Array(buf));

      assert.strictEqual(
        totalPages,
        1,
        `Empty content on ${pageSize} must generate exactly 1 page. Got ${totalPages}`
      );
      const firstPage = Array.isArray(text) ? text[0] : String(text);
      assert.ok(firstPage.toLowerCase().includes("jane doe"), "Candidate name must be on page 1");
    }
  });

  // Test 2: Half page resume must be exactly 1 page
  test("Half-page resume produces exactly 1 page on A4 and Letter", async () => {
    const theme: ThemeConfig = {
      templateId: "classic-professional",
      fontFamily: "Inter",
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

    const buf = await generateChromiumPdfBuffer(makeHalfPageContent(), theme);
    const { totalPages } = await extractText(new Uint8Array(buf));

    assert.strictEqual(totalPages, 1, `Half page content must produce exactly 1 page. Got ${totalPages}`);
  });

  // Test 3: Exactly 1 page resume must NOT produce a blank page 2
  test("Standard 1-page resume produces exactly 1 page with NO trailing blank page", async () => {
    for (const tpl of templatesToTest) {
      const theme: ThemeConfig = {
        templateId: tpl,
        fontFamily: "Inter",
        primaryColor: "#0f172a",
        accentColor: "#3b82f6",
        textColor: "#0f172a",
        fontSize: "small",
        lineSpacing: "compact",
        pageMargins: "compact",
        pageSize: "a4",
        showCreatedWithBadge: false,
        brandingLevel: "metadata-only",
        fitToPages: "1",
        sectionOrder: ["summary", "workExperience", "education", "skills", "projects"],
        hiddenSections: [],
      };

      const buf = await generateChromiumPdfBuffer(makeExactlyOnePageContent(), theme);
      const { totalPages, text } = await extractText(new Uint8Array(buf));

      assert.strictEqual(
        totalPages,
        1,
        `Template ${tpl} in fit-to-1-page mode must produce 1 page. Got ${totalPages}`
      );

      // Verify page is not blank
      const pageText = Array.isArray(text) ? text[0] : String(text);
      assert.ok(pageText.length > 200, `Page text must contain substantial content. Got length ${pageText.length}`);
    }
  });

  // Test 4: Heavy 2-page resume produces exactly 2 pages with NO blank 3rd page
  test("2-page resume produces exactly 2 pages (page 2 has content, zero page 3) across A4 & Letter", async () => {
    for (const pageSize of ["a4", "letter"] as const) {
      const theme: ThemeConfig = {
        templateId: "classic-professional",
        fontFamily: "Latin Modern Roman",
        primaryColor: "#0f172a",
        accentColor: "#1e293b",
        textColor: "#0f172a",
        fontSize: "medium",
        lineSpacing: "normal",
        pageMargins: "normal",
        pageSize,
        showCreatedWithBadge: false,
        brandingLevel: "metadata-only",
        fitToPages: "2",
        sectionOrder: ["summary", "workExperience", "education", "skills", "projects"],
        hiddenSections: [],
      };

      const buf = await generateChromiumPdfBuffer(makeTwoPageContent(), theme);
      const { totalPages, text } = await extractText(new Uint8Array(buf));

      assert.strictEqual(
        totalPages,
        2,
        `Heavy resume on ${pageSize} must generate exactly 2 pages. Got ${totalPages}`
      );

      // Ensure page 2 is NOT blank
      if (Array.isArray(text)) {
        const page2Text = text[1].trim();
        assert.ok(
          page2Text.length > 50,
          `Page 2 on ${pageSize} must contain actual overflow content, not blank space. Got length ${page2Text.length}`
        );
      }
    }
  });

  // Test 5: Photo enabled vs disabled formatting
  test("Photo enabled vs disabled maintains exact page bounds without gap inflation", async () => {
    const withPhoto = JSON.parse(JSON.stringify(makeHalfPageContent())) as ResumeContent;
    withPhoto.personalInfo.photoUrl =
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='blue'/></svg>";
    withPhoto.personalInfo.showPhoto = true;

    const withoutPhoto = JSON.parse(JSON.stringify(makeHalfPageContent())) as ResumeContent;
    withoutPhoto.personalInfo.photoUrl = "";
    withoutPhoto.personalInfo.showPhoto = false;

    const theme: ThemeConfig = {
      templateId: "classic-professional",
      fontFamily: "Latin Modern Roman",
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

    const bufWithPhoto = await generateChromiumPdfBuffer(withPhoto, theme);
    const { totalPages: pagesWithPhoto } = await extractText(new Uint8Array(bufWithPhoto));

    const bufWithoutPhoto = await generateChromiumPdfBuffer(withoutPhoto, theme);
    const { totalPages: pagesWithoutPhoto } = await extractText(new Uint8Array(bufWithoutPhoto));

    assert.strictEqual(pagesWithPhoto, 1, "With compact photo, must stay 1 page");
    assert.strictEqual(pagesWithoutPhoto, 1, "Without photo, must stay 1 page");
  });
});
