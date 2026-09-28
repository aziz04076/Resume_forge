import { saveAs } from "file-saver";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";

export function exportToJson(
  content: ResumeContent,
  themeConfig: ThemeConfig,
  fileName = "Resume.json"
) {
  const data = JSON.stringify({ content, themeConfig, exportedAt: new Date().toISOString() }, null, 2);
  const blob = new Blob([data], { type: "application/json;charset=utf-8" });
  saveAs(blob, fileName);
}

export function exportToTxt(content: ResumeContent, fileName = "Resume.txt") {
  const { personalInfo, workExperience, education, skills, projects, certifications } = content;

  let text = "";
  text += `${personalInfo.fullName.toUpperCase()}\n`;
  if (personalInfo.jobTitle) text += `${personalInfo.jobTitle}\n`;
  text += `${[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(" | ")}\n`;
  if (personalInfo.linkedin || personalInfo.github || personalInfo.website) {
    text += `${[personalInfo.linkedin, personalInfo.github, personalInfo.website].filter(Boolean).join(" | ")}\n`;
  }
  text += "\n" + "=".repeat(60) + "\n\n";

  if (personalInfo.summary) {
    text += "PROFESSIONAL SUMMARY\n";
    text += "-".repeat(30) + "\n";
    text += `${personalInfo.summary}\n\n`;
  }

  if (workExperience.length > 0) {
    text += "WORK EXPERIENCE\n";
    text += "-".repeat(30) + "\n";
    for (const exp of workExperience) {
      text += `${exp.position} - ${exp.company} (${exp.startDate} - ${exp.current ? "Present" : exp.endDate})\n`;
      if (exp.location) text += `${exp.location}\n`;
      for (const bullet of exp.bullets) {
        text += `  * ${bullet}\n`;
      }
      if (exp.technologies && exp.technologies.length > 0) {
        text += `  Tech: ${exp.technologies.join(", ")}\n`;
      }
      text += "\n";
    }
  }

  if (education.length > 0) {
    text += "EDUCATION\n";
    text += "-".repeat(30) + "\n";
    for (const edu of education) {
      text += `${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution} (${edu.startDate} - ${edu.endDate})\n`;
      if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
      text += "\n";
    }
  }

  if (skills.length > 0) {
    text += "SKILLS\n";
    text += "-".repeat(30) + "\n";
    for (const s of skills) {
      text += `${s.category}: ${s.items.join(", ")}\n`;
    }
    text += "\n";
  }

  if (projects.length > 0) {
    text += "PROJECTS\n";
    text += "-".repeat(30) + "\n";
    for (const p of projects) {
      text += `${p.name} (${p.role || "Lead"})\n`;
      if (p.description) text += `${p.description}\n`;
      for (const b of p.bullets) {
        text += `  * ${b}\n`;
      }
      text += "\n";
    }
  }

  if (certifications && certifications.length > 0) {
    text += "CERTIFICATIONS\n";
    text += "-".repeat(30) + "\n";
    for (const c of certifications) {
      text += `${c.name} - ${c.issuer} (${c.issueDate})\n`;
    }
    text += "\n";
  }

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  saveAs(blob, fileName);
}
