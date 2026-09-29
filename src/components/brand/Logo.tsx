import React from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand/tokens";

interface LogoProps {
  variant?: "full" | "icon" | "wordmark";
  theme?: "dark" | "light" | "auto";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  href?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "full",
  theme = "auto",
  size = "md",
  showTagline = false,
  href,
  className = "",
}) => {
  // Dimension definitions
  const dimensions = {
    sm: { icon: 20, text: "text-sm", markSize: "w-5 h-5", tagline: "text-[9px]" },
    md: { icon: 26, text: "text-base", markSize: "w-7 h-7", tagline: "text-[10px]" },
    lg: { icon: 34, text: "text-xl", markSize: "w-9 h-9", tagline: "text-xs" },
    xl: { icon: 46, text: "text-2xl", markSize: "w-12 h-12", tagline: "text-xs" },
  }[size];

  // Theme styling
  const resumeTextColor =
    theme === "light"
      ? "text-slate-900"
      : theme === "dark"
      ? "text-white"
      : "text-slate-900 dark:text-white";

  const taglineTextColor =
    theme === "light"
      ? "text-slate-600"
      : theme === "dark"
      ? "text-slate-400"
      : "text-slate-600 dark:text-slate-400";

  // The custom SVG mark: A precision document fold transitioning into an architectural anvil/spark
  const IconMark = (
    <svg
      width={dimensions.icon}
      height={dimensions.icon}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rf-grad-primary" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="60%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="rf-grad-accent" x1="18" y1="6" x2="28" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="rf-ember" x1="20" y1="8" x2="26" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>

      {/* Modern Back Sheet (Base Document) */}
      <rect
        x="5"
        y="5"
        width="16"
        height="22"
        rx="3"
        fill="url(#rf-grad-primary)"
        fillOpacity="0.92"
      />

      {/* Folded Top-Right Geometric Accent (The "Forge" facet) */}
      <path
        d="M21 5H24C25.6569 5 27 6.34315 27 8V18L21 12V5Z"
        fill="url(#rf-grad-accent)"
        fillOpacity="0.85"
      />

      {/* Dynamic Stylized Accent Line (Document Content / Quenching Line) */}
      <path
        d="M9 11H17M9 16H18M9 21H14"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* The Forge Ember Spark (Micro diamond indicating craft & spark) */}
      <polygon points="25,7 27,10 25,13 23,10" fill="url(#rf-ember)" />
    </svg>
  );

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {variant !== "wordmark" && (
        <div className="relative flex items-center justify-center drop-shadow-sm">
          {IconMark}
        </div>
      )}

      {variant !== "icon" && (
        <div className="flex flex-col leading-none">
          <span className={`${dimensions.text} tracking-tight font-sans`}>
            <span className={`font-semibold ${resumeTextColor} transition-colors`}>Resume</span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
              Forge
            </span>
          </span>
          {showTagline && (
            <span className={`${dimensions.tagline} font-medium ${taglineTextColor} mt-0.5 tracking-tight`}>
              {BRAND.taglines.primary}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};
