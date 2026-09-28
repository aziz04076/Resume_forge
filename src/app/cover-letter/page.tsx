"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { CoverLetterResponse } from "@/schemas/ai.schema";
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Copy,
  Check,
  Download,
  Building2,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { saveAs } from "file-saver";

export default function CoverLetterPage() {
  const { content, targetRole } = useResumeStore();

  const [companyName, setCompanyName] = useState<string>("Stripe");
  const [roleTitle, setRoleTitle] = useState<string>(targetRole || "Senior Software Engineer");
  const [tone, setTone] = useState<string>("confident and metric-driven");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [coverLetter, setCoverLetter] = useState<CoverLetterResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const tones = [
    { label: "Confident & Metric-Driven", value: "confident and metric-driven" },
    { label: "Executive & Authoritative", value: "executive and authoritative" },
    { label: "Startup & Fast-Paced", value: "energetic, entrepreneurial, and impact-focused" },
    { label: "Warm & Collaborative", value: "warm, humble, and relationship-centric" },
  ];

  const handleGenerate = async () => {
    if (!companyName.trim() || !roleTitle.trim()) {
      toast.error("Please enter both Company and Target Role");
      return;
    }

    try {
      setIsLoading(true);
      toast.info("Synthesizing tailored cover letter with Claude 3.5 Sonnet...");

      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent: content,
          companyName,
          roleTitle,
          tone,
          jobDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setCoverLetter(data);
      toast.success("Cover letter crafted!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to generate cover letter");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetter) return;
    const fullText = `${coverLetter.salutation}\n\n${coverLetter.body}\n\n${coverLetter.closing}\n${content.personalInfo.fullName}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success("Copied cover letter to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!coverLetter) return;
    const fullText = `${coverLetter.salutation}\n\n${coverLetter.body}\n\n${coverLetter.closing}\n${content.personalInfo.fullName}`;
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `Cover_Letter_${companyName.replace(/\s+/g, "_")}.txt`);
    toast.success("Cover letter downloaded!");
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
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-sm font-bold text-white">AI Tailored Cover Letter Generator</h1>
          </div>
        </div>

        <Link
          href="/editor"
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Back to Editor
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Application Parameters</span>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Bridges your actual accomplishments directly into the prospective employer&apos;s mission.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" /> Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. OpenAI, Stripe, Figma"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" /> Target Role
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tone & Voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                {tones.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Job Description / Requirements (Optional)
              </label>
              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key responsibilities to align specific keywords..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder-slate-600 outline-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !companyName.trim()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? "Generating with Claude 3.5..." : "Generate Cover Letter"}</span>
            </button>
          </div>
        </div>

        {/* Right Output Document */}
        <div className="lg:col-span-7">
          <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl min-h-[600px] flex flex-col justify-between relative border border-slate-200">
            {coverLetter ? (
              <div className="space-y-6 text-xs leading-relaxed font-sans">
                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pb-4 border-b border-slate-100">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Text"}</span>
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TXT</span>
                  </button>
                </div>

                {/* Candidate Contact */}
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{content.personalInfo.fullName}</h3>
                  <div className="text-[11px] text-slate-500">
                    {[content.personalInfo.email, content.personalInfo.phone, content.personalInfo.location]
                      .filter(Boolean)
                      .join(" • ")}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                {/* Salutation */}
                <div className="font-semibold text-slate-800">{coverLetter.salutation}</div>

                {/* Body Paragraphs */}
                <div className="whitespace-pre-line text-slate-800 leading-normal text-justify">
                  {coverLetter.body}
                </div>

                {/* Closing */}
                <div className="pt-4 space-y-1">
                  <div>{coverLetter.closing}</div>
                  <div className="font-bold text-slate-900">{content.personalInfo.fullName}</div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <FileText className="w-12 h-12 text-slate-300 stroke-[1.5] mb-3" />
                <h4 className="font-semibold text-slate-700 text-sm">Your Cover Letter Will Appear Here</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Fill in your target company and position on the left, then click Generate to produce a personalized,
                  high-impact letter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
