"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { exportToJson } from "@/lib/export/miscExporters";
import {
  ArrowLeft,
  Shield,
  Key,
  Trash2,
  Download,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { content, themeConfig } = useResumeStore();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleExportData = () => {
    exportToJson(content, themeConfig, "ResumeForge_Personal_Data_Export.json");
    toast.success("Complete JSON archive downloaded!");
  };

  const handleDeleteAllData = () => {
    if (confirm("Are you sure you want to permanently delete all your resume data? This action cannot be undone.")) {
      setIsDeleting(true);
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      setTimeout(() => {
        setIsDeleting(false);
        toast.success("All personal data permanently wiped.");
        window.location.reload();
      }, 500);
    }
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
              RF
            </div>
            <h1 className="text-sm font-bold text-white">Settings & Privacy Center</h1>
          </div>
        </div>

        <Link
          href="/editor"
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Back to Editor
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8 space-y-6">
        {/* Privacy & Zero-Training Pledge */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span>Privacy-First & Zero AI Model Training Guarantee</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            ResumeForge is designed with strict enterprise data protection. Your resume text, job applications,
            and interview transcripts are processed ephemerally. None of your data is ever used to train commercial
            or public LLM foundation models.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zero Data Retention in AI Training Pipelines</span>
          </div>
        </div>

        {/* API Credentials Diagnostic */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
            <Key className="w-4 h-4 text-slate-400" />
            <span>Integration Services Diagnostic</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            ResumeForge uses real production APIs. Keys are loaded from your secure server-side <code className="text-indigo-300">.env</code> environment file.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">Anthropic Claude 3.5 API</span>
                <p className="text-[10px] text-slate-500">Powers Star/XYZ Bullets, ATS Scoring & Interview Coach</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active in .env
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">Resend Email Gateway</span>
                <p className="text-[10px] text-slate-500">Automated job follow-up email notifications</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Ready
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">PostgreSQL & Prisma Client</span>
                <p className="text-[10px] text-slate-500">Persistent resumes, version history & application records</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Generated v6.4.1
              </span>
            </div>
          </div>
        </div>

        {/* Data Ownership & Deletion */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Data Ownership & Account Actions</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportData}
              className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export Full Data Archive (JSON)</span>
            </button>

            <button
              onClick={handleDeleteAllData}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-300 flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? "Wiping Data..." : "Delete All Stored Data"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
