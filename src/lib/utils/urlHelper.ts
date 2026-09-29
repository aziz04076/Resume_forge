/**
 * URL and Contact Normalization Utility for ResumeForge
 * Validates, normalizes, strips tracking parameters, and identifies platforms.
 */

const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "ref",
  "si",
  "igshid",
  "mc_cid",
  "mc_eid",
];

export interface PlatformInfo {
  platform: string;
  iconKey: "linkedin" | "github" | "behance" | "dribbble" | "x" | "website" | "link";
  displayName: string;
  url: string;
}

/**
 * Normalizes a URL:
 * - Prepends https:// if protocol is omitted
 * - Strips tracking queries (utm_*, fbclid, etc.)
 * - Neutralizes dangerous schemes (javascript:, data:, vbscript:)
 */
export function normalizeUrl(input?: string | null): string {
  if (!input) return "";
  const trimmed = input.trim();
  if (!trimmed) return "";

  // Reject malicious schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return "";
  }

  // Preserve mailto and tel links as-is
  if (lower.startsWith("mailto:") || lower.startsWith("tel:")) {
    return trimmed;
  }

  let withProto = trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    withProto = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(withProto);

    // Strip www. prefix from hostname
    if (parsed.hostname.startsWith("www.")) {
      parsed.hostname = parsed.hostname.substring(4);
    }

    // Strip known tracking params
    TRACKING_PARAMS.forEach((param) => {
      parsed.searchParams.delete(param);
    });

    // Remove trailing slash if path is only root
    let clean = parsed.toString();
    if (parsed.pathname === "/" && !parsed.search && !parsed.hash) {
      clean = clean.replace(/\/$/, "");
    }
    return clean;
  } catch {
    // If not a valid URL structure, return empty
    return "";
  }
}

/**
 * Identifies the platform and provides human-friendly label and icon identifier.
 */
export function getPlatformInfo(rawUrl?: string | null): PlatformInfo {
  const url = normalizeUrl(rawUrl);
  if (!url) {
    return {
      platform: "Link",
      iconKey: "link",
      displayName: "Link",
      url: "",
    };
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

    if (host.includes("linkedin.com")) {
      return { platform: "LinkedIn", iconKey: "linkedin", displayName: "LinkedIn", url };
    }
    if (host.includes("github.com")) {
      return { platform: "GitHub", iconKey: "github", displayName: "GitHub", url };
    }
    if (host.includes("behance.net")) {
      return { platform: "Behance", iconKey: "behance", displayName: "Behance", url };
    }
    if (host.includes("dribbble.com")) {
      return { platform: "Dribbble", iconKey: "dribbble", displayName: "Dribbble", url };
    }
    if (host === "x.com" || host.includes("twitter.com")) {
      return { platform: "X", iconKey: "x", displayName: "X", url };
    }

    // Generic website / custom portfolio domain
    const cleanDomain = host;
    return {
      platform: "Website",
      iconKey: "website",
      displayName: cleanDomain,
      url,
    };
  } catch {
    return {
      platform: "Link",
      iconKey: "link",
      displayName: "Link",
      url,
    };
  }
}

/**
 * Returns the visible text for a profile link.
 * If showFullUrl is true, returns clean normalized URL text.
 * If showFullUrl is false (default), returns the clean platform name or domain name only.
 */
export function getDisplayLinkText(rawUrl?: string | null, showFullUrl = false): string {
  const info = getPlatformInfo(rawUrl);
  if (!info.url) return "";
  if (showFullUrl) {
    return info.url.replace(/^https?:\/\//, "");
  }
  return info.displayName;
}

/**
 * Normalizes phone numbers for tel: URI schemes.
 */
export function normalizePhoneUri(phone?: string | null): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9+]/g, "");
  return cleaned ? `tel:${cleaned}` : "";
}
