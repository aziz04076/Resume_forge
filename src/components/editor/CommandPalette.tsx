"use client";

import React, { useEffect, useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import {
  Search,
  Sparkles,
  Eye,
  Github,
  Languages,
  Download,
  Palette,
  Box,
  Undo2,
  Redo2,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTailor: () => void;
  onOpenRecruiterScan: () => void;
  onOpenGitHub: () => void;
  onOpenTranslate: () => void;
  onExportPdf: () => void;
  onExportDocx: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenTailor,
  onOpenRecruiterScan,
  onOpenGitHub,
  onOpenTranslate,
  onExportPdf,
  onExportDocx,
}) => {
  const { setActiveTab, undo, redo } = useResumeStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: "tailor",
      name: "Tailor Resume to Job Description (Diff View)",
      category: "AI Engines",
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      run: () => {
        onClose();
        onOpenTailor();
      },
    },
    {
      id: "recruiter-scan",
      name: "Run Recruiter 6-Second Scan & Heatmap",
      category: "AI Engines",
      icon: <Eye className="w-4 h-4 text-pink-400" />,
      run: () => {
        onClose();
        onOpenRecruiterScan();
      },
    },
    {
      id: "github-import",
      name: "Import Repositories from GitHub",
      category: "Integrations",
      icon: <Github className="w-4 h-4 text-white" />,
      run: () => {
        onClose();
        onOpenGitHub();
      },
    },
    {
      id: "translate",
      name: "Translate Resume (Hindi, Spanish, German...)",
      category: "Localization",
      icon: <Languages className="w-4 h-4 text-amber-400" />,
      run: () => {
        onClose();
        onOpenTranslate();
      },
    },
    {
      id: "export-pdf",
      name: "Export Vector Text ATS PDF",
      category: "Exports",
      icon: <Download className="w-4 h-4 text-emerald-400" />,
      run: () => {
        onClose();
        onExportPdf();
      },
    },
    {
      id: "export-docx",
      name: "Export Microsoft Word Document (.docx)",
      category: "Exports",
      icon: <Download className="w-4 h-4 text-blue-400" />,
      run: () => {
        onClose();
        onExportDocx();
      },
    },
    {
      id: "tab-templates",
      name: "Switch to 28 Designer Templates View",
      category: "Navigation",
      icon: <Palette className="w-4 h-4 text-purple-400" />,
      run: () => {
        setActiveTab("templates");
        onClose();
      },
    },
    {
      id: "tab-3d",
      name: "Switch to 3D Orbit Canvas",
      category: "Navigation",
      icon: <Box className="w-4 h-4 text-indigo-400" />,
      run: () => {
        setActiveTab("3d");
        onClose();
      },
    },
    {
      id: "action-undo",
      name: "Undo Last Change (Ctrl+Z)",
      category: "History",
      icon: <Undo2 className="w-4 h-4 text-slate-400" />,
      run: () => {
        undo();
        onClose();
      },
    },
    {
      id: "action-redo",
      name: "Redo Last Change (Ctrl+Y)",
      category: "History",
      icon: <Redo2 className="w-4 h-4 text-slate-400" />,
      run: () => {
        redo();
        onClose();
      },
    },
  ];

  const filtered = actions.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or jump to feature (e.g. Tailor, GitHub, PDF)..."
            className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC to close
          </kbd>
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No matching commands found.</div>
          ) : (
            filtered.map((action) => (
              <button
                key={action.id}
                onClick={action.run}
                className="w-full p-2.5 rounded-xl hover:bg-slate-800/80 flex items-center justify-between group transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-slate-700">
                    {action.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {action.name}
                    </div>
                    <div className="text-[10px] text-slate-500">{action.category}</div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 group-hover:text-slate-300 font-mono">Select ↵</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
