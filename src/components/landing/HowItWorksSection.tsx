import React from "react";
import { Layout, PenTool, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Pick Your Field & Layout",
      description:
        "Select a template that matches your profession's expectations—whether you need a formal clinical layout, an academic CV, or a modern design with an optional photo.",
      icon: <Layout className="w-6 h-6 text-indigo-400" />,
      tag: "28 Field-Specific Designs",
    },
    {
      number: "02",
      title: "Add Experience with Real Guidance",
      description:
        "Turn basic job duties into clear, compelling accomplishments. Our writing assistant asks questions to bring out your real achievements without ever inventing false claims.",
      icon: <PenTool className="w-6 h-6 text-purple-400" />,
      tag: "Plain-Language Help",
    },
    {
      number: "03",
      title: "Download Real, Searchable Documents",
      description:
        "Export a clean, selectable PDF or Microsoft Word file that hiring software can read accurately. Every character is genuine text—no flattened screenshots.",
      icon: <Download className="w-6 h-6 text-emerald-400" />,
      tag: "100% Selectable Text",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 relative bg-slate-50/50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-700 dark:text-indigo-400 mb-2 block">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How ResumeForge Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            No complicated design tools or confusing jargon. Just a direct path to a resume you feel proud sending.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-7 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400 select-none">
                    {step.number}
                  </span>
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-3 border border-slate-200 dark:border-slate-700/60">
                  {step.tag}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center text-xs text-indigo-700 dark:text-indigo-400 font-semibold">
                <span>Step {idx + 1} of 3</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 min-h-[44px]"
          >
            <span>Start Building in 2 Minutes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
