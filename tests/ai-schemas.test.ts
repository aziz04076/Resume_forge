import { describe, it } from "node:test";
import assert from "node:assert";
import {
  BulletImproverResponseSchema,
  JDMatcherResponseSchema,
  ATSSimulatorResponseSchema,
  CoverLetterResponseSchema,
} from "../src/schemas/ai.schema";

describe("Strict Zod AI Validation Schemas", () => {
  it("should validate a compliant Bullet Improver payload", () => {
    const validData = {
      originalBullet: "I fixed bugs in payment system",
      improvedOptions: [
        {
          bullet: "Architected and deployed distributed payment reconciler, cutting reconciliation discrepancies by 42%.",
          formula: "XYZ",
          impactMetric: "42% reduction in discrepancies",
          reasoning: "Uses active power verb and quantified impact.",
        },
        {
          bullet: "Spearheaded resolution of 150+ high-severity payment defects, elevating system uptime to 99.99%.",
          formula: "STAR",
          impactMetric: "99.99% uptime",
          reasoning: "Demonstrates reliability and SLA impact.",
        },
      ],
      identifiedKeywords: ["payment reconciler", "distributed systems", "99.99% uptime"],
    };

    const parsed = BulletImproverResponseSchema.parse(validData);
    assert.strictEqual(parsed.improvedOptions.length, 2);
  });

  it("should validate a compliant JD Matcher payload", () => {
    const validData = {
      matchScore: 84,
      summary: "Strong alignment with backend architecture requirements.",
      matchingKeywords: ["TypeScript", "PostgreSQL", "Kafka"],
      missingKeywords: ["Kubernetes", "gRPC"],
      skillGaps: ["Container orchestration"],
      tailoredSuggestions: ["Highlight Kafka cluster scaling in Experience bullet 2."],
      recommendedTargetRole: "Senior Backend Engineer",
    };

    const parsed = JDMatcherResponseSchema.parse(validData);
    assert.strictEqual(parsed.matchScore, 84);
  });

  it("should validate a compliant Cover Letter payload", () => {
    const validData = {
      subject: "Application for Staff Engineer - Alex Morgan",
      salutation: "Dear Hiring Team at Stripe,",
      body: "I am writing to express my enthusiasm for the Staff Engineer position...",
      tailoredPoints: ["Demonstrated high-scale payment reconciliation", "99.99% uptime engineering"],
      closing: "Sincerely,",
    };

    const parsed = CoverLetterResponseSchema.parse(validData);
    assert.strictEqual(parsed.salutation, "Dear Hiring Team at Stripe,");
  });
});
