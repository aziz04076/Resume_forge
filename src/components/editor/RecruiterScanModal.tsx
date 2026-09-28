"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { X, Eye, Zap, Flame, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { RecruiterScanResponse } from "@/schemas/ai.schema";

interface RecruiterScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecruiterScanModal: React.FC<RecruiterScanModalProps> = ({ isOpen, onClose }) => {
  const { content, targetRole } = useResumeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<RecruiterScanResponse | null>(null);

  if (!isOpen) return null;

  const handleRunScan = async () => {
    try {
      setIsLoading(true);
      toast.info("Simulating 6-second recruiter glance and eye-tracking...");

      const res = await fetch("/api/ai/recruiter-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent: content,
          targetRole: targetRole || "Software Engineer",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to execute scan");
      }

      setScanResult(data);
      toast.success("Recruiter simulation complete!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to run recruiter scan");
    } finally {
      setIsLoading(false);
    }
  };

  const getImpressionColor = (imp?: string) => {
    switch (imp) {
      case "Strong Hire":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "Hire":
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      case "Leaning No-Hire":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      default:
        return "text-rose-400 bg-rose-500/10 border-rose-500/30";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Recruiter 6-Second Skim & Heatmap</h2>
              <p className="text-xs text-slate-400">
                Simulates real recruiter eye-tracking, instant psychological hooks, and hire/no-hire verdict.
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!scanResult ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-pink-500/20">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Simulate Recruiter First Impression</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Discover what a recruiter reads in their initial 6-second glance, which sections grab attention, and what might trigger an instant rejection.
              </p>
              <button
                onClick={handleRunScan}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-pink-600/30 transition-all"
              >
                {isLoading ? "Running 6-Second Eye Tracking..." : "Run 6-Second Recruiter Scan"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Verdict Banner */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Initial Verdict</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-sm font-bold px-3 py-1 rounded-lg border ${getImpressionColor(
                        scanResult.firstImpression
                      )}`}
                    >
                      {scanResult.firstImpression}
                    </span>
                    <span className="text-xs text-slate-300">{scanResult.verdictRationale}</span>
                  </div>
                </div>
                <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                  <div className="text-[9px] text-slate-500 uppercase font-mono">First Thing Noticed</div>
                  <div className="font-semibold text-pink-400 mt-0.5">&ldquo;{scanResult.firstNotice}&rdquo;</div>
                </div>
              </div>

              {/* Eye-Tracking Path */}
              <div>
                <h4 className="text-xs font-bold text-slate-200 mb-2.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Eye-Tracking Fixation Sequence (F-Pattern Flow)</span>
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  {scanResult.eyeTrackingPath.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-200">
                        <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                      {idx < scanResult.eyeTrackingPath.length - 1 && (
                        <span className="text-slate-600 text-xs">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap Zones */}
              <div>
                <h4 className="text-xs font-bold text-slate-200 mb-2.5 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Visual Attention Heatmap</span>
                </h4>
                <div className="space-y-2.5">
                  {scanResult.heatmapZones.map((zone, idx) => {
                    const isHigh = zone.intensity === "high";
                    const isMed = zone.intensity === "medium";
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-4 ${
                          isHigh
                            ? "bg-rose-950/20 border-rose-800/40 text-rose-200"
                            : isMed
                            ? "bg-amber-950/20 border-amber-800/40 text-amber-200"
                            : "bg-slate-950/50 border-slate-800 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isHigh ? "bg-rose-500 shadow-lg shadow-rose-500/50 animate-pulse" : isMed ? "bg-amber-500" : "bg-slate-600"
                            }`}
                          />
                          <span className="font-semibold text-xs text-white">{zone.section}</span>
                        </div>
                        <span className="text-[11px] text-slate-300">{zone.feedback}</span>
                        <span
                          className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                            isHigh ? "bg-rose-500 text-white" : isMed ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {zone.intensity} attention
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strengths & Dealbreakers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Instant Positive Hooks</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {scanResult.immediateStrengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Recruiter Dealbreakers / Red Flags</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {scanResult.dealbreakers.map((db, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-400">•</span>
                        <span>{db}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
