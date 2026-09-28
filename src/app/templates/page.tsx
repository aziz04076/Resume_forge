import Link from "next/link";
import { TemplateSelector } from "@/components/editor/TemplateSelector";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "28 Designer Resume Templates | ResumeForge",
  description: "Browse 28 ATS-compliant, executive, creative, tech, and fresher resume templates.",
};

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-6 pb-20">
      <div className="max-w-6xl mx-auto px-6 mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <Link
          href="/editor"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
        >
          Open in Editor
        </Link>
      </div>

      <TemplateSelector />
    </div>
  );
}
