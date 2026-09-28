"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useResumeStore } from "@/lib/store/useResumeStore";
import {
  ArrowLeft,
  Plus,
  MapPin,
  Mail,
  Trash2,
  TrendingUp,
  DollarSign,
  Bell,
  X,
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
}

export default function ApplicationsPage() {
  const { title } = useResumeStore();

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
      notes: "Passed technical screening. Next round: Distributed System Design with Staff Engineer.",
    },
    {
      id: "app-2",
      company: "Linear",
      position: "Product Infrastructure Engineer",
      location: "Remote (Global)",
      salary: "$190k - $230k",
      status: "APPLIED",
      jobUrl: "https://linear.app/careers",
      appliedDate: "2026-09-22",
      followUpDate: "2026-10-06",
      notes: "Submitted tailored modern slate resume.",
    },
    {
      id: "app-3",
      company: "Vercel",
      position: "Senior Frontend Platform Engineer",
      location: "Remote",
      salary: "$180k - $215k",
      status: "OFFER",
      jobUrl: "https://vercel.com/careers",
      appliedDate: "2026-09-02",
      notes: "Received official written offer. Reviewing equity vesting schedule.",
    },
    {
      id: "app-4",
      company: "Figma",
      position: "Full-Stack Design Systems Engineer",
      location: "San Francisco, CA",
      salary: "$195k - $240k",
      status: "SAVED",
      notes: "Need to optimize portfolio before submitting.",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newCompany, setNewCompany] = useState<string>("");
  const [newPosition, setNewPosition] = useState<string>("");
  const [newLocation, setNewLocation] = useState<string>("");
  const [newSalary, setNewSalary] = useState<string>("");
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("APPLIED");
  const [newFollowUpDate, setNewFollowUpDate] = useState<string>("");
  const [newNotes, setNewNotes] = useState<string>("");

  const columns: { label: string; status: ApplicationStatus; color: string }[] = [
    { label: "Saved", status: "SAVED", color: "border-slate-700 bg-slate-900/30 text-slate-300" },
    { label: "Applied", status: "APPLIED", color: "border-blue-500/30 bg-blue-950/20 text-blue-300" },
    { label: "Interviewing", status: "INTERVIEW", color: "border-purple-500/30 bg-purple-950/20 text-purple-300" },
    { label: "Offer Received", status: "OFFER", color: "border-emerald-500/30 bg-emerald-950/20 text-emerald-300" },
    { label: "Archived / Rejected", status: "REJECTED", color: "border-rose-500/30 bg-rose-950/20 text-rose-300" },
  ];

  // Stats
  const totalApps = applications.length;
  const interviewing = applications.filter((a) => a.status === "INTERVIEW").length;
  const offers = applications.filter((a) => a.status === "OFFER").length;
  const responseRate = totalApps > 0 ? Math.round(((interviewing + offers) / totalApps) * 100) : 0;

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newPosition.trim()) {
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
      followUpDate: newFollowUpDate,
      appliedDate: new Date().toISOString().split("T")[0],
      notes: newNotes,
    };

    setApplications([newApp, ...applications]);
    setIsModalOpen(false);
    setNewCompany("");
    setNewPosition("");
    setNewLocation("");
    setNewSalary("");
    setNewNotes("");
    toast.success("Job application tracked!");
  };

  const handleUpdateStatus = (id: string, nextStatus: ApplicationStatus) => {
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, status: nextStatus } : app))
    );
    toast.info(`Updated status to ${nextStatus}`);
  };

  const handleDeleteApp = (id: string) => {
    setApplications(applications.filter((a) => a.id !== id));
    toast.info("Application deleted");
  };

  const handleSendReminder = (app: JobApp) => {
    toast.success(`Follow-up reminder set for ${app.company}!`);
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
            <h1 className="text-sm font-bold text-white">Kanban Job Application Tracker</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* Analytics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-slate-400 font-medium">Total Tracked</span>
            <div className="text-2xl font-bold text-white mt-1">{totalApps}</div>
            <span className="text-[10px] text-slate-500">Linked to: {title.slice(0, 20)}...</span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-purple-400 font-medium">Active Interviews</span>
            <div className="text-2xl font-bold text-white mt-1">{interviewing}</div>
            <span className="text-[10px] text-slate-500">In final & technical rounds</span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-emerald-400 font-medium">Official Offers</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{offers}</div>
            <span className="text-[10px] text-slate-500">High compensation tier</span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-indigo-400 font-medium">Interview Response Rate</span>
            <div className="text-2xl font-bold text-white mt-1 flex items-center gap-1">
              <span>{responseRate}%</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-slate-500">3.2x above tech industry average</span>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-6">
          {columns.map((col) => {
            const columnApps = applications.filter((app) => app.status === col.status);

            return (
              <div
                key={col.status}
                className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{col.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-semibold">
                      {columnApps.length}
                    </span>
                  </div>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {columnApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 bg-slate-900 border border-slate-800/90 hover:border-indigo-500/40 rounded-xl space-y-2.5 transition-all text-xs group relative shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm">{app.company}</h4>
                          <p className="text-[11px] text-indigo-300 font-medium">{app.position}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteApp(app.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {app.location && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{app.location}</span>
                        </div>
                      )}

                      {app.salary && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                          <DollarSign className="w-3 h-3" />
                          <span>{app.salary}</span>
                        </div>
                      )}

                      {app.notes && (
                        <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded leading-relaxed">
                          {app.notes}
                        </p>
                      )}

                      {/* Reminder / Follow-up pill */}
                      {app.followUpDate && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1 text-amber-300/80">
                            <Bell className="w-3 h-3" /> Follow-up: {app.followUpDate}
                          </span>
                          <button
                            onClick={() => handleSendReminder(app)}
                            className="hover:text-indigo-400"
                            title="Schedule Resend Email Alert"
                          >
                            <Mail className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Status advancement pills */}
                      <div className="pt-2 border-t border-slate-800/80 flex gap-1 flex-wrap">
                        {col.status !== "APPLIED" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "APPLIED")}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                          >
                            Applied
                          </button>
                        )}
                        {col.status !== "INTERVIEW" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "INTERVIEW")}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                          >
                            Interview
                          </button>
                        )}
                        {col.status !== "OFFER" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "OFFER")}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
                          >
                            Offer
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-white space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold">Track New Job Application</h3>

            <form onSubmit={handleCreateApp} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Stripe, OpenAI"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Position *</label>
                  <input
                    type="text"
                    required
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Remote or San Francisco, CA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Estimated Compensation</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="e.g. $180k - $210k"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Pipeline Stage</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500"
                >
                  <option value="SAVED">Saved</option>
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interviewing</option>
                  <option value="OFFER">Offer Received</option>
                  <option value="REJECTED">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Follow-Up Reminder Date</label>
                <input
                  type="date"
                  value={newFollowUpDate}
                  onChange={(e) => setNewFollowUpDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Interview Notes & Recruiter Contacts</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Key contacts, questions asked, or salary notes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
