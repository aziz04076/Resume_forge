import React from "react";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";
import { getFontSizeClasses } from "./templateUtils";
import { ExternalLink } from "lucide-react";

interface TemplateExtraSectionsProps {
  content: ResumeContent;
  themeConfig: ThemeConfig;
  className?: string;
  headingClassName?: string;
  subheadingClassName?: string;
}

export const TemplateExtraSections: React.FC<TemplateExtraSectionsProps> = ({
  content,
  themeConfig,
  className = "",
  headingClassName = "",
  subheadingClassName = "",
}) => {
  const {
    internships = [],
    courses = [],
    publications = [],
    volunteering = [],
    awards = [],
    references = [],
  } = content;

  const { primaryColor, fontSize, hiddenSections = [] } = themeConfig;
  const sizeClasses = getFontSizeClasses(fontSize);
  const isVisible = (sec: string) => !hiddenSections.includes(sec);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Internships */}
      {isVisible("internships") && internships.length > 0 && (
        <section>
          <h2
            className={`${sizeClasses.heading} font-bold border-b pb-0.5 mb-2 ${headingClassName}`}
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Internships & Practical Training
          </h2>
          <div className="space-y-2.5">
            {internships.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-baseline">
                  <div className="flex items-baseline gap-2">
                    <span className={`${sizeClasses.subheading} font-bold text-slate-900 ${subheadingClassName}`}>
                      {item.position}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600">
                      @ {item.company}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {item.startDate} {item.endDate ? `– ${item.endDate}` : ""}
                  </span>
                </div>
                {item.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-700 text-[11px]">
                    {item.bullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">
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

      {/* Publications */}
      {isVisible("publications") && publications.length > 0 && (
        <section>
          <h2
            className={`${sizeClasses.heading} font-bold border-b pb-0.5 mb-2 ${headingClassName}`}
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Publications & Research
          </h2>
          <div className="space-y-2">
            {publications.map((pub) => (
              <div key={pub.id} className="text-[11px]">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-slate-900">
                    {pub.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{pub.date}</span>
                </div>
                <div className="text-slate-600 italic">
                  {pub.publisher}
                  {pub.url && (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 inline-flex items-center gap-0.5 text-indigo-600 hover:underline not-italic text-[10px]"
                    >
                      <span>Link</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                {pub.description && (
                  <p className="text-slate-600 mt-0.5 leading-snug">{pub.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Courses & Specialized Training */}
      {isVisible("courses") && courses.length > 0 && (
        <section>
          <h2
            className={`${sizeClasses.heading} font-bold border-b pb-0.5 mb-2 ${headingClassName}`}
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Courses & Specialized Training
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
            {courses.map((c) => (
              <div key={c.id} className="p-2 rounded bg-slate-50 border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  <div className="text-[10px] text-slate-600">{c.institution}</div>
                </div>
                {c.date && <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{c.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteering & Leadership */}
      {isVisible("volunteering") && volunteering.length > 0 && (
        <section>
          <h2
            className={`${sizeClasses.heading} font-bold border-b pb-0.5 mb-2 ${headingClassName}`}
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Volunteering & Community Leadership
          </h2>
          <div className="space-y-2">
            {volunteering.map((v) => (
              <div key={v.id} className="text-[11px]">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-slate-900">{v.role} — {v.organization}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{v.period}</span>
                </div>
                {v.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-slate-700">
                    {v.bullets.map((b, i) => (
                      <li key={i} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Honors & Awards */}
      {isVisible("awards") && awards.length > 0 && (
        <section>
          <h2
            className={`${sizeClasses.heading} font-bold border-b pb-0.5 mb-2 ${headingClassName}`}
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Honors & Awards
          </h2>
          <div className="space-y-2">
            {awards.map((aw) => (
              <div key={aw.id} className="text-[11px]">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-slate-900">{aw.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{aw.date}</span>
                </div>
                <div className="text-slate-600 text-[10px]">{aw.issuer}</div>
                {aw.description && (
                  <p className="text-slate-700 mt-0.5 leading-snug">{aw.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {isVisible("references") && references.length > 0 && (
        <section>
          <h2
            className={`${sizeClasses.heading} font-bold border-b pb-0.5 mb-2 ${headingClassName}`}
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            References
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {references.map((ref) => (
              <div key={ref.id} className="p-2 rounded bg-slate-50 border border-slate-100">
                <div className="font-semibold text-slate-900">{ref.name}</div>
                <div className="text-[10px] text-slate-600">{ref.role} — {ref.organization}</div>
                <div className="text-[10px] font-mono text-indigo-600 mt-0.5">{ref.contact}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
