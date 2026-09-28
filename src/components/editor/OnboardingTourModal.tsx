"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Layers, Eye, Download, X, ArrowRight } from "lucide-react";

const TOUR_STEPS = [
  {
    title: "Welcome to ResumeForge",
    subtitle: "The Autonomous Career Copilot",
    desc: "Unlike basic resume builders that generate flat text, ResumeForge is a full career OS with real Claude & OpenAI intelligence, live 3D visualization, and automated ATS compliance.",
    icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
  },
  {
    title: "Split-Screen Live Engine",
    subtitle: "Real-Time Visual Recalculation",
    desc: "Edit your structured profile on the left while observing pixel-perfect A4 rendering on the right with instant zoom, font swaps, and section reordering.",
    icon: <Layers className="w-6 h-6 text-blue-400" />,
  },
  {
    title: "10 Autonomous AI Engines",
    subtitle: "From STAR Bullets to Recruiter 6-Sec Scan",
    desc: "Quantify your achievements using Google's XYZ formula, simulate real Taleo/Workday ATS algorithms, run 6-second recruiter gaze tracking, and practice mock interviews via voice.",
    icon: <Eye className="w-6 h-6 text-pink-400" />,
  },
  {
    title: "100% Text Vector PDF Export",
    subtitle: "Guaranteed Selectable & ATS-Parsable",
    desc: "Export real text vector PDFs verified by pdftotext, native Word (.docx), plain text, or standard JSON Resume format.",
    icon: <Download className="w-6 h-6 text-emerald-400" />,
  },
];

export const OnboardingTourModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const hasSeen = localStorage.getItem("resumeforge_tour_completed");
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem("resumeforge_tour_completed", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const current = TOUR_STEPS[stepIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step indicator */}
        <div className="flex gap-1.5 mb-6">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i <= stepIndex ? "bg-indigo-500" : "bg-slate-800"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto shadow-xl">
            {current.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{current.title}</h3>
            <p className="text-xs text-indigo-400 font-medium mt-0.5">{current.subtitle}</p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">{current.desc}</p>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between">
          <button onClick={handleComplete} className="text-xs text-slate-500 hover:text-slate-300">
            Skip Tour
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <span>{stepIndex === TOUR_STEPS.length - 1 ? "Get Started" : "Next"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
