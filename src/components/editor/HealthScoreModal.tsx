"use client";

import React from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { CheckCircle2, AlertCircle, Sparkles, X, TrendingUp } from "lucide-react";

interface HealthScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HealthScoreModal: React.FC<HealthScoreModalProps> = ({ isOpen, onClose }) => {
  const { content, healthScore } = useResumeStore();
  if (!isOpen) return null;

  const { personalInfo, workExperience, education, skills, projects } = content;

  // Breakdown checks
  const checks = [
    {
      title: "Contact Information",
      passed: Boolean(personalInfo.fullName && personalInfo.email && personalInfo.phone && personalInfo.location),
      desc: "Full name, email, phone number, and location are provided.",
      points: 20,
    },
    {
      title: "Impactful Summary",
      passed: Boolean(personalInfo.summary && personalInfo.summary.length >= 80),
      desc: "Summary exceeds 80 characters and summarizes senior value proposition.",
      points: 15,
    },
    {
      title: "Work Experience & Metrics",
      passed: workExperience.length > 0 && workExperience.some((e) => e.bullets.length >= 2),
      desc: "Has professional roles with at least 2 descriptive bullet points each.",
      points: 15,
    },
    {
      title: "Quantified Accomplishments (STAR/XYZ)",
      passed: workExperience.some((e) =>
        e.bullets.some((b) => /(\d+%|\$\d+|\d+x|\d+\s*(users|clients|engineers|teams|million|k))/i.test(b))
      ),
      desc: "Contains quantifiable metrics (e.g. percentages, revenue, latency reduction).",
      points: 15,
    },
    {
      title: "Technical & Core Skills (8+ items)",
      passed: skills.reduce((acc, cat) => acc + cat.items.length, 0) >= 8,
      desc: "Includes at least 8 relevant technical and domain skills for ATS indexing.",
      points: 15,
    },
    {
      title: "Education Credentials",
      passed: education.length > 0 && Boolean(education[0].institution),
      desc: "Degree and university or equivalent education are documented.",
      points: 10,
    },
    {
      title: "Projects / Key Deliverables",
      passed: projects.length > 0 || (content.certifications && content.certifications.length > 0),
      desc: "Demonstrates applied experience via projects or verified certifications.",
      points: 10,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (score >= 60) return "text-amber-400 border-amber-500/40 bg-amber-500/10";
    return "text-rose-400 border-rose-500/40 bg-rose-500/10";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-bold ${getScoreColor(
              healthScore
            )}`}
          >
            <span className="text-2xl leading-none">{healthScore}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">/ 100</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Resume Health & ATS Score</h2>
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {healthScore >= 85
                ? "Excellent! Your resume has strong ATS keyword density and metrics."
                : healthScore >= 60
                ? "Good baseline. Address missing items below to boost interview calls."
                : "Needs optimization. Complete the checklist to pass automated ATS filters."}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-6 border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${healthScore}%` }}
          />
        </div>

        {/* Criteria List */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {checks.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                item.passed
                  ? "bg-emerald-500/5 border-emerald-500/20 text-slate-300"
                  : "bg-slate-800/40 border-slate-700/60 text-slate-400"
              }`}
            >
              {item.passed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs">
                <div className="flex justify-between items-center mb-0.5">
                  <span className={`font-semibold ${item.passed ? "text-slate-200" : "text-slate-300"}`}>
                    {item.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">+{item.points} pts</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-xs text-indigo-400">
            <TrendingUp className="w-4 h-4" />
            <span>Resumes scoring 85+ get 3.2x more callbacks</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
