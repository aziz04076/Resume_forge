"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useResumeStore } from "@/lib/store/useResumeStore";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Share2,
  Check,
  Code2,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

export default function PortfolioPage() {
  const { content, targetRole } = useResumeStore();
  const { personalInfo, workExperience, education, skills, projects } = content;
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Public portfolio link copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Bar for Creator */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/editor"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Editor
          </Link>
          <span className="text-slate-700">|</span>
          <span className="text-xs text-indigo-400 font-mono">Live Portfolio Preview</span>
        </div>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? "Link Copied!" : "Share Portfolio"}</span>
        </button>
      </div>

      {/* Hero Section */}
      <header className="relative pt-24 pb-20 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-3xl text-white shadow-2xl shadow-indigo-500/30 mb-6">
          {personalInfo.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "ME"}
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          {personalInfo.fullName || "Your Full Name"}
        </h1>

        <p className="text-lg sm:text-xl font-medium text-indigo-400 mb-6 max-w-xl">
          {personalInfo.jobTitle || targetRole}
        </p>

        {personalInfo.summary && (
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            {personalInfo.summary}
          </p>
        )}

        {/* Contact Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          {personalInfo.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>{personalInfo.email}</span>
            </a>
          )}
          {personalInfo.location && (
            <span className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{personalInfo.location}</span>
            </span>
          )}
          {personalInfo.github && (
            <a
              href={`https://${personalInfo.github}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}
          {personalInfo.linkedin && (
            <a
              href={`https://${personalInfo.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-400" />
              <span>LinkedIn</span>
            </a>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 space-y-16 pb-24">
        {/* Featured Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" /> Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-base text-white">{proj.name}</h3>
                      <div className="flex gap-2 text-slate-400">
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-indigo-400"
                            title="Live URL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white"
                            title="Source Code"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    {proj.role && (
                      <span className="text-[11px] text-indigo-400 font-mono block mb-2">
                        {proj.role}
                      </span>
                    )}
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {proj.description}
                    </p>
                  </div>

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                      {proj.technologies.map((t, i) => (
                        <span
                          key={i}
                          className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience Timeline */}
        {workExperience.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" /> Work Experience
            </h2>
            <div className="space-y-6">
              {workExperience.map((exp) => (
                <div
                  key={exp.id}
                  className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <h3 className="font-bold text-base text-white">{exp.position}</h3>
                      <p className="text-xs text-indigo-400 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>

                  {exp.bullets.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Skills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-6">Skills & Technologies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((cat) => (
                <div key={cat.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {cat.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-lg text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Credentials */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" /> Education
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {education.map((edu) => (
                <div key={edu.id} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
                  <h3 className="font-bold text-sm text-white">{edu.degree} in {edu.fieldOfStudy}</h3>
                  <p className="text-xs text-indigo-400 mt-0.5">{edu.institution}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    {edu.startDate} – {edu.endDate} {edu.gpa ? `• GPA: ${edu.gpa}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
