"use client";

import React, { useState } from "react";
import { TEMPLATES } from "@/templates/registry";
import { TemplateCategory } from "@/templates/types";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { Check, ShieldCheck, Sparkles } from "lucide-react";

export const TemplateSelector: React.FC = () => {
  const { themeConfig, setTemplateId, updateThemeConfig, setActiveTab } = useResumeStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories: ("All" | TemplateCategory)[] = [
    "All",
    "ATS-Friendly",
    "Tech",
    "Executive",
    "Creative",
    "Minimal",
    "Fresher",
    "Modern",
    "Academic",
  ];

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    if (selectedCategory === "All") return true;
    return tpl.category === selectedCategory;
  });

  const handleSelectTemplate = (id: string, recommendedColors: string[]) => {
    setTemplateId(id);
    if (recommendedColors.length > 0) {
      updateThemeConfig({ primaryColor: recommendedColors[0] });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>28 Designer Templates</span>
            <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
              ATS-Scored
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Carefully engineered for maximum hiring manager engagement and machine parser readability.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => {
          const isSelected = themeConfig.templateId === tpl.id;

          return (
            <div
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl.id, tpl.recommendedColors)}
              className={`group relative rounded-2xl overflow-hidden border p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-indigo-500 bg-indigo-950/20 ring-2 ring-indigo-500/50 shadow-xl shadow-indigo-500/10"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              {/* Thumbnail Representation */}
              <div
                className={`h-40 rounded-xl bg-gradient-to-br ${tpl.thumbnailGradient} p-3 flex flex-col justify-between relative overflow-hidden mb-3.5 shadow-inner`}
              >
                <div className="flex justify-between items-start z-10">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-white border border-white/10">
                    {tpl.category}
                  </span>
                  {tpl.isAtsOptimized && (
                    <span className="flex items-center gap-1 text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full backdrop-blur-md">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> ATS 100%
                    </span>
                  )}
                </div>

                {/* Abstract Resume Paper Graphic */}
                <div className="bg-white/95 rounded-lg p-2.5 shadow-lg transform group-hover:scale-[1.02] transition-transform duration-200">
                  <div className="w-16 h-2 bg-slate-900 rounded mb-1.5" />
                  <div className="w-24 h-1 bg-slate-400 rounded mb-2.5" />
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-slate-200 rounded" />
                    <div className="w-5/6 h-1 bg-slate-200 rounded" />
                    <div className="w-4/6 h-1 bg-slate-200 rounded" />
                  </div>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="bg-indigo-600 text-white rounded-full p-2 shadow-lg">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                  {tpl.name}
                </h3>
                {tpl.isPopular && (
                  <span className="text-[9px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> Popular
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 leading-normal line-clamp-2 mb-3">
                {tpl.description}
              </p>

              {/* Color Recommendations */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500">Palettes:</span>
                  {tpl.recommendedColors.map((col, cIdx) => (
                    <span
                      key={cIdx}
                      className="w-3.5 h-3.5 rounded-full border border-slate-700"
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate(tpl.id, tpl.recommendedColors);
                    setActiveTab("editor");
                  }}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded transition-colors ${
                    isSelected
                      ? "text-indigo-400 hover:text-indigo-300"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {isSelected ? "Active" : "Use Template"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
