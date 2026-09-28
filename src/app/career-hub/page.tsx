"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useResumeStore } from "@/lib/store/useResumeStore";
import {
  LinkedInOptimizerResponse,
  CareerAdvisorResponse,
} from "@/schemas/ai.schema";
import {
  ArrowLeft,
  Sparkles,
  Linkedin,
  Compass,
  Copy,
  Check,
  DollarSign,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export default function CareerHubPage() {
  const { content, targetRole } = useResumeStore();

  const [activeTab, setActiveTab] = useState<"linkedin" | "advisor">("linkedin");

  // LinkedIn Optimizer State
  const [isGeneratingLinkedIn, setIsGeneratingLinkedIn] = useState<boolean>(false);
  const [linkedinResult, setLinkedinResult] = useState<LinkedInOptimizerResponse | null>(null);
  const [copiedKey, setCopiedKey] = useState<string>("");

  // Career Advisor State
  const [isGeneratingAdvisor, setIsGeneratingAdvisor] = useState<boolean>(false);
  const [advisorResult, setAdvisorResult] = useState<CareerAdvisorResponse | null>(null);

  const handleGenerateLinkedIn = async () => {
    try {
      setIsGeneratingLinkedIn(true);
      toast.info("Synthesizing recruiter-optimized LinkedIn profile...");

      const res = await fetch("/api/ai/linkedin-optimizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeContent: content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setLinkedinResult(data);
      toast.success("LinkedIn profile assets generated!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to optimize LinkedIn");
    } finally {
      setIsGeneratingLinkedIn(false);
    }
  };

  const handleGenerateAdvisor = async () => {
    try {
      setIsGeneratingAdvisor(true);
      toast.info("Analyzing labor market trends and career progression...");

      const res = await fetch("/api/ai/career-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeContent: content, targetRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Advisor failed");

      setAdvisorResult(data);
      toast.success("Career trajectory roadmap generated!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to generate roadmap");
    } finally {
      setIsGeneratingAdvisor(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(""), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200 pb-20">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
              <Compass className="w-4 h-4" />
            </div>
            <h1 className="text-sm font-bold text-white">Career Acceleration & LinkedIn Hub</h1>
          </div>
        </div>

        <Link
          href="/editor"
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Back to Editor
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab("linkedin")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "linkedin"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn Profile Optimizer</span>
          </button>

          <button
            onClick={() => setActiveTab("advisor")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "advisor"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Career Path & Skill Gap Roadmap</span>
          </button>
        </div>

        {/* TAB 1: LINKEDIN OPTIMIZER */}
        {activeTab === "linkedin" && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Transform Your Resume into a Top 1% LinkedIn Profile</span>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generates algorithmic search headlines, story-driven About sections, and high-ranking skill tags.
                </p>
              </div>

              <button
                onClick={handleGenerateLinkedIn}
                disabled={isGeneratingLinkedIn}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingLinkedIn ? "Synthesizing Profile..." : "Optimize My LinkedIn"}</span>
              </button>
            </div>

            {linkedinResult && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Headlines */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    High-Converting Recruiter Headlines
                  </h3>
                  <div className="space-y-2.5">
                    {linkedinResult.headlineOptions.map((h, i) => (
                      <div
                        key={i}
                        className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                      >
                        <p className="text-slate-200 font-medium">{h}</p>
                        <button
                          onClick={() => copyToClipboard(h, `h-${i}`)}
                          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 shrink-0"
                          title="Copy Headline"
                        >
                          {copiedKey === `h-${i}` ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* About Section */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Story-Driven &quot;About&quot; Narrative
                    </h3>
                    <button
                      onClick={() => copyToClipboard(linkedinResult.aboutSection, "about")}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
                    >
                      {copiedKey === "about" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedKey === "about" ? "Copied" : "Copy About"}</span>
                    </button>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {linkedinResult.aboutSection}
                  </div>
                </div>

                {/* Top Skills */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recommended Top 15 Algorithmic Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {linkedinResult.suggestedTopSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-blue-950/40 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CAREER PATH & SKILL GAP ADVISOR */}
        {activeTab === "advisor" && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>AI Career Strategist & Skill Gap Roadmap</span>
                  <Compass className="w-4 h-4 text-indigo-400" />
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculates adjacent high-growth roles, salary benchmarks, and actionable timeline milestones.
                </p>
              </div>

              <button
                onClick={handleGenerateAdvisor}
                disabled={isGeneratingAdvisor}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>{isGeneratingAdvisor ? "Analyzing Trajectory..." : "Generate My Career Roadmap"}</span>
              </button>
            </div>

            {advisorResult && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Target Next-Level Roles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {advisorResult.targetRoles.map((role, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3"
                    >
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold uppercase">
                        {role.transitionDifficulty} Transition
                      </span>
                      <h3 className="font-bold text-sm text-white">{role.title}</h3>
                      <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{role.salaryRangeEstimate}</span>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Readiness</span>
                          <span className="text-white font-bold">{role.readinessPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full"
                            style={{ width: `${role.readinessPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Phased Roadmap Timeline */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Phased Skill Acquisition & Milestone Timeline
                  </h3>
                  <div className="space-y-4">
                    {advisorResult.roadmap.map((step, i) => (
                      <div
                        key={i}
                        className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                          <Calendar className="w-4 h-4" />
                          <span>{step.timeframe} — {step.focusArea}</span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-300 pl-4 list-disc">
                          {step.actionItems.map((item, itIdx) => (
                            <li key={itIdx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
