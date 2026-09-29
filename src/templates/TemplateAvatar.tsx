import React from "react";
import { PersonalInfo } from "@/schemas/resume.schema";

interface TemplateAvatarProps {
  personalInfo: PersonalInfo;
  className?: string;
  sizeOverride?: string;
}

export const TemplateAvatar: React.FC<TemplateAvatarProps> = ({
  personalInfo,
  className = "",
  sizeOverride,
}) => {
  if (!personalInfo.showPhoto || !personalInfo.photoUrl) return null;

  const shapeClass =
    personalInfo.photoShape === "square"
      ? "rounded-none"
      : personalInfo.photoShape === "rounded"
      ? "rounded-xl"
      : "rounded-full";

  const sizeClass =
    sizeOverride ||
    (personalInfo.photoSize === "small"
      ? "w-14 h-14"
      : personalInfo.photoSize === "large"
      ? "w-24 h-24"
      : "w-20 h-20");

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={personalInfo.photoUrl}
      alt={personalInfo.fullName || "Candidate Photo"}
      className={`${sizeClass} ${shapeClass} object-cover shadow-sm shrink-0 ${className}`}
    />
  );
};
