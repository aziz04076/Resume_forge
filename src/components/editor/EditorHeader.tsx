"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { exportToDocx } from "@/lib/export/docxExporter";
import { exportToClientPdf, printResume } from "@/lib/export/pdfExporter";
import { exportToJson, exportToTxt } from "@/lib/export/miscExporters";
import { HealthScoreModal } from "./HealthScoreModal";
import {
  Undo2,
  Redo2,
  Download,
  FileText,
  FileCode,
  Printer,
  Layers,
  Palette,
  Eye,
  ChevronDown,
  Box,
} from "lucide-react";
import { toast } from "sonner";

export const EditorHeader: React.FC = () => {
  const {
    title,
    setTitle,
    targetRole,
    setTargetRole,
    healthScore,
    undoStack,
    redoStack,
    undo,
    redo,
    activeTab,
    setActiveTab,
    content,
    themeConfig,
  } = useResumeStore();

  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      toast.info("Generating pixel-perfect PDF...");
      await exportToClientPdf("resume-preview-pane", `${title || "Resume"}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF. Trying system print dialog...");
      printResume();
    } finally {
      setIsExporting(false);
      setIsExportMenuOpen(false);
    }
  };

  const handleExportDocx = async () => {
    try {
      setIsExporting(true);
      toast.info("Building Microsoft Word document...");
      await exportToDocx(content, themeConfig, `${title || "Resume"}.docx`);
      toast.success("Word document downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export DOCX.");
    } finally {
      setIsExporting(false);
      setIsExportMenuOpen(false);
    }
  };

  const handleExportJson = () => {
    exportToJson(content, themeConfig, `${title || "Resume"}.json`);
    toast.success("JSON Resume downloaded!");
    setIsExportMenuOpen(false);
  };

  const handleExportTxt = () => {
    exportToTxt(content, `${title || "Resume"}.txt`);
    toast.success("Plain text ATS resume downloaded!");
    setIsExportMenuOpen(false);
  };

  return (
    <>
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between z-30 sticky top-0">
        {/* Left: Brand / Title / Target Role */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              RF
            </div>
            <span className="font-bold text-sm tracking-tight text-white hidden md:inline">
              Resume<span className="text-indigo-400">Forge</span>
            </span>
          </div>

          {/* Editable Title */}
          <div className="flex flex-col">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent hover:bg-slate-900 focus:bg-slate-900 border border-transparent hover:border-slate-800 focus:border-indigo-500 rounded px-2 py-0.5 text-xs font-semibold text-white focus:outline-none transition-all w-48 md:w-64"
              placeholder="Resume Title..."
            />
            <div className="flex items-center gap-2 pl-2">
              <span className="text-[10px] text-slate-500">Target Role:</span>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="bg-transparent hover:bg-slate-900/60 focus:bg-slate-900 text-[10px] text-indigo-300 border-none outline-none w-36"
              />
            </div>
          </div>
        </div>

        {/* Center: Tabs */}
        <div className="hidden lg:flex items-center bg-slate-900/90 border border-slate-800/80 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "editor"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Content Form</span>
          </button>

          <button
            onClick={() => setActiveTab("templates")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "templates"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Templates (28)</span>
          </button>

          <button
            onClick={() => setActiveTab("customize")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "customize"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme & Fonts</span>
          </button>

          <button
            onClick={() => setActiveTab("3d")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "3d"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Showcase</span>
          </button>
        </div>

        {/* Right: Health Score, Undo/Redo, Export */}
        <div className="flex items-center gap-2">
          {/* Health Score Pill */}
          <button
            onClick={() => setIsHealthModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all text-xs group"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                healthScore >= 85
                  ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                  : healthScore >= 60
                  ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                  : "bg-rose-400 shadow-[0_0_8px_#f87171]"
              }`}
            />
            <span className="text-slate-300 font-semibold">{healthScore}%</span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">ATS Score</span>
          </button>

          {/* Undo / Redo */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded transition-colors"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded transition-colors"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={handleExportPdf}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-200 hover:bg-indigo-600/20 hover:text-white transition-colors"
                >
                  <FileText className="w-4 h-4 text-rose-400" />
                  <div>
                    <div className="font-semibold">Download PDF</div>
                    <div className="text-[10px] text-slate-400">Pixel-perfect ATS vector format</div>
                  </div>
                </button>

                <button
                  onClick={handleExportDocx}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-200 hover:bg-indigo-600/20 hover:text-white transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-semibold">Download Word (.docx)</div>
                    <div className="text-[10px] text-slate-400">Editable Microsoft Word format</div>
                  </div>
                </button>

                <button
                  onClick={handleExportTxt}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-200 hover:bg-indigo-600/20 hover:text-white transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold">Plain Text (.txt)</div>
                    <div className="text-[10px] text-slate-400">Clean ASCII text for job portals</div>
                  </div>
                </button>

                <button
                  onClick={handleExportJson}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-200 hover:bg-indigo-600/20 hover:text-white transition-colors"
                >
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold">JSON Resume (.json)</div>
                    <div className="text-[10px] text-slate-400">Standard portable JSON schema</div>
                  </div>
                </button>

                <div className="border-t border-slate-800 my-1" />

                <button
                  onClick={() => {
                    printResume();
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Browser Print / Save as PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Health Score Modal */}
      <HealthScoreModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
      />
    </>
  );
};
