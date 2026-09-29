export interface FieldPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  recommendedTemplateId: string;
  defaultRole: string;
  sectionOrder: string[];
  hiddenSections: string[];
  sectionHeadings?: Record<string, string>;
}

export const FIELD_PRESETS: FieldPreset[] = [
  {
    id: "healthcare",
    name: "Healthcare & Clinical",
    icon: "HeartPulse",
    description: "Prioritizes clinical rotations, licenses, patient ratios, and EHR systems.",
    recommendedTemplateId: "minimal-ats",
    defaultRole: "Registered Nurse / Clinical Specialist",
    sectionOrder: [
      "summary",
      "certifications",
      "workExperience",
      "education",
      "skills",
      "volunteering",
      "awards",
    ],
    hiddenSections: ["projects", "publications"],
    sectionHeadings: {
      workExperience: "Clinical Experience",
      certifications: "Licenses & Certifications",
      skills: "Clinical & Patient Care Skills",
    },
  },
  {
    id: "teaching",
    name: "Teaching & Education",
    icon: "GraduationCap",
    description: "Spotlights pedagogical methodologies, classroom achievements, and state certifications.",
    recommendedTemplateId: "academic-cv",
    defaultRole: "High School Mathematics Educator",
    sectionOrder: [
      "summary",
      "workExperience",
      "education",
      "certifications",
      "skills",
      "awards",
      "publications",
    ],
    hiddenSections: ["projects"],
    sectionHeadings: {
      workExperience: "Teaching Experience",
      skills: "Curriculum & Pedagogy",
      certifications: "Teaching Credentials & Endorsements",
    },
  },
  {
    id: "sales",
    name: "Sales & Marketing",
    icon: "TrendingUp",
    description: "Focuses on quota attainment, revenue growth, key accounts, and CRM tools.",
    recommendedTemplateId: "modern-slate",
    defaultRole: "Senior Enterprise Account Executive",
    sectionOrder: [
      "summary",
      "workExperience",
      "skills",
      "awards",
      "education",
      "certifications",
    ],
    hiddenSections: ["publications", "internships"],
    sectionHeadings: {
      workExperience: "Sales & Revenue Track Record",
      awards: "Honors & President's Club",
    },
  },
  {
    id: "design",
    name: "Design & Creative",
    icon: "Palette",
    description: "Elevates portfolio links, visual case studies, creative tools, and brand impact.",
    recommendedTemplateId: "creative-sidebar",
    defaultRole: "Senior Product / Brand Designer",
    sectionOrder: [
      "summary",
      "projects",
      "workExperience",
      "skills",
      "awards",
      "education",
    ],
    hiddenSections: ["certifications"],
    sectionHeadings: {
      projects: "Selected Design Projects & Portfolios",
      skills: "Tools & Creative Proficiencies",
    },
  },
  {
    id: "academic",
    name: "Academic & Research",
    icon: "BookOpen",
    description: "Prioritizes peer-reviewed publications, research grants, teaching, and fellowships.",
    recommendedTemplateId: "academic-cv",
    defaultRole: "Postdoctoral Research Fellow",
    sectionOrder: [
      "summary",
      "education",
      "publications",
      "workExperience",
      "awards",
      "skills",
      "references",
    ],
    hiddenSections: ["projects"],
    sectionHeadings: {
      publications: "Peer-Reviewed Publications",
      workExperience: "Academic & Research Appointments",
      awards: "Grants, Fellowships & Honors",
    },
  },
  {
    id: "government",
    name: "Government & Public Sector",
    icon: "Building2",
    description: "Compliant with civil service standards: security clearances, commendations, and regulations.",
    recommendedTemplateId: "minimal-ats",
    defaultRole: "Senior Public Policy Analyst",
    sectionOrder: [
      "summary",
      "workExperience",
      "education",
      "certifications",
      "awards",
      "skills",
    ],
    hiddenSections: ["projects"],
    sectionHeadings: {
      workExperience: "Public Sector & Agency Experience",
      certifications: "Clearances & Regulatory Certifications",
      awards: "Official Commendations & Citations",
    },
  },
  {
    id: "student",
    name: "Student & Fresher",
    icon: "Sparkles",
    description: "Positions education, academic capstones, internships, and campus leadership at the top.",
    recommendedTemplateId: "fresher-starter",
    defaultRole: "Graduate Trainee / Associate",
    sectionOrder: [
      "education",
      "internships",
      "projects",
      "skills",
      "volunteering",
      "awards",
    ],
    hiddenSections: ["workExperience"],
    sectionHeadings: {
      projects: "Academic Capstone & Projects",
      volunteering: "Campus Leadership & Extracurriculars",
    },
  },
  {
    id: "tech",
    name: "Technology & Software",
    icon: "Code2",
    description: "Technical stack tags, engineering scale metrics, open-source projects, and systems architecture.",
    recommendedTemplateId: "tech-mono",
    defaultRole: "Senior Full-Stack Engineer",
    sectionOrder: [
      "summary",
      "workExperience",
      "skills",
      "projects",
      "education",
      "certifications",
    ],
    hiddenSections: [],
    sectionHeadings: {
      projects: "Technical Projects & Open Source",
      skills: "Languages, Frameworks & Infrastructure",
    },
  },
];
