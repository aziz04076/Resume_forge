"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PROFESSIONS, ProfessionProfile } from "@/lib/data/professions";
import {
  GraduationCap,
  HeartPulse,
  BookOpen,
  TrendingUp,
  Palette,
  Briefcase,
  Code,
  Scale,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Camera,
  FileCheck
} from "lucide-react";

const PROFESSION_ICONS: Record<string, React.ReactNode> = {
  student: <GraduationCap className="w-4 h-4" />,
  healthcare: <HeartPulse className="w-4 h-4" />,
  teaching: <BookOpen className="w-4 h-4" />,
  "sales-business": <TrendingUp className="w-4 h-4" />,
  "creative-design": <Palette className="w-4 h-4" />,
  finance: <Briefcase className="w-4 h-4" />,
  "tech-it": <Code className="w-4 h-4" />,
  "public-legal": <Scale className="w-4 h-4" />,
};

export const ProfessionSelectorSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>("healthcare");
  const selected: ProfessionProfile =
    PROFESSIONS.find((p) => p.id === selectedId) || PROFESSIONS[0];

  return (
    <section id="who-is-it-for" className="py-24 px-6 relative bg-slate-50/50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built For Every Profession</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Who is ResumeForge for?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Whether you are treating patients, teaching classrooms, closing enterprise deals, or graduating university,
            ResumeForge adapts its guidance and formatting to your specific field.
          </p>
        </div>

        {/* Profession Tabs Grid */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {PROFESSIONS.map((prof) => {
            const isActive = prof.id === selectedId;
            return (
              <button
                key={prof.id}
                onClick={() => setSelectedId(prof.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 shadow-sm"
                }`}
              >
                <span>{PROFESSION_ICONS[prof.id]}</span>
                <span>{prof.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Showcase Card for Selected Profession */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Profession Details & Real Before/After Bullet Transformation */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-sm transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                  {selected.badge}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {selected.hasPhoto ? (
                    <>
                      <Camera className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Optional Photo Template</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Text-First Screening Layout</span>
                    </>
                  )}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {selected.roleTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {selected.description}
                </p>
              </div>

              {/* Before vs After Bullet Coach */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider">
                  How our guidance improves your bullet points:
                </div>

                {/* Before Box */}
                <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-slate-950 border border-rose-200 dark:border-rose-900/30 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-rose-700 dark:text-rose-400">
                    <span>Weak, vague statement (Before)</span>
                    <span className="text-[10px] bg-rose-100 dark:bg-rose-500/10 px-2 py-0.5 rounded text-rose-800 dark:text-rose-300 font-medium">Misses results</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-400 italic">
                    &quot;{selected.sampleBulletBefore}&quot;
                  </p>
                </div>

                {/* After Box */}
                <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900/40 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-emerald-800 dark:text-emerald-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Clear, credible & quantified (After)</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-800 dark:text-emerald-300 font-medium">Stands out</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200">
                    &quot;{selected.sampleBulletAfter}&quot;
                  </p>
                </div>
              </div>

              {/* Essential Field Skills */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-2">
                  Recognized skills for {selected.name}:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.keySkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-indigo-700 dark:text-indigo-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Recommended design: <strong className="text-slate-900 dark:text-white">{selected.recommendedTemplateName}</strong>
              </span>
              <Link
                href="/editor"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 min-h-[44px]"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Realistic Live Sheet Preview */}
          <div className="lg:col-span-6 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800/50 flex flex-col justify-between select-none">
            <div className="space-y-4">
              {/* Resume Header */}
              <div className="border-b border-slate-200 pb-4">
                <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {selected.candidateName}
                </h4>
                <div className="text-xs font-semibold text-indigo-700 mt-0.5">
                  {selected.roleTitle}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1.5 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{selected.location}</span>
                  </span>
                  <span>•</span>
                  <span>Verified Contact</span>
                  <span>•</span>
                  <span>Portfolio / Profiles Attached</span>
                </div>
              </div>

              {/* Summary Section */}
              <div>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Professional Summary
                </h5>
                <p className="text-xs text-slate-800 leading-relaxed text-justify">
                  {selected.summary}
                </p>
              </div>

              {/* Experience Section */}
              <div>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Experience & Key Achievements
                </h5>
                <div className="space-y-3">
                  {selected.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {exp.role} <span className="font-normal text-slate-700">at {exp.organization}</span>
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono font-medium">{exp.period}</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-700 pl-3">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="list-disc leading-normal">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="pt-2 border-t border-slate-200">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Education & Credentials
                </h5>
                <p className="text-[11px] text-slate-800 font-medium">
                  {selected.education}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span>Standard A4 / Letter format</span>
              <span className="font-semibold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Screening software friendly</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
