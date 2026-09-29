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

export const ModernSlate: React.FC<TemplateProps> = ({ content, themeConfig, className = "" }) => {
  const { personalInfo, workExperience, education, skills, projects } = content;
  const { primaryColor, accentColor, fontFamily, fontSize, lineSpacing, pageMargins, hiddenSections = [] } =
    themeConfig;

  const fontClass = getFontFamilyClass(fontFamily);
  const sizeClasses = getFontSizeClasses(fontSize);
  const spacingClass = getLineSpacingClass(lineSpacing);
  const paddingClass = getMarginPaddingClass(pageMargins);

  const isVisible = (sec: string) => !hiddenSections.includes(sec);

  return (
    <div className={`resume-paper ${fontClass} ${paddingClass} ${className} text-slate-800`}>
      {/* Modern Banner Header */}
      <header className="bg-slate-50 -mx-9 -mt-9 p-8 mb-6 border-b border-slate-200">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <TemplateAvatar personalInfo={personalInfo} />
            <div>
              <h1 className={`${sizeClasses.name} tracking-tight font-extrabold`} style={{ color: primaryColor }}>
                {personalInfo.fullName || "Your Full Name"}
              </h1>
              {personalInfo.jobTitle && (
                <p className="text-sm font-semibold mt-1" style={{ color: accentColor }}>
                  {personalInfo.jobTitle}
                </p>
              )}
            </div>
          </div>
          <TemplateContactLinks personalInfo={personalInfo} variant="stacked" className="text-right" />
        </div>
      </header>

      <div className={spacingClass}>
        {/* Executive Summary */}
        {isVisible("summary") && personalInfo.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 pl-2 mb-1.5" style={{ borderColor: accentColor }}>
              Executive Summary
            </h2>
            <p className={`${sizeClasses.body} text-slate-700 leading-normal`}>{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {isVisible("workExperience") && workExperience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 pl-2 mb-2.5" style={{ borderColor: accentColor }}>
              Professional Experience
            </h2>
            <div className="space-y-3.5">
              {workExperience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                    <span>{exp.position}</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 mb-1">
                    {exp.company} {exp.location ? `• ${exp.location}` : ""}
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1">
                      {exp.bullets.map((b, idx) => (
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

        {/* Skills */}
        {isVisible("skills") && skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 pl-2 mb-2" style={{ borderColor: accentColor }}>
              Competencies & Skills
            </h2>
            <div className="space-y-1">
              {skills.map((cat) => (
                <div key={cat.id} className="text-[11px]">
                  <span className="font-bold text-slate-900">{cat.category}: </span>
                  <span className="text-slate-700">{cat.items.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Projects Grid */}
        <div className="grid grid-cols-2 gap-4">
          {isVisible("education") && education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 pl-2 mb-1.5" style={{ borderColor: accentColor }}>
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="text-[11px]">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600">{edu.institution}</div>
                  <div className="text-[10px] text-slate-500">
                    {edu.startDate} – {edu.endDate} {edu.gpa ? `• GPA ${edu.gpa}` : ""}
                  </div>
                </div>
              ))}
            </section>
          )}

          {isVisible("projects") && projects.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 pl-2 mb-1.5" style={{ borderColor: accentColor }}>
                Featured Projects
              </h2>
              {projects.slice(0, 2).map((proj) => (
                <div key={proj.id} className="text-[11px] mb-1">
                  <div className="font-bold text-slate-900">{proj.name}</div>
                  <div className="text-[10px] text-slate-600 line-clamp-2">{proj.description}</div>
                </div>
              ))}
            </section>
          )}

          {/* Extra Multi-Entry Sections */}
          <TemplateExtraSections content={content} themeConfig={themeConfig} />
        </div>
      </div>
    </div>
  );
};
