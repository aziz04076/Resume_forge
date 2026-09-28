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
  const [mobileTab, setMobileTab] = React.useState<"form" | "preview">("form");

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 overflow-hidden select-none">
      {/* 1. Header Toolbar */}
      <EditorHeader />

      {/* Mobile Tab Switcher for Editor and Customize tabs */}
      {(activeTab === "editor" || activeTab === "customize") && (
        <div className="lg:hidden flex items-center justify-center py-2 px-4 bg-slate-900/90 border-b border-slate-800 z-10">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs w-full max-w-xs justify-center">
            <button
              onClick={() => setMobileTab("form")}
              className={`flex-1 py-1.5 rounded-lg font-medium text-center transition-all ${
                mobileTab === "form" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              {activeTab === "editor" ? "Edit Form" : "Customizer"}
            </button>
            <button
              onClick={() => setMobileTab("preview")}
              className={`flex-1 py-1.5 rounded-lg font-medium text-center transition-all ${
                mobileTab === "preview" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Live Preview
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Tab 1: Form Editor (Split Screen on Desktop, Tabbed on Mobile) */}
        {activeTab === "editor" && (
          <div className="flex-1 flex w-full h-full overflow-hidden">
            {/* Form Editor Pane */}
            <div
              className={`h-full overflow-y-auto bg-slate-950/70 border-r border-slate-800/80 transition-all duration-75 ${
                mobileTab === "form" ? "w-full lg:w-1/2 block" : "hidden lg:block lg:w-1/2"
              }`}
            >
              <FormEditor />
            </div>

            {/* Live Preview Pane */}
            <div
              className={`h-full overflow-hidden transition-all duration-75 ${
                mobileTab === "preview" ? "w-full lg:w-1/2 block" : "hidden lg:block lg:w-1/2"
              }`}
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

        {/* Tab 3: Design & Theme Customizer (Split Screen on Desktop, Tabbed on Mobile) */}
        {activeTab === "customize" && (
          <div className="flex-1 flex w-full h-full overflow-hidden">
            <div
              className={`h-full overflow-y-auto bg-slate-950/70 border-r border-slate-800/80 ${
                mobileTab === "form" ? "w-full lg:w-1/2 block" : "hidden lg:block lg:w-1/2"
              }`}
            >
              <ThemeCustomizer />
            </div>
            <div
              className={`h-full overflow-hidden ${
                mobileTab === "preview" ? "w-full lg:w-1/2 block" : "hidden lg:block lg:w-1/2"
              }`}
            >
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
