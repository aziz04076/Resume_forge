"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { BulletImproverResponse } from "@/schemas/ai.schema";
import { Sparkles, X, Check, Wand2 } from "lucide-react";
import { toast } from "sonner";

interface BulletImproverModalProps {
  isOpen: boolean;
  onClose: () => void;
  experienceId?: string;
  bulletIndex?: number;
  initialBullet?: string;
  onApply?: (bullet: string) => void;
}

export const BulletImproverModal: React.FC<BulletImproverModalProps> = ({
  isOpen,
  onClose,
  experienceId,
  bulletIndex,
  initialBullet = "",
  onApply,
}) => {
  const { content, updateWorkExperience, targetRole } = useResumeStore();

  const [inputBullet, setInputBullet] = useState<string>(initialBullet);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<BulletImproverResponse | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setInputBullet(initialBullet || "");
      setResult(null);
    }
  }, [isOpen, initialBullet]);

  if (!isOpen) return null;

  const handleImprove = async () => {
    if (!inputBullet.trim()) {
      toast.error("Please enter a bullet point to improve");
      return;
    }

    try {
      setIsLoading(true);
      toast.info("Synthesizing quantified STAR/XYZ bullets...");

      const res = await fetch("/api/ai/bullet-improver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullet: inputBullet,
          targetRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to optimize bullet");

      setResult(data);
      toast.success("Generated 3 quantified options!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to improve bullet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (improvedBullet: string) => {
    if (onApply) {
      onApply(improvedBullet);
    } else if (experienceId !== undefined && bulletIndex !== undefined) {
      const exp = content.workExperience.find((e) => e.id === experienceId);
      if (exp) {
        const nextBullets = [...exp.bullets];
        nextBullets[bulletIndex] = improvedBullet;
        updateWorkExperience(experienceId, { bullets: nextBullets });
        toast.success("Applied to resume!");
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative text-white space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <span>AI Bullet Point Optimizer</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Rewrites weak or passive bullets into impact-driven, quantified accomplishments (Google XYZ & STAR).
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Original Bullet</label>
          <textarea
            rows={2}
            value={inputBullet}
            onChange={(e) => setInputBullet(e.target.value)}
            placeholder="e.g. Worked on the payment service and fixed bugs"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder-slate-600 outline-none"
          />
        </div>

        <button
          onClick={handleImprove}
          disabled={isLoading || !inputBullet.trim()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>{isLoading ? "Rewriting with Claude API..." : "Optimize Bullet"}</span>
        </button>

        {/* Options */}
        {result && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quantified Options
            </h4>

            {result.improvedOptions.map((opt, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 rounded-xl space-y-2 text-xs transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Formula: {opt.formula}
                  </span>
                  <button
                    onClick={() => handleApply(opt.bullet)}
                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <Check className="w-3.5 h-3.5" /> Apply this option
                  </button>
                </div>

                <p className="text-slate-200 font-medium leading-relaxed">• {opt.bullet}</p>

                <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded">
                  <span className="text-indigo-400 font-semibold">Why it works:</span> {opt.reasoning}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
