import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
  BorderStyle,
} from "docx";
import { saveAs } from "file-saver";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";

export async function exportToDocx(
  content: ResumeContent,
  themeConfig: ThemeConfig,
  fileName = "Resume.docx"
) {
  const { personalInfo, workExperience, education, skills, projects, certifications } = content;

  const children: Paragraph[] = [];

  // Header - Full Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: personalInfo.fullName.toUpperCase(),
          bold: true,
          size: 32, // 16pt
          font: "Calibri",
        }),
      ],
    })
  );

  // Target Role
  if (personalInfo.jobTitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: personalInfo.jobTitle,
            bold: true,
            size: 24, // 12pt
            color: "4F46E5",
            font: "Calibri",
          }),
        ],
      })
    );
  }

  // Contact line
  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.website,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: contactParts.join("  |  "),
            size: 20, // 10pt
            color: "555555",
            font: "Calibri",
          }),
        ],
      })
    );
  }

  // Section Heading Helper
  const addSectionHeading = (title: string) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 120 },
        border: {
          bottom: {
            color: "333333",
            space: 4,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 22,
            font: "Calibri",
          }),
        ],
      })
    );
  };

  // Summary
  if (personalInfo.summary) {
    addSectionHeading("Professional Summary");
    children.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: personalInfo.summary,
            size: 21,
            font: "Calibri",
          }),
        ],
      })
    );
  }

  // Work Experience
  if (workExperience.length > 0) {
    addSectionHeading("Work Experience");
    for (const exp of workExperience) {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: `${exp.position} — `,
              bold: true,
              size: 22,
              font: "Calibri",
            }),
            new TextRun({
              text: exp.company,
              bold: true,
              size: 22,
              color: "333333",
              font: "Calibri",
            }),
            new TextRun({
              text: ` (${exp.startDate} - ${exp.current ? "Present" : exp.endDate}${exp.location ? `, ${exp.location}` : ""})`,
              italics: true,
              size: 20,
              color: "666666",
              font: "Calibri",
            }),
          ],
        })
      );

      for (const bullet of exp.bullets) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: bullet,
                size: 20,
                font: "Calibri",
              }),
            ],
          })
        );
      }

      if (exp.technologies && exp.technologies.length > 0) {
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "Technologies: ",
                bold: true,
                size: 19,
                color: "555555",
                font: "Calibri",
              }),
              new TextRun({
                text: exp.technologies.join(", "),
                size: 19,
                color: "555555",
                font: "Calibri",
              }),
            ],
          })
        );
      }
    }
  }

  // Education
  if (education.length > 0) {
    addSectionHeading("Education");
    for (const edu of education) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: `${edu.degree} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""} — `,
              bold: true,
              size: 22,
              font: "Calibri",
            }),
            new TextRun({
              text: edu.institution,
              size: 21,
              font: "Calibri",
            }),
            new TextRun({
              text: ` (${edu.startDate} - ${edu.endDate}${edu.gpa ? `, GPA: ${edu.gpa}` : ""})`,
              italics: true,
              size: 20,
              color: "666666",
              font: "Calibri",
            }),
          ],
        })
      );
    }
  }

  // Skills
  if (skills.length > 0) {
    addSectionHeading("Skills & Competencies");
    for (const skill of skills) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${skill.category}: `,
              bold: true,
              size: 21,
              font: "Calibri",
            }),
            new TextRun({
              text: skill.items.join(", "),
              size: 21,
              font: "Calibri",
            }),
          ],
        })
      );
    }
  }

  // Projects
  if (projects.length > 0) {
    addSectionHeading("Key Projects");
    for (const proj of projects) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: proj.name,
              bold: true,
              size: 21,
              font: "Calibri",
            }),
            new TextRun({
              text: proj.role ? ` (${proj.role})` : "",
              italics: true,
              size: 20,
              color: "555555",
              font: "Calibri",
            }),
          ],
        })
      );

      if (proj.description) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: proj.description,
                size: 20,
                font: "Calibri",
              }),
            ],
          })
        );
      }

      for (const bullet of proj.bullets) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: bullet,
                size: 20,
                font: "Calibri",
              }),
            ],
          })
        );
      }
    }
  }

  // Certifications
  if (certifications && certifications.length > 0) {
    addSectionHeading("Certifications");
    for (const cert of certifications) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${cert.name} — ${cert.issuer} (${cert.issueDate})`,
              size: 21,
              font: "Calibri",
            }),
          ],
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
}
