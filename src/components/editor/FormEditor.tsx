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
  Camera,
  BookOpen,
  HeartHandshake,
  Users,
  FileText,
  Sliders,
} from "lucide-react";
import { BulletImproverModal } from "./BulletImproverModal";
import { PhotoUploadModal } from "./PhotoUploadModal";
import { FIELD_PRESETS } from "@/lib/data/fieldPresets";
import { toast } from "sonner";

export const FormEditor: React.FC = () => {
  const {
    content,
    themeConfig,
    updatePersonalInfo,
    addSocialLink,
    updateSocialLink,
    removeSocialLink,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addInternship,
    updateInternship,
    removeInternship,
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
    addCourse,
    updateCourse,
    removeCourse,
    addPublication,
    updatePublication,
    removePublication,
    addVolunteering,
    updateVolunteering,
    removeVolunteering,
    addAward,
    updateAward,
    removeAward,
    addReference,
    updateReference,
    removeReference,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    applyFieldPreset,
    fitToPages,
  } = useResumeStore();

  const {
    personalInfo,
    workExperience,
    internships = [],
    education,
    skills,
    projects,
    certifications,
    courses = [],
    publications = [],
    volunteering = [],
    awards = [],
    references = [],
    languages,
    customSections = [],
  } = content;

  // Active accordion section
  const [openSection, setOpenSection] = useState<string>("personal");
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);

  // Bullet Improver modal state
  const [improverState, setImproverState] = useState<{
    isOpen: boolean;
    expId?: string;
    bulletIndex?: number;
    initialBullet?: string;
    onApply?: (bullet: string) => void;
  }>({ isOpen: false });

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? "" : id);
  };

  return (
    <div className="space-y-4 p-4 max-w-3xl mx-auto text-slate-200">
      {/* Quick Controls Toolbar: Page Fit & Field Presets */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Page Fit:</span>
          </span>
          <button
            type="button"
            onClick={() => {
              fitToPages(1);
              toast.success("Optimized spacing & font size to fit on 1 Page!");
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              themeConfig.fitToPages === "1"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            Fit to 1 Page
          </button>
          <button
            type="button"
            onClick={() => {
              fitToPages(2);
              toast.success("Optimized spacing & font size to fit on 2 Pages!");
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              themeConfig.fitToPages === "2"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            Fit to 2 Pages
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Preset:</span>
          </span>
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                applyFieldPreset(e.target.value);
                toast.success(`Applied ${FIELD_PRESETS.find((p) => p.id === e.target.value)?.name} preset!`);
              }
            }}
            className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-1 outline-none focus:border-indigo-500"
          >
            <option value="" disabled>Apply Field Preset...</option>
            {FIELD_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

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

            {/* Photo / Headshot Controls */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-white">Profile Photo / Headshot</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={personalInfo.showPhoto || false}
                    onChange={(e) => updatePersonalInfo({ showPhoto: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Show on Resume</span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                <div className="relative group shrink-0">
                  {personalInfo.photoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={personalInfo.photoUrl}
                      alt={personalInfo.fullName || "Profile photo"}
                      className={`w-20 h-20 object-cover border-2 border-indigo-500/40 shadow-md ${
                        personalInfo.photoShape === "square"
                          ? "rounded-none"
                          : personalInfo.photoShape === "rounded"
                          ? "rounded-2xl"
                          : "rounded-full"
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-20 h-20 bg-slate-800/80 border border-slate-700 flex flex-col items-center justify-center text-slate-500 ${
                        personalInfo.photoShape === "square"
                          ? "rounded-none"
                          : personalInfo.photoShape === "rounded"
                          ? "rounded-2xl"
                          : "rounded-full"
                      }`}
                    >
                      <Camera className="w-6 h-6 mb-1 text-slate-500" />
                      <span className="text-[9px]">No Photo</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2.5 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{personalInfo.photoUrl ? "Change / Crop Photo" : "Upload & Crop Photo"}</span>
                    </button>

                    {personalInfo.photoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          updatePersonalInfo({ photoUrl: "", showPhoto: false });
                          toast.info("Photo removed");
                        }}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 rounded-lg text-xs transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Shape</label>
                      <select
                        value={personalInfo.photoShape || "circle"}
                        onChange={(e) =>
                          updatePersonalInfo({ photoShape: e.target.value as "circle" | "square" | "rounded" })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none"
                      >
                        <option value="circle">Circle</option>
                        <option value="rounded">Rounded Square</option>
                        <option value="square">Square</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Size</label>
                      <select
                        value={personalInfo.photoSize || "medium"}
                        onChange={(e) =>
                          updatePersonalInfo({ photoSize: e.target.value as "small" | "medium" | "large" })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none"
                      >
                        <option value="small">Compact</option>
                        <option value="medium">Standard</option>
                        <option value="large">Prominent</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                <strong className="text-slate-300">Regional Guidance:</strong> In the US, UK, and Canada, photos are typically omitted to prevent unconscious bias. In the EU, Latin America, Middle East, and Asia, a professional headshot is customary.
              </p>
            </div>

            {/* Social Links & Web Profiles */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white">Social & Professional Links</span>
                  <p className="text-[11px] text-slate-400">Clickable in PDF & DOCX (Behance, Dribbble, Medium, Substack, ORCID, etc.)</p>
                </div>
                <button
                  type="button"
                  onClick={() => addSocialLink()}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Profile Link
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1 pb-1">
                <input
                  type="checkbox"
                  id="showFullUrlAsText"
                  checked={personalInfo.showFullUrlAsText || false}
                  onChange={(e) => updatePersonalInfo({ showFullUrlAsText: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="showFullUrlAsText" className="text-xs text-slate-300 cursor-pointer">
                  Show full URLs as text in print/PDF (e.g. <span className="font-mono text-[11px] text-indigo-300">linkedin.com/in/alex</span> instead of <span className="font-mono text-[11px] text-indigo-300">LinkedIn</span>)
                </label>
              </div>

              {personalInfo.socialLinks && personalInfo.socialLinks.length > 0 && (
                <div className="space-y-2 pt-1">
                  {personalInfo.socialLinks.map((link) => (
                    <div key={link.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex flex-wrap sm:flex-nowrap items-center gap-2">
                      <input
                        type="text"
                        value={link.platform}
                        onChange={(e) => updateSocialLink(link.id, { platform: e.target.value })}
                        placeholder="Platform (e.g. Behance)"
                        className="w-full sm:w-36 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-indigo-500"
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1 text-[11px] text-slate-400 cursor-pointer whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={link.showFullUrl || false}
                            onChange={(e) => updateSocialLink(link.id, { showFullUrl: e.target.checked })}
                            className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                          />
                          <span>Full URL</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeSocialLink(link.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      {/* Internships & Practicums */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("internships")}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-white">Internships & Practicums ({internships.length})</h3>
              <p className="text-xs text-slate-400">Clinical rotations, internships, teaching practicums, apprenticeships</p>
            </div>
          </div>
          {openSection === "internships" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === "internships" && (
          <div className="p-5 border-t border-slate-800 space-y-5 bg-slate-950/40">
            {internships.map((intern) => (
              <div key={intern.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl relative group">
                <button
                  onClick={() => removeInternship(intern.id)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title="Remove Internship"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Organization / Hospital / Firm</label>
                    <input
                      type="text"
                      value={intern.company}
                      onChange={(e) => updateInternship(intern.id, { company: e.target.value })}
                      placeholder="e.g. Johns Hopkins Hospital / Acme Labs"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Role / Practicum Title</label>
                    <input
                      type="text"
                      value={intern.position}
                      onChange={(e) => updateInternship(intern.id, { position: e.target.value })}
                      placeholder="e.g. Clinical Nursing Intern / SWE Intern"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={intern.location}
                      onChange={(e) => updateInternship(intern.id, { location: e.target.value })}
                      placeholder="e.g. Boston, MA"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={intern.startDate}
                        onChange={(e) => updateInternship(intern.id, { startDate: e.target.value })}
                        placeholder="e.g. 2023-05"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">End Date</label>
                      <input
                        type="text"
                        disabled={intern.current}
                        value={intern.current ? "Present" : intern.endDate}
                        onChange={(e) => updateInternship(intern.id, { endDate: e.target.value })}
                        placeholder="e.g. 2023-08"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id={`current-intern-${intern.id}`}
                    checked={intern.current}
                    onChange={(e) => updateInternship(intern.id, { current: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={`current-intern-${intern.id}`} className="text-xs text-slate-400 cursor-pointer">
                    I am currently completing this internship
                  </label>
                </div>

                {/* Bullets */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-medium text-slate-400">Accomplishments & Case Hours</label>
                    <button
                      type="button"
                      onClick={() =>
                        updateInternship(intern.id, {
                          bullets: [...intern.bullets, "New accomplishment or rotation duty."],
                        })
                      }
                      className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet
                    </button>
                  </div>

                  {intern.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <span className="text-slate-600 text-xs">•</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const nextBullets = [...intern.bullets];
                          nextBullets[bIdx] = e.target.value;
                          updateInternship(intern.id, { bullets: nextBullets });
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImproverState({
                            isOpen: true,
                            initialBullet: bullet,
                            onApply: (improved) => {
                              const nextBullets = [...intern.bullets];
                              nextBullets[bIdx] = improved;
                              updateInternship(intern.id, { bullets: nextBullets });
                            },
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
                          const nextBullets = intern.bullets.filter((_, idx) => idx !== bIdx);
                          updateInternship(intern.id, { bullets: nextBullets });
                        }}
                        className="text-slate-600 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tech / Competency tags */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Tools / Competencies Used (comma separated)
                  </label>
                  <input
                    type="text"
                    value={intern.technologies.join(", ")}
                    onChange={(e) =>
                      updateInternship(intern.id, {
                        technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="e.g. Epic EHR, Phlebotomy, Python, Figma"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addInternship}
              className="w-full py-2.5 border border-dashed border-slate-700 hover:border-sky-500 text-slate-400 hover:text-sky-400 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Internship / Practicum
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

      {/* Courses & Continuing Education */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("courses")}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-white">Courses & Continuing Education ({courses.length})</h3>
              <p className="text-xs text-slate-400">Bootcamps, specialized courses, CEUs, and executive training</p>
            </div>
          </div>
          {openSection === "courses" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === "courses" && (
          <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/40">
            {courses.map((course) => (
              <div key={course.id} className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl relative group">
                <button
                  onClick={() => removeCourse(course.id)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title="Remove Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Course / Program Name</label>
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                      placeholder="e.g. Stanford Machine Learning Specialization"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Institution / Platform</label>
                    <input
                      type="text"
                      value={course.institution}
                      onChange={(e) => updateCourse(course.id, { institution: e.target.value })}
                      placeholder="e.g. Coursera / DeepLearning.AI"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Date / Year</label>
                    <input
                      type="text"
                      value={course.date}
                      onChange={(e) => updateCourse(course.id, { date: e.target.value })}
                      placeholder="e.g. 2023"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addCourse}
              className="w-full py-2.5 border border-dashed border-slate-700 hover:border-violet-500 text-slate-400 hover:text-violet-400 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Course / Training
            </button>
          </div>
        )}
      </div>

      {/* Publications & Research */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("publications")}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-white">Publications & Research ({publications.length})</h3>
              <p className="text-xs text-slate-400">Peer-reviewed papers, articles, conference talks, and preprints</p>
            </div>
          </div>
          {openSection === "publications" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === "publications" && (
          <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/40">
            {publications.map((pub) => (
              <div key={pub.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl relative group">
                <button
                  onClick={() => removePublication(pub.id)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title="Remove Publication"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Publication Title</label>
                    <input
                      type="text"
                      value={pub.title}
                      onChange={(e) => updatePublication(pub.id, { title: e.target.value })}
                      placeholder="e.g. Scalable Multi-Agent Systems in Healthcare Diagnostics"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Publisher / Journal / Conference</label>
                    <input
                      type="text"
                      value={pub.publisher}
                      onChange={(e) => updatePublication(pub.id, { publisher: e.target.value })}
                      placeholder="e.g. IEEE Transactions / NeurIPS / Nature"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Date / Year</label>
                    <input
                      type="text"
                      value={pub.date}
                      onChange={(e) => updatePublication(pub.id, { date: e.target.value })}
                      placeholder="e.g. 2024"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">URL / DOI Link (clickable in PDF)</label>
                    <input
                      type="text"
                      value={pub.url}
                      onChange={(e) => updatePublication(pub.id, { url: e.target.value })}
                      placeholder="https://doi.org/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Brief Description / Abstract</label>
                  <textarea
                    rows={2}
                    value={pub.description}
                    onChange={(e) => updatePublication(pub.id, { description: e.target.value })}
                    placeholder="Key findings and contributions..."
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addPublication}
              className="w-full py-2.5 border border-dashed border-slate-700 hover:border-indigo-500 text-slate-400 hover:text-indigo-400 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Publication / Research
            </button>
          </div>
        )}
      </div>

      {/* Volunteering & Community Leadership */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("volunteering")}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-white">Volunteering & Community ({volunteering.length})</h3>
              <p className="text-xs text-slate-400">Community service, nonprofit leadership, and pro-bono work</p>
            </div>
          </div>
          {openSection === "volunteering" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === "volunteering" && (
          <div className="p-5 border-t border-slate-800 space-y-5 bg-slate-950/40">
            {volunteering.map((vol) => (
              <div key={vol.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl relative group">
                <button
                  onClick={() => removeVolunteering(vol.id)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title="Remove Volunteering"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Role / Title</label>
                    <input
                      type="text"
                      value={vol.role}
                      onChange={(e) => updateVolunteering(vol.id, { role: e.target.value })}
                      placeholder="e.g. Volunteer Lead / Mentor"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Organization / Cause</label>
                    <input
                      type="text"
                      value={vol.organization}
                      onChange={(e) => updateVolunteering(vol.id, { organization: e.target.value })}
                      placeholder="e.g. Red Cross / Code for America"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Period / Years</label>
                    <input
                      type="text"
                      value={vol.period}
                      onChange={(e) => updateVolunteering(vol.id, { period: e.target.value })}
                      placeholder="e.g. 2021 - Present"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Bullets */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-medium text-slate-400">Impact & Contributions</label>
                    <button
                      type="button"
                      onClick={() =>
                        updateVolunteering(vol.id, {
                          bullets: [...vol.bullets, "Spearheaded community initiatives reaching diverse participants."],
                        })
                      }
                      className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet
                    </button>
                  </div>

                  {vol.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <span className="text-slate-600 text-xs">•</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const nextBullets = [...vol.bullets];
                          nextBullets[bIdx] = e.target.value;
                          updateVolunteering(vol.id, { bullets: nextBullets });
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImproverState({
                            isOpen: true,
                            initialBullet: bullet,
                            onApply: (improved) => {
                              const nextBullets = [...vol.bullets];
                              nextBullets[bIdx] = improved;
                              updateVolunteering(vol.id, { bullets: nextBullets });
                            },
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
                          const nextBullets = vol.bullets.filter((_, idx) => idx !== bIdx);
                          updateVolunteering(vol.id, { bullets: nextBullets });
                        }}
                        className="text-slate-600 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={addVolunteering}
              className="w-full py-2.5 border border-dashed border-slate-700 hover:border-rose-500 text-slate-400 hover:text-rose-400 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Volunteering Experience
            </button>
          </div>
        )}
      </div>

      {/* Honors & Awards */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("awards")}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-white">Honors & Awards ({awards.length})</h3>
              <p className="text-xs text-slate-400">Scholarships, competition wins, dean&apos;s list, and corporate recognition</p>
            </div>
          </div>
          {openSection === "awards" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === "awards" && (
          <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/40">
            {awards.map((award) => (
              <div key={award.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl relative group">
                <button
                  onClick={() => removeAward(award.id)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title="Remove Award"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Award / Honor Title</label>
                    <input
                      type="text"
                      value={award.title}
                      onChange={(e) => updateAward(award.id, { title: e.target.value })}
                      placeholder="e.g. President's Club / Dean's Honor Roll"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Issuer / Organization</label>
                    <input
                      type="text"
                      value={award.issuer}
                      onChange={(e) => updateAward(award.id, { issuer: e.target.value })}
                      placeholder="e.g. University / Salesforce"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Date / Year</label>
                    <input
                      type="text"
                      value={award.date}
                      onChange={(e) => updateAward(award.id, { date: e.target.value })}
                      placeholder="e.g. 2023"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Description / Context</label>
                    <input
                      type="text"
                      value={award.description}
                      onChange={(e) => updateAward(award.id, { description: e.target.value })}
                      placeholder="Awarded to top 1% of department for outstanding performance..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addAward}
              className="w-full py-2.5 border border-dashed border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-400 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Honor / Award
            </button>
          </div>
        )}
      </div>

      {/* References */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection("references")}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-white">References ({references.length})</h3>
              <p className="text-xs text-slate-400">Academic advisors, clinical preceptors, former managers</p>
            </div>
          </div>
          {openSection === "references" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === "references" && (
          <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/40">
            {references.map((ref) => (
              <div key={ref.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl relative group">
                <button
                  onClick={() => removeReference(ref.id)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title="Remove Reference"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={ref.name}
                      onChange={(e) => updateReference(ref.id, { name: e.target.value })}
                      placeholder="e.g. Dr. Sarah Jenkins"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Title / Position</label>
                    <input
                      type="text"
                      value={ref.role}
                      onChange={(e) => updateReference(ref.id, { role: e.target.value })}
                      placeholder="e.g. Department Chair / VP of Engineering"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Organization / Hospital</label>
                    <input
                      type="text"
                      value={ref.organization}
                      onChange={(e) => updateReference(ref.id, { organization: e.target.value })}
                      placeholder="e.g. University Hospital / Google"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Contact Details</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ref.contact}
                        onChange={(e) => updateReference(ref.id, { contact: e.target.value })}
                        placeholder="e.g. s.jenkins@uni.edu or Available upon request"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => updateReference(ref.id, { contact: "Available upon request" })}
                        className="text-[10px] text-slate-400 hover:text-indigo-400 px-2 border border-slate-800 rounded-lg bg-slate-950 whitespace-nowrap"
                        title="Set to 'Available upon request'"
                      >
                        Quick Fill
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addReference}
              className="w-full py-2.5 border border-dashed border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Reference
            </button>
          </div>
        )}
      </div>

      {/* Custom Sections */}
      {customSections.map((sec) => (
        <div key={sec.id} className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection(sec.id)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-white">{sec.heading || "Custom Section"} ({sec.items.length})</h3>
                <p className="text-xs text-slate-400">Custom user-defined entries</p>
              </div>
            </div>
            {openSection === sec.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === sec.id && (
            <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/40">
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
                <div className="flex-1">
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={sec.heading}
                    onChange={(e) => updateCustomSection(sec.id, { heading: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomSection(sec.id)}
                  className="mt-4 px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 border border-rose-900/40 rounded hover:bg-rose-950/30"
                >
                  Delete Section
                </button>
              </div>

              {sec.items.map((item, itemIdx) => (
                <div key={item.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg relative">
                  <button
                    onClick={() => {
                      const nextItems = sec.items.filter((_, idx) => idx !== itemIdx);
                      updateCustomSection(sec.id, { items: nextItems });
                    }}
                    className="absolute top-2.5 right-2.5 text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const nextItems = [...sec.items];
                        nextItems[itemIdx] = { ...item, title: e.target.value };
                        updateCustomSection(sec.id, { items: nextItems });
                      }}
                      placeholder="Title"
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none"
                    />
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) => {
                        const nextItems = [...sec.items];
                        nextItems[itemIdx] = { ...item, subtitle: e.target.value };
                        updateCustomSection(sec.id, { items: nextItems });
                      }}
                      placeholder="Subtitle / Organization"
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none"
                    />
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) => {
                        const nextItems = [...sec.items];
                        nextItems[itemIdx] = { ...item, date: e.target.value };
                        updateCustomSection(sec.id, { items: nextItems });
                      }}
                      placeholder="Date / Period"
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const nextItems = [...sec.items];
                      nextItems[itemIdx] = { ...item, description: e.target.value };
                      updateCustomSection(sec.id, { items: nextItems });
                    }}
                    placeholder="Brief description or bullet point"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newItem = {
                    id: `item-${Date.now()}`,
                    title: "New Item",
                    subtitle: "",
                    date: "",
                    description: "",
                    bullets: [],
                  };
                  updateCustomSection(sec.id, { items: [...sec.items, newItem] });
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item to {sec.heading}
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => addCustomSection("Additional Activities")}
        className="w-full py-2.5 border border-dashed border-slate-800 hover:border-slate-600 text-slate-500 hover:text-slate-300 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Custom Section
      </button>

      {/* Bullet Improver Modal */}
      <BulletImproverModal
        isOpen={improverState.isOpen}
        onClose={() => setImproverState({ isOpen: false })}
        experienceId={improverState.expId}
        bulletIndex={improverState.bulletIndex}
        initialBullet={improverState.initialBullet}
        onApply={improverState.onApply}
      />

      {/* Photo Upload & Crop Modal */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        initialPhotoUrl={personalInfo.photoUrl}
        initialShape={personalInfo.photoShape}
        initialSize={personalInfo.photoSize}
        onSave={(data) => {
          updatePersonalInfo(data);
          setIsPhotoModalOpen(false);
          toast.success("Profile photo updated!");
        }}
        onRemove={() => {
          updatePersonalInfo({ photoUrl: "", showPhoto: false });
          setIsPhotoModalOpen(false);
          toast.info("Profile photo removed");
        }}
      />
    </div>
  );
};
