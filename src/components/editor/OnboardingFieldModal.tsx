"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { SAMPLE_RESUMES } from "@/lib/data/sampleResumes";
import {
  X,
  Sparkles,
  Stethoscope,
  GraduationCap,
  TrendingUp,
  Palette,
  Scale,
  DollarSign,
  HardHat,
  Wrench,
  BookOpen,
  Briefcase,
  ArrowRight,
} from "lucide-react";

interface OnboardingFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FIELD_OPTIONS = [
  { id: "healthcare", name: "Healthcare & Medicine", icon: Stethoscope, sampleId: "nurse", defaultRole: "Registered Nurse" },
  { id: "teaching", name: "Teaching & Education", icon: GraduationCap, sampleId: "teacher", defaultRole: "Mathematics Educator" },
  { id: "sales", name: "Sales & Marketing", icon: TrendingUp, sampleId: "sales-rep", defaultRole: "Enterprise Account Executive" },
  { id: "design", name: "Design & Creative", icon: Palette, sampleId: "graphic-designer", defaultRole: "Senior Visual Designer" },
  { id: "legal", name: "Legal & Compliance", icon: Scale, sampleId: "lawyer", defaultRole: "Corporate Counsel" },
  { id: "finance", name: "Finance & Accounting", icon: DollarSign, sampleId: "financial-analyst", defaultRole: "Financial Analyst" },
  { id: "engineering", name: "Civil & Infrastructure", icon: HardHat, sampleId: "civil-engineer", defaultRole: "Civil Project Engineer" },
  { id: "trades", name: "Skilled Trades", icon: Wrench, sampleId: "electrician", defaultRole: "Master Electrician" },
  { id: "student", name: "Student & Fresher", icon: BookOpen, sampleId: "fresher-cs", defaultRole: "Graduate Trainee / Associate" },
  { id: "tech", name: "Software & Technology", icon: Briefcase, sampleId: "", defaultRole: "Full-Stack Engineer" },
];

const EXPERIENCE_LEVELS = [
  { id: "student", label: "Student / Recent Graduate", sub: "0-1 years" },
  { id: "early", label: "Early Career", sub: "1-3 years" },
  { id: "mid", label: "Mid-Career Professional", sub: "4-7 years" },
  { id: "senior", label: "Senior Leader / Director", sub: "8+ years" },
  { id: "changer", label: "Career Changer", sub: "Transitioning to a new field" },
];

const CAREER_GOALS = [
  { id: "first-job", label: "Land First Job", desc: "Break into the industry with a compelling foundation" },
  { id: "promotion", label: "Target a Promotion", desc: "Showcase leadership, metrics, and strategic impact" },
  { id: "switch", label: "Switch Specializations", desc: "Highlight transferable skills and continuous learning" },
  { id: "relocate", label: "Relocate or Go Remote", desc: "Optimize for remote or international opportunities" },
];

export const OnboardingFieldModal: React.FC<OnboardingFieldModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { applyFieldPreset, setResumeContent, setTargetRole, setTitle } = useResumeStore();

  const [selectedField, setSelectedField] = useState<string>("healthcare");
  const [selectedExp, setSelectedExp] = useState<string>("mid");
  const [selectedGoal, setSelectedGoal] = useState<string>("promotion");
  const [loadSampleContent, setLoadSampleContent] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleApply = () => {
    // 1. Apply preset
    const presetId = selectedField === "legal" ? "academic" : selectedField === "finance" ? "sales" : selectedField;
    applyFieldPreset(presetId);

    // 2. Load relevant sample if requested
    const fieldOpt = FIELD_OPTIONS.find((f) => f.id === selectedField);
    if (loadSampleContent && fieldOpt?.sampleId) {
      const sample = SAMPLE_RESUMES.find((s) => s.id === fieldOpt.sampleId);
      if (sample) {
        setResumeContent(sample.content);
        setTargetRole(sample.jobTitle);
        setTitle(`${sample.candidateName} - ${sample.jobTitle}`);
      }
    } else if (fieldOpt) {
      setTargetRole(fieldOpt.defaultRole);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">Configure Your Career Profile</h3>
              <p className="text-xs text-slate-400">Tailors section order, ATS structure, and terminology to your field</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* 1. Field Selection */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              1. Your Industry or Field
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {FIELD_OPTIONS.map((f) => {
                const Icon = f.icon;
                const isSelected = selectedField === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedField(f.id)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-white shadow-sm"
                        : "bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/30"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? "text-indigo-400" : "text-slate-400"}`} />
                    <span className="text-xs font-medium leading-tight">{f.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Experience Level */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              2. Your Experience Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EXPERIENCE_LEVELS.map((lvl) => {
                const isSelected = selectedExp === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSelectedExp(lvl.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                        : "bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="text-xs font-medium text-white">{lvl.label}</div>
                    <div className="text-[10px] text-slate-400">{lvl.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Primary Career Goal */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              3. Primary Goal
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CAREER_GOALS.map((goal) => {
                const isSelected = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                        : "bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="text-xs font-medium text-white">{goal.label}</div>
                    <div className="text-[10px] text-slate-400">{goal.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sample Resume Checkbox */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-white">Load Realistic Profession Sample Data</div>
              <div className="text-[11px] text-slate-400">
                Pre-populates authentic, honest career accomplishments for {FIELD_OPTIONS.find((f) => f.id === selectedField)?.name} to guide your editing.
              </div>
            </div>
            <input
              type="checkbox"
              checked={loadSampleContent}
              onChange={(e) => setLoadSampleContent(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all"
          >
            <span>Apply Field Setup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
