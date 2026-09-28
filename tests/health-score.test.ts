import { describe, it } from "node:test";
import assert from "node:assert";
import { computeResumeScore } from "../src/lib/store/useResumeStore";
import { DEFAULT_RESUME_CONTENT, ResumeContent } from "../src/schemas/resume.schema";

describe("Resume Health & ATS Scoring Engine", () => {
  it("should calculate a high score (80+) for complete resume with metrics", () => {
    const score = computeResumeScore(DEFAULT_RESUME_CONTENT);
    assert.ok(score >= 80, `Expected score >= 80, got ${score}`);
    assert.ok(score <= 100, `Expected score <= 100, got ${score}`);
  });

  it("should penalize empty contact information and empty summaries", () => {
    const emptyResume: ResumeContent = {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        jobTitle: "",
        website: "",
        linkedin: "",
        github: "",
        photoUrl: "",
        summary: "",
      },
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      customSections: [],
    };

    const score = computeResumeScore(emptyResume);
    assert.strictEqual(score, 0, `Expected empty resume score to be 0, got ${score}`);
  });

  it("should award bonus points for quantified metrics like $40M, 42%, or 250k", () => {
    const unquantifiedContent: ResumeContent = {
      ...DEFAULT_RESUME_CONTENT,
      workExperience: [
        {
          id: "exp-test",
          company: "Acme",
          position: "Dev",
          location: "Remote",
          startDate: "2020",
          endDate: "2022",
          current: false,
          bullets: ["Worked on features and handled team communication."],
          technologies: [],
        },
      ],
    };

    const quantifiedContent: ResumeContent = {
      ...DEFAULT_RESUME_CONTENT,
      workExperience: [
        {
          id: "exp-test",
          company: "Acme",
          position: "Dev",
          location: "Remote",
          startDate: "2020",
          endDate: "2022",
          current: false,
          bullets: ["Scaled checkout throughput by 42% and saved $120k annually."],
          technologies: [],
        },
      ],
    };

    const unquantScore = computeResumeScore(unquantifiedContent);
    const quantScore = computeResumeScore(quantifiedContent);

    assert.ok(
      quantScore > unquantScore,
      `Quantified score (${quantScore}) should be greater than unquantified score (${unquantScore})`
    );
  });
});
