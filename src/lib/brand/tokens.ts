/**
 * ResumeForge Brand Identity Tokens
 * Unified design tokens for brand consistency across UI, 3D scenes, SVG marks, and PDF exports.
 */

export const BRAND = {
  name: "ResumeForge",
  legalName: "ResumeForge Career Copilot",
  
  // Tagline Options
  taglines: {
    primary: "Build a resume that opens doors in any field.",
    copilot: "The modern career copilot for every profession.",
    credible: "Clear, credible resumes for the work you actually want to do.",
  },
  
  description:
    "An intelligent, human-centered career platform that helps students, doctors, teachers, sales reps, designers, and professionals in every field build interview-winning resumes.",

  colors: {
    primary: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1", // Brand Accent
      600: "#4f46e5", // Brand Primary
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
    forge: {
      amber: "#f59e0b",
      coral: "#f43f5e",
      violet: "#8b5cf6",
    },
    slate: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      950: "#020617",
    },
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
  },

  radii: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },

  fonts: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
    serif: 'Merriweather, Georgia, Cambria, "Times New Roman", Times, serif',
  },
} as const;

export type BrandTokens = typeof BRAND;
