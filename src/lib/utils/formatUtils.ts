/**
 * formatUtils.ts
 *
 * Robust text formatting, dangling-separator elimination,
 * special-character survival, incomplete-content linting, and resume spellchecking.
 */

/**
 * Joins non-empty string parts with a separator.
 * Completely eliminates dangling separators like "|", ",", or "-"
 * when optional fields (company, location, dates, tech stack) are blank.
 */
export function joinNonEmpty(
  parts: (string | null | undefined | false | 0)[],
  separator: string = " | "
): string {
  return parts
    .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
    .map((p) => p.trim())
    .join(separator);
}

/**
 * Formats a project title with its optional technologies cleanly.
 * Rule: Title in bold with NO bullet in front, tech stack after separator ONLY when present.
 */
export function formatProjectHeading(name: string, technologies?: string[] | null): {
  title: string;
  techSuffix: string;
} {
  const cleanTitle = (name || "").trim();
  const validTech = (technologies || [])
    .filter((t) => typeof t === "string" && t.trim().length > 0)
    .map((t) => t.trim());

  return {
    title: cleanTitle,
    techSuffix: validTech.length > 0 ? ` | ${validTech.join(", ")}` : "",
  };
}

/**
 * Ensures special characters survive intact across all preview, PDF, and DOCX pipelines:
 * % & $ # _ { } < > " ' – — ’ and international unicode characters.
 */
export function preserveSpecialCharacters(input: unknown): string {
  if (input === null || input === undefined) return "";
  const str = typeof input === "string" ? input : String(input);
  return str.normalize("NFC");
}

/**
 * Incomplete content detector:
 * Flags bullet points that end abruptly on a number, comma, unfinished sentence,
 * or broken metrics (e.g. "response latency, 98", "increased by", "managed a team of,").
 */
export interface ContentIssue {
  type: "unfinished_number" | "dangling_punctuation" | "unfinished_phrase" | "empty_field";
  message: string;
  field?: string;
  sample?: string;
}

export function detectContentIssues(text: string, fieldName = "Bullet"): ContentIssue[] {
  const issues: ContentIssue[] = [];
  if (!text || text.trim().length === 0) return issues;

  const trimmed = text.trim();

  // 1. Ends abruptly on a digit preceded by comma/space (e.g. "...latency, 98" or "reduced to 45")
  if (/[,:\s]\d+$/.test(trimmed)) {
    issues.push({
      type: "unfinished_number",
      field: fieldName,
      sample: trimmed,
      message: `${fieldName} ends abruptly with a number ("${trimmed.slice(-15)}"). Did you forget a unit or "%"?`,
    });
  }

  // 2. Ends with dangling comma, colon, hyphen, or slash
  if (/[,:;\-\/\\]$/.test(trimmed)) {
    issues.push({
      type: "dangling_punctuation",
      field: fieldName,
      sample: trimmed,
      message: `${fieldName} ends with dangling punctuation ("${trimmed.slice(-1)}").`,
    });
  }

  // 3. Ends with common dangling prepositions/conjunctions
  const trailingPrepositions = /\b(and|or|with|to|of|by|for|in|at|from|the|a|an)$/i;
  if (trailingPrepositions.test(trimmed.replace(/[.,!?]+$/, ""))) {
    issues.push({
      type: "unfinished_phrase",
      field: fieldName,
      sample: trimmed,
      message: `${fieldName} appears unfinished (ends with a connecting word like "${trimmed.split(/\s+/).pop()}").`,
    });
  }

  return issues;
}

/**
 * Common high-frequency resume typos and their standard professional corrections.
 */
export const COMMON_RESUME_TYPOS: Record<string, string> = {
  teh: "the",
  managment: "management",
  devloper: "developer",
  develope: "develop",
  experiance: "experience",
  responisble: "responsible",
  responsable: "responsible",
  acheived: "achieved",
  achievment: "achievement",
  seperate: "separate",
  implimented: "implemented",
  impliment: "implement",
  leaded: "led",
  recieve: "receive",
  recieved: "received",
  maintainance: "maintenance",
  colaberated: "collaborated",
  enviroment: "environment",
  coordinationg: "coordinating",
  supervized: "supervised",
  comunication: "communication",
  sucessful: "successful",
  occured: "occurred",
  referance: "reference",
  proficientcy: "proficiency",
  technolgy: "technology",
  databse: "database",
  architechture: "architecture",
  reponsibility: "responsibility",
  analys: "analysis",
};

export interface SpellingIssue {
  word: string;
  suggestion: string;
  index: number;
}

export function checkResumeSpelling(text: string): SpellingIssue[] {
  const issues: SpellingIssue[] = [];
  if (!text) return issues;

  // Split on word boundaries, keeping match positions
  const regex = /\b[A-Za-z]{3,}\b/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const word = match[0];
    const lower = word.toLowerCase();
    if (COMMON_RESUME_TYPOS[lower]) {
      // Preserve original capitalization
      const suggestion =
        word[0] === word[0].toUpperCase() && word.length > 1
          ? COMMON_RESUME_TYPOS[lower][0].toUpperCase() + COMMON_RESUME_TYPOS[lower].slice(1)
          : COMMON_RESUME_TYPOS[lower];

      issues.push({
        word,
        suggestion,
        index: match.index,
      });
    }
  }

  return issues;
}
