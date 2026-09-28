import Link from "next/link";
import { HeroScene } from "@/components/3d/HeroScene";
import { Sparkles, ArrowRight, Zap, Mic, Layers } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* 1. Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
            RF
          </div>
          <span className="font-extrabold text-base tracking-tight">
            Resume<span className="text-indigo-400">Forge</span>
          </span>
          <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Career Copilot v2.0
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
          <Link href="/editor" className="hover:text-white transition-colors">
            Resume Builder
          </Link>
          <Link href="/templates" className="hover:text-white transition-colors">
            28 Templates
          </Link>
          <Link href="/ats-scanner" className="hover:text-white transition-colors">
            ATS Scanner
          </Link>
          <Link href="/interview" className="hover:text-white transition-colors">
            Interview Coach
          </Link>
          <Link href="/applications" className="hover:text-white transition-colors">
            Job Tracker
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/editor"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section with Interactive 3D Canvas */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh] overflow-hidden">
        {/* 3D Background Canvas */}
        <HeroScene />

        {/* Ambient Radial Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Floating Hero Content */}
        <div className="relative z-10 max-w-4xl text-center flex flex-col items-center pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-indigo-300 text-xs font-medium mb-6 shadow-xl backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>The Autonomous Career Copilot — Not Just a Resume Builder</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 drop-shadow-md">
            Engineer your dream career with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              real AI precision
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow">
            Split-screen live editor, 28 ATS-engineered templates, quantifiable STAR bullet optimization,
            voice-assisted mock interviews, and automated job tracking in one unified platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto pointer-events-auto">
            <Link
              href="/editor"
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Build My Resume Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/editor"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 rounded-xl text-sm font-semibold backdrop-blur-md flex items-center justify-center gap-2 transition-all hover:text-white"
            >
              <span>Browse 28 Templates</span>
            </Link>
          </div>

          {/* Proof Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 text-center">
            <div className="p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800">
              <div className="text-xl sm:text-2xl font-bold text-white">99.4%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">ATS Parse Rate</div>
            </div>
            <div className="p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800">
              <div className="text-xl sm:text-2xl font-bold text-white">28</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Designer Templates</div>
            </div>
            <div className="p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800">
              <div className="text-xl sm:text-2xl font-bold text-white">3.2x</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Interview Callback Rate</div>
            </div>
            <div className="p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800">
              <div className="text-xl sm:text-2xl font-bold text-emerald-400">100% Real</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Live Claude & OpenAI APIs</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Feature Pillars */}
      <section className="py-24 px-6 border-t border-slate-800/80 bg-slate-950/40 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-400 mb-2">
              Beyond Basic Builders
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              A Complete Career Operating System
            </h3>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Every tool required from drafting your first bullet to negotiating your final offer letter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-indigo-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-white mb-2">Split-Screen Live Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Edit structured forms on the left while viewing pixel-perfect rendering on the right with instant
                zoom, font swaps, and color changes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-purple-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-white mb-2">10 Real AI Career Engines</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                STAR/XYZ bullet rewrites, real-time Job Description keyword matching, automated ATS scanner,
                and personalized cover letter generation with Claude 3.5 Sonnet.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-white mb-2">Voice AI Mock Interviewer</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Practice role-specific interview questions generated directly from your resume and target JD.
                Answers evaluated live via Web Speech API with concrete feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="border-t border-slate-800/80 py-10 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">ResumeForge</span>
            <span>• The Autonomous Career Copilot</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/editor" className="hover:text-slate-300 transition-colors">
              Open Editor
            </Link>
            <Link href="/templates" className="hover:text-slate-300 transition-colors">
              Templates
            </Link>
            <span className="text-emerald-400">Zero Mock Data Guarantee</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
