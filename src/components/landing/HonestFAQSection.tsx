"use client";

import React, { useState } from "react";
import { ChevronDown, ShieldCheck, Lock, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Can I use ResumeForge for free without signing up?",
    answer:
      "Yes. You can build, customize, preview, and download full vector PDF and Word documents in guest mode without creating an account or entering a credit card. If you later choose to sign in, your drafts seamlessly transfer to your profile.",
  },
  {
    question: "Do you sell or train AI models on my personal resume data?",
    answer:
      "Never. Your contact details, career history, and notes are processed strictly to assist with writing and formatting your documents. We do not sell candidate information to recruiters or third parties, and your data is never used to train public AI foundation models.",
  },
  {
    question: "Can I permanently delete my information at any time?",
    answer:
      "Yes. You maintain complete ownership of your career data. You can export a full backup copy as structured JSON, clear your browser storage, or permanently delete your account and all associated resumes from our database with a single click.",
  },
  {
    question: "Why do some templates include photos while others do not?",
    answer:
      "Hiring customs vary significantly by region and field. In the United States, Canada, and the UK, photos are typically discouraged to prevent unconscious bias. In continental Europe, Asia, and creative or client-facing roles, a professional photo is common. ResumeForge gives you the freedom to choose what is right for your target market.",
  },
  {
    question: "How does ResumeForge ensure screening software can read my resume?",
    answer:
      "Many online resume builders take a picture of your resume and save it as a PDF. Applicant tracking software cannot read pictures, leading to silent rejections. ResumeForge generates native vector text streams with standard font embedding and clear reading order so software and human recruiters can read every single word.",
  },
  {
    question: "Does the AI assistant make up fake experience or numbers?",
    answer:
      "No. We enforce strict anti-hallucination rules. Our assistant will help you rephrase and quantify the work you actually did by asking clarifying questions, but it will never fabricate companies, degrees, or false metrics you did not achieve.",
  },
];

export const HonestFAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 px-6 relative bg-slate-50/50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-3 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" />
            <span>Honest Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Straightforward answers about our privacy practices, pricing transparency, and how we handle your data.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 overflow-hidden transition-colors shadow-sm"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full min-h-[48px] p-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-indigo-700 dark:text-indigo-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Privacy & Trust Banner */}
        <div className="mt-14 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Your privacy comes first.</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">Zero model training. 100% candidate data ownership.</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <Lock className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" />
            <span>Encrypted Connections</span>
          </div>
        </div>
      </div>
    </section>
  );
};
