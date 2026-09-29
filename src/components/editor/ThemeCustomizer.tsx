"use client";

import React from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { ThemeConfig } from "@/schemas/resume.schema";
import { Eye, EyeOff, Type, Palette, MoveVertical, Check } from "lucide-react";

export const ThemeCustomizer: React.FC = () => {
  const { themeConfig, updateThemeConfig, toggleSectionVisibility } = useResumeStore();

  const fonts: { label: string; value: ThemeConfig["fontFamily"] }[] = [
    { label: "Inter (Modern Sans)", value: "Inter" },
    { label: "Latin Modern Roman (LaTeX Serif)", value: "Latin Modern Roman" },
    { label: "Merriweather (Classic Serif)", value: "Merriweather" },
    { label: "Roboto (Clean Corporate)", value: "Roboto" },
    { label: "Playfair (Executive Editorial)", value: "Playfair" },
    { label: "JetBrains Mono (Tech Monospace)", value: "JetBrains Mono" },
    { label: "Outfit (Geometric Startup)", value: "Outfit" },
  ];

  const primaryPresets = [
    "#0f172a", // Slate 900
    "#1e293b", // Slate 800
    "#312e81", // Indigo 900
    "#1e3a8a", // Blue 900
    "#064e3b", // Emerald 900
    "#78350f", // Amber 900
    "#831843", // Rose 900
    "#18181b", // Zinc 900
  ];

  const accentPresets = [
    "#4f46e5", // Indigo 600
    "#2563eb", // Blue 600
    "#059669", // Emerald 600
    "#d97706", // Amber 600
    "#e11d48", // Rose 600
    "#0284c7", // Sky 600
    "#7c3aed", // Violet 600
    "#475569", // Slate 600
  ];

  const sectionLabels: Record<string, string> = {
    summary: "Professional Summary",
    workExperience: "Work Experience",
    education: "Education",
    skills: "Skills & Competencies",
    projects: "Key Projects",
    certifications: "Certifications",
    languages: "Languages",
    customSections: "Custom Sections",
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 text-slate-200">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-400" />
          <span>Styling & Typography</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize typography, brand colors, spacing, and section layout.
        </p>
      </div>

      {/* 1. Typography */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Type className="w-4 h-4 text-indigo-400" /> Font Family
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {fonts.map((f) => (
            <button
              key={f.value}
              onClick={() => updateThemeConfig({ fontFamily: f.value })}
              className={`p-3 rounded-lg border text-left text-xs font-medium transition-all ${
                themeConfig.fontFamily === f.value
                  ? "border-indigo-500 bg-indigo-950/30 text-white ring-1 ring-indigo-500"
                  : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Color Palettes */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Primary Color
          </h3>
          <div className="flex items-center gap-2.5 flex-wrap">
            {primaryPresets.map((color) => (
              <button
                key={color}
                onClick={() => updateThemeConfig({ primaryColor: color })}
                className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center"
                style={{
                  backgroundColor: color,
                  borderColor: themeConfig.primaryColor === color ? "#ffffff" : "transparent",
                }}
              >
                {themeConfig.primaryColor === color && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
            <input
              type="color"
              value={themeConfig.primaryColor}
              onChange={(e) => updateThemeConfig({ primaryColor: e.target.value })}
              className="w-8 h-8 rounded-full border-0 bg-transparent cursor-pointer"
              title="Custom hex color"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Accent Color
          </h3>
          <div className="flex items-center gap-2.5 flex-wrap">
            {accentPresets.map((color) => (
              <button
                key={color}
                onClick={() => updateThemeConfig({ accentColor: color })}
                className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center"
                style={{
                  backgroundColor: color,
                  borderColor: themeConfig.accentColor === color ? "#ffffff" : "transparent",
                }}
              >
                {themeConfig.accentColor === color && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
            <input
              type="color"
              value={themeConfig.accentColor}
              onChange={(e) => updateThemeConfig({ accentColor: e.target.value })}
              className="w-8 h-8 rounded-full border-0 bg-transparent cursor-pointer"
              title="Custom accent color"
            />
          </div>
        </div>
      </div>

      {/* 3. Spacing & Margins */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <MoveVertical className="w-4 h-4 text-indigo-400" /> Sizing & Density
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Font Size</label>
            <div className="grid grid-cols-3 gap-2">
              {(["small", "medium", "large"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateThemeConfig({ fontSize: s })}
                  className={`py-2 rounded-lg text-xs font-medium border capitalize transition-all ${
                    themeConfig.fontSize === s
                      ? "border-indigo-500 bg-indigo-600 text-white"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Line Spacing</label>
            <div className="grid grid-cols-3 gap-2">
              {(["compact", "normal", "spacious"] as const).map((spacing) => (
                <button
                  key={spacing}
                  onClick={() => updateThemeConfig({ lineSpacing: spacing })}
                  className={`py-2 rounded-lg text-xs font-medium border capitalize transition-all ${
                    themeConfig.lineSpacing === spacing
                      ? "border-indigo-500 bg-indigo-600 text-white"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white"
                  }`}
                >
                  {spacing}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Page Margins</label>
            <div className="grid grid-cols-3 gap-2">
              {(["compact", "normal", "spacious"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => updateThemeConfig({ pageMargins: m })}
                  className={`py-2 rounded-lg text-xs font-medium border capitalize transition-all ${
                    themeConfig.pageMargins === m
                      ? "border-indigo-500 bg-indigo-600 text-white"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Section Visibility */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Section Visibility & Toggles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(sectionLabels).map(([key, label]) => {
            const isHidden = (themeConfig.hiddenSections || []).includes(key);

            return (
              <button
                key={key}
                onClick={() => toggleSectionVisibility(key)}
                className={`p-2.5 rounded-lg border flex items-center justify-between text-xs font-medium transition-colors ${
                  isHidden
                    ? "border-slate-800 bg-slate-950/30 text-slate-500"
                    : "border-slate-700 bg-slate-800/40 text-slate-200"
                }`}
              >
                <span>{label}</span>
                {isHidden ? (
                  <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Paper Format & Pagination */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Paper Format & Page Budget
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Paper Size</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "A4 (210 × 297 mm)", value: "a4" },
                { label: "US Letter (8.5 × 11 in)", value: "letter" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => updateThemeConfig({ pageSize: p.value as "a4" | "letter" })}
                  className={`p-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                    (themeConfig.pageSize || "a4") === p.value
                      ? "border-indigo-500 bg-indigo-600 text-white"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Fit to Target Pages</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Auto Flow", value: "auto" },
                { label: "Fit 1 Page", value: "1" },
                { label: "Fit 2 Pages", value: "2" },
              ].map((fit) => (
                <button
                  key={fit.value}
                  onClick={() => updateThemeConfig({ fitToPages: fit.value as "auto" | "1" | "2" })}
                  className={`p-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                    (themeConfig.fitToPages || "auto") === fit.value
                      ? "border-indigo-500 bg-indigo-600 text-white"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white"
                  }`}
                >
                  {fit.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Document Branding & Export Privacy */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          PDF & Print Branding (Zero Website Traces)
        </h3>
        <p className="text-xs text-slate-400">
          Candidates retain 100% ownership of their resume. Control whether any reference to ResumeForge appears in output.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              id: "none",
              label: "Completely Unbranded",
              desc: "Zero footer, zero metadata",
            },
            {
              id: "metadata-only",
              label: "Metadata Only (Default)",
              desc: "No visible mark; invisible PDF creator tag",
            },
            {
              id: "visible",
              label: "Discreet Footer",
              desc: "Small footer credit mark",
            },
          ].map((b) => {
            const isSelected = (themeConfig.brandingLevel || "metadata-only") === b.id;
            return (
              <button
                key={b.id}
                onClick={() =>
                  updateThemeConfig({
                    brandingLevel: b.id as "none" | "metadata-only" | "visible",
                    showCreatedWithBadge: b.id === "visible",
                  })
                }
                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-950/30 text-white ring-1 ring-indigo-500"
                    : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white"
                }`}
              >
                <div className="font-semibold">{b.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{b.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
