import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";

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
    marginBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: "#4f46e5",
    paddingBottom: 10,
    alignItems: "center",
  },
  fullName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  targetRole: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#4f46e5",
    marginTop: 2,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 2,
  },
  contactItem: {
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
});

interface ResumePdfDocumentProps {
  content: ResumeContent;
  themeConfig?: ThemeConfig;
}

export const ResumePdfDocument: React.FC<ResumePdfDocumentProps> = ({ content }) => {
  const { personalInfo, workExperience, education, skills, projects, certifications } = content;

  return (
    <Document title={`${personalInfo.fullName} - Resume`} author={personalInfo.fullName}>
      <Page size="A4" style={styles.page}>
        {/* Header: Name & Contact */}
        <View style={styles.header}>
          <Text style={styles.fullName}>{personalInfo.fullName}</Text>
          {personalInfo.jobTitle ? <Text style={styles.targetRole}>{personalInfo.jobTitle}</Text> : null}
          <View style={styles.contactRow}>
            {personalInfo.email ? <Text style={styles.contactItem}>{personalInfo.email}</Text> : null}
            {personalInfo.phone ? <Text style={styles.contactItem}>• {personalInfo.phone}</Text> : null}
            {personalInfo.location ? <Text style={styles.contactItem}>• {personalInfo.location}</Text> : null}
            {personalInfo.linkedin ? <Text style={styles.contactItem}>• {personalInfo.linkedin}</Text> : null}
            {personalInfo.github ? <Text style={styles.contactItem}>• {personalInfo.github}</Text> : null}
          </View>
        </View>

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
            <Text style={styles.sectionTitle}>Experience</Text>
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
                  <Text style={styles.techPills}>Technologies: {exp.technologies.join(", ")}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills */}
        {skills && skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
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
            <Text style={styles.sectionTitle}>Education</Text>
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
                <Text style={styles.itemCompany}>{edu.institution}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Projects */}
        {projects && projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={styles.projectItem} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>
                    {proj.name} {proj.role ? <Text style={styles.itemCompany}>({proj.role})</Text> : null}
                  </Text>
                  {proj.liveUrl || proj.githubUrl ? (
                    <Text style={styles.itemDate}>{proj.liveUrl || proj.githubUrl}</Text>
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

        {/* Certifications */}
        {certifications && certifications.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
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
      </Page>
    </Document>
  );
};
