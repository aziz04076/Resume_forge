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

export const MinimalATS: React.FC<TemplateProps> = ({ content, themeConfig, className = "" }) => {
  const { personalInfo, workExperience, education, skills, projects, certifications, languages, customSections } =
    content;
  const { primaryColor, accentColor, fontFamily, fontSize, lineSpacing, pageMargins, hiddenSections = [] } =
    themeConfig;

  const fontClass = getFontFamilyClass(fontFamily);
  const sizeClasses = getFontSizeClasses(fontSize);
  const spacingClass = getLineSpacingClass(lineSpacing);
  const paddingClass = getMarginPaddingClass(pageMargins);

  const isVisible = (sec: string) => !hiddenSections.includes(sec);

  return (
    <div
      className={`resume-paper ${fontClass} ${paddingClass} ${className} text-slate-800`}
      style={{ color: primaryColor }}
    >
      {/* Header */}
      <header
        className="border-b pb-4 mb-4 flex items-center justify-between gap-4"
        style={{ borderColor: primaryColor + "33" }}
      >
        <div className="flex-1">
          <h1 className={`${sizeClasses.name} uppercase tracking-wider mb-1`} style={{ color: primaryColor }}>
            {personalInfo.fullName || "Your Full Name"}
          </h1>
          {personalInfo.jobTitle && (
            <p className={`${sizeClasses.role} font-medium mb-2`} style={{ color: accentColor }}>
              {personalInfo.jobTitle}
            </p>
          )}
          <TemplateContactLinks personalInfo={personalInfo} />
        </div>
        <TemplateAvatar personalInfo={personalInfo} />
      </header>

      <div className={spacingClass}>
        {/* Professional Summary */}
        {isVisible("summary") && personalInfo.summary && (
          <section>
            <h2
              className={`${sizeClasses.heading} font-bold border-b pb-0.5 mb-1.5`}
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Professional Summary
            </h2>
            <p className={`${sizeClasses.body} text-slate-700 leading-normal text-justify`}>
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {isVisible("workExperience") && workExperience.length > 0 && (
          <section>
            <h2
              className={`${sizeClasses.heading} font-bold border-b pb-0.5 mb-2`}
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Work Experience
            </h2>
            <div className="space-y-3">
              {workExperience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className={`${sizeClasses.subheading} font-bold text-slate-900`}>
                      {exp.position} — <span className="font-semibold text-slate-700">{exp.company}</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-600">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.location && (
                    <div className="text-[10px] text-slate-500 italic mb-1">{exp.location}</div>
                  )}

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
                    <p className="text-[10px] text-slate-500 mt-1">
                      <span className="font-semibold text-slate-600">Technologies:</span>{" "}
                      {exp.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {isVisible("education") && education.length > 0 && (
          <section>
            <h2
              className={`${sizeClasses.heading} font-bold border-b pb-0.5 mb-2`}
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <span className={`${sizeClasses.subheading} font-bold text-slate-900`}>
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600">
                      {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[11px] text-slate-600">
                    <span>{edu.institution}</span>
                    {edu.location && <span>{edu.location}</span>}
                  </div>
                  {edu.gpa && (
                    <div className="text-[10px] text-slate-600 mt-0.5">GPA: {edu.gpa}</div>
                  )}
                  {edu.honors && edu.honors.length > 0 && (
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Honors: {edu.honors.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {isVisible("skills") && skills.length > 0 && (
          <section>
            <h2
              className={`${sizeClasses.heading} font-bold border-b pb-0.5 mb-2`}
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Skills & Competencies
            </h2>
            <div className="space-y-1">
              {skills.map((cat) => (
                <div key={cat.id} className="text-[11px] text-slate-700">
                  <span className="font-bold text-slate-900">{cat.category}: </span>
                  <span>{cat.items.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {isVisible("projects") && projects.length > 0 && (
          <section>
            <h2
              className={`${sizeClasses.heading} font-bold border-b pb-0.5 mb-2`}
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Key Projects
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <span className={`${sizeClasses.subheading} font-bold text-slate-900`}>
                      {proj.name}
                      {proj.role && <span className="font-normal text-slate-600"> — {proj.role}</span>}
                    </span>
                    {(proj.liveUrl || proj.githubUrl) && (
                      <span className="text-[10px] text-blue-600 space-x-2">
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="underline">
                            Live Demo
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="underline">
                            GitHub
                          </a>
                        )}
                      </span>
                    )}
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
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[10px] text-slate-500 mt-1">
                      <span className="font-semibold text-slate-600">Built with:</span>{" "}
                      {proj.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {isVisible("certifications") && certifications.length > 0 && (
          <section>
            <h2
              className={`${sizeClasses.heading} font-bold border-b pb-0.5 mb-1.5`}
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Certifications & Credentials
            </h2>
            <div className="space-y-1">
              {certifications.map((c) => (
                <div key={c.id} className="flex justify-between text-[11px]">
                  <span className="font-semibold text-slate-800">
                    {c.name} — <span className="font-normal text-slate-600">{c.issuer}</span>
                  </span>
                  <span className="text-slate-500">{c.issueDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {isVisible("languages") && languages.length > 0 && (
          <section>
            <h2
              className={`${sizeClasses.heading} font-bold border-b pb-0.5 mb-1.5`}
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Languages
            </h2>
            <p className="text-[11px] text-slate-700">
              {languages.map((l) => `${l.language} (${l.proficiency})`).join(" • ")}
            </p>
          </section>
        )}

        {/* Custom Sections */}
        {isVisible("customSections") &&
          customSections.map((sec) => (
            <section key={sec.id}>
              <h2
                className={`${sizeClasses.heading} font-bold border-b pb-0.5 mb-2`}
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                {sec.heading}
              </h2>
              <div className="space-y-2">
                {sec.items.map((it) => (
                  <div key={it.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[11px] text-slate-900">
                        {it.title} {it.subtitle ? `— ${it.subtitle}` : ""}
                      </span>
                      {it.date && <span className="text-[10px] text-slate-500">{it.date}</span>}
                    </div>
                    {it.description && (
                      <p className={`${sizeClasses.body} text-slate-700`}>{it.description}</p>
                    )}
                    {it.bullets && it.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5">
                        {it.bullets.map((b, idx) => (
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
          ))}

        {/* Extra Multi-Entry Sections */}
        <TemplateExtraSections content={content} themeConfig={themeConfig} />
      </div>
    </div>
  );
};
