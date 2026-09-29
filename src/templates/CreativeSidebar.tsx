import React from "react";
import { TemplateProps } from "./types";
import {
  getFontFamilyClass,
  getFontSizeClasses,
  getLineSpacingClass,
} from "./templateUtils";
import { TemplateAvatar } from "./TemplateAvatar";
import { TemplateContactLinks } from "./TemplateContactLinks";
import { TemplateExtraSections } from "./TemplateExtraSections";

export const CreativeSidebar: React.FC<TemplateProps> = ({ content, themeConfig, className = "" }) => {
  const { personalInfo, workExperience, education, skills, projects, certifications, languages } = content;
  const { primaryColor, accentColor, fontFamily, fontSize, lineSpacing, hiddenSections = [] } =
    themeConfig;

  const fontClass = getFontFamilyClass(fontFamily);
  const sizeClasses = getFontSizeClasses(fontSize);
  const spacingClass = getLineSpacingClass(lineSpacing);

  const isVisible = (sec: string) => !hiddenSections.includes(sec);

  return (
    <div className={`resume-paper ${fontClass} ${className} flex overflow-hidden min-h-[297mm]`}>
      {/* Left Sidebar (35% width) */}
      <aside
        className="w-[34%] p-6 text-white flex flex-col justify-between"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="space-y-6">
          {/* Avatar & Personal Info */}
          <div>
            <TemplateAvatar personalInfo={personalInfo} className="mb-3 border-2 border-white/30" />
            <h1 className="text-xl font-extrabold tracking-tight leading-tight text-white mb-1">
              {personalInfo.fullName || "Your Full Name"}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-xs font-medium text-slate-200 opacity-90 uppercase tracking-wider">
                {personalInfo.jobTitle}
              </p>
            )}
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-[11px] text-slate-100">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 border-b border-white/20 pb-1">
              Contact
            </h2>
            <TemplateContactLinks
              personalInfo={personalInfo}
              variant="stacked"
              textColor="#f8fafc"
              iconColor="#cbd5e1"
            />
          </div>

          {/* Education in Sidebar */}
          {isVisible("education") && education.length > 0 && (
            <div className="space-y-2 text-slate-100">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 border-b border-white/20 pb-1">
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="text-[11px]">
                  <div className="font-bold text-white">{edu.degree}</div>
                  <div className="text-slate-200">{edu.fieldOfStudy}</div>
                  <div className="text-slate-300 text-[10px]">{edu.institution}</div>
                  <div className="text-slate-400 text-[9px]">
                    {edu.startDate} – {edu.endDate} {edu.gpa ? `• GPA: ${edu.gpa}` : ""}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills in Sidebar */}
          {isVisible("skills") && skills.length > 0 && (
            <div className="space-y-2 text-slate-100">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 border-b border-white/20 pb-1">
                Skills
              </h2>
              {skills.map((cat) => (
                <div key={cat.id} className="text-[11px]">
                  <div className="font-semibold text-slate-200 text-[10px] uppercase">{cat.category}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cat.items.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-white/15 px-1.5 py-0.5 rounded text-[10px] text-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages in Sidebar */}
          {isVisible("languages") && languages.length > 0 && (
            <div className="space-y-1 text-slate-100">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 border-b border-white/20 pb-1">
                Languages
              </h2>
              {languages.map((l) => (
                <div key={l.id} className="text-[11px] flex justify-between">
                  <span>{l.language}</span>
                  <span className="text-slate-300 text-[10px]">{l.proficiency}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Right Content Area (66% width) */}
      <main className="w-[66%] p-7 bg-white text-slate-800">
        <div className={spacingClass}>
          {/* Summary */}
          {isVisible("summary") && personalInfo.summary && (
            <section>
              <h2
                className={`${sizeClasses.heading} font-bold border-b-2 pb-0.5 mb-2`}
                style={{ borderColor: accentColor, color: primaryColor }}
              >
                Profile Summary
              </h2>
              <p className={`${sizeClasses.body} text-slate-700 leading-normal`}>
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {isVisible("workExperience") && workExperience.length > 0 && (
            <section>
              <h2
                className={`${sizeClasses.heading} font-bold border-b-2 pb-0.5 mb-2.5`}
                style={{ borderColor: accentColor, color: primaryColor }}
              >
                Experience
              </h2>
              <div className="space-y-3">
                {workExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-xs text-slate-900">{exp.position}</span>
                      <span className="text-[10px] font-medium text-slate-500">
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

          {/* Key Projects */}
          {isVisible("projects") && projects.length > 0 && (
            <section>
              <h2
                className={`${sizeClasses.heading} font-bold border-b-2 pb-0.5 mb-2`}
                style={{ borderColor: accentColor, color: primaryColor }}
              >
                Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-xs text-slate-900">{proj.name}</span>
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-blue-600 hover:underline"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <p className={`${sizeClasses.body} text-slate-600 mt-0.5`}>{proj.description}</p>
                    )}
                    {proj.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5">
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

          {/* Certifications */}
          {isVisible("certifications") && certifications.length > 0 && (
            <section>
              <h2
                className={`${sizeClasses.heading} font-bold border-b-2 pb-0.5 mb-1.5`}
                style={{ borderColor: accentColor, color: primaryColor }}
              >
                Certifications
              </h2>
              <div className="space-y-1">
                {certifications.map((c) => (
                  <div key={c.id} className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-800">{c.name}</span>
                    <span className="text-slate-500">{c.issueDate}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Extra Multi-Entry Sections */}
          <TemplateExtraSections content={content} themeConfig={themeConfig} />
        </div>
      </main>
    </div>
  );
};
