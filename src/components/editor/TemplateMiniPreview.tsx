"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import { ResumeContent, ThemeConfig } from "@/schemas/resume.schema";
import { SharedPageLayout } from "@/components/preview/SharedPageLayout";

interface TemplateMiniPreviewProps {
  templateId: string;
  content: ResumeContent;
  themeConfig: ThemeConfig;
  className?: string;
}

/**
 * TemplateMiniPreview — Renders an authentic miniature of the real template layout.
 *
 * Implements:
 * - Lazy intersection-observer rendering to keep gallery scrolling at 60fps
 * - Exact same SharedPageLayout component scaled down
 * - Isolated pointer-events to prevent interaction inside mini thumbnail
 */
export const TemplateMiniPreview = memo(function TemplateMiniPreview({
  templateId,
  content,
  themeConfig,
  className = "",
}: TemplateMiniPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scale, setScale] = useState(0.24);

  // Lazy render when scrolled into view
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute exact scale to fit container width
  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (!containerRef.current) return;
      const widthPx = containerRef.current.clientWidth;
      // 210mm is 793.7px at 96 DPI
      const a4WidthPx = 793.7;
      if (widthPx > 0) {
        setScale(widthPx / a4WidthPx);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[210/297] overflow-hidden rounded-lg bg-white border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}
    >
      {isVisible ? (
        <div
          className="absolute top-0 left-0 w-[210mm] origin-top-left pointer-events-none select-none"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <SharedPageLayout
            content={content}
            themeConfig={{
              ...themeConfig,
              templateId,
              fontSize: "small",
              pageMargins: "compact",
            }}
            scale={1}
            isPrintMode={true}
          />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900/60 p-4">
          <div className="w-16 h-2 bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
          <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded mb-4 animate-pulse" />
          <div className="w-full space-y-1.5 opacity-40">
            <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-5/6 h-1 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-4/6 h-1 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      )}
    </div>
  );
});
