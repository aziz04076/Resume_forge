"use client";

import React from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { EditorHeader } from "./EditorHeader";
import { FormEditor } from "./FormEditor";
import { TemplateSelector } from "./TemplateSelector";
import { ThemeCustomizer } from "./ThemeCustomizer";
import { LivePreviewPane } from "./LivePreviewPane";
import { ResumeOrbit3D } from "@/components/3d/ResumeOrbit3D";
import { AICopilotWidget } from "./AICopilotWidget";

export const EditorLayout: React.FC = () => {
  const { activeTab } = useResumeStore();
  const splitRatio = 50; // 50-50 split

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 overflow-hidden select-none">
      {/* 1. Header Toolbar */}
      <EditorHeader />

      {/* 2. Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Tab 1: Form Editor (Split Screen with Live Preview) */}
        {activeTab === "editor" && (
          <div className="flex-1 flex w-full h-full overflow-hidden">
            {/* Left: Input Forms */}
            <div
              className="h-full overflow-y-auto bg-slate-950/70 border-r border-slate-800/80 transition-all duration-75"
              style={{ width: `${splitRatio}%` }}
            >
              <FormEditor />
            </div>

            {/* Right: Live Preview */}
            <div
              className="h-full overflow-hidden transition-all duration-75"
              style={{ width: `${100 - splitRatio}%` }}
            >
              <LivePreviewPane />
            </div>
          </div>
        )}

        {/* Tab 2: 28 Designer Templates */}
        {activeTab === "templates" && (
          <div className="flex-1 h-full overflow-y-auto bg-slate-950">
            <TemplateSelector />
          </div>
        )}

        {/* Tab 3: Design & Theme Customizer (Split Screen with Live Preview) */}
        {activeTab === "customize" && (
          <div className="flex-1 flex w-full h-full overflow-hidden">
            <div className="w-1/2 h-full overflow-y-auto bg-slate-950/70 border-r border-slate-800/80">
              <ThemeCustomizer />
            </div>
            <div className="w-1/2 h-full overflow-hidden">
              <LivePreviewPane />
            </div>
          </div>
        )}

        {/* Tab 4: 3D Rotating Orbit Showcase */}
        {activeTab === "3d" && (
          <div className="flex-1 h-full w-full overflow-hidden relative bg-slate-950">
            <ResumeOrbit3D elementId="resume-preview-pane" />
          </div>
        )}
      </main>

      {/* Floating AI Copilot Chat */}
      <AICopilotWidget />
    </div>
  );
};
