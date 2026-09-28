"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { ResumeTemplateDispatcher } from "@/templates/ResumeTemplateDispatcher";
import { ZoomIn, ZoomOut, ShieldCheck, Printer } from "lucide-react";
import { printResume } from "@/lib/export/pdfExporter";

export const LivePreviewPane: React.FC = () => {
  const { content, themeConfig } = useResumeStore();
  const [zoom, setZoom] = useState<number>(85); // 85% is optimal on standard 1080p split screen

  const handleZoomIn = () => setZoom((prev) => Math.min(130, prev + 10));
  const handleZoomOut = () => setZoom((prev) => Math.max(50, prev - 10));
  const handleResetZoom = () => setZoom(85);

  return (
    <div className="flex flex-col h-full bg-slate-950/60 relative overflow-hidden border-l border-slate-800">
      {/* Floating Toolbar */}
      <div className="h-10 px-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between text-xs text-slate-400 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> Live ATS Preview
          </span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">Standard A4 (210mm × 297mm)</span>
        </div>

        {/* Zoom & Print Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 py-0.5 hover:text-white hover:bg-slate-800 rounded text-[11px] font-mono transition-colors"
            title="Reset Zoom"
          >
            {zoom}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3.5 bg-slate-800 mx-1" />
          <button
            onClick={printResume}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Print Preview (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Area with Auto Scroll */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
          }}
          className="shadow-2xl"
        >
          <div id="resume-preview-pane">
            <ResumeTemplateDispatcher content={content} themeConfig={themeConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};
