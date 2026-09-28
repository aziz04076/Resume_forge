"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { X, Sparkles, Check, AlertTriangle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ResumeContent } from "@/schemas/resume.schema";

interface DiffItem {
  id: string;
  section: string;
  originalText: string;
  modifiedText: string;
  reason: string;
  accepted?: boolean;
}

interface SuggestedAddition {
  section: string;
  suggestedFact: string;
  rationale: string;
}

interface TailorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TailorModal: React.FC<TailorModalProps> = ({ isOpen, onClose }) => {
  const { content, setResumeContent, targetRole } = useResumeStore();
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [diffs, setDiffs] = useState<DiffItem[]>([]);
  const [suggestedAdditions, setSuggestedAdditions] = useState<SuggestedAddition[]>([]);
  const [pendingTailoredContent, setPendingTailoredContent] = useState<ResumeContent | null>(null);

  if (!isOpen) return null;

  const handleRunTailor = async () => {
    if (!jobDescription.trim() && !jobUrl.trim()) {
      toast.error("Please provide either a Job Description or Job Post URL");
      return;
    }

    try {
      setIsLoading(true);
      toast.info("Analyzing JD and generating precision-tailored bullet points...");

      const res = await fetch("/api/ai/tailor-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent: content,
          jobDescription,
          jobUrl,
          targetRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to tailor resume");
      }

      setDiffs(data.diffSummary.map((d: DiffItem, idx: number) => ({ ...d, id: String(idx), accepted: true })));
      setSuggestedAdditions(data.suggestedAdditions || []);
      setPendingTailoredContent(data.tailoredContent);
      toast.success("Tailored resume generated! Review diffs below.");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to run tailoring engine");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAcceptDiff = (id: string) => {
    setDiffs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, accepted: !d.accepted } : d))
    );
  };

  const handleApplyAllAccepted = () => {
    if (!pendingTailoredContent) return;

    // Apply tailored content
    setResumeContent(pendingTailoredContent);
    toast.success("Accepted changes successfully applied to resume!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Tailor Resume to Target Job</h2>
              <p className="text-xs text-slate-400">
                Aligns keywords and re-orders bullets without inventing unverified experience.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {diffs.length === 0 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Option 1: Paste Job Posting URL (Auto-Extraction)
                </label>
                <div className="relative">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://boards.greenhouse.io/company/jobs/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest absolute">
                  Or Paste Text
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Option 2: Target Job Description Text
                </label>
                <textarea
                  rows={8}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste requirements, responsibilities, and qualifications from the job posting..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <button
                onClick={handleRunTailor}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? "Tailoring Bullets with Real AI..." : "Generate Precision Tailored Diffs"}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl text-xs text-indigo-300">
                <span>{diffs.length} proposed optimizations identified. Review and accept/reject each change:</span>
                <button
                  onClick={() => setDiffs((prev) => prev.map((d) => ({ ...d, accepted: true })))}
                  className="text-xs font-semibold underline hover:text-white"
                >
                  Accept All
                </button>
              </div>

              {/* Side by side diffs */}
              <div className="space-y-3">
                {diffs.map((diff) => (
                  <div
                    key={diff.id}
                    className={`border rounded-xl p-4 transition-all ${
                      diff.accepted
                        ? "bg-slate-950/80 border-indigo-500/40"
                        : "bg-slate-950/30 border-slate-800/80 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {diff.section}
                      </span>
                      <button
                        onClick={() => toggleAcceptDiff(diff.id)}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                          diff.accepted
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>{diff.accepted ? "Accepted" : "Accept Change"}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-2">
                      <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30 text-slate-300">
                        <div className="text-[10px] text-red-400 font-semibold mb-1">ORIGINAL</div>
                        <p className="line-through text-slate-400 text-[11px]">{diff.originalText}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-slate-200">
                        <div className="text-[10px] text-emerald-400 font-semibold mb-1">TAILORED REPHRASE</div>
                        <p className="text-emerald-100 text-[11px] font-medium">{diff.modifiedText}</p>
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] text-indigo-300">
                      <strong>Rationale:</strong> {diff.reason}
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggested Additions (Not added to preserve truthfulness) */}
              {suggestedAdditions.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Suggested Additions (Flagged for Truthfulness — NOT Automatically Inserted)</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    {suggestedAdditions.map((s, idx) => (
                      <div key={idx} className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <span className="font-semibold text-amber-400">[{s.section}]: </span>
                        {s.suggestedFact}
                        <div className="text-[10px] text-slate-400 mt-1 italic">Why: {s.rationale}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {diffs.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950">
            <button
              onClick={() => {
                setDiffs([]);
                setPendingTailoredContent(null);
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              Reset & Try Another JD
            </button>
            <button
              onClick={handleApplyAllAccepted}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Accepted Changes to Resume</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
