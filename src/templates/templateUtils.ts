import { ThemeConfig } from "@/schemas/resume.schema";

export function getFontFamilyClass(fontFamily: ThemeConfig["fontFamily"]): string {
  switch (fontFamily) {
    case "Merriweather":
      return "font-serif";
    case "JetBrains Mono":
      return "font-mono";
    case "Playfair":
      return "font-serif tracking-tight";
    case "Roboto":
    case "Outfit":
    case "Inter":
    default:
      return "font-sans";
  }
}

export function getFontSizeClasses(size: ThemeConfig["fontSize"]): {
  body: string;
  name: string;
  role: string;
  heading: string;
  subheading: string;
} {
  switch (size) {
    case "small":
      return {
        body: "text-[11px] leading-relaxed",
        name: "text-2xl font-bold tracking-tight",
        role: "text-xs font-semibold uppercase tracking-wider",
        heading: "text-xs font-bold uppercase tracking-wider",
        subheading: "text-[11px] font-semibold",
      };
    case "large":
      return {
        body: "text-[13px] leading-relaxed",
        name: "text-3xl font-extrabold tracking-tight",
        role: "text-sm font-semibold uppercase tracking-wider",
        heading: "text-sm font-bold uppercase tracking-wider",
        subheading: "text-xs font-semibold",
      };
    case "medium":
    default:
      return {
        body: "text-[12px] leading-relaxed",
        name: "text-2xl font-bold tracking-tight",
        role: "text-xs font-semibold uppercase tracking-wider",
        heading: "text-xs font-bold uppercase tracking-wider",
        subheading: "text-xs font-semibold",
      };
  }
}

export function getLineSpacingClass(spacing: ThemeConfig["lineSpacing"]): string {
  switch (spacing) {
    case "compact":
      return "space-y-2.5 leading-snug";
    case "spacious":
      return "space-y-5 leading-loose";
    case "normal":
    default:
      return "space-y-3.5 leading-relaxed";
  }
}

export function getMarginPaddingClass(margin: ThemeConfig["pageMargins"]): string {
  switch (margin) {
    case "compact":
      return "p-6";
    case "spacious":
      return "p-12";
    case "normal":
    default:
      return "p-9";
  }
}
