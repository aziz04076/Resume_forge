"use client";

import React, { useEffect, useState, use } from "react";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";
import { ResumeTemplateDispatcher } from "@/templates/ResumeTemplateDispatcher";
import { MessageSquare, Lock, Eye, QrCode, Send, Download } from "lucide-react";
import { toast } from "sonner";
import { exportToClientPdf } from "@/lib/export/pdfExporter";

interface PublicResumeData {
  id: string;
  title: string;
  targetRole: string;
  templateId: string;
  themeConfig: ThemeConfig;
  content: ResumeContent;
  healthScore: number;
  viewCount: number;
  comments: Array<{
    id: string;
    authorName: string;
    sectionKey: string;
    text: string;
    createdAt: string;
  }>;
}

export default function PublicSharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [data, setData] = useState<PublicResumeData | null>(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showQr, setShowQr] = useState(false);
  const [activeCommentSection, setActiveCommentSection] = useState("general");
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    const loadPublicResume = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/public/resume/${token}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to load shared resume");
        }

        if (json.requiresPassword) {
          setRequiresPassword(true);
        } else {
          setData(json.resume);
        }
      } catch (err) {
        console.error(err);
        toast.error(err instanceof Error ? err.message : "Error loading resume");
      } finally {
        setIsLoading(false);
      }
    };

    loadPublicResume();
  }, [token]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/public/resume/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Incorrect password");
      }
      setData(json.resume);
      setRequiresPassword(false);
      toast.success("Access unlocked!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`/api/public/resume/${token}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: authorName || "Reviewer",
          sectionKey: activeCommentSection,
          text: commentText,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to post comment");
      }

      if (data) {
        setData({
          ...data,
          comments: [json.comment, ...data.comments],
        });
      }
      setCommentText("");
      toast.success("Feedback posted successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post feedback");
    }
  };

  const handleDownloadPdf = async () => {
    if (!data) return;
    toast.info("Generating vector ATS PDF...");
    await exportToClientPdf(data.content, data.themeConfig, `${data.title || "Resume"}.pdf`);
    toast.success("PDF downloaded!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading verified career resume...</span>
        </div>
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Password Protected Resume</h2>
          <p className="text-xs text-slate-400">
            This candidate has secured this resume link with a password.
          </p>
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password..."
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Unlock Resume
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm">
        <span>This resume link is invalid or has expired.</span>
      </div>
    );
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : ""
  )}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 pb-20">
      {/* Top Banner */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            RF
          </div>
          <div>
            <div className="font-bold text-xs text-white">{data.content.personalInfo.fullName}</div>
            <div className="text-[10px] text-slate-400">{data.targetRole || data.content.personalInfo.jobTitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>{data.viewCount} views</span>
          </div>

          <button
            onClick={() => setShowQr(!showQr)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">QR Code</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* QR Code Modal Overlay */}
      {showQr && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 max-w-xs w-full shadow-2xl">
            <h3 className="font-bold text-sm text-white">Scan with Mobile</h3>
            <div className="p-3 bg-white rounded-xl inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="QR Code" className="w-40 h-40" />
            </div>
            <p className="text-[11px] text-slate-400">Instant direct access on any phone or tablet.</p>
            <button
              onClick={() => setShowQr(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Body */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Resume Rendered Sheet */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="w-full max-w-[800px] shadow-2xl rounded-sm overflow-hidden border border-slate-800 bg-white">
            <ResumeTemplateDispatcher
              content={data.content}
              themeConfig={{
                ...data.themeConfig,
                templateId: data.templateId || data.themeConfig?.templateId || "minimal-ats",
              }}
            />
          </div>
        </div>

        {/* Right: Mentor Review Mode & Comments */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">Mentor Review & Feedback</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Leave section-specific feedback for the candidate to review and incorporate.
            </p>

            <form onSubmit={handlePostComment} className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Your Name / Title</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Senior Recruiter @ Google"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Section</label>
                <select
                  value={activeCommentSection}
                  onChange={(e) => setActiveCommentSection(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="general">Overall Feedback</option>
                  <option value="summary">Professional Summary</option>
                  <option value="experience">Work Experience & Bullets</option>
                  <option value="skills">Technical Skills</option>
                  <option value="projects">Projects & Impact</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Feedback Note</label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="e.g. Quantify bullet #2 with the dollar volume or percentage latency..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow"
              >
                <Send className="w-3 h-3" />
                <span>Submit Feedback Note</span>
              </button>
            </form>
          </div>

          {/* Past Comments */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="font-semibold text-xs text-slate-300">
              Mentor Notes ({data.comments.length})
            </h4>
            {data.comments.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No feedback submitted yet. Be the first mentor to comment!</p>
            ) : (
              <div className="space-y-2.5">
                {data.comments.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">{c.authorName}</span>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400">
                        {c.sectionKey}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{c.text}</p>
                    <div className="text-[9px] text-slate-500 mt-1">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
