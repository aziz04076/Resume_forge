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
  LanguageItem,
  CustomSection,
  DEFAULT_RESUME_CONTENT,
  DEFAULT_THEME_CONFIG,
} from "@/schemas/resume.schema";

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

  // Work experience
  addWorkExperience: () => void;
  updateWorkExperience: (id: string, data: Partial<WorkExperienceItem>) => void;
  removeWorkExperience: (id: string) => void;
  reorderWorkExperience: (newItems: WorkExperienceItem[]) => void;

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

  // Languages
  addLanguage: () => void;
  updateLanguage: (id: string, data: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;

  // Custom sections
  addCustomSection: (heading?: string) => void;
  updateCustomSection: (id: string, data: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;

  // Theme & Sections
  updateThemeConfig: (data: Partial<ThemeConfig>) => void;
  setTemplateId: (templateId: string) => void;
  reorderSections: (newOrder: string[]) => void;
  toggleSectionVisibility: (sectionKey: string) => void;

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

  // Work experience depth and quantification (up to 30 pts)
  if (workExperience.length > 0) {
    score += 10;
    let hasQuantifiedBullet = false;
    let bulletCount = 0;
    const metricRegex = /(\d+%|\$\d+|\d+x|\d+\s*(users|clients|engineers|teams|million|thousand|k))/i;

    for (const exp of workExperience) {
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

  // Projects or Certifications (up to 10 pts)
  if (projects.length > 0 || (content.certifications && content.certifications.length > 0)) {
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
