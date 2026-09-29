import { z } from "zod";

export const SocialLinkSchema = z.object({
  id: z.string(),
  platform: z.string().default(""),
  url: z.string().default(""),
  showFullUrl: z.boolean().default(false),
});

export const PersonalInfoSchema = z.object({
  fullName: z.string().default(""),
  email: z.string().email().or(z.literal("")).default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  jobTitle: z.string().default(""),
  website: z.string().default(""),
  linkedin: z.string().default(""),
  github: z.string().default(""),
  portfolioUrl: z.string().optional(),
  behance: z.string().optional(),
  dribbble: z.string().optional(),
  x: z.string().optional(),
  socialLinks: z.array(SocialLinkSchema).optional(),
  showFullUrlAsText: z.boolean().optional(),
  photoUrl: z.string().optional(),
  showPhoto: z.boolean().optional(),
  photoShape: z.enum(["circle", "square", "rounded"]).optional(),
  photoSize: z.enum(["small", "medium", "large"]).optional(),
  summary: z.string().default(""),
});

export const WorkExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string().default(""),
  position: z.string().default(""),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  bullets: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
});

export const EducationItemSchema = z.object({
  id: z.string(),
  institution: z.string().default(""),
  degree: z.string().default(""),
  fieldOfStudy: z.string().default(""),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  gpa: z.string().default(""),
  honors: z.array(z.string()).default([]),
});

export const SkillCategorySchema = z.object({
  id: z.string(),
  category: z.string().default("General"),
  items: z.array(z.string()).default([]),
});

export const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  description: z.string().default(""),
  role: z.string().default(""),
  liveUrl: z.string().default(""),
  githubUrl: z.string().default(""),
  bullets: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
});

export const CertificationItemSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  issuer: z.string().default(""),
  issueDate: z.string().default(""),
  expiryDate: z.string().default(""),
  credentialId: z.string().default(""),
  url: z.string().default(""),
});

export const LanguageItemSchema = z.object({
  id: z.string(),
  language: z.string().default(""),
  proficiency: z.string().default("Fluent"), // Native, Fluent, Professional, Intermediate, Elementary
});

export const CourseItemSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  institution: z.string().default(""),
  date: z.string().default(""),
});

export const PublicationItemSchema = z.object({
  id: z.string(),
  title: z.string().default(""),
  publisher: z.string().default(""),
  date: z.string().default(""),
  url: z.string().default(""),
  description: z.string().default(""),
});

export const VolunteeringItemSchema = z.object({
  id: z.string(),
  role: z.string().default(""),
  organization: z.string().default(""),
  period: z.string().default(""),
  bullets: z.array(z.string()).default([]),
});

export const AwardItemSchema = z.object({
  id: z.string(),
  title: z.string().default(""),
  issuer: z.string().default(""),
  date: z.string().default(""),
  description: z.string().default(""),
});

export const ReferenceItemSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  role: z.string().default(""),
  organization: z.string().default(""),
  contact: z.string().default(""),
});

export const CustomSectionItemSchema = z.object({
  id: z.string(),
  title: z.string().default(""),
  subtitle: z.string().default(""),
  date: z.string().default(""),
  description: z.string().default(""),
  bullets: z.array(z.string()).default([]),
});

export const CustomSectionSchema = z.object({
  id: z.string(),
  heading: z.string().default("Custom Section"),
  items: z.array(CustomSectionItemSchema).default([]),
});

export const ResumeContentSchema = z.object({
  personalInfo: PersonalInfoSchema,
  workExperience: z.array(WorkExperienceItemSchema).default([]),
  internships: z.array(WorkExperienceItemSchema).default([]),
  education: z.array(EducationItemSchema).default([]),
  skills: z.array(SkillCategorySchema).default([]),
  projects: z.array(ProjectItemSchema).default([]),
  certifications: z.array(CertificationItemSchema).default([]),
  courses: z.array(CourseItemSchema).default([]),
  publications: z.array(PublicationItemSchema).default([]),
  volunteering: z.array(VolunteeringItemSchema).default([]),
  awards: z.array(AwardItemSchema).default([]),
  references: z.array(ReferenceItemSchema).default([]),
  languages: z.array(LanguageItemSchema).default([]),
  customSections: z.array(CustomSectionSchema).default([]),
});

export const ThemeConfigSchema = z.object({
  templateId: z.string().default("minimal-ats"),
  fontFamily: z
    .enum([
      "Inter",
      "Merriweather",
      "Roboto",
      "Playfair",
      "JetBrains Mono",
      "Outfit",
      "Latin Modern Roman",
      "Computer Modern",
    ])
    .default("Inter"),
  primaryColor: z.string().default("#1e293b"),
  accentColor: z.string().default("#3b82f6"),
  textColor: z.string().default("#0f172a"),
  fontSize: z.enum(["small", "medium", "large"]).default("medium"),
  lineSpacing: z.enum(["compact", "normal", "spacious"]).default("normal"),
  pageMargins: z.enum(["compact", "normal", "spacious"]).default("normal"),
  pageSize: z.enum(["a4", "letter"]).default("a4"),
  showCreatedWithBadge: z.boolean().default(false),
  brandingLevel: z.enum(["none", "metadata-only", "visible"]).default("metadata-only"),
  fitToPages: z.enum(["auto", "1", "2"]).default("auto"),
  sectionOrder: z.array(z.string()).default([
    "summary",
    "workExperience",
    "internships",
    "education",
    "skills",
    "projects",
    "certifications",
    "courses",
    "publications",
    "volunteering",
    "awards",
    "references",
    "languages",
    "customSections",
  ]),
  hiddenSections: z.array(z.string()).default([]),
});

export const FullResumeSchema = z.object({
  id: z.string().optional(),
  title: z.string().default("Untitled Resume"),
  slug: z.string().optional(),
  targetRole: z.string().optional().default("Software Engineer"),
  language: z.string().default("en"),
  isPublic: z.boolean().default(false),
  publicToken: z.string().optional(),
  themeConfig: ThemeConfigSchema,
  content: ResumeContentSchema,
  healthScore: z.number().default(0),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type WorkExperienceItem = z.infer<typeof WorkExperienceItemSchema>;
export type EducationItem = z.infer<typeof EducationItemSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type ProjectItem = z.infer<typeof ProjectItemSchema>;
export type CertificationItem = z.infer<typeof CertificationItemSchema>;
export type CourseItem = z.infer<typeof CourseItemSchema>;
export type PublicationItem = z.infer<typeof PublicationItemSchema>;
export type VolunteeringItem = z.infer<typeof VolunteeringItemSchema>;
export type AwardItem = z.infer<typeof AwardItemSchema>;
export type ReferenceItem = z.infer<typeof ReferenceItemSchema>;
export type LanguageItem = z.infer<typeof LanguageItemSchema>;
export type CustomSectionItem = z.infer<typeof CustomSectionItemSchema>;
export type CustomSection = z.infer<typeof CustomSectionSchema>;
export type ResumeContent = z.infer<typeof ResumeContentSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
export type FullResume = z.infer<typeof FullResumeSchema>;

export const DEFAULT_RESUME_CONTENT: ResumeContent = {
  personalInfo: {
    fullName: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    jobTitle: "Senior Full-Stack Engineer",
    website: "https://alexmorgan.dev",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
    portfolioUrl: "",
    behance: "",
    dribbble: "",
    x: "",
    socialLinks: [],
    showFullUrlAsText: false,
    photoUrl: "",
    showPhoto: false,
    photoShape: "circle",
    photoSize: "medium",
    summary:
      "Results-oriented Senior Full-Stack Engineer with 6+ years of experience architecting high-concurrency cloud distributed platforms, leading engineering pods, and optimizing enterprise web performance.",
  },
  workExperience: [
    {
      id: "exp-1",
      company: "Stripe",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected and deployed a multi-tenant payment reconciliation engine processing $40M+ in daily transaction volume, reducing ledger discrepancy latency by 42%.",
        "Spearheaded team migration from legacy microservices to Next.js App Router and Go gRPC pipelines, achieving a 99.99% uptime SLA across 8 regions.",
        "Mentored 6 junior and mid-level engineers, running weekly code architecture reviews and instituting automated end-to-end testing that cut production bugs by 35%.",
      ],
      technologies: ["TypeScript", "Next.js", "Go", "PostgreSQL", "Kafka", "AWS"],
    },
    {
      id: "exp-2",
      company: "Shopify",
      position: "Full-Stack Software Engineer",
      location: "San Francisco, CA",
      startDate: "2019-06",
      endDate: "2022-02",
      current: false,
      bullets: [
        "Built responsive merchant analytics dashboards handling 250,000+ active sessions with sub-second queries using React and Redis caching.",
        "Engineered automated inventory webhooks reducing checkout failure rate during Black Friday / Cyber Monday peaks by 28%.",
        "Collaborated with product designers to build an accessible UI component library adhering strictly to WCAG AA guidelines.",
      ],
      technologies: ["React", "Ruby on Rails", "GraphQL", "Redis", "Tailwind CSS"],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2015-09",
      endDate: "2019-05",
      current: false,
      gpa: "3.85 / 4.0",
      honors: ["Dean's Honor List (4 semesters)", "Upsilon Pi Epsilon CS Honor Society"],
    },
  ],
  skills: [
    {
      id: "skill-1",
      category: "Frontend & UI",
      items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Framer Motion", "Three.js", "WebSockets"],
    },
    {
      id: "skill-2",
      category: "Backend & Systems",
      items: ["Node.js", "Go", "Python", "PostgreSQL", "Prisma", "Redis", "GraphQL", "REST APIs"],
    },
    {
      id: "skill-3",
      category: "DevOps & Cloud",
      items: ["AWS (ECS, S3, RDS)", "Docker", "Kubernetes", "CI/CD (GitHub Actions)", "Cloudflare R2"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "PulseEngine - Realtime Event Streamer",
      description: "Distributed pub/sub event pipeline with WebSocket telemetry and low-latency dashboard.",
      role: "Lead Creator",
      liveUrl: "https://pulseengine.dev",
      githubUrl: "https://github.com/alexmorgan/pulse-engine",
      bullets: [
        "Achieved 10,000+ simulated concurrent client connections with under 20ms p99 message distribution latency.",
        "Integrated Prometheus metrics and Grafana alerting for automated pod autoscaling on Kubernetes.",
      ],
      technologies: ["Go", "WebSockets", "Redis Streams", "React", "Docker"],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023-08",
      expiryDate: "2026-08",
      credentialId: "AWS-PSA-982341",
      url: "https://aws.amazon.com/verification",
    },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native / Bilingual" },
    { id: "lang-2", language: "Spanish", proficiency: "Professional Working" },
  ],
  internships: [],
  courses: [],
  publications: [],
  volunteering: [],
  awards: [],
  references: [],
  customSections: [],
};

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  templateId: "minimal-ats",
  fontFamily: "Inter",
  primaryColor: "#0f172a",
  accentColor: "#2563eb",
  textColor: "#1e293b",
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
    "internships",
    "education",
    "skills",
    "projects",
    "certifications",
    "courses",
    "publications",
    "volunteering",
    "awards",
    "references",
    "languages",
    "customSections",
  ],
  hiddenSections: [],
};
