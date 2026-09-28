import React from "react";
import { TemplateProps } from "./types";
import {
  getFontSizeClasses,
  getLineSpacingClass,
  getMarginPaddingClass,
} from "./templateUtils";

export const ExecutiveClassic: React.FC<TemplateProps> = ({ content, themeConfig, className = "" }) => {
  const { personalInfo, workExperience, education, skills, certifications } = content;
  const { primaryColor, fontSize, lineSpacing, pageMargins, hiddenSections = [] } =
    themeConfig;

  const sizeClasses = getFontSizeClasses(fontSize);
  const spacingClass = getLineSpacingClass(lineSpacing);
  const paddingClass = getMarginPaddingClass(pageMargins);

  const isVisible = (sec: string) => !hiddenSections.includes(sec);

  return (
    <div
      className={`resume-paper font-serif ${paddingClass} ${className} text-stone-900 border-t-8`}
      style={{ borderColor: primaryColor }}
    >
      {/* Centered Traditional Executive Header */}
      <header className="text-center border-b-2 pb-4 mb-4" style={{ borderColor: primaryColor + "33" }}>
        <h1
          className={`${sizeClasses.name} tracking-tight font-bold uppercase mb-1`}
          style={{ color: primaryColor }}
        >
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-xs italic tracking-wide text-stone-600 mb-2">
            {personalInfo.jobTitle}
          </p>
        )}

        <div className="flex flex-wrap justify-center items-center gap-x-3 text-[11px] text-stone-600">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && (
            <span>
              • <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
            </span>
          )}
          {personalInfo.linkedin && (
            <span>
              • <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.linkedin}</a>
            </span>
          )}
          {personalInfo.website && (
            <span>
              • <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.website.replace(/^https?:\/\//, "")}</a>
            </span>
          )}
        </div>
      </header>

      <div className={spacingClass}>
        {/* Executive Summary */}
        {isVisible("summary") && personalInfo.summary && (
          <section>
            <h2
              className={`${sizeClasses.heading} font-bold text-center border-b pb-0.5 mb-2 uppercase tracking-widest`}
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Executive Summary
            </h2>
            <p className={`${sizeClasses.body} text-stone-800 text-justify leading-relaxed`}>
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Professional Experience */}
        {isVisible("workExperience") && workExperience.length > 0 && (
          <section>
            <h2
              className={`${sizeClasses.heading} font-bold text-center border-b pb-0.5 mb-2.5 uppercase tracking-widest`}
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Professional Experience
            </h2>
            <div className="space-y-3.5">
              {workExperience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline font-bold text-xs text-stone-900">
                    <span>{exp.position}</span>
                    <span className="text-[11px] font-normal italic text-stone-600">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[11px] italic text-stone-700 mb-1">
                    <span>{exp.company}</span>
                    <span>{exp.location}</span>
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1">
                      {exp.bullets.map((b, idx) => (
                        <li key={idx} className={`${sizeClasses.body} text-stone-800`}>
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

        {/* Education & Academic Honors */}
        {isVisible("education") && education.length > 0 && (
          <section>
            <h2
              className={`${sizeClasses.heading} font-bold text-center border-b pb-0.5 mb-2 uppercase tracking-widest`}
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Education & Honors
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline font-bold text-xs text-stone-900">
                    <span>{edu.institution}</span>
                    <span className="text-[11px] font-normal italic text-stone-600">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[11px] text-stone-700">
                    <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                  {edu.honors && edu.honors.length > 0 && (
                    <div className="text-[10px] italic text-stone-600 mt-0.5">
                      Honors: {edu.honors.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Core Competencies & Board Affiliations */}
        {isVisible("skills") && skills.length > 0 && (
          <section>
            <h2
              className={`${sizeClasses.heading} font-bold text-center border-b pb-0.5 mb-2 uppercase tracking-widest`}
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Core Competencies & Areas of Expertise
            </h2>
            <div className="space-y-1 text-center">
              {skills.map((cat) => (
                <p key={cat.id} className="text-[11px] text-stone-800">
                  <span className="font-bold">{cat.category}: </span>
                  <span>{cat.items.join(" • ")}</span>
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Governance */}
        {isVisible("certifications") && certifications.length > 0 && (
          <section>
            <h2
              className={`${sizeClasses.heading} font-bold text-center border-b pb-0.5 mb-1.5 uppercase tracking-widest`}
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Credentials & Affiliations
            </h2>
            <div className="space-y-1 text-[11px] text-stone-800 text-center">
              {certifications.map((c) => (
                <div key={c.id}>
                  <span className="font-semibold">{c.name}</span> — {c.issuer} ({c.issueDate})
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
