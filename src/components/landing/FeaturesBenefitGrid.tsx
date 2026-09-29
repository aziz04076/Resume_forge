import React from "react";
import {
  FileCheck2,
  SplitSquareVertical,
  ShieldCheck,
  Target,
  MessageSquare,
  Kanban
} from "lucide-react";

export const FeaturesBenefitGrid: React.FC = () => {
  const benefits = [
    {
      title: "Pass Employer Screening Software",
      description:
        "Large employers and hiring portals use screening software to read applications. ResumeForge builds standard, machine-readable documents so your hard work isn't filtered out by an algorithm.",
      icon: <FileCheck2 className="w-5 h-5 text-emerald-400" />,
      badge: "Zero Formatting Errors",
    },
    {
      title: "Live Side-by-Side Editor",
      description:
        "See your changes update in real time as you type. Adjust margins, spacing, and templates with instant visual feedback—no more hitting preview and waiting.",
      icon: <SplitSquareVertical className="w-5 h-5 text-indigo-400" />,
      badge: "Instant Real-Time Preview",
    },
    {
      title: "Coaching That Never Invents Facts",
      description:
        "Our writing assistant asks clarifying questions to highlight your real achievements. It polishes your phrasing and grammar, but strictly never invents companies or fake accomplishments.",
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      badge: "100% Truthful Content",
    },
    {
      title: "Tailor to Any Job Posting in Seconds",
      description:
        "Paste the job description you're applying for. We compare your background against the employer's requirements, highlighting exactly what to emphasize so you stand out.",
      icon: <Target className="w-5 h-5 text-amber-400" />,
      badge: "Role Alignment",
    },
    {
      title: "Interview Practice & Speaking Coach",
      description:
        "Practice answering common interview questions tailored to your profession. Get constructive feedback on clarity, structure, and speaking pace before the real meeting.",
      icon: <MessageSquare className="w-5 h-5 text-sky-400" />,
      badge: "Interview Confidence",
    },
    {
      title: "Visual Job Application Pipeline",
      description:
        "Organize every job you apply for in a clean, drag-and-drop tracker. Record interview dates, salary notes, and set automated reminders so you always follow up on time.",
      icon: <Kanban className="w-5 h-5 text-rose-400" />,
      badge: "Stay Organized",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 relative bg-slate-50/70 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-700 dark:text-indigo-400 mb-2 block">
            Everything You Need
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Features Built for Real Results
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Every feature is designed to reduce stress, showcase your genuine value, and help you get hired faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
