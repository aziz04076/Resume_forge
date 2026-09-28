import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";
import { ComponentType } from "react";

export type TemplateCategory =
  | "ATS-Friendly"
  | "Modern"
  | "Executive"
  | "Creative"
  | "Minimal"
  | "Fresher"
  | "Tech"
  | "Academic";

export interface TemplateMetadata {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  isPopular?: boolean;
  isAtsOptimized: boolean;
  recommendedColors: string[];
  thumbnailGradient: string;
}

export interface TemplateProps {
  content: ResumeContent;
  themeConfig: ThemeConfig;
  className?: string;
}

export type TemplateRenderer = ComponentType<TemplateProps>;
