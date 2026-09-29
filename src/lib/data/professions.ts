/**
 * Real-world profession samples and templates for ResumeForge
 * Built for every profession — students, healthcare, educators, sales, designers, finance, tech, and public sector.
 */

export interface ProfessionProfile {
  id: string;
  name: string;
  badge: string;
  roleTitle: string;
  candidateName: string;
  location: string;
  description: string;
  recommendedTemplateId: string;
  recommendedTemplateName: string;
  hasPhoto: boolean;
  sampleBulletBefore: string;
  sampleBulletAfter: string;
  summary: string;
  experience: Array<{
    role: string;
    organization: string;
    period: string;
    bullets: string[];
  }>;
  education: string;
  keySkills: string[];
}

export const PROFESSIONS: ProfessionProfile[] = [
  {
    id: "healthcare",
    name: "Healthcare & Nursing",
    badge: "Medical & Clinical",
    roleTitle: "Registered Nurse (ICU / Critical Care)",
    candidateName: "Elena Rostova, BSN, RN",
    location: "Chicago, IL",
    description: "Highlight patient care ratios, clinical certifications, triage coordination, and life-support protocols.",
    recommendedTemplateId: "minimal-ats",
    recommendedTemplateName: "Clean Clinical",
    hasPhoto: false,
    sampleBulletBefore: "Helped sick patients in the ICU and monitored their equipment.",
    sampleBulletAfter: "Delivered one-on-one critical care for 120+ post-op trauma patients; led bedside code response that decreased emergency telemetry response time by 28%.",
    summary: "Dedicated Registered Nurse with 5+ years of critical care experience in high-volume Level 1 trauma centers. Certified in Advanced Cardiac Life Support (ACLS) and Pediatric Advanced Life Support (PALS) with a track record of zero protocol deviations.",
    experience: [
      {
        role: "Critical Care Staff Nurse (ICU)",
        organization: "Mercy Health Medical Center",
        period: "2021 – Present",
        bullets: [
          "Manage direct hemodynamic monitoring, mechanical ventilation, and continuous renal replacement therapy for 3-4 acute patients per shift.",
          "Partner with multidisciplinary teams of physicians, pharmacists, and respiratory therapists to reduce ICU average length of stay by 14%.",
          "Trained 18 newly licensed graduate nurses during clinical orientation, focusing on patient safety and electronic health record (EHR) compliance."
        ]
      },
      {
        role: "Emergency Room Nurse",
        organization: "Metropolitan Hospital",
        period: "2019 – 2021",
        bullets: [
          "Triage an average of 45 patients daily in rapid assessment pods, maintaining strict prioritization and patient privacy standards.",
          "Achieved a 98% patient satisfaction rating across quarterly clinical audits."
        ]
      }
    ],
    education: "Bachelor of Science in Nursing (BSN) — University of Illinois Chicago, 2019",
    keySkills: ["Critical Care Nursing", "ACLS & BLS Certified", "Epic EHR", "Ventilator Management", "Patient Advocacy", "Medication Administration", "Triage Assessment"]
  },
  {
    id: "teaching",
    name: "Teaching & Education",
    badge: "K-12 & Higher Ed",
    roleTitle: "High School Mathematics & STEM Educator",
    candidateName: "Marcus Sterling, M.Ed.",
    location: "Austin, TX",
    description: "Showcase curriculum design, test score gains, differentiated learning, and parent-student engagement.",
    recommendedTemplateId: "academic-cv",
    recommendedTemplateName: "Academic Scholar",
    hasPhoto: false,
    sampleBulletBefore: "Taught high school algebra and helped students study for tests.",
    sampleBulletAfter: "Redesigned 10th-grade Algebra curriculum with interactive problem-solving modules, raising state standardized exam pass rates from 71% to 89% in two semesters.",
    summary: "Certified STEM educator with 7 years of classroom leadership. Passionate about project-based learning and closing mathematical achievement gaps among diverse student cohorts.",
    experience: [
      {
        role: "Lead STEM & Mathematics Teacher",
        organization: "Westlake High School",
        period: "2020 – Present",
        bullets: [
          "Deliver differentiated instruction in AP Calculus and Algebra II across 5 class sections totaling 140+ students.",
          "Introduced a peer-tutoring mentorship program that lowered term-end course failure rates by 34%.",
          "Facilitated bi-weekly parent-teacher communications and individualized education plans (IEP) with special education staff."
        ]
      },
      {
        role: "Middle School Math Instructor",
        organization: "Oakridge Academy",
        period: "2017 – 2020",
        bullets: [
          "Integrated digital visualization software into daily geometry lessons, improving homework completion by 42%."
        ]
      }
    ],
    education: "Master of Education (M.Ed.) in Curriculum & Instruction — UT Austin, 2017",
    keySkills: ["Curriculum Planning", "Differentiated Instruction", "Classroom Management", "Standardized Testing", "Parent Communication", "IEP Coordination", "EdTech Tools"]
  },
  {
    id: "sales-business",
    name: "Sales, Business & Marketing",
    badge: "Commercial & Growth",
    roleTitle: "Senior Enterprise Account Executive",
    candidateName: "Jordan Vance",
    location: "New York, NY",
    description: "Display quota attainment, pipeline expansion, contract size, and client relationship retention.",
    recommendedTemplateId: "executive-classic",
    recommendedTemplateName: "Executive Leadership",
    hasPhoto: false,
    sampleBulletBefore: "Sold business services to corporate clients and hit my numbers.",
    sampleBulletAfter: "Exceeded annual sales quota by 142% ($2.4M ARR closed) by securing 14 Fortune 500 accounts through value-based consultative discovery.",
    summary: "High-performing Enterprise Sales professional specializing in B2B recurring revenue, contract negotiations, and executive stakeholder alignment. Proven track record of 4 consecutive years exceeding sales targets.",
    experience: [
      {
        role: "Senior Account Executive",
        organization: "Apex Enterprise Solutions",
        period: "2021 – Present",
        bullets: [
          "Manage end-to-end sales cycles from outbound qualification to closing contracts valued between $150K and $750K.",
          "Recognized as #1 Top Producer in Northeast region for FY23 with 138% quota attainment.",
          "Partnered with Solution Engineering and Customer Success to achieve a 96% first-year client retention rate."
        ]
      },
      {
        role: "Business Development Representative",
        organization: "CloudSphere Software",
        period: "2019 – 2021",
        bullets: [
          "Generated $4.1M in qualified pipeline through outbound strategic account prospecting and executive networking."
        ]
      }
    ],
    education: "B.A. in Business Administration — Fordham University, 2019",
    keySkills: ["Consultative Selling", "Pipeline Generation", "Contract Negotiation", "CRM & Salesforce", "Executive Presentations", "Territory Management"]
  },
  {
    id: "student",
    name: "Students & Recent Graduates",
    badge: "Early Career",
    roleTitle: "Recent Graduate / Business & Tech Intern",
    candidateName: "Priya Sharma",
    location: "Seattle, WA",
    description: "Turn university projects, coursework, part-time jobs, and club leadership into compelling hiring credentials.",
    recommendedTemplateId: "fresher-starter",
    recommendedTemplateName: "Graduate Launchpad",
    hasPhoto: false,
    sampleBulletBefore: "Was a member of the finance club and did a group project on market research.",
    sampleBulletAfter: "Served as Finance Club Treasurer managing a $14,000 annual budget; spearheaded an analytical market research project on green energy stocks presented to faculty judges.",
    summary: "Motivated recent graduate with a 3.8 GPA in Economics and Data Analytics. Hands-on experience conducting market research, organizing campus initiatives, and analyzing structured datasets.",
    experience: [
      {
        role: "Research & Analytics Intern",
        organization: "Pacific Northwest Institute",
        period: "Summer 2024",
        bullets: [
          "Analyzed regional retail pricing trends using Excel and Tableau across 25,000+ consumer data points.",
          "Synthesized findings into an executive summary deck presented to the Director of Economic Development."
        ]
      },
      {
        role: "Student Association Treasurer",
        organization: "University Student Council",
        period: "2023 – 2024",
        bullets: [
          "Supervised club funding allocations for 32 student organizations with zero budget discrepancies."
        ]
      }
    ],
    education: "B.S. in Economics & Quantitative Analysis — University of Washington, 2024 (GPA: 3.82)",
    keySkills: ["Financial Analysis", "Microsoft Excel (Advanced)", "Tableau", "Public Speaking", "Data Synthesis", "Research Methodologies", "Team Leadership"]
  },
  {
    id: "creative-design",
    name: "Design & Creative",
    badge: "Creative Studio",
    roleTitle: "Product & Brand Designer",
    candidateName: "Chloe Dupont",
    location: "San Francisco, CA",
    description: "Feature portfolio links, design systems, visual impact, user testing, and brand cohesion.",
    recommendedTemplateId: "creative-sidebar",
    recommendedTemplateName: "Creative Portfolio",
    hasPhoto: true,
    sampleBulletBefore: "Made graphics and screens for mobile applications and marketing campaigns.",
    sampleBulletAfter: "Led the visual redesign of a mobile booking application with 400,000 users, increasing checkout conversion by 22% and reducing customer support tickets by 35%.",
    summary: "Multidisciplinary Product & Brand Designer with 6+ years creating intuitive digital interfaces and visual brand identities. Committed to human-centered design, accessibility standards, and clean design systems.",
    experience: [
      {
        role: "Lead Product Designer",
        organization: "Studio Forma",
        period: "2021 – Present",
        bullets: [
          "Architected a comprehensive 150-component design system in Figma adopted by 12 cross-functional product squads.",
          "Conducted 40+ moderated usability interviews to optimize customer onboarding flow from 7 steps to 3 steps.",
          "Mentored junior visual designers and established WCAG 2.1 AA accessibility checklists."
        ]
      }
    ],
    education: "B.F.A. in Graphic & Interactive Design — Rhode Island School of Design (RISD), 2018",
    keySkills: ["Figma & Design Systems", "UI/UX Prototyping", "User Research", "Visual Branding", "Design Thinking", "Accessibility (WCAG)", "Information Architecture"]
  },
  {
    id: "finance",
    name: "Finance & Accounting",
    badge: "Corporate Finance",
    roleTitle: "Senior Financial Analyst",
    candidateName: "David O'Connor, CPA",
    location: "Boston, MA",
    description: "Highlight budget audits, financial forecasting, variance analysis, and cost-reduction initiatives.",
    recommendedTemplateId: "modern-slate",
    recommendedTemplateName: "Corporate Financial",
    hasPhoto: false,
    sampleBulletBefore: "Did the monthly accounting spreadsheets and reports for managers.",
    sampleBulletAfter: "Automated monthly cash-flow forecasting across 6 international operating entities, cutting report delivery time from 5 days to 4 hours while identifying $420,000 in redundant operational expenses.",
    summary: "CPA-certified Senior Financial Analyst with expertise in financial modeling, corporate budgeting, and variance analysis. Trusted advisor to VP-level stakeholders for multi-million dollar capital allocations.",
    experience: [
      {
        role: "Senior Financial Analyst",
        organization: "Beacon Capital Advisory",
        period: "2020 – Present",
        bullets: [
          "Lead the annual $85M operating budget preparation in collaboration with 9 departmental department heads.",
          "Designed quantitative valuation models for 3 successful corporate acquisitions totaling $45M in enterprise value."
        ]
      }
    ],
    education: "B.S. in Accounting & Finance — Boston College, 2017",
    keySkills: ["Financial Modeling", "CPA Licensed", "Budget Variance Analysis", "Forecasting", "ERP (SAP & Oracle)", "GAAP Compliance", "Executive Reporting"]
  },
  {
    id: "tech-it",
    name: "Technology & Engineering",
    badge: "Engineering & IT",
    roleTitle: "Staff Systems Engineer",
    candidateName: "Amara Chen",
    location: "San Jose, CA",
    description: "Showcase system reliability, architectural ownership, cloud infrastructure, and technical leadership.",
    recommendedTemplateId: "tech-mono",
    recommendedTemplateName: "Modern Engineer",
    hasPhoto: false,
    sampleBulletBefore: "Worked on server code and fixed bugs in our database systems.",
    sampleBulletAfter: "Re-architected core messaging microservices to handle 45,000 events/sec, reducing 99th-percentile API latency by 64% and eliminating server failovers during peak traffic.",
    summary: "Systems Engineer with 8+ years specializing in distributed backend architecture, cloud infrastructure, and developer productivity. Advocate of clean code, automated testing, and zero-downtime deployments.",
    experience: [
      {
        role: "Staff Infrastructure Engineer",
        organization: "Nimbus Systems",
        period: "2021 – Present",
        bullets: [
          "Spearheaded multi-region cloud migration across AWS and GCP, reducing monthly hosting overhead by $180,000.",
          "Mentored 6 software engineers and drove engineering-wide adoption of containerized CI/CD pipelines."
        ]
      }
    ],
    education: "B.S. in Computer Engineering — UC Berkeley, 2016",
    keySkills: ["Distributed Systems", "Cloud Infrastructure (AWS/GCP)", "Kubernetes", "Database Optimization", "System Architecture", "Security & Reliability"]
  },
  {
    id: "public-legal",
    name: "Government, Law & Public Sector",
    badge: "Public Policy & Law",
    roleTitle: "Public Policy Analyst & Legal Counsel",
    candidateName: "Jonathan Hayes, J.D.",
    location: "Washington, DC",
    description: "Emphasize regulatory compliance, legislative research, stakeholder hearings, and public advocacy.",
    recommendedTemplateId: "cambridge-fellow",
    recommendedTemplateName: "Formal Legal",
    hasPhoto: false,
    sampleBulletBefore: "Researched government regulations and wrote summaries for our department.",
    sampleBulletAfter: "Authored 14 comprehensive policy briefings on federal compliance standards; advised state committee leaders during drafting of landmark consumer privacy legislation.",
    summary: "Licensed attorney and public sector policy analyst with extensive experience in legislative interpretation, administrative law, and regulatory compliance. Proven ability to translate complex statutory requirements into actionable government policy.",
    experience: [
      {
        role: "Senior Policy Advisor",
        organization: "Department of Regulatory Affairs",
        period: "2020 – Present",
        bullets: [
          "Drafted administrative guidelines and conducted legal compliance reviews for 30+ regional municipal programs.",
          "Coordinated cross-agency public hearings with over 200 civic and industry participants."
        ]
      }
    ],
    education: "Juris Doctor (J.D.) — Georgetown University Law Center, 2018",
    keySkills: ["Regulatory Compliance", "Statutory Interpretation", "Policy Briefings", "Administrative Law", "Stakeholder Engagement", "Legal Writing"]
  }
];
