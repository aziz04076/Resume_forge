"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { X, Languages, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { ResumeContent } from "@/schemas/resume.schema";

interface TranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORTED_LANGUAGES = [
  { code: "hi", name: "Hindi (हिन्दी)" },
  { code: "es", name: "Spanish (Español)" },
  { code: "fr", name: "French (Français)" },
  { code: "de", name: "German (Deutsch)" },
  { code: "ja", name: "Japanese (日本語)" },
  { code: "pt", name: "Portuguese (Português)" },
  { code: "ar", name: "Arabic (العربية)" },
];

export const TranslateModal: React.FC<TranslateModalProps> = ({ isOpen, onClose }) => {
  const { content, setResumeContent } = useResumeStore();
  const [selectedLang, setSelectedLang] = useState("Hindi");
  const [isLoading, setIsLoading] = useState(false);
  const [translatedPreview, setTranslatedPreview] = useState<ResumeContent | null>(null);

  if (!isOpen) return null;

  const handleTranslate = async () => {
    try {
      setIsLoading(true);
      toast.info(`Translating resume into ${selectedLang}...`);

      const res = await fetch("/api/ai/translate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent: content,
          targetLanguage: selectedLang,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Translation failed");
      }

      setTranslatedPreview(data.translatedContent);
      toast.success(`Resume successfully translated into ${selectedLang}!`);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to translate resume");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyTranslation = () => {
    if (translatedPreview) {
      setResumeContent(translatedPreview);
      toast.success("Translated resume applied to editor!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Multi-Language Resume Translation</h2>
              <p className="text-xs text-slate-400">Translate your resume into Hindi and global languages.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!translatedPreview ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Select Target Language</label>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLang(lang.name.split(" ")[0])}
                      className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                        selectedLang === lang.name.split(" ")[0]
                          ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleTranslate}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? "Translating with Neural AI..." : `Translate to ${selectedLang}`}</span>
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="text-[10px] text-indigo-400 uppercase font-mono font-semibold">
                  Translated Summary Preview ({selectedLang})
                </div>
                <p className="text-slate-200 leading-relaxed font-sans">{translatedPreview.personalInfo.summary}</p>
                <div className="text-[10px] text-slate-400 mt-2">
                  First Bullet: {translatedPreview.workExperience[0]?.bullets[0]}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setTranslatedPreview(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Choose Another
                </button>
                <button
                  onClick={handleApplyTranslation}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply to Resume</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
