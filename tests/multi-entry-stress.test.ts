import { test, describe } from "node:test";
import assert from "node:assert";
import { generateTextPdfBuffer } from "../src/lib/export/pdfExporter";
import { generateDocxBuffer } from "../src/lib/export/docxExporter";
import {
  DEFAULT_RESUME_CONTENT,
  DEFAULT_THEME_CONFIG,
  ResumeContent,
  WorkExperienceItem,
  EducationItem,
  ProjectItem,
  CertificationItem,
  CourseItem,
  PublicationItem,
  VolunteeringItem,
  AwardItem,
  ReferenceItem,
  LanguageItem,
} from "../src/schemas/resume.schema";
import { FIELD_PRESETS } from "../src/lib/data/fieldPresets";
import { useResumeStore } from "../src/lib/store/useResumeStore";

function createStressResume(countPerSection: number): ResumeContent {
  const exps: WorkExperienceItem[] = [];
  const edus: EducationItem[] = [];
  const projs: ProjectItem[] = [];
  const certs: CertificationItem[] = [];
  const courses: CourseItem[] = [];
  const pubs: PublicationItem[] = [];
  const vols: VolunteeringItem[] = [];
  const awards: AwardItem[] = [];
  const refs: ReferenceItem[] = [];
  const langs: LanguageItem[] = [];

  for (let i = 0; i < countPerSection; i++) {
    exps.push({
      id: `exp-${i}`,
      company: `Company ${i + 1}`,
      position: `Senior Specialist ${i + 1}`,
      location: "Metropolis, NY",
      startDate: "2020-01",
      endDate: "2022-01",
      current: i === 0,
      bullets: [
        `Executed initiative ${i + 1} yielding a 25% efficiency increase across operations.`,
        `Managed cross-functional team of 10+ professionals and improved SLA delivery by 30%.`,
      ],
      technologies: ["System A", "Tool B"],
    });

    edus.push({
      id: `edu-${i}`,
      institution: `University of Excellence ${i + 1}`,
      degree: "Bachelor of Science",
      fieldOfStudy: "Applied Studies",
      location: "Cambridge, MA",
      startDate: "2014",
      endDate: "2018",
      current: false,
      gpa: "3.9 / 4.0",
      honors: ["Honors Scholar"],
    });

    projs.push({
      id: `proj-${i}`,
      name: `Project Enterprise ${i + 1}`,
      description: `Description of high-impact strategic project ${i + 1}.`,
      role: "Lead Architect",
      liveUrl: "https://example.com/project",
      githubUrl: "https://github.com/example/project",
      bullets: [`Delivered milestones ahead of deadline with 99.9% reliability.`],
      technologies: ["Framework X", "Service Y"],
    });

    certs.push({
      id: `cert-${i}`,
      name: `Board Certification ${i + 1}`,
      issuer: "Professional Authority",
      issueDate: "2021",
      expiryDate: "2026",
      credentialId: `ID-${1000 + i}`,
      url: "",
    });

    courses.push({
      id: `course-${i}`,
      name: `Executive Masterclass ${i + 1}`,
      institution: "Harvard Online",
      date: "2022",
    });

    pubs.push({
      id: `pub-${i}`,
      title: `Empirical Analysis on Scalable Systems ${i + 1}`,
      publisher: "Journal of Modern Practice",
      date: "2023",
      url: "https://doi.org/10.1000/182",
      description: "Comprehensive experimental study on distributed fault tolerance.",
    });

    vols.push({
      id: `vol-${i}`,
      role: "Community Mentor",
      organization: "Global STEM Outreach",
      period: "2021 - Present",
      bullets: [`Mentored ${i + 5} emerging students in career planning and portfolio design.`],
    });

    awards.push({
      id: `award-${i}`,
      title: `Distinguished Service Award ${i + 1}`,
      issuer: "National Leadership Council",
      date: "2023",
      description: "Conferred for exceptional sustained contributions to organizational growth.",
    });

    refs.push({
      id: `ref-${i}`,
      name: `Director Jane Doe ${i + 1}`,
      role: "Vice President",
      organization: "Enterprise Global",
      contact: "Available upon request",
    });

    langs.push({
      id: `lang-${i}`,
      language: `Language ${i + 1}`,
      proficiency: "Fluent",
    });
  }

  return {
    personalInfo: {
      ...DEFAULT_RESUME_CONTENT.personalInfo,
      fullName: `Candidate Stress-${countPerSection}`,
      jobTitle: "Multi-Disciplinary Professional",
      photoUrl: countPerSection > 0 ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" : "",
      showPhoto: countPerSection > 0,
      photoShape: "circle",
      photoSize: "medium",
    },
    workExperience: exps,
    internships: exps.slice(0, Math.min(3, countPerSection)),
    education: edus,
    skills: [
      {
        id: "cat-1",
        category: "Domain Expertise",
        items: ["Analysis", "Leadership", "Execution", "Architecture"],
      },
    ],
    projects: projs,
    certifications: certs,
    courses,
    publications: pubs,
    volunteering: vols,
    awards,
    references: refs,
    languages: langs,
    customSections: [],
  };
}

describe("Unlimited Multi-Entry Sections & Stress Test", () => {
  const counts = [0, 1, 5, 25];

  for (const count of counts) {
    test(`should generate valid vector PDF for ${count} entries per section without error`, async () => {
      const resume = createStressResume(count);
      const pdfBuffer = await generateTextPdfBuffer(resume, DEFAULT_THEME_CONFIG);
      assert.ok(pdfBuffer && pdfBuffer.length > 0, `PDF buffer must be generated for ${count} entries`);
    });

    test(`should generate valid DOCX document for ${count} entries per section without error`, async () => {
      const resume = createStressResume(count);
      const docxBuffer = await generateDocxBuffer(resume, DEFAULT_THEME_CONFIG);
      assert.ok(docxBuffer && docxBuffer.length > 0, `DOCX buffer must be generated for ${count} entries`);
    });
  }

  test("FIELD_PRESETS covers 8 required distinct fields with custom section ordering", () => {
    assert.strictEqual(FIELD_PRESETS.length >= 8, true, "Must have at least 8 presets");
    const requiredPresetIds = [
      "healthcare",
      "teaching",
      "sales",
      "design",
      "academic",
      "government",
      "student",
      "tech",
    ];

    for (const reqId of requiredPresetIds) {
      const found = FIELD_PRESETS.find((p) => p.id === reqId);
      assert.ok(found, `Field preset '${reqId}' must exist`);
      assert.ok(found.sectionOrder.length > 0, `Preset '${reqId}' must define sectionOrder`);
    }
  });

  test("applyFieldPreset properly configures store template and section order", () => {
    const store = useResumeStore.getState();

    // Apply Healthcare
    store.applyFieldPreset("healthcare");
    let state = useResumeStore.getState();
    assert.match(state.targetRole, /Nurse|Clinical/i);
    assert.strictEqual(state.themeConfig.hiddenSections.includes("projects"), true);

    // Apply Student / Fresher
    store.applyFieldPreset("student");
    state = useResumeStore.getState();
    assert.strictEqual(state.themeConfig.templateId, "fresher-starter");
    assert.strictEqual(state.themeConfig.sectionOrder[0], "education");
    assert.strictEqual(state.themeConfig.hiddenSections.includes("workExperience"), true);
  });

  test("fitToPages dynamically compacts heavy resume for 1 page", () => {
    const store = useResumeStore.getState();
    const heavyResume = createStressResume(5);
    store.setResumeContent(heavyResume);

    // Fit to 1 page
    store.fitToPages(1);
    let state = useResumeStore.getState();
    assert.strictEqual(state.themeConfig.fontSize, "small");
    assert.strictEqual(state.themeConfig.lineSpacing, "compact");
    assert.strictEqual(state.themeConfig.fitToPages, "1");

    // Fit to 2 pages
    store.fitToPages(2);
    state = useResumeStore.getState();
    assert.strictEqual(state.themeConfig.fitToPages, "2");
  });
});
