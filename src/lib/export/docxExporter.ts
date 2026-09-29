import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
  BorderStyle,
  ExternalHyperlink,
} from "docx";
import { saveAs } from "file-saver";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";
import {
  normalizeUrl,
  getDisplayLinkText,
  normalizePhoneUri,
} from "@/lib/utils/urlHelper";

export function buildDocxDocument(
  content: ResumeContent,
  themeConfig?: ThemeConfig
): Document {
  const font =
    themeConfig?.fontFamily === "Merriweather" || themeConfig?.fontFamily === "Playfair"
      ? "Georgia"
      : "Calibri";
  const {
    personalInfo,
    workExperience,
    internships,
    education,
    skills,
    projects,
    certifications,
    courses,
    publications,
    volunteering,
    awards,
    references,
  } = content;

  const showFullUrl = personalInfo.showFullUrlAsText ?? false;
  const children: Paragraph[] = [];

  // Header - Full Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: (personalInfo.fullName || "Candidate").toUpperCase(),
          bold: true,
          size: 32, // 16pt
          font,
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

  // Clickable Contact elements
  const contactElements: (TextRun | ExternalHyperlink)[] = [];

  if (personalInfo.email) {
    contactElements.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: personalInfo.email,
            size: 20,
            color: "4F46E5",
            underline: {},
            font: "Calibri",
          }),
        ],
        link: `mailto:${personalInfo.email}`,
      })
    );
  }

  if (personalInfo.phone) {
    if (contactElements.length > 0) {
      contactElements.push(new TextRun({ text: "  |  ", size: 20, color: "888888", font: "Calibri" }));
    }
    contactElements.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: personalInfo.phone,
            size: 20,
            color: "4F46E5",
            underline: {},
            font: "Calibri",
          }),
        ],
        link: normalizePhoneUri(personalInfo.phone),
      })
    );
  }

  if (personalInfo.location) {
    if (contactElements.length > 0) {
      contactElements.push(new TextRun({ text: "  |  ", size: 20, color: "888888", font: "Calibri" }));
    }
    contactElements.push(
      new TextRun({
        text: personalInfo.location,
        size: 20,
        color: "555555",
        font: "Calibri",
      })
    );
  }

  if (personalInfo.linkedin) {
    if (contactElements.length > 0) {
      contactElements.push(new TextRun({ text: "  |  ", size: 20, color: "888888", font: "Calibri" }));
    }
    contactElements.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: getDisplayLinkText(personalInfo.linkedin, showFullUrl),
            size: 20,
            color: "4F46E5",
            underline: {},
            font: "Calibri",
          }),
        ],
        link: normalizeUrl(personalInfo.linkedin),
      })
    );
  }

  if (personalInfo.github) {
    if (contactElements.length > 0) {
      contactElements.push(new TextRun({ text: "  |  ", size: 20, color: "888888", font: "Calibri" }));
    }
    contactElements.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: getDisplayLinkText(personalInfo.github, showFullUrl),
            size: 20,
            color: "4F46E5",
            underline: {},
            font: "Calibri",
          }),
        ],
        link: normalizeUrl(personalInfo.github),
      })
    );
  }

  if (personalInfo.website) {
    if (contactElements.length > 0) {
      contactElements.push(new TextRun({ text: "  |  ", size: 20, color: "888888", font: "Calibri" }));
    }
    contactElements.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: getDisplayLinkText(personalInfo.website, showFullUrl),
            size: 20,
            color: "4F46E5",
            underline: {},
            font: "Calibri",
          }),
        ],
        link: normalizeUrl(personalInfo.website),
      })
    );
  }

  if (personalInfo.socialLinks && personalInfo.socialLinks.length > 0) {
    for (const sl of personalInfo.socialLinks) {
      if (sl.url) {
        if (contactElements.length > 0) {
          contactElements.push(new TextRun({ text: "  |  ", size: 20, color: "888888", font: "Calibri" }));
        }
        contactElements.push(
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: getDisplayLinkText(sl.url, sl.showFullUrl || showFullUrl),
                size: 20,
                color: "4F46E5",
                underline: {},
                font: "Calibri",
              }),
            ],
            link: normalizeUrl(sl.url),
          })
        );
      }
    }
  }

  if (contactElements.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: contactElements,
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

  // Internships & Practicums
  if (internships && internships.length > 0) {
    addSectionHeading("Internships & Practicums");
    for (const intern of internships) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: `${intern.position} — ${intern.company}`,
              bold: true,
              size: 22,
              font: "Calibri",
            }),
            new TextRun({
              text: ` (${intern.startDate} - ${intern.current ? "Present" : intern.endDate}${intern.location ? `, ${intern.location}` : ""})`,
              italics: true,
              size: 20,
              color: "666666",
              font: "Calibri",
            }),
          ],
        })
      );
      for (const bullet of intern.bullets) {
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

  // Courses & Continuing Education
  if (courses && courses.length > 0) {
    addSectionHeading("Courses & Continuing Education");
    for (const course of courses) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${course.name} — ${course.institution} (${course.date})`,
              size: 21,
              font: "Calibri",
            }),
          ],
        })
      );
    }
  }

  // Publications & Research
  if (publications && publications.length > 0) {
    addSectionHeading("Publications & Research");
    for (const pub of publications) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: pub.title,
              bold: true,
              size: 21,
              font: "Calibri",
            }),
            new TextRun({
              text: ` — ${pub.publisher} (${pub.date})`,
              size: 20,
              font: "Calibri",
            }),
          ],
        })
      );
      if (pub.description) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: pub.description,
                size: 20,
                font: "Calibri",
              }),
            ],
          })
        );
      }
    }
  }

  // Volunteering & Community
  if (volunteering && volunteering.length > 0) {
    addSectionHeading("Volunteering & Community Leadership");
    for (const vol of volunteering) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: `${vol.role} — ${vol.organization}`,
              bold: true,
              size: 21,
              font: "Calibri",
            }),
            new TextRun({
              text: ` (${vol.period})`,
              italics: true,
              size: 20,
              color: "666666",
              font: "Calibri",
            }),
          ],
        })
      );
      for (const bullet of vol.bullets) {
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

  // Honors & Awards
  if (awards && awards.length > 0) {
    addSectionHeading("Honors & Awards");
    for (const award of awards) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${award.title} — ${award.issuer} (${award.date})`,
              bold: true,
              size: 21,
              font: "Calibri",
            }),
            ...(award.description
              ? [
                  new TextRun({
                    text: `: ${award.description}`,
                    size: 20,
                    font: "Calibri",
                  }),
                ]
              : []),
          ],
        })
      );
    }
  }

  // References
  if (references && references.length > 0) {
    addSectionHeading("Professional References");
    for (const ref of references) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${ref.name}${ref.role ? ` (${ref.role})` : ""}${ref.organization ? `, ${ref.organization}` : ""}`,
              bold: true,
              size: 21,
              font: "Calibri",
            }),
            ...(ref.contact
              ? [
                  new TextRun({
                    text: ` — ${ref.contact}`,
                    size: 20,
                    font: "Calibri",
                  }),
                ]
              : []),
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

  return doc;
}

export async function generateDocxBuffer(
  content: ResumeContent,
  themeConfig?: ThemeConfig
): Promise<Buffer> {
  const doc = buildDocxDocument(content, themeConfig);
  return await Packer.toBuffer(doc);
}

export async function exportToDocx(
  content: ResumeContent,
  themeConfig?: ThemeConfig,
  fileName = "Resume.docx"
): Promise<void> {
  const doc = buildDocxDocument(content, themeConfig);
  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
}

