import { z } from "zod";
import { ResumeContentSchema } from "./resume.schema";

// 1. AI Bullet Improver Schema
export const BulletOptionSchema = z.object({
  bullet: z.string(),
  formula: z.enum(["STAR", "XYZ", "CAR"]),
  impactMetric: z.string().describe("The quantifiable metric or outcome achieved"),
  reasoning: z.string().describe("Why this formulation is stronger and ATS-optimized"),
});

export const BulletImproverResponseSchema = z.object({
  originalBullet: z.string(),
  improvedOptions: z.array(BulletOptionSchema).min(2),
  identifiedKeywords: z.array(z.string()),
});

// 2. Job Description Matcher Schema
export const JDMatcherResponseSchema = z.object({
  matchScore: z.number().min(0).max(100),
  summary: z.string(),
  matchingKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  skillGaps: z.array(z.string()),
  tailoredSuggestions: z.array(z.string()),
  recommendedTargetRole: z.string(),
});

// 3. ATS Simulator Schema
export const ATSCategoryScoreSchema = z.object({
  category: z.string(),
  score: z.number().min(0).max(100),
  status: z.enum(["passed", "warning", "critical"]),
  feedback: z.string(),
});

export const ATSSimulatorResponseSchema = z.object({
  overallScore: z.number().min(0).max(100),
  headlineAssessment: z.string(),
  categories: z.array(ATSCategoryScoreSchema),
  formattingIssues: z.array(z.string()),
  keywordDensityAssessment: z.string(),
  actionableFixes: z.array(
    z.object({
      priority: z.enum(["high", "medium", "low"]),
      issue: z.string(),
      fix: z.string(),
    })
  ),
});

// 4. Resume Parser Schema (Must directly feed into builder content)
export const ParsedResumeResponseSchema = ResumeContentSchema;

// 5. Cover Letter Generator Schema
export const CoverLetterResponseSchema = z.object({
  subject: z.string(),
  salutation: z.string(),
  body: z.string(),
  tailoredPoints: z.array(z.string()),
  closing: z.string(),
  companyInsights: z.array(z.string()).optional().default([]),
  citedSources: z.array(z.string()).optional().default([]),
});

// 6. Mock Interview Coach Schema
export const InterviewQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(["behavioral", "technical", "system-design", "situational"]),
  question: z.string(),
  rationale: z.string().describe("Why an interviewer for this role asks this question"),
  evaluationCriteria: z.array(z.string()),
  sampleIdealAnswer: z.string(),
});

export const InterviewQuestionsResponseSchema = z.object({
  roleTitle: z.string(),
  questions: z.array(InterviewQuestionSchema).min(3),
});

export const InterviewAnswerEvaluationSchema = z.object({
  score: z.number().min(0).max(100),
  confidenceRating: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  missingKeyConcepts: z.array(z.string()),
  improvedAnswerSuggestion: z.string(),
  generalFeedback: z.string(),
  starScores: z
    .object({
      situation: z.number().min(0).max(25).default(20),
      task: z.number().min(0).max(25).default(20),
      action: z.number().min(0).max(25).default(20),
      result: z.number().min(0).max(25).default(20),
    })
    .optional(),
  fillerWordCount: z.number().optional().default(0),
  fillerWordsDetected: z.array(z.string()).optional().default([]),
});

// 7. LinkedIn Profile Optimizer Schema
export const LinkedInOptimizerResponseSchema = z.object({
  headlineOptions: z.array(z.string()).min(3),
  aboutSection: z.string(),
  suggestedTopSkills: z.array(z.string()),
  featuredExperienceBullets: z.array(z.string()),
});

// 8. Career Path & Skill Gap Advisor Schema
export const CareerRoadmapStepSchema = z.object({
  timeframe: z.string(), // e.g. "Next 30 Days", "3-6 Months", "1 Year"
  focusArea: z.string(),
  actionItems: z.array(z.string()),
  recommendedCertificationsOrProjects: z.array(z.string()),
});

export const CareerAdvisorResponseSchema = z.object({
  currentLevelAssessment: z.string(),
  targetRoles: z.array(
    z.object({
      title: z.string(),
      salaryRangeEstimate: z.string(),
      readinessPercentage: z.number().min(0).max(100),
      transitionDifficulty: z.enum(["Easy", "Moderate", "Challenging"]),
    })
  ),
  roadmap: z.array(CareerRoadmapStepSchema),
  marketDemandAnalysis: z.string(),
});

// 9. AI Chat Copilot Schema
export const CopilotActionSchema = z.object({
  type: z.enum([
    "NO_ACTION",
    "UPDATE_SUMMARY",
    "REWRITE_BULLET",
    "ADD_SKILL",
    "ADD_WORK_EXPERIENCE",
    "CHANGE_TEMPLATE",
  ]),
  payload: z.unknown().optional(),
});

export const CopilotMessageResponseSchema = z.object({
  reply: z.string(),
  suggestedAction: CopilotActionSchema.optional(),
  followUpSuggestions: z.array(z.string()),
});

// 10. Tailor to JD Schema with Diff & Non-Invented Rules
export const TailoredResumeResponseSchema = z.object({
  tailoredContent: ResumeContentSchema,
  diffSummary: z.array(
    z.object({
      id: z.string(),
      section: z.string(),
      originalText: z.string(),
      modifiedText: z.string(),
      reason: z.string(),
    })
  ),
  suggestedAdditions: z.array(
    z.object({
      section: z.string(),
      suggestedFact: z.string(),
      rationale: z.string(),
    })
  ),
});

// 11. Recruiter 6-Second Scan Schema
export const RecruiterScanResponseSchema = z.object({
  firstImpression: z.enum(["Strong Hire", "Hire", "Leaning No-Hire", "No-Hire"]),
  firstNotice: z.string(),
  eyeTrackingPath: z.array(z.string()),
  heatmapZones: z.array(
    z.object({
      section: z.string(),
      intensity: z.enum(["high", "medium", "low"]),
      feedback: z.string(),
    })
  ),
  immediateStrengths: z.array(z.string()),
  dealbreakers: z.array(z.string()),
  verdictRationale: z.string(),
});

// 12. Salary & Offer Coach Schema
export const SalaryCoachResponseSchema = z.object({
  roleTitle: z.string(),
  location: z.string(),
  marketBenchmark: z.object({
    percentile25: z.string(),
    median: z.string(),
    percentile75: z.string(),
    percentile90: z.string(),
  }),
  scripts: z.array(
    z.object({
      scenario: z.string(),
      subject: z.string(),
      body: z.string(),
      tactics: z.string(),
    })
  ),
  counterOfferStrategies: z.array(z.string()),
  leveragePoints: z.array(z.string()),
});

export type BulletImproverResponse = z.infer<typeof BulletImproverResponseSchema>;
export type JDMatcherResponse = z.infer<typeof JDMatcherResponseSchema>;
export type ATSSimulatorResponse = z.infer<typeof ATSSimulatorResponseSchema>;
export type CoverLetterResponse = z.infer<typeof CoverLetterResponseSchema>;
export type InterviewQuestion = z.infer<typeof InterviewQuestionSchema>;
export type InterviewQuestionsResponse = z.infer<typeof InterviewQuestionsResponseSchema>;
export type InterviewAnswerEvaluation = z.infer<typeof InterviewAnswerEvaluationSchema>;
export type LinkedInOptimizerResponse = z.infer<typeof LinkedInOptimizerResponseSchema>;
export type CareerAdvisorResponse = z.infer<typeof CareerAdvisorResponseSchema>;
export type CopilotMessageResponse = z.infer<typeof CopilotMessageResponseSchema>;
export type TailoredResumeResponse = z.infer<typeof TailoredResumeResponseSchema>;
export type RecruiterScanResponse = z.infer<typeof RecruiterScanResponseSchema>;
export type SalaryCoachResponse = z.infer<typeof SalaryCoachResponseSchema>;
