import React from "react";
import { PersonalInfo } from "@/schemas/resume.schema";
import { normalizeUrl, getDisplayLinkText, normalizePhoneUri } from "@/lib/utils/urlHelper";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from "lucide-react";

interface TemplateContactLinksProps {
  personalInfo: PersonalInfo;
  variant?: "inline" | "stacked";
  iconColor?: string;
  textColor?: string;
  className?: string;
}

export const TemplateContactLinks: React.FC<TemplateContactLinksProps> = ({
  personalInfo,
  variant = "inline",
  iconColor,
  textColor,
  className = "",
}) => {
  const showFullUrl = personalInfo.showFullUrlAsText ?? false;

  const items: Array<{
    id: string;
    icon: React.ReactNode;
    label: string;
    href?: string;
  }> = [];

  if (personalInfo.email) {
    items.push({
      id: "email",
      icon: <Mail className="w-3 h-3 shrink-0" style={iconColor ? { color: iconColor } : undefined} />,
      label: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    });
  }

  if (personalInfo.phone) {
    items.push({
      id: "phone",
      icon: <Phone className="w-3 h-3 shrink-0" style={iconColor ? { color: iconColor } : undefined} />,
      label: personalInfo.phone,
      href: normalizePhoneUri(personalInfo.phone),
    });
  }

  if (personalInfo.location) {
    items.push({
      id: "location",
      icon: <MapPin className="w-3 h-3 shrink-0" style={iconColor ? { color: iconColor } : undefined} />,
      label: personalInfo.location,
    });
  }

  if (personalInfo.linkedin) {
    items.push({
      id: "linkedin",
      icon: <Linkedin className="w-3 h-3 shrink-0" style={iconColor ? { color: iconColor } : undefined} />,
      label: getDisplayLinkText(personalInfo.linkedin, showFullUrl),
      href: normalizeUrl(personalInfo.linkedin),
    });
  }

  if (personalInfo.github) {
    items.push({
      id: "github",
      icon: <Github className="w-3 h-3 shrink-0" style={iconColor ? { color: iconColor } : undefined} />,
      label: getDisplayLinkText(personalInfo.github, showFullUrl),
      href: normalizeUrl(personalInfo.github),
    });
  }

  if (personalInfo.website) {
    items.push({
      id: "website",
      icon: <Globe className="w-3 h-3 shrink-0" style={iconColor ? { color: iconColor } : undefined} />,
      label: getDisplayLinkText(personalInfo.website, showFullUrl),
      href: normalizeUrl(personalInfo.website),
    });
  }

  if (personalInfo.portfolioUrl) {
    items.push({
      id: "portfolio",
      icon: <ExternalLink className="w-3 h-3 shrink-0" style={iconColor ? { color: iconColor } : undefined} />,
      label: getDisplayLinkText(personalInfo.portfolioUrl, showFullUrl),
      href: normalizeUrl(personalInfo.portfolioUrl),
    });
  }

  if (personalInfo.socialLinks && personalInfo.socialLinks.length > 0) {
    personalInfo.socialLinks.forEach((sl) => {
      if (sl.url) {
        items.push({
          id: sl.id,
          icon: <ExternalLink className="w-3 h-3 shrink-0" style={iconColor ? { color: iconColor } : undefined} />,
          label: getDisplayLinkText(sl.url, sl.showFullUrl || showFullUrl),
          href: normalizeUrl(sl.url),
        });
      }
    });
  }

  if (items.length === 0) return null;

  if (variant === "stacked") {
    return (
      <div className={`space-y-1.5 text-[11px] ${className}`}>
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 break-all">
            {item.icon}
            {item.href ? (
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="hover:underline"
                style={textColor ? { color: textColor } : undefined}
              >
                {item.label}
              </a>
            ) : (
              <span style={textColor ? { color: textColor } : undefined}>{item.label}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] ${className}`}>
      {items.map((item) => (
        <span key={item.id} className="inline-flex items-center gap-1.5">
          {item.icon}
          {item.href ? (
            <a
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="hover:underline"
              style={textColor ? { color: textColor } : undefined}
            >
              {item.label}
            </a>
          ) : (
            <span style={textColor ? { color: textColor } : undefined}>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
};
