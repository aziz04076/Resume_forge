"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useResumeStore } from "@/lib/store/useResumeStore";
import {
  LinkedInOptimizerResponse,
  CareerAdvisorResponse,
  SalaryCoachResponse,
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
  Calculator,
} from "lucide-react";
import { toast } from "sonner";

export default function CareerHubPage() {
  const { content, targetRole } = useResumeStore();

  const [activeTab, setActiveTab] = useState<"linkedin" | "advisor" | "salary">("linkedin");

  // LinkedIn Optimizer State
  const [isGeneratingLinkedIn, setIsGeneratingLinkedIn] = useState<boolean>(false);
  const [linkedinResult, setLinkedinResult] = useState<LinkedInOptimizerResponse | null>(null);
  const [copiedKey, setCopiedKey] = useState<string>("");

  // Career Advisor State
  const [isGeneratingAdvisor, setIsGeneratingAdvisor] = useState<boolean>(false);
  const [advisorResult, setAdvisorResult] = useState<CareerAdvisorResponse | null>(null);

  // Salary Coach State
  const [isGeneratingSalary, setIsGeneratingSalary] = useState<boolean>(false);
  const [salaryResult, setSalaryResult] = useState<SalaryCoachResponse | null>(null);
  const [offerRole, setOfferRole] = useState(targetRole || "Senior Software Engineer");
  const [offerLocation, setOfferLocation] = useState("San Francisco, CA / Remote");
  const [offerDetails, setOfferDetails] = useState("Base $165,000, $40,000/yr RSUs, 10% annual bonus, $15,000 sign-on");

  // Offer Comparison Calculator State
  const [calcA, setCalcA] = useState({ base: 165000, equityYear: 40000, bonusPercent: 10, signOn: 15000 });
  const [calcB, setCalcB] = useState({ base: 180000, equityYear: 30000, bonusPercent: 15, signOn: 25000 });

  const totalA = calcA.base + (calcA.base * calcA.bonusPercent) / 100 + calcA.equityYear + calcA.signOn;
  const totalB = calcB.base + (calcB.base * calcB.bonusPercent) / 100 + calcB.equityYear + calcB.signOn;

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
      toast.info("Formulating 6-month career advancement roadmap...");

      const res = await fetch("/api/ai/career-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent: content,
          targetRole: targetRole || "Engineering Lead",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setAdvisorResult(data);
      toast.success("Strategic career progression roadmap formulated!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to formulate advisor roadmap");
    } finally {
      setIsGeneratingAdvisor(false);
    }
  };

  const handleGenerateSalary = async () => {
    try {
      setIsGeneratingSalary(true);
      toast.info("Analyzing compensation benchmarks and negotiation leverage...");

      const res = await fetch("/api/ai/salary-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleTitle: offerRole,
          location: offerLocation,
          currentOffer: offerDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Salary coaching failed");

      setSalaryResult(data);
      toast.success("Salary negotiation playbooks ready!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to run salary coach");
    } finally {
      setIsGeneratingSalary(false);
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
      {/* Top Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/editor"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Editor
          </Link>
          <span className="text-slate-600">/</span>
          <div className="font-bold text-sm text-white">Career Acceleration & Compensation Hub</div>
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
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
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

          <button
            onClick={() => setActiveTab("salary")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "salary"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Salary & Offer Coach</span>
          </button>
        </div>

        {/* Tab 1: LinkedIn Optimizer */}
        {activeTab === "linkedin" && (
          <div className="space-y-6">
            {!linkedinResult ? (
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto">
                  <Linkedin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Generate High-Converting LinkedIn Profile Assets</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                    Extracts recruiter search keywords and executive storytelling from your resume to create headlines and an About narrative.
                  </p>
                </div>
                <button
                  onClick={handleGenerateLinkedIn}
                  disabled={isGeneratingLinkedIn}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mx-auto transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingLinkedIn ? "Synthesizing with Claude..." : "Generate LinkedIn Assets"}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Headlines */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Recruiter-Optimized Headlines
                    </h3>
                    <button
                      onClick={handleGenerateLinkedIn}
                      disabled={isGeneratingLinkedIn}
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Regenerate
                    </button>
                  </div>
                  <div className="space-y-2">
                    {linkedinResult.headlineOptions.map((hl: string, i: number) => (
                      <div
                        key={i}
                        className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                      >
                        <span className="text-slate-200 font-medium">{hl}</span>
                        <button
                          onClick={() => copyToClipboard(hl, `hl-${i}`)}
                          className="text-slate-400 hover:text-white p-1"
                        >
                          {copiedKey === `hl-${i}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
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
                      Storytelling &quot;About&quot; Narrative
                    </h3>
                    <button
                      onClick={() => copyToClipboard(linkedinResult.aboutSection, "about")}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      {copiedKey === "about" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Full About</span>
                    </button>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                    {linkedinResult.aboutSection}
                  </div>
                </div>

                {/* Algorithmic Skills */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Top 15 Skills for Recruiter Keyword Search
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {linkedinResult.suggestedTopSkills.map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-indigo-300"
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

        {/* Tab 2: Career Advisor */}
        {activeTab === "advisor" && (
          <div className="space-y-6">
            {!advisorResult ? (
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Generate 6-Month Phased Progression Roadmap</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                    AI analyzes current skills against next-level market compensation, identifying target roles and exact milestones.
                  </p>
                </div>
                <button
                  onClick={handleGenerateAdvisor}
                  disabled={isGeneratingAdvisor}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mx-auto transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingAdvisor ? "Analyzing Trajectory with Claude..." : "Formulate Career Roadmap"}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {advisorResult.targetRoles.map((role, i) => (
                    <div
                      key={i}
                      className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3"
                    >
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {role.transitionDifficulty} Transition
                      </span>
                      <h4 className="font-bold text-sm text-white">{role.title}</h4>
                      <div className="text-xs text-emerald-400 font-mono font-semibold">
                        {role.salaryRangeEstimate}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Skill Readiness</span>
                          <span>{role.readinessPercentage}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${role.readinessPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

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

        {/* Tab 3: Salary & Offer Coach */}
        {activeTab === "salary" && (
          <div className="space-y-6">
            {/* Offer Comparison Calculator */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Interactive Offer Comparison Calculator</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">1st-Year Total Compensation</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Offer A */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-400">Offer A (Current / Baseline)</span>
                    <span className="text-base font-bold font-mono text-white">
                      ${totalA.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Base Salary ($)</label>
                      <input
                        type="number"
                        value={calcA.base}
                        onChange={(e) => setCalcA({ ...calcA, base: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Equity / Year ($)</label>
                      <input
                        type="number"
                        value={calcA.equityYear}
                        onChange={(e) => setCalcA({ ...calcA, equityYear: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Bonus (%)</label>
                      <input
                        type="number"
                        value={calcA.bonusPercent}
                        onChange={(e) => setCalcA({ ...calcA, bonusPercent: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Sign-On Bonus ($)</label>
                      <input
                        type="number"
                        value={calcA.signOn}
                        onChange={(e) => setCalcA({ ...calcA, signOn: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Offer B */}
                <div className="p-4 bg-slate-950 border border-emerald-900/40 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-400">Offer B (Counter / Competing)</span>
                    <span className="text-base font-bold font-mono text-emerald-400">
                      ${totalB.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Base Salary ($)</label>
                      <input
                        type="number"
                        value={calcB.base}
                        onChange={(e) => setCalcB({ ...calcB, base: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Equity / Year ($)</label>
                      <input
                        type="number"
                        value={calcB.equityYear}
                        onChange={(e) => setCalcB({ ...calcB, equityYear: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Bonus (%)</label>
                      <input
                        type="number"
                        value={calcB.bonusPercent}
                        onChange={(e) => setCalcB({ ...calcB, bonusPercent: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Sign-On Bonus ($)</label>
                      <input
                        type="number"
                        value={calcB.signOn}
                        onChange={(e) => setCalcB({ ...calcB, signOn: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-lg flex items-center justify-between">
                <span>
                  Offer B delivers a{" "}
                  <strong className="text-emerald-400">
                    +${Math.abs(totalB - totalA).toLocaleString()} (
                    {(((totalB - totalA) / totalA) * 100).toFixed(1)}%)
                  </strong>{" "}
                  differential in Year 1.
                </span>
              </div>
            </div>

            {/* AI Negotiation Script Generator Form */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">AI Negotiation Playbook & Counter-Offer Scripts</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Target Role</label>
                  <input
                    type="text"
                    value={offerRole}
                    onChange={(e) => setOfferRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Location / Market</label>
                  <input
                    type="text"
                    value={offerLocation}
                    onChange={(e) => setOfferLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Offer Details & Desired Target</label>
                <input
                  type="text"
                  value={offerDetails}
                  onChange={(e) => setOfferDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <button
                onClick={handleGenerateSalary}
                disabled={isGeneratingSalary}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingSalary ? "Generating Negotiation Scripts..." : "Generate Custom Negotiation Playbook"}</span>
              </button>
            </div>

            {/* Generated Scripts Display */}
            {salaryResult && (
              <div className="space-y-6">
                {/* Market Benchmark */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Market Compensation Percentiles ({salaryResult.location})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-mono">25th Percentile</div>
                      <div className="text-sm font-bold text-white mt-1">{salaryResult.marketBenchmark.percentile25}</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-mono">50th (Median)</div>
                      <div className="text-sm font-bold text-indigo-400 mt-1">{salaryResult.marketBenchmark.median}</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-mono">75th Percentile</div>
                      <div className="text-sm font-bold text-emerald-400 mt-1">{salaryResult.marketBenchmark.percentile75}</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-mono">90th (Top Tier)</div>
                      <div className="text-sm font-bold text-purple-400 mt-1">{salaryResult.marketBenchmark.percentile90}</div>
                    </div>
                  </div>
                </div>

                {/* Ready to Use Scripts */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Custom Negotiation Email & Phone Scripts
                  </h4>
                  <div className="space-y-4">
                    {salaryResult.scripts.map((script, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{script.scenario}</span>
                          <button
                            onClick={() => copyToClipboard(`Subject: ${script.subject}\n\n${script.body}`, `script-${idx}`)}
                            className="text-xs text-indigo-400 hover:text-white flex items-center gap-1"
                          >
                            {copiedKey === `script-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>Copy Script</span>
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium font-sans">
                          Subject: {script.subject}
                        </div>
                        <p className="text-slate-300 leading-relaxed font-sans whitespace-pre-line bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                          {script.body}
                        </p>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          Psychological Tactic: {script.tactics}
                        </div>
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
