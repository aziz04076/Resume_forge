import React from "react";
import { TemplateProps } from "./types";
import {
  getFontFamilyClass,
  getFontSizeClasses,
  getLineSpacingClass,
  getMarginPaddingClass,
} from "./templateUtils";
import { Globe, Linkedin, Github, GraduationCap, Sparkles } from "lucide-react";

export const FresherStarter: React.FC<TemplateProps> = ({ content, themeConfig, className = "" }) => {
  const { personalInfo, workExperience, education, skills, projects, certifications, languages } = content;
  const { primaryColor, accentColor, fontFamily, fontSize, lineSpacing, pageMargins, hiddenSections = [] } =
    themeConfig;

  const fontClass = getFontFamilyClass(fontFamily);
  const sizeClasses = getFontSizeClasses(fontSize);
  const spacingClass = getLineSpacingClass(lineSpacing);
  const paddingClass = getMarginPaddingClass(pageMargins);

  const isVisible = (sec: string) => !hiddenSections.includes(sec);

  return (
    <div className={`resume-paper ${fontClass} ${paddingClass} ${className} text-slate-800`}>
      {/* Header */}
      <header className="border-b-2 pb-4 mb-4" style={{ borderColor: primaryColor }}>
        <div className="flex justify-between items-baseline">
          <div>
            <h1 className={`${sizeClasses.name} font-bold`} style={{ color: primaryColor }}>
              {personalInfo.fullName || "Your Full Name"}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-xs font-semibold uppercase tracking-wider mt-0.5" style={{ color: accentColor }}>
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
          <div className="text-right text-[11px] text-slate-600 space-y-0.5">
            {personalInfo.email && (
              <div>
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                  {personalInfo.email}
                </a>
              </div>
            )}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
          </div>
        </div>

        <div className="flex gap-4 mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
          {personalInfo.linkedin && (
            <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-blue-600">
              <Linkedin className="w-2.5 h-2.5" /> LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-slate-800">
              <Github className="w-2.5 h-2.5" /> GitHub
            </a>
          )}
          {personalInfo.website && (
            <a href={personalInfo.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-slate-700">
              <Globe className="w-2.5 h-2.5" /> Portfolio
            </a>
          )}
        </div>
      </header>

      <div className={spacingClass}>
        {/* Career Objective / Profile */}
        {isVisible("summary") && personalInfo.summary && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5 flex items-center gap-1"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              <Sparkles className="w-3 h-3" style={{ color: accentColor }} />
              Career Objective
            </h2>
            <p className={`${sizeClasses.body} text-slate-700 leading-normal`}>
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Education First for Freshers */}
        {isVisible("education") && education.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2 flex items-center gap-1"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              <GraduationCap className="w-3.5 h-3.5" style={{ color: accentColor }} />
              Education & Academic Achievements
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                    <span>
                      {edu.degree} in {edu.fieldOfStudy}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[11px] text-slate-600">
                    <span>{edu.institution}, {edu.location}</span>
                    {edu.gpa && <span className="font-semibold text-slate-800">GPA: {edu.gpa}</span>}
                  </div>
                  {edu.honors && edu.honors.length > 0 && (
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      <span className="font-medium text-slate-700">Honors & Awards:</span> {edu.honors.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical & Soft Skills */}
        {isVisible("skills") && skills.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Skills & Proficiencies
            </h2>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {skills.map((cat) => (
                <div key={cat.id} className="p-1.5 bg-slate-50 rounded border border-slate-100">
                  <span className="font-semibold text-slate-800 block text-[10px] uppercase mb-0.5">
                    {cat.category}
                  </span>
                  <span className="text-slate-600">{cat.items.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Academic & Personal Projects */}
        {isVisible("projects") && projects.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Projects & Capstones
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-slate-900">
                      {proj.name} {proj.role ? `(${proj.role})` : ""}
                    </span>
                    <div className="text-[10px] text-blue-600 space-x-2">
                      {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="underline">Demo</a>}
                      {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="underline">Code</a>}
                    </div>
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

        {/* Internships & Work Experience */}
        {isVisible("workExperience") && workExperience.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Experience & Internships
            </h2>
            <div className="space-y-2.5">
              {workExperience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                    <span>{exp.position} — <span className="font-normal text-slate-600">{exp.company}</span></span>
                    <span className="text-[10px] text-slate-500">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5">
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

        {/* Certifications & Languages */}
        <div className="grid grid-cols-2 gap-4">
          {isVisible("certifications") && certifications.length > 0 && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-1"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Certifications
              </h2>
              <div className="space-y-0.5 text-[11px]">
                {certifications.map((c) => (
                  <div key={c.id} className="text-slate-800">
                    <span className="font-medium">{c.name}</span> <span className="text-slate-500">({c.issuer})</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {isVisible("languages") && languages.length > 0 && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-1"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Languages
              </h2>
              <p className="text-[11px] text-slate-700">
                {languages.map((l) => `${l.language} (${l.proficiency})`).join(", ")}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
