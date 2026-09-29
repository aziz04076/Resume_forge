"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Camera, FileText, ArrowRight, Check } from "lucide-react";

interface TemplateShowcaseItem {
  id: string;
  name: string;
  category: string;
  hasPhoto: boolean;
  idealFor: string;
  description: string;
  colorScheme: string;
  gradient: string;
}

const SHOWCASE_TEMPLATES: TemplateShowcaseItem[] = [
  {
    id: "minimal-ats",
    name: "Minimalist Classic",
    category: "Standard Text-First",
    hasPhoto: false,
    idealFor: "Healthcare, Corporate, US/UK Applications",
    description: "Single-column format designed for effortless readability and 100% automated software compatibility.",
    colorScheme: "Slate & Charcoal",
    gradient: "from-slate-800 to-slate-950",
  },
  {
    id: "creative-sidebar",
    name: "Creative Studio",
    category: "Photo & Visual",
    hasPhoto: true,
    idealFor: "Design, Marketing, Creative Roles, Europe/Asia",
    description: "Elegant two-column asymmetric layout with a dedicated sidebar for your headshot, skills, and links.",
    colorScheme: "Indigo & Deep Purple",
    gradient: "from-indigo-900 to-purple-950",
  },
  {
    id: "executive-classic",
    name: "Executive Leadership",
    category: "Standard Text-First",
    hasPhoto: false,
    idealFor: "Management, Finance, Law, Senior Roles",
    description: "Timeless serif typography and subtle dividers that convey seasoned authority and executive presence.",
    colorScheme: "Navy & Warm Stone",
    gradient: "from-amber-950/40 to-slate-900",
  },
  {
    id: "modern-slate",
    name: "Modern Professional",
    category: "Photo & Visual",
    hasPhoto: true,
    idealFor: "Sales, Business, Tech, Consulting",
    description: "Contemporary layout with crisp spacing, clean section headers, and an optional profile portrait.",
    colorScheme: "Slate & Ocean Blue",
    gradient: "from-slate-900 to-sky-950",
  },
  {
    id: "fresher-starter",
    name: "Graduate Launchpad",
    category: "Standard Text-First",
    hasPhoto: false,
    idealFor: "Students, Recent Grads, Career Changers",
    description: "Puts education, university projects, and coursework upfront to highlight your growth and foundational skills.",
    colorScheme: "Emerald & Dark Slate",
    gradient: "from-emerald-950/40 to-slate-900",
  },
  {
    id: "academic-cv",
    name: "Academic Scholar",
    category: "Standard Text-First",
    hasPhoto: false,
    idealFor: "Educators, Researchers, Professors, Scientists",
    description: "Designed to cleanly organize curriculum history, publications, grants, and teaching appointments.",
    colorScheme: "Classic Ivory & Charcoal",
    gradient: "from-slate-900 to-stone-900",
  },
];

export const TemplatePreviewStrip: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "photo" | "no-photo">("all");

  const filtered = SHOWCASE_TEMPLATES.filter((tpl) => {
    if (filter === "photo") return tpl.hasPhoto;
    if (filter === "no-photo") return !tpl.hasPhoto;
    return true;
  });

  return (
    <section id="templates" className="py-24 px-6 relative bg-slate-50/50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-700 dark:text-indigo-400 mb-2 block">
              Curated Layouts
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Templates for Every Industry
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-xl">
              Choose between traditional text-first layouts or designs crafted with an optional photo. Every template is fully customizable.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
            <button
              onClick={() => setFilter("all")}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                filter === "all"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              All Layouts (28)
            </button>
            <button
              onClick={() => setFilter("no-photo")}
              className={`min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                filter === "no-photo"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Standard (No Photo)</span>
            </button>
            <button
              onClick={() => setFilter("photo")}
              className={`min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                filter === "photo"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>With Photo Option</span>
            </button>
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 overflow-hidden hover:border-indigo-400 dark:hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
            >
              {/* Visual Thumbnail Simulator */}
              <div className={`h-48 p-5 bg-gradient-to-tr ${item.gradient} flex flex-col justify-between relative overflow-hidden`}>
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-950/90 text-white backdrop-blur-sm border border-slate-700/60 shadow-sm">
                    {item.category}
                  </span>
                  {item.hasPhoto ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md bg-slate-950/90 text-indigo-300 border border-indigo-500/50 shadow-sm">
                      <Camera className="w-3 h-3 text-indigo-400" />
                      <span>Photo Ready</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md bg-slate-950/90 text-emerald-300 border border-emerald-500/50 shadow-sm">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Text-First</span>
                    </span>
                  )}
                </div>

                {/* Abstract Stylized Resume Lines in Thumbnail */}
                <div className="bg-white/95 rounded-lg p-3 shadow-xl transform group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    {item.hasPhoto && (
                      <div className="w-6 h-6 rounded-full bg-slate-300 shrink-0" />
                    )}
                    <div className="space-y-1 w-full">
                      <div className="h-2 bg-slate-800 rounded w-1/3" />
                      <div className="h-1 bg-slate-500 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 bg-slate-300 rounded w-full" />
                    <div className="h-1 bg-slate-300 rounded w-5/6" />
                    <div className="h-1 bg-slate-300 rounded w-4/6" />
                  </div>
                </div>
              </div>

              {/* Template Meta Content */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {item.name}
                  </h3>
                  <div className="text-[11px] text-indigo-700 dark:text-indigo-300 font-semibold mt-0.5">
                    Ideal for: {item.idealFor}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{item.colorScheme}</span>
                  <Link
                    href={`/editor?template=${item.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded py-1 px-1.5"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1"
          >
            <span>Explore all 28 professional templates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
