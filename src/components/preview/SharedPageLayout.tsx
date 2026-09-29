"use client";

import React, { useEffect, useRef, useState } from "react";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";
import { ResumeTemplateDispatcher } from "@/templates/ResumeTemplateDispatcher";

export interface SharedPageLayoutProps {
  content: ResumeContent;
  themeConfig: ThemeConfig;
  scale?: number;
  className?: string;
  onPageCountChange?: (count: number) => void;
  isPrintMode?: boolean;
}

/**
 * SharedPageLayout — The single source of truth for both Live Preview and Headless PDF Export.
 *
 * Implements:
 * - Fixed physical page width in mm (A4: 210mm, Letter: 215.9mm)
 * - Fixed physical margins in mm (compact: 10mm, normal: 15mm, spacious: 20mm)
 * - Visual scale transforms for preview without modifying the underlying physical layout
 * - Exact content-driven pagination with break-inside avoidance
 * - Dynamic page count calculation matching server PDF output
 */
export const SharedPageLayout: React.FC<SharedPageLayoutProps> = ({
  content,
  themeConfig,
  scale = 1,
  className = "",
  onPageCountChange,
  isPrintMode = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState<number>(1);

  const pageSize = themeConfig.pageSize || "a4";
  // A4 height in mm is 297mm; Letter is 279.4mm (11 inches)
  const pageHeightMm = pageSize === "letter" ? 279.4 : 297.0;

  // Fit to 1 page / 2 pages automatic scaling factor calculation
  let fitScale = 1;
  if (themeConfig.fitToPages === "1" && pageCount > 1) {
    fitScale = Math.max(0.85, 1 / pageCount);
  } else if (themeConfig.fitToPages === "2" && pageCount > 2) {
    fitScale = Math.max(0.88, 2 / pageCount);
  }

  // Calculate real page count dynamically by measuring physical element height
  useEffect(() => {
    if (!containerRef.current) return;

    const measurePages = () => {
      if (!containerRef.current) return;
      // 1mm ~ 3.7795275591 pixels at 96 DPI
      const mmToPx = 3.7795275591;
      const pageHeightPx = pageHeightMm * mmToPx;
      const contentHeightPx = containerRef.current.offsetHeight;

      // New page only if content genuinely overflows by more than 4px threshold
      const calculatedPages = Math.max(1, Math.ceil((contentHeightPx - 4) / pageHeightPx));

      setPageCount(calculatedPages);
      if (onPageCountChange) {
        onPageCountChange(calculatedPages);
      }
    };

    measurePages();

    // Re-measure when fonts or images load
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(measurePages);
    }

    const observer = new ResizeObserver(measurePages);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [content, themeConfig, pageHeightMm, onPageCountChange]);

  const effectiveScale = scale * fitScale;

  return (
    <div
      className={`shared-page-wrapper flex flex-col items-center select-text ${className}`}
      data-fit-pages={themeConfig.fitToPages || "auto"}
    >
      <div
        className="shared-page-scaler origin-top transition-transform duration-150"
        style={{
          transform: effectiveScale !== 1 ? `scale(${effectiveScale})` : undefined,
          transformOrigin: "top center",
        }}
      >
        <div
          ref={containerRef}
          id="resume-shared-root"
          className="shared-page-container relative bg-white"
          data-page-size={pageSize}
          data-pages-count={pageCount}
          style={{
            width: pageSize === "letter" ? "215.9mm" : "210mm",
            minHeight: isPrintMode ? undefined : `${pageHeightMm}mm`,
          }}
        >
          <ResumeTemplateDispatcher content={content} themeConfig={themeConfig} />
        </div>
      </div>
    </div>
  );
};
