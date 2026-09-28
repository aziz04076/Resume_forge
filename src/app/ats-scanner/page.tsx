"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { JDMatcherResponse, ATSSimulatorResponse } from "@/schemas/ai.schema";
import {
  ArrowLeft,
  ShieldCheck,
  Target,
  FileSearch,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function ATSScannerPage() {
  const router = useRouter();
  const { content, loadResume, themeConfig, targetRole, setTargetRole } = useResumeStore();

  const [activeTab, setActiveTab] = useState<"matcher" | "simulator" | "parser">("matcher");

  // JD Matcher State
  const [jobTitle, setJobTitle] = useState<string>(targetRole || "Senior Software Engineer");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<JDMatcherResponse | null>(null);

  // ATS Simulator State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<ATSSimulatorResponse | null>(null);

  // Resume Parser State
  const [rawResumeText, setRawResumeText] = useState<string>("");
  const [isParsing, setIsParsing] = useState<boolean>(false);

  // Handler 1: JD Matcher
  const handleRunJDMatch = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a Job Description first");
      return;
    }

    try {
      setIsMatching(true);
      toast.info("Analyzing resume against Job Description...");

      const res = await fetch("/api/ai/jd-matcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent: content,
          jobDescription,
          jobTitle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze match");

      setMatchResult(data);
      toast.success("Match analysis completed!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to run matcher");
    } finally {
      setIsMatching(false);
    }
  };

  // Handler 2: ATS Simulator
  const handleRunSimulator = async () => {
    try {
      setIsSimulating(true);
      toast.info("Simulating enterprise ATS algorithms (Taleo, Workday, Greenhouse)...");

      const res = await fetch("/api/ai/ats-simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent: content,
          targetRole: jobTitle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Simulation failed");

      setSimResult(data);
      toast.success("ATS Simulation completed!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Simulation failed");
    } finally {
      setIsSimulating(false);
    }
  };

  // Handler 3: Resume Parser
  const handleParseResume = async () => {
    if (!rawResumeText.trim() || rawResumeText.length < 50) {
      toast.error("Please paste at least 50 characters of resume text");
      return;
    }

    try {
      setIsParsing(true);
      toast.info("Extracting structured candidate data with AI...");

      const res = await fetch("/api/ai/resume-parser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: rawResumeText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Parser failed");

      loadResume({
        title: `${data.content.personalInfo.fullName || "Imported"} Resume`,
        targetRole: data.content.personalInfo.jobTitle || targetRole,
        content: data.content,
        themeConfig,
      });

      toast.success("Resume parsed and imported into builder!");
      router.push("/editor");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Parsing failed");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200 pb-20">
      {/* Top Bar */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              RF
            </div>
            <h1 className="text-sm font-bold text-white">ATS Simulator & Job Matcher</h1>
          </div>
        </div>

        <Link
          href="/editor"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
        >
          <span>Open Editor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab("matcher")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "matcher"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Job Description Matcher</span>
          </button>

          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "simulator"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ATS Algorithm Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab("parser")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "parser"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Resume Parser & Auto-fill</span>
          </button>
        </div>

        {/* TAB 1: JD MATCHER */}
        {activeTab === "matcher" && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <span>Compare Resume Against Any Job Description</span>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Paste the full text of a target job posting to uncover missing ATS keywords, critical skill gaps,
                and your exact match probability.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Position Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => {
                      setJobTitle(e.target.value);
                      setTargetRole(e.target.value);
                    }}
                    placeholder="e.g. Staff Distributed Systems Engineer"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Paste Job Description</label>
                  <textarea
                    rows={6}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job post requirements, responsibilities, and qualifications..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder-slate-600 outline-none leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleRunJDMatch}
                  disabled={isMatching || !jobDescription.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
                >
                  <FileSearch className="w-4 h-4" />
                  <span>{isMatching ? "Analyzing with Claude API..." : "Calculate ATS Match Score"}</span>
                </button>
              </div>
            </div>

            {/* Match Results */}
            {matchResult && (
              <div className="p-6 bg-slate-900 border border-indigo-500/30 rounded-2xl space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 font-semibold">
                      ATS Match Evaluation
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{jobTitle}</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                      {matchResult.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
                    <div
                      className={`text-3xl font-extrabold ${
                        matchResult.matchScore >= 80
                          ? "text-emerald-400"
                          : matchResult.matchScore >= 60
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {matchResult.matchScore}%
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <div className="font-semibold text-white">Match Score</div>
                      <div>{matchResult.matchScore >= 80 ? "High Callback Probability" : "Requires Tailoring"}</div>
                    </div>
                  </div>
                </div>

                {/* Keywords Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Matching Keywords */}
                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-4 h-4" /> Matching Keywords ({matchResult.matchingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.matchingKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded text-[11px]"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl">
                    <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-4 h-4" /> Missing Keywords ({matchResult.missingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.missingKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-2 py-0.5 rounded text-[11px]"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-indigo-400 mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" /> Recommended Adjustments to Reach 90%+
                  </h4>
                  <ul className="space-y-1.5">
                    {matchResult.tailoredSuggestions.map((sug, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ATS SIMULATOR */}
        {activeTab === "simulator" && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Enterprise ATS Health Audit</h2>
                <p className="text-xs text-slate-400">
                  Simulates parse rates across Greenhouse, Taleo, Workday, and Lever parsers.
                </p>
              </div>

              <button
                onClick={handleRunSimulator}
                disabled={isSimulating}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSimulating ? "Scanning Algorithms..." : "Run Full ATS Scan"}</span>
              </button>
            </div>

            {simResult && (
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">Overall ATS Score: {simResult.overallScore}/100</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{simResult.headlineAssessment}</p>
                  </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {simResult.categories.map((cat, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-200">{cat.category}</span>
                        <span className="font-mono text-indigo-400">{cat.score}%</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{cat.feedback}</p>
                    </div>
                  ))}
                </div>

                {/* Actionable Fixes */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Prioritized Fixes
                  </h4>
                  <div className="space-y-2">
                    {simResult.actionableFixes.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3 text-xs"
                      >
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                            item.priority === "high"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {item.priority}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-200">{item.issue}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">{item.fix}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RESUME PARSER */}
        {activeTab === "parser" && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white mb-1">AI Resume Extractor & Importer</h2>
              <p className="text-xs text-slate-400">
                Paste your existing resume text to extract education, work history, and skills directly into the
                ResumeForge live editor.
              </p>
            </div>

            <textarea
              rows={12}
              value={rawResumeText}
              onChange={(e) => setRawResumeText(e.target.value)}
              placeholder="Paste raw text copied from your existing PDF or Word resume here..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 outline-none leading-relaxed font-mono"
            />

            <button
              onClick={handleParseResume}
              disabled={isParsing || rawResumeText.length < 50}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>{isParsing ? "Extracting Structured JSON..." : "Parse & Auto-Fill Builder"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
