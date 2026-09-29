"use client";

import React, { useState, useEffect } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { exportToDocx } from "@/lib/export/docxExporter";
import { exportToClientPdf, printResume } from "@/lib/export/pdfExporter";
import { exportToJson, exportToTxt } from "@/lib/export/miscExporters";
import { HealthScoreModal } from "./HealthScoreModal";
import { TailorModal } from "./TailorModal";
import { RecruiterScanModal } from "./RecruiterScanModal";
import { GitHubImportModal } from "./GitHubImportModal";
import { TranslateModal } from "./TranslateModal";
import { ShareModal } from "./ShareModal";
import { CommandPalette } from "./CommandPalette";
import { OnboardingTourModal } from "./OnboardingTourModal";
import { OnboardingFieldModal } from "./OnboardingFieldModal";
import { Logo } from "@/components/brand/Logo";
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
  Sparkles,
  Share2,
  Github,
  Languages,
  Command,
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
    isSaving,
  } = useResumeStore();

  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);
  const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);

  // Global keyboard shortcuts (Ctrl+K, Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      toast.info("Generating selectable vector text ATS PDF...");
      await exportToClientPdf(content, themeConfig, `${title || "Resume"}.pdf`);
      toast.success("Vector PDF exported successfully!");
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
          <div className="pr-3 border-r border-slate-800">
            <Logo href="/" size="sm" />
          </div>

          {/* Editable Title */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent hover:bg-slate-900 focus:bg-slate-900 border border-transparent hover:border-slate-800 focus:border-indigo-500 rounded px-2 py-0.5 text-xs font-semibold text-white focus:outline-none transition-all w-40 md:w-56"
                placeholder="Resume Title..."
              />
              {/* Autosave Status Indicator */}
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSaving ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                  }`}
                />
                <span className="hidden xl:inline">{isSaving ? "Saving..." : "Saved"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <span className="text-[10px] text-slate-500">Target:</span>
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

        {/* Center: Tabs & Copilot Quick Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Main Workspace Tabs */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800/80 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab("editor")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "editor"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Editor</span>
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
              <span>28 Templates</span>
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
              <span>Styles</span>
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
              <span>3D Orbit</span>
            </button>
          </div>

          {/* Quick AI Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsTailorModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors"
              title="Tailor resume to specific Job Description"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span className="hidden xl:inline">Tailor to JD</span>
            </button>

            <button
              onClick={() => setIsRecruiterModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-medium transition-colors"
              title="6-Second Recruiter Attention Skim"
            >
              <Eye className="w-3 h-3 text-pink-400" />
              <span className="hidden xl:inline">6s Recruiter</span>
            </button>

            <button
              onClick={() => setIsGitHubModalOpen(true)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              title="Import from GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsTranslateModalOpen(true)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              title="Translate to Hindi / Global Languages"
            >
              <Languages className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsFieldModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Select your industry or load a realistic sample resume"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Field Presets</span>
            </button>
          </div>
        </div>

        {/* Right: Health Score, Share, Undo/Redo, Export */}
        <div className="flex items-center gap-2">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] text-slate-400 font-mono"
            title="Open Command Palette (Ctrl+K)"
          >
            <Command className="w-3 h-3" />
            <span>K</span>
          </button>

          {/* Share Modal Trigger */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Share</span>
          </button>

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
            <span className="text-[10px] text-slate-500 hidden sm:inline">ATS</span>
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
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={handleExportPdf}
                  className="w-full px-3 py-2 text-left hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold">Vector Text PDF</div>
                    <div className="text-[10px] text-slate-500">100% ATS-parsable vector stream</div>
                  </div>
                </button>

                <button
                  onClick={handleExportDocx}
                  className="w-full px-3 py-2 text-left hover:bg-slate-800 text-slate-200 flex items-center gap-2 border-t border-slate-800"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-semibold">Microsoft Word (.docx)</div>
                    <div className="text-[10px] text-slate-500">Native Office XML document</div>
                  </div>
                </button>

                <button
                  onClick={handleExportTxt}
                  className="w-full px-3 py-2 text-left hover:bg-slate-800 text-slate-200 flex items-center gap-2 border-t border-slate-800"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-semibold">Plain Text (.txt)</div>
                    <div className="text-[10px] text-slate-500">Raw text for legacy job portals</div>
                  </div>
                </button>

                <button
                  onClick={handleExportJson}
                  className="w-full px-3 py-2 text-left hover:bg-slate-800 text-slate-200 flex items-center gap-2 border-t border-slate-800"
                >
                  <FileCode className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-semibold">JSON Resume (.json)</div>
                    <div className="text-[10px] text-slate-500">Standard portable open schema</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    printResume();
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-800 text-slate-200 flex items-center gap-2 border-t border-slate-800"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold">Print Dialog</div>
                    <div className="text-[10px] text-slate-500">System @media print styling</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <HealthScoreModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
      />

      <TailorModal
        isOpen={isTailorModalOpen}
        onClose={() => setIsTailorModalOpen(false)}
      />

      <RecruiterScanModal
        isOpen={isRecruiterModalOpen}
        onClose={() => setIsRecruiterModalOpen(false)}
      />

      <GitHubImportModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      <TranslateModal
        isOpen={isTranslateModalOpen}
        onClose={() => setIsTranslateModalOpen(false)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenTailor={() => setIsTailorModalOpen(true)}
        onOpenRecruiterScan={() => setIsRecruiterModalOpen(true)}
        onOpenGitHub={() => setIsGitHubModalOpen(true)}
        onOpenTranslate={() => setIsTranslateModalOpen(true)}
        onExportPdf={handleExportPdf}
        onExportDocx={handleExportDocx}
      />

      <OnboardingTourModal />
      <OnboardingFieldModal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
      />
    </>
  );
};
