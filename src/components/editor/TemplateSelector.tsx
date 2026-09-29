"use client";

import React, { useState } from "react";
import { TEMPLATES } from "@/templates/registry";
import { TemplateCategory } from "@/templates/types";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { TemplateMiniPreview } from "./TemplateMiniPreview";
import { SharedPageLayout } from "@/components/preview/SharedPageLayout";
import { SAMPLE_RESUMES } from "@/lib/data/sampleResumes";
import {
  Check,
  ShieldCheck,
  Sparkles,
  Maximize2,
  X,
  UserCheck,
  Columns,
  Image as ImageIcon,
} from "lucide-react";

export const TemplateSelector: React.FC = () => {
  const { content, themeConfig, setTemplateId, updateThemeConfig, setActiveTab } =
    useResumeStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [previewWithMyData, setPreviewWithMyData] = useState<boolean>(false);
  const [zoomedTemplateId, setZoomedTemplateId] = useState<string | null>(null);

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

  // Default sample content to showcase template layout
  const defaultSample =
    SAMPLE_RESUMES.find((r) => r.id === "software-engineer")?.content || SAMPLE_RESUMES[0].content;

  const displayContent = previewWithMyData ? content : defaultSample;

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

  const getTemplateBadges = (tplId: string, category: string, isAts: boolean) => {
    const isTwoColumn =
      category === "Creative" || tplId.includes("sidebar") || tplId.includes("hybrid");
    const isPhotoReady =
      tplId === "classic-professional" ||
      tplId.includes("creative") ||
      tplId.includes("portfolio") ||
      tplId.includes("slate") ||
      tplId.includes("modern") ||
      tplId.includes("executive");

    return {
      columns: isTwoColumn ? "2-Column" : "1-Column",
      photo: isPhotoReady ? "Photo Ready" : "Text First",
      ats: isAts ? "ATS-Safe" : "Creative",
    };
  };

  const activeZoomedTemplate = TEMPLATES.find((t) => t.id === zoomedTemplateId);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto text-slate-200">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>29 Designer Templates</span>
            <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
              WYSIWYG Previews
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real rendered miniatures showing authentic typography, section dividers, and column structures.
          </p>
        </div>

        {/* Toggle: Preview with my resume vs sample content */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewWithMyData((prev) => !prev)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              previewWithMyData
                ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{previewWithMyData ? "Showing My Resume Data" : "Preview with My Resume"}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap mb-6">
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

      {/* Grid of Templates with Real Miniature Previews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => {
          const isSelected = themeConfig.templateId === tpl.id;
          const badges = getTemplateBadges(tpl.id, tpl.category, tpl.isAtsOptimized);

          return (
            <div
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl.id, tpl.recommendedColors)}
              className={`group relative rounded-2xl overflow-hidden border p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "border-indigo-500 bg-indigo-950/20 ring-2 ring-indigo-500/50 shadow-xl shadow-indigo-500/10"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div>
                {/* Real Rendered Miniature */}
                <div className="relative mb-3 group/thumb">
                  <TemplateMiniPreview
                    templateId={tpl.id}
                    content={displayContent}
                    themeConfig={themeConfig}
                  />

                  {/* Zoom Preview Button on Hover */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomedTemplateId(tpl.id);
                    }}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/80 hover:bg-indigo-600 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity backdrop-blur-md border border-white/20 shadow-md"
                    title="Enlarge Preview"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Selected Indicator Pill */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1 shadow-lg">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Badges Row */}
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    <Columns className="w-2.5 h-2.5 text-slate-400" />
                    {badges.columns}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    <ImageIcon className="w-2.5 h-2.5 text-indigo-400" />
                    {badges.photo}
                  </span>
                  {tpl.isAtsOptimized && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                      ATS-Safe
                    </span>
                  )}
                </div>

                {/* Template Name & Popularity */}
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
              </div>

              {/* Action and Palettes Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-2">
                <div className="flex items-center gap-1.5">
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

      {/* Larger Zoom Preview Modal */}
      {zoomedTemplateId && activeZoomedTemplate && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomedTemplateId(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">
                  {activeZoomedTemplate.name}
                </h3>
                <p className="text-xs text-slate-400">{activeZoomedTemplate.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleSelectTemplate(
                      activeZoomedTemplate.id,
                      activeZoomedTemplate.recommendedColors
                    );
                    setZoomedTemplateId(null);
                    setActiveTab("editor");
                  }}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  Use This Template
                </button>
                <button
                  onClick={() => setZoomedTemplateId(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: High-resolution scrollable preview */}
            <div className="flex-1 overflow-auto p-6 flex justify-center bg-slate-950/70">
              <div className="shadow-2xl">
                <SharedPageLayout
                  content={displayContent}
                  themeConfig={{
                    ...themeConfig,
                    templateId: activeZoomedTemplate.id,
                  }}
                  scale={0.75}
                  isPrintMode={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
