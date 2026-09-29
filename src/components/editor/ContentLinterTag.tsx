"use client";

import React from "react";
import { detectContentIssues, checkResumeSpelling } from "@/lib/utils/formatUtils";
import { AlertCircle, Lightbulb } from "lucide-react";

interface ContentLinterTagProps {
  text: string;
  fieldName?: string;
  className?: string;
}

export const ContentLinterTag: React.FC<ContentLinterTagProps> = ({
  text,
  fieldName = "Bullet",
  className = "",
}) => {
  if (!text || text.trim().length === 0) return null;

  const issues = detectContentIssues(text, fieldName);
  const spelling = checkResumeSpelling(text);

  if (issues.length === 0 && spelling.length === 0) return null;

  return (
    <div className={`flex flex-col gap-1 text-[11px] mt-1 ml-4 ${className}`}>
      {issues.map((iss, idx) => (
        <div
          key={`issue-${idx}`}
          className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-md"
        >
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{iss.message}</span>
        </div>
      ))}
      {spelling.map((sp, idx) => (
        <div
          key={`spell-${idx}`}
          className="flex items-center gap-1.5 text-sky-400 bg-sky-500/10 border border-sky-500/25 px-2 py-0.5 rounded-md"
        >
          <Lightbulb className="w-3 h-3 shrink-0 text-sky-400" />
          <span>
            Spelling suggestion: &quot;{sp.word}&quot; → <strong className="text-white">{sp.suggestion}</strong>
          </span>
        </div>
      ))}
    </div>
  );
};
