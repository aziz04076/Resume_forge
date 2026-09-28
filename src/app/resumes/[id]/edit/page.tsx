import { Metadata } from "next";
import { EditorLayout } from "@/components/editor/EditorLayout";

export const metadata: Metadata = {
  title: "ResumeForge Editor | The Autonomous Career Copilot",
};

export default function ResumeEditPage() {
  return <EditorLayout />;
}
