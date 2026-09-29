import React from "react";
import { TemplateProps } from "./types";
import {
  getFontFamilyClass,
  getFontSizeClasses,
  getLineSpacingClass,
  getMarginPaddingClass,
} from "./templateUtils";
import { TemplateAvatar } from "./TemplateAvatar";
import { TemplateContactLinks } from "./TemplateContactLinks";
import { TemplateExtraSections } from "./TemplateExtraSections";
import { ExternalLink, Code2 } from "lucide-react";

export const TechModern: React.FC<TemplateProps> = ({ content, themeConfig, className = "" }) => {
  const { personalInfo, workExperience, education, skills, projects, certifications } =
    content;
  const { primaryColor, accentColor, fontFamily, fontSize, lineSpacing, pageMargins, hiddenSections = [] } =
    themeConfig;

  const fontClass = getFontFamilyClass(fontFamily);
  const sizeClasses = getFontSizeClasses(fontSize);
  const spacingClass = getLineSpacingClass(lineSpacing);
  const paddingClass = getMarginPaddingClass(pageMargins);

  const isVisible = (sec: string) => !hiddenSections.includes(sec);

  return (
    <div className={`resume-paper ${fontClass} ${paddingClass} ${className} text-slate-800`}>
      {/* Tech Header */}
      <header className="border-b-2 pb-4 mb-4" style={{ borderColor: accentColor }}>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <TemplateAvatar personalInfo={personalInfo} />
            <div>
              <h1 className={`${sizeClasses.name} tracking-tight font-extrabold`} style={{ color: primaryColor }}>
                {personalInfo.fullName || "Your Full Name"}
              </h1>
              {personalInfo.jobTitle && (
                <p
                  className="text-xs font-mono font-semibold tracking-wide mt-0.5 uppercase"
                  style={{ color: accentColor }}
                >
                  {"//"} {personalInfo.jobTitle}
                </p>
              )}
            </div>
          </div>
          <TemplateContactLinks personalInfo={personalInfo} variant="stacked" className="text-right font-mono" />
        </div>
      </header>

      <div className={spacingClass}>
        {/* Technical Summary */}
        {isVisible("summary") && personalInfo.summary && (
          <section>
            <h2
              className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5"
              style={{ color: primaryColor }}
            >
              <span style={{ color: accentColor }}>&gt;</span> System Overview
            </h2>
            <p className={`${sizeClasses.body} text-slate-700 leading-normal`}>
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Technical Skills - High Visibility Grid */}
        {isVisible("skills") && skills.length > 0 && (
          <section>
            <h2
              className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2"
              style={{ color: primaryColor }}
            >
              <Code2 className="w-3.5 h-3.5" style={{ color: accentColor }} />
              Technical Stack & Competencies
            </h2>
            <div className="space-y-1.5">
              {skills.map((cat) => (
                <div key={cat.id} className="flex items-baseline text-[11px]">
                  <span className="font-mono font-semibold text-slate-900 w-36 shrink-0">
                    {cat.category}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-200"
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

        {/* Work Experience */}
        {isVisible("workExperience") && workExperience.length > 0 && (
          <section>
            <h2
              className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2"
              style={{ color: primaryColor }}
            >
              <span style={{ color: accentColor }}>&gt;</span> Experience & Engineering Impact
            </h2>
            <div className="space-y-3">
              {workExperience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-slate-900">
                      {exp.position} <span className="font-semibold text-slate-600">@ {exp.company}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate} | {exp.location}
                    </span>
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-1">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className={`${sizeClasses.body} text-slate-700`}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5 items-center">
                      <span className="text-[9px] font-mono uppercase text-slate-400">Stack:</span>
                      {exp.technologies.map((t, tidx) => (
                        <span
                          key={tidx}
                          className="bg-slate-50 text-slate-700 px-1 py-0.2 rounded text-[9px] font-mono border border-slate-200"
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

        {/* Projects */}
        {isVisible("projects") && projects.length > 0 && (
          <section>
            <h2
              className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2"
              style={{ color: primaryColor }}
            >
              <span style={{ color: accentColor }}>&gt;</span> Featured Architecture & Open Source
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      {proj.name}
                      {proj.role && <span className="font-normal text-[10px] text-slate-500 font-mono">({proj.role})</span>}
                    </span>
                    <div className="flex gap-2 text-[10px] font-mono">
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-0.5 text-blue-600 hover:underline"
                        >
                          Live <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-0.5 text-slate-700 hover:underline"
                        >
                          Repo <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  {proj.description && (
                    <p className={`${sizeClasses.body} text-slate-600 mt-0.5`}>{proj.description}</p>
                  )}
                  {proj.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5">
                      {proj.bullets.map((b, idx) => (
                        <li key={idx} className={`${sizeClasses.body} text-slate-700`}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Certs Split Grid */}
        <div className="grid grid-cols-2 gap-4">
          {isVisible("education") && education.length > 0 && (
            <section>
              <h2
                className="text-xs font-mono font-bold uppercase tracking-wider mb-1.5"
                style={{ color: primaryColor }}
              >
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="text-[11px]">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600">{edu.institution}</div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {edu.startDate} – {edu.endDate} {edu.gpa ? `| GPA: ${edu.gpa}` : ""}
                  </div>
                </div>
              ))}
            </section>
          )}

          {isVisible("certifications") && certifications.length > 0 && (
            <section>
              <h2
                className="text-xs font-mono font-bold uppercase tracking-wider mb-1.5"
                style={{ color: primaryColor }}
              >
                Certifications
              </h2>
              <div className="space-y-1">
                {certifications.map((c) => (
                  <div key={c.id} className="text-[11px]">
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {c.issuer} • {c.issueDate}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Extra Multi-Entry Sections */}
          <TemplateExtraSections content={content} themeConfig={themeConfig} />
        </div>
      </div>
    </div>
  );
};
