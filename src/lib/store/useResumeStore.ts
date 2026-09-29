import { create } from "zustand";
import {
  ResumeContent,
  ThemeConfig,
  PersonalInfo,
  WorkExperienceItem,
  EducationItem,
  SkillCategory,
  ProjectItem,
  CertificationItem,
  CourseItem,
  PublicationItem,
  VolunteeringItem,
  AwardItem,
  ReferenceItem,
  LanguageItem,
  CustomSection,
  SocialLink,
  DEFAULT_RESUME_CONTENT,
  DEFAULT_THEME_CONFIG,
} from "@/schemas/resume.schema";
import { FIELD_PRESETS } from "@/lib/data/fieldPresets";

export interface ResumeStoreState {
  id?: string;
  title: string;
  targetRole: string;
  language: string;
  isPublic: boolean;
  publicToken?: string;
  content: ResumeContent;
  themeConfig: ThemeConfig;
  healthScore: number;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  activeTab: string; // "editor" | "templates" | "ai" | "customize" | "3d"

  // Undo / Redo history
  undoStack: ResumeContent[];
  redoStack: ResumeContent[];

  // Actions
  setTitle: (title: string) => void;
  setTargetRole: (role: string) => void;
  setActiveTab: (tab: string) => void;
  setResumeContent: (content: ResumeContent) => void;
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;

  // Social Links
  addSocialLink: (platform?: string, url?: string) => void;
  updateSocialLink: (id: string, data: Partial<SocialLink>) => void;
  removeSocialLink: (id: string) => void;

  // Work experience
  addWorkExperience: () => void;
  updateWorkExperience: (id: string, data: Partial<WorkExperienceItem>) => void;
  removeWorkExperience: (id: string) => void;
  reorderWorkExperience: (newItems: WorkExperienceItem[]) => void;

  // Internships
  addInternship: () => void;
  updateInternship: (id: string, data: Partial<WorkExperienceItem>) => void;
  removeInternship: (id: string) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkillCategory: (categoryName?: string) => void;
  updateSkillCategory: (id: string, data: Partial<SkillCategory>) => void;
  removeSkillCategory: (id: string) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, data: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<CertificationItem>) => void;
  removeCertification: (id: string) => void;

  // Courses
  addCourse: () => void;
  updateCourse: (id: string, data: Partial<CourseItem>) => void;
  removeCourse: (id: string) => void;

  // Publications
  addPublication: () => void;
  updatePublication: (id: string, data: Partial<PublicationItem>) => void;
  removePublication: (id: string) => void;

  // Volunteering
  addVolunteering: () => void;
  updateVolunteering: (id: string, data: Partial<VolunteeringItem>) => void;
  removeVolunteering: (id: string) => void;

  // Awards
  addAward: () => void;
  updateAward: (id: string, data: Partial<AwardItem>) => void;
  removeAward: (id: string) => void;

  // References
  addReference: () => void;
  updateReference: (id: string, data: Partial<ReferenceItem>) => void;
  removeReference: (id: string) => void;

  // Languages
  addLanguage: () => void;
  updateLanguage: (id: string, data: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;

  // Custom sections
  addCustomSection: (heading?: string) => void;
  updateCustomSection: (id: string, data: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;

  // Theme, Presets & Fit-to-Pages
  updateThemeConfig: (data: Partial<ThemeConfig>) => void;
  setTemplateId: (templateId: string) => void;
  reorderSections: (newOrder: string[]) => void;
  toggleSectionVisibility: (sectionKey: string) => void;
  applyFieldPreset: (presetId: string) => void;
  fitToPages: (targetPages: 1 | 2) => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;

  // Hydration / Load
  loadResume: (data: {
    id?: string;
    title?: string;
    targetRole?: string;
    content: ResumeContent;
    themeConfig: ThemeConfig;
    isPublic?: boolean;
    publicToken?: string;
  }) => void;
  calculateHealthScore: () => number;
}

export function computeResumeScore(content: ResumeContent): number {
  let score = 0;
  const { personalInfo, workExperience, education, skills, projects } = content;

  // Contact info completeness (up to 20 pts)
  if (personalInfo.fullName.trim()) score += 5;
  if (personalInfo.email.trim()) score += 5;
  if (personalInfo.phone.trim()) score += 4;
  if (personalInfo.location.trim()) score += 3;
  if (personalInfo.linkedin?.trim() || personalInfo.github?.trim()) score += 3;

  // Summary impact (up to 15 pts)
  if (personalInfo.summary && personalInfo.summary.length >= 80) {
    score += 15;
  } else if (personalInfo.summary && personalInfo.summary.length >= 30) {
    score += 8;
  }

  // Work experience & internships depth and quantification (up to 30 pts)
  const allExperiences = [...(workExperience || []), ...(content.internships || [])];
  if (allExperiences.length > 0) {
    score += 10;
    let hasQuantifiedBullet = false;
    let bulletCount = 0;
    const metricRegex = /(\d+%|\$\d+|\d+x|\d+\s*(users|clients|engineers|teams|million|thousand|k))/i;

    for (const exp of allExperiences) {
      bulletCount += exp.bullets.length;
      for (const bullet of exp.bullets) {
        if (metricRegex.test(bullet)) {
          hasQuantifiedBullet = true;
        }
      }
    }

    if (bulletCount >= 4) score += 10;
    else if (bulletCount >= 2) score += 5;
    if (hasQuantifiedBullet) score += 10;
  }

  // Skills & Categorization (up to 15 pts)
  const totalSkills = skills.reduce((acc, cat) => acc + cat.items.length, 0);
  if (totalSkills >= 8) score += 15;
  else if (totalSkills >= 4) score += 8;

  // Education (up to 10 pts)
  if (education.length > 0 && education[0].institution.trim()) {
    score += 10;
  }

  // Projects, Certifications, Publications, or Awards (up to 10 pts)
  if (
    projects.length > 0 ||
    (content.certifications && content.certifications.length > 0) ||
    (content.publications && content.publications.length > 0) ||
    (content.awards && content.awards.length > 0)
  ) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}

export const useResumeStore = create<ResumeStoreState>((set, get) => ({
  title: "Alex Morgan - Senior Full-Stack Engineer",
  targetRole: "Senior Full-Stack Engineer",
  language: "en",
  isPublic: false,
  content: DEFAULT_RESUME_CONTENT,
  themeConfig: DEFAULT_THEME_CONFIG,
  healthScore: computeResumeScore(DEFAULT_RESUME_CONTENT),
  isDirty: false,
  isSaving: false,
  lastSaved: null,
  activeTab: "editor",
  undoStack: [],
  redoStack: [],

  setTitle: (title) => set({ title, isDirty: true }),
  setTargetRole: (targetRole) => set({ targetRole, isDirty: true }),
  setActiveTab: (activeTab) => set({ activeTab }),

  setResumeContent: (content) =>
    set((state) => ({
      undoStack: [...state.undoStack.slice(-15), state.content],
      redoStack: [],
      content,
      healthScore: computeResumeScore(content),
      isDirty: true,
    })),

  updatePersonalInfo: (data) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        personalInfo: { ...state.content.personalInfo, ...data },
      };
      return {
        undoStack: [...state.undoStack.slice(-15), state.content],
        redoStack: [],
        content: nextContent,
        healthScore: computeResumeScore(nextContent),
        isDirty: true,
      };
    }),

  addSocialLink: (platform = "LinkedIn", url = "") =>
    set((state) => {
      const newLink: SocialLink = {
        id: `social-${Date.now()}`,
        platform,
        url,
        showFullUrl: false,
      };
      const existing = state.content.personalInfo.socialLinks || [];
      const nextContent: ResumeContent = {
        ...state.content,
        personalInfo: {
          ...state.content.personalInfo,
          socialLinks: [...existing, newLink],
        },
      };
      return { content: nextContent, isDirty: true };
    }),

  updateSocialLink: (id, data) =>
    set((state) => {
      const existing = state.content.personalInfo.socialLinks || [];
      const nextContent: ResumeContent = {
        ...state.content,
        personalInfo: {
          ...state.content.personalInfo,
          socialLinks: existing.map((link) => (link.id === id ? { ...link, ...data } : link)),
        },
      };
      return { content: nextContent, isDirty: true };
    }),

  removeSocialLink: (id) =>
    set((state) => {
      const existing = state.content.personalInfo.socialLinks || [];
      const nextContent: ResumeContent = {
        ...state.content,
        personalInfo: {
          ...state.content.personalInfo,
          socialLinks: existing.filter((link) => link.id !== id),
        },
      };
      return { content: nextContent, isDirty: true };
    }),

  addWorkExperience: () =>
    set((state) => {
      const newItem: WorkExperienceItem = {
        id: `exp-${Date.now()}`,
        company: "Company Name",
        position: "Job Title",
        location: "City, State or Remote",
        startDate: "2023-01",
        endDate: "Present",
        current: true,
        bullets: ["Spearheaded key initiative resulting in measurable metric improvement."],
        technologies: ["Tech 1", "Tech 2"],
      };
      const nextContent: ResumeContent = {
        ...state.content,
        workExperience: [newItem, ...state.content.workExperience],
      };
      return {
        undoStack: [...state.undoStack.slice(-15), state.content],
        redoStack: [],
        content: nextContent,
        healthScore: computeResumeScore(nextContent),
        isDirty: true,
      };
    }),

  updateWorkExperience: (id, data) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        workExperience: state.content.workExperience.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      };
      return {
        undoStack: [...state.undoStack.slice(-15), state.content],
        redoStack: [],
        content: nextContent,
        healthScore: computeResumeScore(nextContent),
        isDirty: true,
      };
    }),

  removeWorkExperience: (id) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        workExperience: state.content.workExperience.filter((item) => item.id !== id),
      };
      return {
        undoStack: [...state.undoStack.slice(-15), state.content],
        redoStack: [],
        content: nextContent,
        healthScore: computeResumeScore(nextContent),
        isDirty: true,
      };
    }),

  reorderWorkExperience: (newItems) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        workExperience: newItems,
      };
      return { content: nextContent, isDirty: true };
    }),

  addInternship: () =>
    set((state) => {
      const newItem: WorkExperienceItem = {
        id: `intern-${Date.now()}`,
        company: "Organization / Company",
        position: "Intern / Trainee",
        location: "City, State or Remote",
        startDate: "2023-06",
        endDate: "2023-08",
        current: false,
        bullets: ["Assisted team with core deliverables and completed capstone project."],
        technologies: [],
      };
      const existing = state.content.internships || [];
      const nextContent: ResumeContent = {
        ...state.content,
        internships: [newItem, ...existing],
      };
      return { content: nextContent, isDirty: true };
    }),

  updateInternship: (id, data) =>
    set((state) => {
      const existing = state.content.internships || [];
      const nextContent: ResumeContent = {
        ...state.content,
        internships: existing.map((item) => (item.id === id ? { ...item, ...data } : item)),
      };
      return { content: nextContent, isDirty: true };
    }),

  removeInternship: (id) =>
    set((state) => {
      const existing = state.content.internships || [];
      const nextContent: ResumeContent = {
        ...state.content,
        internships: existing.filter((item) => item.id !== id),
      };
      return { content: nextContent, isDirty: true };
    }),

  addEducation: () =>
    set((state) => {
      const newItem: EducationItem = {
        id: `edu-${Date.now()}`,
        institution: "University / College",
        degree: "Bachelor of Science",
        fieldOfStudy: "Major or Field",
        location: "Location",
        startDate: "2018-09",
        endDate: "2022-05",
        current: false,
        gpa: "",
        honors: [],
      };
      const nextContent: ResumeContent = {
        ...state.content,
        education: [...state.content.education, newItem],
      };
      return {
        undoStack: [...state.undoStack.slice(-15), state.content],
        redoStack: [],
        content: nextContent,
        healthScore: computeResumeScore(nextContent),
        isDirty: true,
      };
    }),

  updateEducation: (id, data) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        education: state.content.education.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      };
      return {
        undoStack: [...state.undoStack.slice(-15), state.content],
        redoStack: [],
        content: nextContent,
        healthScore: computeResumeScore(nextContent),
        isDirty: true,
      };
    }),

  removeEducation: (id) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        education: state.content.education.filter((item) => item.id !== id),
      };
      return {
        undoStack: [...state.undoStack.slice(-15), state.content],
        redoStack: [],
        content: nextContent,
        healthScore: computeResumeScore(nextContent),
        isDirty: true,
      };
    }),

  addSkillCategory: (categoryName = "Technical Skills") =>
    set((state) => {
      const newCat: SkillCategory = {
        id: `skill-${Date.now()}`,
        category: categoryName,
        items: ["Skill 1", "Skill 2"],
      };
      const nextContent: ResumeContent = {
        ...state.content,
        skills: [...state.content.skills, newCat],
      };
      return {
        undoStack: [...state.undoStack.slice(-15), state.content],
        redoStack: [],
        content: nextContent,
        healthScore: computeResumeScore(nextContent),
        isDirty: true,
      };
    }),

  updateSkillCategory: (id, data) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        skills: state.content.skills.map((cat) => (cat.id === id ? { ...cat, ...data } : cat)),
      };
      return {
        undoStack: [...state.undoStack.slice(-15), state.content],
        redoStack: [],
        content: nextContent,
        healthScore: computeResumeScore(nextContent),
        isDirty: true,
      };
    }),

  removeSkillCategory: (id) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        skills: state.content.skills.filter((cat) => cat.id !== id),
      };
      return {
        undoStack: [...state.undoStack.slice(-15), state.content],
        redoStack: [],
        content: nextContent,
        healthScore: computeResumeScore(nextContent),
        isDirty: true,
      };
    }),

  addProject: () =>
    set((state) => {
      const newItem: ProjectItem = {
        id: `proj-${Date.now()}`,
        name: "Project Name",
        description: "Concise overview of what this application or project accomplishes.",
        role: "Creator / Contributor",
        liveUrl: "",
        githubUrl: "",
        bullets: ["Engineered core functionality using modern architecture."],
        technologies: ["React", "TypeScript"],
      };
      const nextContent: ResumeContent = {
        ...state.content,
        projects: [...state.content.projects, newItem],
      };
      return {
        undoStack: [...state.undoStack.slice(-15), state.content],
        redoStack: [],
        content: nextContent,
        healthScore: computeResumeScore(nextContent),
        isDirty: true,
      };
    }),

  updateProject: (id, data) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        projects: state.content.projects.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      };
      return {
        undoStack: [...state.undoStack.slice(-15), state.content],
        redoStack: [],
        content: nextContent,
        healthScore: computeResumeScore(nextContent),
        isDirty: true,
      };
    }),

  removeProject: (id) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        projects: state.content.projects.filter((item) => item.id !== id),
      };
      return {
        undoStack: [...state.undoStack.slice(-15), state.content],
        redoStack: [],
        content: nextContent,
        healthScore: computeResumeScore(nextContent),
        isDirty: true,
      };
    }),

  addCertification: () =>
    set((state) => {
      const newItem: CertificationItem = {
        id: `cert-${Date.now()}`,
        name: "Certification Title",
        issuer: "Issuing Organization",
        issueDate: "2023",
        expiryDate: "",
        credentialId: "",
        url: "",
      };
      const nextContent: ResumeContent = {
        ...state.content,
        certifications: [...state.content.certifications, newItem],
      };
      return { content: nextContent, isDirty: true };
    }),

  updateCertification: (id, data) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        certifications: state.content.certifications.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      };
      return { content: nextContent, isDirty: true };
    }),

  removeCertification: (id) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        certifications: state.content.certifications.filter((item) => item.id !== id),
      };
      return { content: nextContent, isDirty: true };
    }),

  addCourse: () =>
    set((state) => {
      const newItem: CourseItem = {
        id: `course-${Date.now()}`,
        name: "Course or Specialization Name",
        institution: "Institution / Platform (e.g. Coursera, HarvardX)",
        date: "2023",
      };
      const existing = state.content.courses || [];
      const nextContent: ResumeContent = {
        ...state.content,
        courses: [...existing, newItem],
      };
      return { content: nextContent, isDirty: true };
    }),

  updateCourse: (id, data) =>
    set((state) => {
      const existing = state.content.courses || [];
      const nextContent: ResumeContent = {
        ...state.content,
        courses: existing.map((c) => (c.id === id ? { ...c, ...data } : c)),
      };
      return { content: nextContent, isDirty: true };
    }),

  removeCourse: (id) =>
    set((state) => {
      const existing = state.content.courses || [];
      const nextContent: ResumeContent = {
        ...state.content,
        courses: existing.filter((c) => c.id !== id),
      };
      return { content: nextContent, isDirty: true };
    }),

  addPublication: () =>
    set((state) => {
      const newItem: PublicationItem = {
        id: `pub-${Date.now()}`,
        title: "Publication / Paper Title",
        publisher: "Publisher / Journal or Conference",
        date: "2023",
        url: "",
        description: "Key findings or contribution summary.",
      };
      const existing = state.content.publications || [];
      const nextContent: ResumeContent = {
        ...state.content,
        publications: [...existing, newItem],
      };
      return { content: nextContent, isDirty: true };
    }),

  updatePublication: (id, data) =>
    set((state) => {
      const existing = state.content.publications || [];
      const nextContent: ResumeContent = {
        ...state.content,
        publications: existing.map((p) => (p.id === id ? { ...p, ...data } : p)),
      };
      return { content: nextContent, isDirty: true };
    }),

  removePublication: (id) =>
    set((state) => {
      const existing = state.content.publications || [];
      const nextContent: ResumeContent = {
        ...state.content,
        publications: existing.filter((p) => p.id !== id),
      };
      return { content: nextContent, isDirty: true };
    }),

  addVolunteering: () =>
    set((state) => {
      const newItem: VolunteeringItem = {
        id: `vol-${Date.now()}`,
        role: "Volunteer Role",
        organization: "Organization or Community Initiative",
        period: "2022 - Present",
        bullets: ["Led community workshops and organized local outreach programs."],
      };
      const existing = state.content.volunteering || [];
      const nextContent: ResumeContent = {
        ...state.content,
        volunteering: [...existing, newItem],
      };
      return { content: nextContent, isDirty: true };
    }),

  updateVolunteering: (id, data) =>
    set((state) => {
      const existing = state.content.volunteering || [];
      const nextContent: ResumeContent = {
        ...state.content,
        volunteering: existing.map((v) => (v.id === id ? { ...v, ...data } : v)),
      };
      return { content: nextContent, isDirty: true };
    }),

  removeVolunteering: (id) =>
    set((state) => {
      const existing = state.content.volunteering || [];
      const nextContent: ResumeContent = {
        ...state.content,
        volunteering: existing.filter((v) => v.id !== id),
      };
      return { content: nextContent, isDirty: true };
    }),

  addAward: () =>
    set((state) => {
      const newItem: AwardItem = {
        id: `award-${Date.now()}`,
        title: "Honor or Award Title",
        issuer: "Issuing Organization or Institution",
        date: "2023",
        description: "Recognition for exceptional performance or leadership.",
      };
      const existing = state.content.awards || [];
      const nextContent: ResumeContent = {
        ...state.content,
        awards: [...existing, newItem],
      };
      return { content: nextContent, isDirty: true };
    }),

  updateAward: (id, data) =>
    set((state) => {
      const existing = state.content.awards || [];
      const nextContent: ResumeContent = {
        ...state.content,
        awards: existing.map((a) => (a.id === id ? { ...a, ...data } : a)),
      };
      return { content: nextContent, isDirty: true };
    }),

  removeAward: (id) =>
    set((state) => {
      const existing = state.content.awards || [];
      const nextContent: ResumeContent = {
        ...state.content,
        awards: existing.filter((a) => a.id !== id),
      };
      return { content: nextContent, isDirty: true };
    }),

  addReference: () =>
    set((state) => {
      const newItem: ReferenceItem = {
        id: `ref-${Date.now()}`,
        name: "Full Name",
        role: "Professional Title",
        organization: "Company or Institution",
        contact: "Available upon request",
      };
      const existing = state.content.references || [];
      const nextContent: ResumeContent = {
        ...state.content,
        references: [...existing, newItem],
      };
      return { content: nextContent, isDirty: true };
    }),

  updateReference: (id, data) =>
    set((state) => {
      const existing = state.content.references || [];
      const nextContent: ResumeContent = {
        ...state.content,
        references: existing.map((r) => (r.id === id ? { ...r, ...data } : r)),
      };
      return { content: nextContent, isDirty: true };
    }),

  removeReference: (id) =>
    set((state) => {
      const existing = state.content.references || [];
      const nextContent: ResumeContent = {
        ...state.content,
        references: existing.filter((r) => r.id !== id),
      };
      return { content: nextContent, isDirty: true };
    }),

  addLanguage: () =>
    set((state) => {
      const newItem: LanguageItem = {
        id: `lang-${Date.now()}`,
        language: "Language",
        proficiency: "Professional",
      };
      const nextContent: ResumeContent = {
        ...state.content,
        languages: [...state.content.languages, newItem],
      };
      return { content: nextContent, isDirty: true };
    }),

  updateLanguage: (id, data) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        languages: state.content.languages.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      };
      return { content: nextContent, isDirty: true };
    }),

  removeLanguage: (id) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        languages: state.content.languages.filter((item) => item.id !== id),
      };
      return { content: nextContent, isDirty: true };
    }),

  addCustomSection: (heading = "Custom Section") =>
    set((state) => {
      const newSection: CustomSection = {
        id: `custom-${Date.now()}`,
        heading,
        items: [
          {
            id: `item-${Date.now()}`,
            title: "Item Title",
            subtitle: "Item Subtitle",
            date: "2023",
            description: "Description or achievements.",
            bullets: [],
          },
        ],
      };
      const nextContent: ResumeContent = {
        ...state.content,
        customSections: [...state.content.customSections, newSection],
      };
      return { content: nextContent, isDirty: true };
    }),

  updateCustomSection: (id, data) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        customSections: state.content.customSections.map((sec) =>
          sec.id === id ? { ...sec, ...data } : sec
        ),
      };
      return { content: nextContent, isDirty: true };
    }),

  removeCustomSection: (id) =>
    set((state) => {
      const nextContent: ResumeContent = {
        ...state.content,
        customSections: state.content.customSections.filter((sec) => sec.id !== id),
      };
      return { content: nextContent, isDirty: true };
    }),

  updateThemeConfig: (data) =>
    set((state) => ({
      themeConfig: { ...state.themeConfig, ...data },
      isDirty: true,
    })),

  setTemplateId: (templateId) =>
    set((state) => ({
      themeConfig: { ...state.themeConfig, templateId },
      isDirty: true,
    })),

  reorderSections: (newOrder) =>
    set((state) => ({
      themeConfig: { ...state.themeConfig, sectionOrder: newOrder },
      isDirty: true,
    })),

  toggleSectionVisibility: (sectionKey) =>
    set((state) => {
      const isHidden = state.themeConfig.hiddenSections.includes(sectionKey);
      const hiddenSections = isHidden
        ? state.themeConfig.hiddenSections.filter((key) => key !== sectionKey)
        : [...state.themeConfig.hiddenSections, sectionKey];
      return {
        themeConfig: { ...state.themeConfig, hiddenSections },
        isDirty: true,
      };
    }),

  applyFieldPreset: (presetId: string) => {
    const preset = FIELD_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    set((state) => ({
      targetRole: preset.defaultRole || state.targetRole,
      themeConfig: {
        ...state.themeConfig,
        templateId: preset.recommendedTemplateId || state.themeConfig.templateId,
        sectionOrder: preset.sectionOrder || state.themeConfig.sectionOrder,
        hiddenSections: preset.hiddenSections || [],
      },
      isDirty: true,
    }));
  },

  fitToPages: (targetPages: 1 | 2) => {
    const { content, themeConfig } = get();
    // Count items and approximate length
    const expCount = content.workExperience.length + (content.internships?.length || 0);
    const bulletsCount =
      content.workExperience.reduce((a, b) => a + b.bullets.length, 0) +
      (content.internships?.reduce((a, b) => a + b.bullets.length, 0) || 0);
    const otherSectionsCount =
      (content.education?.length || 0) +
      (content.projects?.length || 0) +
      (content.certifications?.length || 0) +
      (content.courses?.length || 0) +
      (content.publications?.length || 0) +
      (content.volunteering?.length || 0) +
      (content.awards?.length || 0) +
      (content.references?.length || 0);

    const totalLoad = expCount * 3 + bulletsCount * 1.5 + otherSectionsCount * 2;

    if (targetPages === 1) {
      if (totalLoad > 22) {
        set({
          themeConfig: {
            ...themeConfig,
            fontSize: "small",
            lineSpacing: "compact",
            pageMargins: "compact",
            fitToPages: "1",
          },
          isDirty: true,
        });
      } else if (totalLoad > 14) {
        set({
          themeConfig: {
            ...themeConfig,
            fontSize: "small",
            lineSpacing: "compact",
            pageMargins: "normal",
            fitToPages: "1",
          },
          isDirty: true,
        });
      } else {
        set({
          themeConfig: {
            ...themeConfig,
            fontSize: "medium",
            lineSpacing: "normal",
            pageMargins: "normal",
            fitToPages: "1",
          },
          isDirty: true,
        });
      }
    } else {
      // 2 pages
      if (totalLoad > 35) {
        set({
          themeConfig: {
            ...themeConfig,
            fontSize: "small",
            lineSpacing: "compact",
            pageMargins: "compact",
            fitToPages: "2",
          },
          isDirty: true,
        });
      } else if (totalLoad > 20) {
        set({
          themeConfig: {
            ...themeConfig,
            fontSize: "medium",
            lineSpacing: "normal",
            pageMargins: "normal",
            fitToPages: "2",
          },
          isDirty: true,
        });
      } else {
        set({
          themeConfig: {
            ...themeConfig,
            fontSize: "large",
            lineSpacing: "spacious",
            pageMargins: "spacious",
            fitToPages: "2",
          },
          isDirty: true,
        });
      }
    }
  },

  undo: () =>
    set((state) => {
      if (state.undoStack.length === 0) return {};
      const previous = state.undoStack[state.undoStack.length - 1];
      const newUndo = state.undoStack.slice(0, -1);
      return {
        content: previous,
        undoStack: newUndo,
        redoStack: [state.content, ...state.redoStack],
        healthScore: computeResumeScore(previous),
        isDirty: true,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.redoStack.length === 0) return {};
      const next = state.redoStack[0];
      const newRedo = state.redoStack.slice(1);
      return {
        content: next,
        undoStack: [...state.undoStack, state.content],
        redoStack: newRedo,
        healthScore: computeResumeScore(next),
        isDirty: true,
      };
    }),

  loadResume: (data) =>
    set({
      id: data.id,
      title: data.title ?? "Untitled Resume",
      targetRole: data.targetRole ?? "Software Engineer",
      content: data.content,
      themeConfig: data.themeConfig,
      isPublic: data.isPublic ?? false,
      publicToken: data.publicToken,
      healthScore: computeResumeScore(data.content),
      isDirty: false,
      undoStack: [],
      redoStack: [],
    }),

  calculateHealthScore: () => {
    const score = computeResumeScore(get().content);
    set({ healthScore: score });
    return score;
  },
}));
