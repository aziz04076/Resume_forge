import { Metadata } from "next";
import { EditorLayout } from "@/components/editor/EditorLayout";

export const metadata: Metadata = {
  title: "ResumeForge Editor | The Autonomous Career Copilot",
  description: "Live split-screen resume builder with 28 ATS-optimized templates, real-time scoring, and export.",
};

export default function EditorPage() {
  return <EditorLayout />;
}
