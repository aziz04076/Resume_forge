"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { BulletImproverModal } from "./BulletImproverModal";

export const FormEditor: React.FC = () => {
  const {
    content,
    updatePersonalInfo,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkillCategory,
    updateSkillCategory,
    removeSkillCategory,
    addProject,
    updateProject,
    removeProject,
    addCertification,
    updateCertification,
    removeCertification,
    addLanguage,
    updateLanguage,
    removeLanguage,
  } = useResumeStore();

  const { personalInfo, workExperience, education, skills, projects, certifications, languages } = content;

  // Active accordion section
  const [openSection, setOpenSection] = useState<string>("personal");

  // Bullet Improver modal state
  const [improverState, setImproverState] = useState<{
    isOpen: boolean;
    expId?: string;
    bulletIndex?: number;
    initialBullet?: string;
  }>({ isOpen: false });

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? "" : id);
  };

  return (
    <div className="space-y-4 p-4 max-w-3xl mx-auto text-slate-200">
      {/* 1. Personal Information */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("personal")}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-white">Personal Information</h3>
              <p className="text-xs text-slate-400">Name, target title, contact & links</p>
            </div>
          </div>
          {openSection === "personal" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === "personal" && (
          <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Job Title / Target Headline</label>
                <input
                  type="text"
                  value={personalInfo.jobTitle}
                  onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                  placeholder="e.g. alex@example.com"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={personalInfo.phone}
                  onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={personalInfo.location}
                  onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                  placeholder="e.g. San Francisco, CA (or Remote)"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Portfolio / Website URL</label>
                <input
                  type="text"
                  value={personalInfo.website}
                  onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                  placeholder="https://yoursite.com"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                  placeholder="linkedin.com/in/username"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">GitHub Profile</label>
                <input
                  type="text"
                  value={personalInfo.github}
                  onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                  placeholder="github.com/username"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Professional Summary / Value Proposition
              </label>
              <textarea
                rows={3}
                value={personalInfo.summary}
                onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                placeholder="2-3 concise sentences summarizing your experience, top achievements, and primary skillset..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg p-3 text-xs text-white placeholder-slate-600 outline-none leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Work Experience */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("experience")}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-white">Work Experience ({workExperience.length})</h3>
              <p className="text-xs text-slate-400">Roles, impact bullets, and technologies</p>
            </div>
          </div>
          {openSection === "experience" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === "experience" && (
          <div className="p-5 border-t border-slate-800 space-y-5 bg-slate-950/40">
            {workExperience.map((exp) => (
              <div key={exp.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl relative group">
                <button
                  onClick={() => removeWorkExperience(exp.id)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title="Remove Experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateWorkExperience(exp.id, { company: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Position / Title</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateWorkExperience(exp.id, { position: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateWorkExperience(exp.id, { location: e.target.value })}
                      placeholder="e.g. New York, NY (Remote)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateWorkExperience(exp.id, { startDate: e.target.value })}
                        placeholder="e.g. 2021-03"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">End Date</label>
                      <input
                        type="text"
                        disabled={exp.current}
                        value={exp.current ? "Present" : exp.endDate}
                        onChange={(e) => updateWorkExperience(exp.id, { endDate: e.target.value })}
                        placeholder="e.g. 2024-01"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => updateWorkExperience(exp.id, { current: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-400 cursor-pointer">
                    I currently work in this role
                  </label>
                </div>

                {/* Bullets */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-medium text-slate-400">Accomplishment Bullets (STAR formula)</label>
                    <button
                      type="button"
                      onClick={() =>
                        updateWorkExperience(exp.id, {
                          bullets: [...exp.bullets, "New quantified accomplishment bullet."],
                        })
                      }
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet
                    </button>
                  </div>

                  {exp.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <span className="text-slate-600 text-xs">•</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const newBullets = [...exp.bullets];
                          newBullets[bIdx] = e.target.value;
                          updateWorkExperience(exp.id, { bullets: newBullets });
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImproverState({
                            isOpen: true,
                            expId: exp.id,
                            bulletIndex: bIdx,
                            initialBullet: bullet,
                          })
                        }
                        title="Optimize with AI"
                        className="text-indigo-400 hover:text-indigo-300 p-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newBullets = exp.bullets.filter((_, idx) => idx !== bIdx);
                          updateWorkExperience(exp.id, { bullets: newBullets });
                        }}
                        className="text-slate-600 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tech tags */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={exp.technologies.join(", ")}
                    onChange={(e) =>
                      updateWorkExperience(exp.id, {
                        technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="React, TypeScript, Go, PostgreSQL"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addWorkExperience}
              className="w-full py-2.5 border border-dashed border-slate-700 hover:border-indigo-500 text-slate-400 hover:text-indigo-400 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Experience Position
            </button>
          </div>
        )}
      </div>

      {/* 3. Education */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("education")}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-white">Education ({education.length})</h3>
              <p className="text-xs text-slate-400">Degrees, universities, GPAs, and honors</p>
            </div>
          </div>
          {openSection === "education" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === "education" && (
          <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/40">
            {education.map((edu) => (
              <div key={edu.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl relative">
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Institution / College</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      placeholder="e.g. Bachelor of Science"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Field of Study / Major</label>
                    <input
                      type="text"
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                      placeholder="e.g. Computer Science"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">Years</label>
                      <input
                        type="text"
                        value={`${edu.startDate} - ${edu.endDate}`}
                        onChange={(e) => {
                          const parts = e.target.value.split("-");
                          updateEducation(edu.id, {
                            startDate: parts[0]?.trim() || "",
                            endDate: parts[1]?.trim() || "",
                          });
                        }}
                        placeholder="2018 - 2022"
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">GPA</label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                        placeholder="3.9"
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addEducation}
              className="w-full py-2.5 border border-dashed border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
        )}
      </div>

      {/* 4. Skills */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("skills")}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-white">Skills & Competencies ({skills.length} categories)</h3>
              <p className="text-xs text-slate-400">Categorized technical and domain skill groups</p>
            </div>
          </div>
          {openSection === "skills" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === "skills" && (
          <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/40">
            {skills.map((cat) => (
              <div key={cat.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="w-36">
                  <input
                    type="text"
                    value={cat.category}
                    onChange={(e) => updateSkillCategory(cat.id, { category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={cat.items.join(", ")}
                    onChange={(e) =>
                      updateSkillCategory(cat.id, {
                        items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Skill 1, Skill 2, Skill 3"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={() => removeSkillCategory(cat.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              onClick={() => addSkillCategory("Tools & Libraries")}
              className="w-full py-2.5 border border-dashed border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-400 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Skill Category
            </button>
          </div>
        )}
      </div>

      {/* 5. Projects */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("projects")}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-white">Projects ({projects.length})</h3>
              <p className="text-xs text-slate-400">Personal, open-source, or client projects</p>
            </div>
          </div>
          {openSection === "projects" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === "projects" && (
          <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/40">
            {projects.map((proj) => (
              <div key={proj.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl relative">
                <button
                  onClick={() => removeProject(proj.id)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Role / Subtitle</label>
                    <input
                      type="text"
                      value={proj.role}
                      onChange={(e) => updateProject(proj.id, { role: e.target.value })}
                      placeholder="e.g. Lead Developer"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Live Demo URL</label>
                    <input
                      type="text"
                      value={proj.liveUrl}
                      onChange={(e) => updateProject(proj.id, { liveUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Repository URL</label>
                    <input
                      type="text"
                      value={proj.githubUrl}
                      onChange={(e) => updateProject(proj.id, { githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Brief Description</label>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addProject}
              className="w-full py-2.5 border border-dashed border-slate-700 hover:border-purple-500 text-slate-400 hover:text-purple-400 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        )}
      </div>

      {/* 6. Certifications & Languages */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("certs")}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-white">Certifications & Languages</h3>
              <p className="text-xs text-slate-400">Official credentials and language proficiencies</p>
            </div>
          </div>
          {openSection === "certs" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === "certs" && (
          <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/40">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-semibold text-slate-300">Certifications</h4>
                <button
                  onClick={addCertification}
                  className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Credential
                </button>
              </div>

              {certifications.map((c) => (
                <div key={c.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center gap-2">
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => updateCertification(c.id, { name: e.target.value })}
                    placeholder="Certification Name"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none"
                  />
                  <input
                    type="text"
                    value={c.issuer}
                    onChange={(e) => updateCertification(c.id, { issuer: e.target.value })}
                    placeholder="Issuer"
                    className="w-36 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none"
                  />
                  <input
                    type="text"
                    value={c.issueDate}
                    onChange={(e) => updateCertification(c.id, { issueDate: e.target.value })}
                    placeholder="Year"
                    className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none"
                  />
                  <button onClick={() => removeCertification(c.id)} className="text-slate-500 hover:text-rose-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-semibold text-slate-300">Languages</h4>
                <button
                  onClick={addLanguage}
                  className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Language
                </button>
              </div>

              {languages.map((l) => (
                <div key={l.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center gap-2">
                  <input
                    type="text"
                    value={l.language}
                    onChange={(e) => updateLanguage(l.id, { language: e.target.value })}
                    placeholder="Language (e.g. Spanish)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none"
                  />
                  <input
                    type="text"
                    value={l.proficiency}
                    onChange={(e) => updateLanguage(l.id, { proficiency: e.target.value })}
                    placeholder="Fluent / Native"
                    className="w-36 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none"
                  />
                  <button onClick={() => removeLanguage(l.id)} className="text-slate-500 hover:text-rose-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bullet Improver Modal */}
      <BulletImproverModal
        isOpen={improverState.isOpen}
        onClose={() => setImproverState({ isOpen: false })}
        experienceId={improverState.expId}
        bulletIndex={improverState.bulletIndex}
        initialBullet={improverState.initialBullet}
      />
    </div>
  );
};
