import React from "react";
import { Document, Page, Text, View, StyleSheet, Link, Image } from "@react-pdf/renderer";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";
import {
  normalizeUrl,
  getDisplayLinkText,
  normalizePhoneUri,
} from "@/lib/utils/urlHelper";
import {
  PdfMailIcon,
  PdfPhoneIcon,
  PdfLinkedinIcon,
  PdfGithubIcon,
  PdfLinkIcon,
} from "./pdfVectorIcons";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: "#1e293b",
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: "#4f46e5",
    paddingBottom: 10,
    alignItems: "center",
  },
  headerWithPhoto: {
    marginBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: "#4f46e5",
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
  },
  avatarContainer: {
    marginLeft: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    objectFit: "cover",
  },
  avatarRounded: {
    width: 60,
    height: 60,
    borderRadius: 8,
    objectFit: "cover",
  },
  avatarSquare: {
    width: 60,
    height: 60,
    borderRadius: 0,
    objectFit: "cover",
  },
  fullName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  targetRole: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#4f46e5",
    marginTop: 2,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 3,
  },
  contactRowLeft: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
    marginTop: 3,
  },
  contactItemLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    fontSize: 8.5,
    color: "#475569",
    textDecoration: "none",
  },
  linkText: {
    fontSize: 8.5,
    color: "#475569",
  },
  section: {
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#1e1b4b",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderBottomWidth: 0.75,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 2,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 9,
    color: "#334155",
    lineHeight: 1.45,
  },
  experienceItem: {
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 1,
  },
  itemTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  itemCompany: {
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#4f46e5",
  },
  itemDate: {
    fontSize: 8,
    color: "#64748b",
  },
  bulletItem: {
    flexDirection: "row",
    marginTop: 2,
    paddingLeft: 6,
  },
  bulletPoint: {
    width: 8,
    fontSize: 9,
    color: "#4f46e5",
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: "#334155",
    lineHeight: 1.35,
  },
  techPills: {
    fontSize: 8,
    color: "#64748b",
    fontFamily: "Helvetica-Oblique",
    marginTop: 2,
    paddingLeft: 8,
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  skillCategoryBox: {
    width: "48%",
    marginBottom: 4,
  },
  skillCategoryName: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
  },
  skillList: {
    fontSize: 8.5,
    color: "#475569",
    marginTop: 1,
  },
  educationItem: {
    marginBottom: 6,
  },
  projectItem: {
    marginBottom: 6,
  },
  footerNote: {
    position: "absolute",
    bottom: 14,
    left: 40,
    right: 40,
    borderTopWidth: 0.5,
    borderTopColor: "#e2e8f0",
    paddingTop: 4,
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    color: "#94a3b8",
    textAlign: "center",
  },
});

interface ResumePdfDocumentProps {
  content: ResumeContent;
  themeConfig?: ThemeConfig;
}

export const ResumePdfDocument: React.FC<ResumePdfDocumentProps> = ({ content, themeConfig }) => {
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
    customSections,
  } = content;

  const pageSize = themeConfig?.pageSize === "letter" ? "LETTER" : "A4";
  const showFullUrl = personalInfo.showFullUrlAsText ?? false;
  const showPhoto = personalInfo.showPhoto && Boolean(personalInfo.photoUrl);

  const keywordsString = skills && skills.length > 0
    ? skills.flatMap((s) => s.items).slice(0, 20).join(", ")
    : "Professional Resume";

  const renderContactInfo = (isLeftAligned = false) => (
    <View style={isLeftAligned ? styles.contactRowLeft : styles.contactRow}>
      {personalInfo.email ? (
        <Link src={`mailto:${personalInfo.email}`} style={styles.contactItemLink}>
          <PdfMailIcon size={8} />
          <Text style={styles.linkText}>{personalInfo.email}</Text>
        </Link>
      ) : null}

      {personalInfo.phone ? (
        <Link src={normalizePhoneUri(personalInfo.phone)} style={styles.contactItemLink}>
          <PdfPhoneIcon size={8} />
          <Text style={styles.linkText}>{personalInfo.phone}</Text>
        </Link>
      ) : null}

      {personalInfo.location ? (
        <View style={styles.contactItemLink}>
          <Text style={styles.linkText}>• {personalInfo.location}</Text>
        </View>
      ) : null}

      {personalInfo.linkedin ? (
        <Link src={normalizeUrl(personalInfo.linkedin)} style={styles.contactItemLink}>
          <PdfLinkedinIcon size={8} />
          <Text style={styles.linkText}>{getDisplayLinkText(personalInfo.linkedin, showFullUrl)}</Text>
        </Link>
      ) : null}

      {personalInfo.github ? (
        <Link src={normalizeUrl(personalInfo.github)} style={styles.contactItemLink}>
          <PdfGithubIcon size={8} />
          <Text style={styles.linkText}>{getDisplayLinkText(personalInfo.github, showFullUrl)}</Text>
        </Link>
      ) : null}

      {personalInfo.website ? (
        <Link src={normalizeUrl(personalInfo.website)} style={styles.contactItemLink}>
          <PdfLinkIcon size={8} />
          <Text style={styles.linkText}>{getDisplayLinkText(personalInfo.website, showFullUrl)}</Text>
        </Link>
      ) : null}

      {personalInfo.portfolioUrl ? (
        <Link src={normalizeUrl(personalInfo.portfolioUrl)} style={styles.contactItemLink}>
          <PdfLinkIcon size={8} />
          <Text style={styles.linkText}>{getDisplayLinkText(personalInfo.portfolioUrl, showFullUrl)}</Text>
        </Link>
      ) : null}

      {personalInfo.socialLinks?.map((sl) =>
        sl.url ? (
          <Link key={sl.id} src={normalizeUrl(sl.url)} style={styles.contactItemLink}>
            <PdfLinkIcon size={8} />
            <Text style={styles.linkText}>{getDisplayLinkText(sl.url, sl.showFullUrl || showFullUrl)}</Text>
          </Link>
        ) : null
      )}
    </View>
  );

  return (
    <Document
      title={`${personalInfo.fullName || "Candidate"} - Resume`}
      author={personalInfo.fullName || "Candidate"}
      subject={personalInfo.jobTitle || "Professional Resume"}
      keywords={keywordsString}
      creator={themeConfig?.brandingLevel === "none" ? undefined : "ResumeForge"}
      producer={themeConfig?.brandingLevel === "none" ? undefined : "ResumeForge Vector PDF Engine"}
    >
      <Page size={pageSize} style={styles.page}>
        {/* Header Section */}
        {showPhoto ? (
          <View style={styles.headerWithPhoto}>
            <View style={styles.headerLeft}>
              <Text style={styles.fullName}>{personalInfo.fullName || "Your Full Name"}</Text>
              {personalInfo.jobTitle ? <Text style={styles.targetRole}>{personalInfo.jobTitle}</Text> : null}
              {renderContactInfo(true)}
            </View>
            <View style={styles.avatarContainer}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image
                src={personalInfo.photoUrl!}
                style={
                  personalInfo.photoShape === "square"
                    ? styles.avatarSquare
                    : personalInfo.photoShape === "rounded"
                    ? styles.avatarRounded
                    : styles.avatarCircle
                }
              />
            </View>
          </View>
        ) : (
          <View style={styles.header}>
            <Text style={styles.fullName}>{personalInfo.fullName || "Your Full Name"}</Text>
            {personalInfo.jobTitle ? <Text style={styles.targetRole}>{personalInfo.jobTitle}</Text> : null}
            {renderContactInfo(false)}
          </View>
        )}

        {/* Professional Summary */}
        {personalInfo.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{personalInfo.summary}</Text>
          </View>
        ) : null}

        {/* Work Experience */}
        {workExperience && workExperience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience & Achievements</Text>
            {workExperience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>
                    {exp.position} <Text style={styles.itemCompany}>| {exp.company}</Text>
                  </Text>
                  <Text style={styles.itemDate}>
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </Text>
                </View>
                {exp.bullets.map((b, i) => (
                  <View key={i} style={styles.bulletItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
                {exp.technologies && exp.technologies.length > 0 ? (
                  <Text style={styles.techPills}>Skills / Tools: {exp.technologies.join(", ")}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Internships & Practicum */}
        {internships && internships.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Internships & Clinical Rotations</Text>
            {internships.map((intn) => (
              <View key={intn.id} style={styles.experienceItem} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>
                    {intn.position} <Text style={styles.itemCompany}>| {intn.company}</Text>
                  </Text>
                  <Text style={styles.itemDate}>
                    {intn.startDate} – {intn.current ? "Present" : intn.endDate}
                  </Text>
                </View>
                {intn.bullets.map((b, i) => (
                  <View key={i} style={styles.bulletItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills */}
        {skills && skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills & Competencies</Text>
            <View style={styles.skillsGrid}>
              {skills.map((s) => (
                <View key={s.id} style={styles.skillCategoryBox} wrap={false}>
                  <Text style={styles.skillCategoryName}>{s.category}:</Text>
                  <Text style={styles.skillList}>{s.items.join(", ")}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Education */}
        {education && education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education & Credentials</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.educationItem} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>
                    {edu.degree} in {edu.fieldOfStudy}
                  </Text>
                  <Text style={styles.itemDate}>
                    {edu.startDate} – {edu.endDate}
                  </Text>
                </View>
                <Text style={styles.itemCompany}>
                  {edu.institution} {edu.gpa ? `• GPA: ${edu.gpa}` : ""}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Projects */}
        {projects && projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={styles.projectItem} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>
                    {proj.name} {proj.role ? <Text style={styles.itemCompany}>({proj.role})</Text> : null}
                  </Text>
                  {proj.liveUrl || proj.githubUrl ? (
                    <Link src={normalizeUrl(proj.liveUrl || proj.githubUrl)} style={styles.contactItemLink}>
                      <Text style={styles.itemDate}>{getDisplayLinkText(proj.liveUrl || proj.githubUrl, showFullUrl)}</Text>
                    </Link>
                  ) : null}
                </View>
                {proj.description ? <Text style={styles.summaryText}>{proj.description}</Text> : null}
                {proj.bullets.map((b, i) => (
                  <View key={i} style={styles.bulletItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* Certifications & Licenses */}
        {certifications && certifications.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications & Licenses</Text>
            {certifications.map((c) => (
              <View key={c.id} style={styles.educationItem} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{c.name}</Text>
                  <Text style={styles.itemDate}>{c.issueDate}</Text>
                </View>
                <Text style={styles.itemCompany}>{c.issuer}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Courses & Continuing Education */}
        {courses && courses.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Courses & Continuing Education</Text>
            {courses.map((c) => (
              <View key={c.id} style={styles.educationItem} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{c.name}</Text>
                  <Text style={styles.itemDate}>{c.date}</Text>
                </View>
                <Text style={styles.itemCompany}>{c.institution}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Publications & Research */}
        {publications && publications.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Publications & Research</Text>
            {publications.map((p) => (
              <View key={p.id} style={styles.educationItem} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{p.title}</Text>
                  <Text style={styles.itemDate}>{p.date}</Text>
                </View>
                <Text style={styles.itemCompany}>{p.publisher}</Text>
                {p.description ? <Text style={styles.summaryText}>{p.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Volunteering & Community */}
        {volunteering && volunteering.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Community Leadership & Volunteering</Text>
            {volunteering.map((v) => (
              <View key={v.id} style={styles.educationItem} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>
                    {v.role} <Text style={styles.itemCompany}>| {v.organization}</Text>
                  </Text>
                  <Text style={styles.itemDate}>{v.period}</Text>
                </View>
                {v.bullets.map((b, i) => (
                  <View key={i} style={styles.bulletItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* Awards & Honors */}
        {awards && awards.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Honors & Awards</Text>
            {awards.map((a) => (
              <View key={a.id} style={styles.educationItem} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{a.title}</Text>
                  <Text style={styles.itemDate}>{a.date}</Text>
                </View>
                <Text style={styles.itemCompany}>{a.issuer}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* References */}
        {references && references.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional References</Text>
            {references.map((r) => (
              <View key={r.id} style={styles.educationItem} wrap={false}>
                <Text style={styles.itemTitle}>
                  {r.name} — <Text style={styles.itemCompany}>{r.role}, {r.organization}</Text>
                </Text>
                <Text style={styles.linkText}>{r.contact}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Custom User Sections */}
        {customSections && customSections.length > 0
          ? customSections.map((cs) => (
              <View key={cs.id} style={styles.section}>
                <Text style={styles.sectionTitle}>{cs.heading}</Text>
                {cs.items.map((item) => (
                  <View key={item.id} style={styles.educationItem} wrap={false}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>
                        {item.title} {item.subtitle ? <Text style={styles.itemCompany}>({item.subtitle})</Text> : null}
                      </Text>
                      <Text style={styles.itemDate}>{item.date}</Text>
                    </View>
                    {item.description ? <Text style={styles.summaryText}>{item.description}</Text> : null}
                    {item.bullets.map((b, i) => (
                      <View key={i} style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))
          : null}

        {/* Optional visible branding footer (Default OFF / metadata-only) */}
        {themeConfig?.brandingLevel === "visible" && (
          <View style={styles.footerNote} wrap={false}>
            <Text style={styles.footerText}>
              Created with ResumeForge • Candidate owns 100% of resume content.
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
