"use client";

import React from "react";
import { TemplateProps } from "./types";
import { joinNonEmpty, preserveSpecialCharacters } from "@/lib/utils/formatUtils";
import { normalizeUrl, getDisplayLinkText, normalizePhoneUri } from "@/lib/utils/urlHelper";
import { TemplateExtraSections } from "./TemplateExtraSections";

/**
 * Classic Professional — LaTeX-Style Reference Resume Template
 *
 * Implements:
 * - Large small-caps name, italic role line
 * - Single contact line joined with " | " separators
 * - Clean hyperlink labels with real destination URLs
 * - Compact top-right photo (30-35mm) with zero header bloat
 * - Full-width horizontal rule under section headings
 * - Bold title + right date, italic org + right location/score
 * - Two-column left-aligned skills grid
 * - Hyphenation disabled by default
 * - No dangling separators
 */
export const ClassicProfessional: React.FC<TemplateProps> = ({
  content,
  themeConfig,
  className = "",
}) => {
  const {
    personalInfo,
    workExperience,
    education,
    skills,
    projects,
  } = content;

  const {
    primaryColor = "#0f172a",
    accentColor = "#1e293b",
    lineSpacing = "normal",
    pageMargins = "normal",
    hiddenSections = [],
    brandingLevel = "metadata-only",
    showCreatedWithBadge = false,
  } = themeConfig;

  const isVisible = (sec: string) => !hiddenSections.includes(sec);
  const showFullUrl = personalInfo.showFullUrlAsText ?? false;

  // Contact items for single-line header
  const contactLinks: Array<{ label: string; href?: string }> = [];

  if (personalInfo.email) {
    contactLinks.push({
      label: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    });
  }

  if (personalInfo.phone) {
    contactLinks.push({
      label: personalInfo.phone,
      href: normalizePhoneUri(personalInfo.phone),
    });
  }

  if (personalInfo.location) {
    contactLinks.push({
      label: personalInfo.location,
    });
  }

  if (personalInfo.linkedin) {
    contactLinks.push({
      label: getDisplayLinkText(personalInfo.linkedin, showFullUrl),
      href: normalizeUrl(personalInfo.linkedin),
    });
  }

  if (personalInfo.github) {
    contactLinks.push({
      label: getDisplayLinkText(personalInfo.github, showFullUrl),
      href: normalizeUrl(personalInfo.github),
    });
  }

  if (personalInfo.website) {
    contactLinks.push({
      label: getDisplayLinkText(personalInfo.website, showFullUrl),
      href: normalizeUrl(personalInfo.website),
    });
  }

  if (personalInfo.portfolioUrl) {
    contactLinks.push({
      label: getDisplayLinkText(personalInfo.portfolioUrl, showFullUrl),
      href: normalizeUrl(personalInfo.portfolioUrl),
    });
  }

  // Margin padding
  const paddingStyle =
    pageMargins === "compact"
      ? "p-[10mm]"
      : pageMargins === "spacious"
      ? "p-[20mm]"
      : "p-[15mm]";

  // Spacing style
  const spacingStyle =
    lineSpacing === "compact"
      ? "space-y-2 text-[9.5pt] leading-[1.3]"
      : lineSpacing === "spacious"
      ? "space-y-3.5 text-[10.5pt] leading-[1.45]"
      : "space-y-2.5 text-[10pt] leading-[1.38]";

  return (
    <div
      className={`resume-paper font-serif ${paddingStyle} ${className} text-slate-900 bg-white select-text`}
      style={{
        color: primaryColor,
        hyphens: "none",
        WebkitHyphens: "none",
      }}
    >
      {/* ─── Header: Small-caps name + optional compact photo ─── */}
      <header className="border-b border-slate-900 pb-2 mb-3 break-inside-avoid">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Full Name in LaTeX Small-Caps */}
            <h1
              className="text-2xl font-bold tracking-normal uppercase"
              style={{
                fontVariant: "small-caps",
                color: primaryColor,
                letterSpacing: "0.04em",
              }}
            >
              {preserveSpecialCharacters(personalInfo.fullName || "Your Full Name")}
            </h1>

            {/* Italic Role Line */}
            {personalInfo.jobTitle && (
              <p
                className="text-xs italic font-serif mt-0.5 mb-1"
                style={{ color: accentColor }}
              >
                {preserveSpecialCharacters(personalInfo.jobTitle)}
              </p>
            )}

            {/* Single Contact Line with " | " separators */}
            {contactLinks.length > 0 && (
              <div className="text-[9pt] text-slate-700 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1 leading-snug">
                {contactLinks.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-slate-400 select-none">|</span>}
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="hover:underline text-slate-800"
                      >
                        {preserveSpecialCharacters(item.label)}
                      </a>
                    ) : (
                      <span>{preserveSpecialCharacters(item.label)}</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Compact Photo (32mm x 32mm ~ 1.25in) */}
          {personalInfo.photoUrl && (
            <div className="shrink-0 ml-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName || "Photo"}
                className="w-[32mm] h-[32mm] object-cover rounded-md border border-slate-300 shadow-xs"
              />
            </div>
          )}
        </div>
      </header>

      {/* ─── Body Sections ─── */}
      <div className={spacingStyle}>
        {/* Professional Summary */}
        {isVisible("summary") && personalInfo.summary && (
          <section className="resume-section break-inside-avoid">
            <h2 className="resume-section-heading font-bold uppercase tracking-wider text-[10.5pt] border-b border-slate-900 pb-0.5 mb-1">
              Professional Summary
            </h2>
            <p className="text-justify text-slate-800 leading-normal">
              {preserveSpecialCharacters(personalInfo.summary)}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {isVisible("workExperience") && workExperience.length > 0 && (
          <section className="resume-section">
            <h2 className="resume-section-heading font-bold uppercase tracking-wider text-[10.5pt] border-b border-slate-900 pb-0.5 mb-1.5 break-after-avoid">
              Work Experience
            </h2>
            <div className="space-y-2">
              {workExperience.map((exp) => (
                <div key={exp.id} className="resume-entry break-inside-avoid">
                  {/* Line 1: Bold Position Left, Date Right */}
                  <div className="flex justify-between items-baseline font-bold text-[10pt]">
                    <span className="text-slate-950">
                      {preserveSpecialCharacters(exp.position)}
                    </span>
                    <span className="text-[9pt] font-normal text-slate-600">
                      {joinNonEmpty([exp.startDate, exp.current ? "Present" : exp.endDate], " – ")}
                    </span>
                  </div>

                  {/* Line 2: Italic Company Left, Location Right */}
                  <div className="flex justify-between items-baseline italic text-[9.5pt] text-slate-700">
                    <span>{preserveSpecialCharacters(exp.company)}</span>
                    {exp.location && <span>{preserveSpecialCharacters(exp.location)}</span>}
                  </div>

                  {/* Bullets */}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-slate-800">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="leading-snug">
                          {preserveSpecialCharacters(bullet)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {isVisible("education") && education.length > 0 && (
          <section className="resume-section">
            <h2 className="resume-section-heading font-bold uppercase tracking-wider text-[10.5pt] border-b border-slate-900 pb-0.5 mb-1.5 break-after-avoid">
              Education
            </h2>
            <div className="space-y-1.5">
              {education.map((edu) => (
                <div key={edu.id} className="resume-entry break-inside-avoid">
                  <div className="flex justify-between items-baseline font-bold text-[10pt]">
                    <span className="text-slate-950">
                      {joinNonEmpty([edu.degree, edu.fieldOfStudy], " in ")}
                    </span>
                    <span className="text-[9pt] font-normal text-slate-600">
                      {joinNonEmpty([edu.startDate, edu.endDate], " – ")}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline italic text-[9.5pt] text-slate-700">
                    <span>{preserveSpecialCharacters(edu.institution)}</span>
                    <span>
                      {joinNonEmpty([edu.gpa ? `GPA: ${edu.gpa}` : null, edu.location], ", ")}
                    </span>
                  </div>
                  {edu.honors && (
                    <p className="text-[9pt] text-slate-600 italic">
                      {preserveSpecialCharacters(edu.honors)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical & Professional Skills: 2-column LEFT-aligned grid */}
        {isVisible("skills") && skills.length > 0 && (
          <section className="resume-section break-inside-avoid">
            <h2 className="resume-section-heading font-bold uppercase tracking-wider text-[10.5pt] border-b border-slate-900 pb-0.5 mb-1 break-after-avoid">
              Skills & Competencies
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-left text-[9.5pt]">
              {skills.map((cat) => {
                const categoryTitle =
                  cat.category || (cat as unknown as { name?: string }).name || "Skills";
                const skillItems =
                  cat.items || (cat as unknown as { skills?: string[] }).skills || [];

                return (
                  <div key={cat.id} className="text-left">
                    <span className="font-bold text-slate-900">
                      {preserveSpecialCharacters(categoryTitle)}:{" "}
                    </span>
                    <span className="text-slate-800">
                      {skillItems.map(preserveSpecialCharacters).join(", ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Projects */}
        {isVisible("projects") && projects.length > 0 && (
          <section className="resume-section">
            <h2 className="resume-section-heading font-bold uppercase tracking-wider text-[10.5pt] border-b border-slate-900 pb-0.5 mb-1.5 break-after-avoid">
              Key Projects
            </h2>
            <div className="space-y-2">
              {projects.map((proj) => {
                const techStr =
                  proj.technologies && proj.technologies.length > 0
                    ? proj.technologies.map(preserveSpecialCharacters).join(", ")
                    : null;
                const headerLine = joinNonEmpty([proj.name, techStr], " | ");

                return (
                  <div key={proj.id} className="resume-entry break-inside-avoid">
                    {/* Title in bold with NO bullet in front, tech stack after separator ONLY when present */}
                    <div className="flex justify-between items-baseline font-bold text-[10pt]">
                      <span className="text-slate-950">
                        {preserveSpecialCharacters(headerLine)}
                      </span>
                      {proj.liveUrl && (
                        <a
                          href={normalizeUrl(proj.liveUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9pt] font-normal text-indigo-700 hover:underline italic"
                        >
                          {getDisplayLinkText(proj.liveUrl, false)}
                        </a>
                      )}
                    </div>

                    {proj.description && (
                      <p className="text-[9.5pt] text-slate-700 mt-0.5">
                        {preserveSpecialCharacters(proj.description)}
                      </p>
                    )}

                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-slate-800">
                        {proj.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="leading-snug">
                            {preserveSpecialCharacters(b)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Additional Standard & Custom Sections */}
        <TemplateExtraSections
          content={content}
          themeConfig={themeConfig}
          headingClassName="font-bold uppercase tracking-wider text-[10.5pt] border-b border-slate-900 pb-0.5 mb-1.5"
          subheadingClassName="font-bold text-[10pt] text-slate-950"
        />
      </div>

      {/* Optional Visible Branding (Only if user explicitly chose visible level) */}
      {(brandingLevel === "visible" || showCreatedWithBadge) && (
        <footer className="mt-4 pt-2 border-t border-slate-200 text-center text-[8pt] text-slate-500 select-none">
          Created with ResumeForge
        </footer>
      )}
    </div>
  );
};
