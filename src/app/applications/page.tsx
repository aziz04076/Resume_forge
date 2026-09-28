"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  ArrowLeft,
  Plus,
  MapPin,
  Trash2,
  DollarSign,
  Bell,
  X,
  Sparkles,
  Copy,
  Check,
  BarChart2,
} from "lucide-react";
import { toast } from "sonner";

export type ApplicationStatus = "SAVED" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

export interface JobApp {
  id: string;
  company: string;
  position: string;
  location?: string;
  salary?: string;
  status: ApplicationStatus;
  jobUrl?: string;
  appliedDate?: string;
  followUpDate?: string;
  notes?: string;
  resumeVersion?: string;
}

const STAGES: { id: ApplicationStatus; title: string; color: string; border: string }[] = [
  { id: "SAVED", title: "Wishlist / Saved", color: "text-slate-400", border: "border-slate-800" },
  { id: "APPLIED", title: "Applied", color: "text-blue-400", border: "border-blue-900/40" },
  { id: "INTERVIEW", title: "Interviewing", color: "text-amber-400", border: "border-amber-900/40" },
  { id: "OFFER", title: "Offer Received", color: "text-emerald-400", border: "border-emerald-900/40" },
  { id: "REJECTED", title: "Archived", color: "text-rose-400", border: "border-rose-900/40" },
];

function DraggableCard({
  app,
  onDelete,
  onOpenEmailModal,
}: {
  app: JobApp;
  onDelete: (id: string) => void;
  onOpenEmailModal: (app: JobApp) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
    data: { app },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3.5 bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-xl shadow cursor-grab active:cursor-grabbing space-y-2.5 transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-bold text-xs text-white leading-tight">{app.position}</h4>
          <span className="text-[11px] font-semibold text-indigo-400">{app.company}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(app.id);
          }}
          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
        {app.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-500" />
            <span>{app.location}</span>
          </span>
        )}
        {app.salary && (
          <span className="flex items-center gap-0.5 text-emerald-400 font-mono">
            <DollarSign className="w-3 h-3" />
            <span>{app.salary}</span>
          </span>
        )}
      </div>

      {app.notes && (
        <p className="text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded-lg line-clamp-2 leading-relaxed">
          {app.notes}
        </p>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
        {app.followUpDate ? (
          <span className="flex items-center gap-1 text-amber-400">
            <Bell className="w-3 h-3" />
            <span>Follow-up: {app.followUpDate}</span>
          </span>
        ) : (
          <span className="text-slate-500">v{app.resumeVersion || "1.0"}</span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenEmailModal(app);
          }}
          className="flex items-center gap-1 px-2 py-0.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded text-[10px] font-medium transition-colors"
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>Draft Email</span>
        </button>
      </div>
    </div>
  );
}

function DroppableColumn({
  stage,
  apps,
  onDelete,
  onOpenEmailModal,
}: {
  stage: (typeof STAGES)[0];
  apps: JobApp[];
  onDelete: (id: string) => void;
  onOpenEmailModal: (app: JobApp) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl bg-slate-950/40 border ${stage.border} flex flex-col min-h-[500px] transition-colors ${
        isOver ? "bg-indigo-950/20 border-indigo-500/50" : ""
      }`}
    >
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`font-bold text-xs ${stage.color}`}>{stage.title}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-mono">
            {apps.length}
          </span>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
        {apps.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-[11px] text-slate-600 border border-dashed border-slate-800/80 rounded-xl">
            Drop cards here
          </div>
        ) : (
          apps.map((app) => (
            <DraggableCard
              key={app.id}
              app={app}
              onDelete={onDelete}
              onOpenEmailModal={onOpenEmailModal}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApp[]>([
    {
      id: "app-1",
      company: "Stripe",
      position: "Senior Full-Stack Engineer",
      location: "San Francisco, CA (Hybrid)",
      salary: "$185k - $220k",
      status: "INTERVIEW",
      jobUrl: "https://stripe.com/jobs",
      appliedDate: "2026-09-15",
      followUpDate: "2026-10-02",
      notes: "Passed tech screen. Next round: Distributed System Design.",
      resumeVersion: "2.1",
    },
    {
      id: "app-2",
      company: "Linear",
      position: "Product Infrastructure Engineer",
      location: "Remote",
      salary: "$190k - $230k",
      status: "APPLIED",
      jobUrl: "https://linear.app/careers",
      appliedDate: "2026-09-22",
      followUpDate: "2026-10-06",
      notes: "Submitted tailored minimal ATS resume.",
      resumeVersion: "2.0",
    },
    {
      id: "app-3",
      company: "Vercel",
      position: "Senior Next.js Developer",
      location: "Remote",
      salary: "$180k - $210k",
      status: "OFFER",
      jobUrl: "https://vercel.com/careers",
      appliedDate: "2026-09-01",
      notes: "Offer in hand! Base $195k, equity $50k/yr. Negotiating sign-on bonus.",
      resumeVersion: "2.1",
    },
    {
      id: "app-4",
      company: "Datadog",
      position: "Backend Performance Engineer",
      location: "New York, NY",
      salary: "$175k - $205k",
      status: "SAVED",
      notes: "Saved for referral via Stanford alumni connection.",
      resumeVersion: "1.0",
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [emailModalApp, setEmailModalApp] = useState<JobApp | null>(null);
  const [emailDraft, setEmailDraft] = useState<{ subject: string; body: string } | null>(null);
  const [isDraftingEmail, setIsDraftingEmail] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // New Application Form State
  const [newCompany, setNewCompany] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newSalary, setNewSalary] = useState("");
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("SAVED");
  const [newFollowUp, setNewFollowUp] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const appId = String(active.id);
    const newStage = String(over.id) as ApplicationStatus;

    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStage } : app))
    );
    toast.success(`Application moved to ${newStage}!`);
  };

  const handleDelete = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    toast.success("Application deleted");
  };

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newPosition) {
      toast.error("Company and Position are required");
      return;
    }

    const newApp: JobApp = {
      id: `app-${Date.now()}`,
      company: newCompany,
      position: newPosition,
      location: newLocation,
      salary: newSalary,
      status: newStatus,
      followUpDate: newFollowUp,
      notes: newNotes,
      resumeVersion: "2.1",
    };

    setApplications([newApp, ...applications]);
    setIsAddModalOpen(false);
    setNewCompany("");
    setNewPosition("");
    setNewLocation("");
    setNewSalary("");
    setNewNotes("");
    toast.success("Job application saved to pipeline!");
  };

  const handleDraftEmail = async (app: JobApp, type = "THANK_YOU_POST_INTERVIEW") => {
    try {
      setIsDraftingEmail(true);
      toast.info(`Drafting high-converting ${type.toLowerCase().replace(/_/g, " ")} email...`);

      const res = await fetch("/api/ai/follow-up-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: app.company,
          position: app.position,
          notes: app.notes,
          emailType: type,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate email");

      setEmailDraft({ subject: data.subject, body: data.body });
      toast.success("Follow-up email ready!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to draft email");
    } finally {
      setIsDraftingEmail(false);
    }
  };

  // Metrics
  const total = applications.length;
  const interviewing = applications.filter((a) => a.status === "INTERVIEW").length;
  const offers = applications.filter((a) => a.status === "OFFER").length;
  const callbackRate = total > 0 ? (((interviewing + offers) / total) * 100).toFixed(0) : "0";

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
          <div className="font-bold text-sm text-white">Kanban Job Tracker & Follow-Up Studio</div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Track New Job</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        {/* Pipeline Analytics & Version Comparison */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Total Applications</div>
            <div className="text-2xl font-bold text-white mt-1">{total}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-amber-400 uppercase font-mono">Active Interviews</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{interviewing}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-emerald-400 uppercase font-mono">Offers In Hand</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{offers}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-indigo-400 uppercase font-mono">Interview Conversion Rate</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">{callbackRate}%</div>
          </div>
        </div>

        {/* Version Performance Analytics Banner */}
        <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-white">Resume Version A/B Analytics</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Version <strong className="text-indigo-300">v2.1 (Tailored STAR)</strong> yields a{" "}
                <strong className="text-emerald-400">67% interview rate</strong> vs 25% on v1.0.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-900 text-emerald-400 border border-emerald-500/20">
              v2.1: 2 Interviews / 3 Sent
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800">
              v1.0: 1 Saved
            </span>
          </div>
        </div>

        {/* Drag and Drop Kanban Board */}
        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {STAGES.map((stage) => (
              <DroppableColumn
                key={stage.id}
                stage={stage}
                apps={applications.filter((a) => a.status === stage.id)}
                onDelete={handleDelete}
                onOpenEmailModal={(app) => {
                  setEmailModalApp(app);
                  handleDraftEmail(app, "THANK_YOU_POST_INTERVIEW");
                }}
              />
            ))}
          </div>
        </DndContext>
      </div>

      {/* Add Job Application Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Track Job Application</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateApp} className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Stripe, OpenAI, Google"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Position</label>
                <input
                  type="text"
                  required
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Stage</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Follow-Up Date</label>
                  <input
                    type="date"
                    value={newFollowUp}
                    onChange={(e) => setNewFollowUp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Salary Range</label>
                <input
                  type="text"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  placeholder="e.g. $180k - $210k"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Referral contacts, interview stages, or topics discussed..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all mt-2"
              >
                Save Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Email Draft Modal */}
      {emailModalApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">
                  AI Follow-Up Email: {emailModalApp.company}
                </h3>
              </div>
              <button onClick={() => setEmailModalApp(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email type buttons */}
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => handleDraftEmail(emailModalApp, "THANK_YOU_POST_INTERVIEW")}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Thank-You (Post-Interview)
              </button>
              <button
                onClick={() => handleDraftEmail(emailModalApp, "STATUS_FOLLOW_UP")}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Status Check-In
              </button>
              <button
                onClick={() => handleDraftEmail(emailModalApp, "OFFER_NEGOTIATION")}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Offer Negotiation
              </button>
            </div>

            {isDraftingEmail ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span>Crafting executive follow-up email...</span>
              </div>
            ) : emailDraft ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-[10px] text-slate-500 font-mono">SUBJECT:</div>
                  <div className="text-xs font-semibold text-white">{emailDraft.subject}</div>
                  <div className="border-t border-slate-800 pt-2 text-[10px] text-slate-500 font-mono">BODY:</div>
                  <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                    {emailDraft.body}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${emailDraft.subject}\n\n${emailDraft.body}`);
                      setCopiedEmail(true);
                      toast.success("Email copied to clipboard!");
                      setTimeout(() => setCopiedEmail(false), 2000);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? "Copied" : "Copy to Clipboard"}</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
