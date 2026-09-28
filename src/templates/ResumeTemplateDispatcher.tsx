import React from "react";
import { TemplateProps } from "./types";
import { MinimalATS } from "./MinimalATS";
import { TechModern } from "./TechModern";
import { ExecutiveClassic } from "./ExecutiveClassic";
import { CreativeSidebar } from "./CreativeSidebar";
import { FresherStarter } from "./FresherStarter";
import { ModernSlate } from "./ModernSlate";

export const ResumeTemplateDispatcher: React.FC<TemplateProps> = (props) => {
  const { themeConfig } = props;
  const templateId = themeConfig.templateId || "minimal-ats";

  switch (templateId) {
    case "tech-mono":
    case "lead-architect":
    case "devops-cloud":
    case "data-scientist":
      return <TechModern {...props} />;

    case "executive-classic":
    case "academic-cv":
    case "harvard-classic":
    case "cambridge-fellow":
    case "legal-counsel":
    case "zurich-finance":
      return <ExecutiveClassic {...props} />;

    case "creative-sidebar":
    case "design-portfolio":
    case "vibrant-gradient":
      return <CreativeSidebar {...props} />;

    case "fresher-starter":
      return <FresherStarter {...props} />;

    case "modern-slate":
    case "berlin-modern":
    case "metro-corporate":
    case "emerald-pro":
    case "product-manager":
    case "startup-founder":
    case "indigo-executive":
    case "hybrid-compact":
      return <ModernSlate {...props} />;

    case "minimal-ats":
    case "nordic-clean":
    case "compact-dense":
    case "tokyo-minimal":
    case "medical-clinical":
    case "ruby-consultant":
    default:
      return <MinimalATS {...props} />;
  }
};
