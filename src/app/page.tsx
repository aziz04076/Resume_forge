import Link from "next/link";
import { HeroScene } from "@/components/3d/HeroScene";
import { Logo } from "@/components/brand/Logo";
import { BRAND } from "@/lib/brand/tokens";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ProfessionSelectorSection } from "@/components/landing/ProfessionSelectorSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesBenefitGrid } from "@/components/landing/FeaturesBenefitGrid";
import { TemplatePreviewStrip } from "@/components/landing/TemplatePreviewStrip";
import { HonestFAQSection } from "@/components/landing/HonestFAQSection";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Users
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-200 overflow-x-hidden transition-colors duration-200">
      {/* 1. Brand Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-slate-200/90 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl z-50 px-4 sm:px-6 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <Logo href="/" size="md" />
          <span className="hidden sm:inline-block ml-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
            For Every Profession
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700 dark:text-slate-200">
          <Link
            href="#who-is-it-for"
            className="hover:text-indigo-600 dark:hover:text-white transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            Who It&apos;s For
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-indigo-600 dark:hover:text-white transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            How It Works
          </Link>
          <Link
            href="#features"
            className="hover:text-indigo-600 dark:hover:text-white transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            Features
          </Link>
          <Link
            href="#templates"
            className="hover:text-indigo-600 dark:hover:text-white transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            Templates
          </Link>
          <Link
            href="#faq"
            className="hover:text-indigo-600 dark:hover:text-white transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/editor"
            className="flex items-center gap-1.5 min-h-[44px] px-4 sm:px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <span>Start My Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* 2. Universal Human Hero Section — 3D scene fills the full hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 flex flex-col items-center justify-center min-h-[92vh] overflow-hidden">

        {/* ─── LAYER 0: Animated gradient background ─── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-indigo-50/60 to-purple-50/40 dark:from-slate-950 dark:via-indigo-950/70 dark:to-purple-950/50 transition-colors duration-500" />
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-400/15 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-5%] right-[15%] w-[500px] h-[400px] bg-amber-400/8 dark:bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-[-5%] w-[400px] h-[500px] bg-blue-400/8 dark:bg-blue-600/12 rounded-full blur-3xl" />
        </div>

        {/* ─── LAYER 1: Three.js 3D canvas ─── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none"
          style={{ zIndex: 1 }}
        >
          <HeroScene />
        </div>

        {/* ─── LAYER 2: Centre text — narrow scrims only behind text blocks ─── */}
        <div
          className="relative max-w-2xl w-full text-center flex flex-col items-center"
          style={{ zIndex: 2 }}
        >
          {/* Tagline pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-600/90 dark:bg-indigo-600/80 text-white text-xs sm:text-sm font-semibold mb-6 shadow-lg backdrop-blur-sm border border-indigo-500/60">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>The Modern Career Copilot for Every Field</span>
          </div>

          {/* Main Headline — text-shadow gives contrast on any background */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-5 px-2 text-slate-900 dark:text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.12)] dark:[text-shadow:0_2px_20px_rgba(0,0,0,0.7)]">
            Build a resume that{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
              opens doors
            </span>{" "}
            in any field.
          </h1>

          {/* Subtitle — frosted pill scrim, narrow and targeted */}
          <div className="px-6 py-3 rounded-2xl bg-white/75 dark:bg-slate-950/65 backdrop-blur-md border border-white/60 dark:border-slate-800/50 shadow-md mb-8 max-w-xl mx-auto">
            <p className="text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-relaxed font-normal">
              Whether you work in healthcare, teaching, sales, design, finance, trades, or tech—
              ResumeForge turns your real work into results hiring managers notice.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full">
            <Link
              href="/editor"
              className="w-full sm:w-auto min-h-[52px] px-9 py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-2xl text-base shadow-xl shadow-indigo-600/40 flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <span>Build My Resume Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#who-is-it-for"
              className="w-full sm:w-auto min-h-[52px] px-9 py-4 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 border border-slate-300/80 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 font-bold rounded-2xl text-base flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 backdrop-blur-sm shadow-lg"
            >
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>See Examples for My Field</span>
            </Link>
          </div>

          {/* Stat badges — semi-transparent, 3D still visible between them */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 w-full max-w-2xl text-center">
            {[
              { stat: "28 Designs", label: "Field-Specific Formats", color: "text-slate-900 dark:text-white" },
              { stat: "100% Vector", label: "Selectable PDF & DOCX", color: "text-emerald-700 dark:text-emerald-400" },
              { stat: "Photo Ready", label: "Optional Headshot Styles", color: "text-slate-900 dark:text-white" },
              { stat: "Free to Start", label: "No Credit Card", color: "text-indigo-700 dark:text-indigo-300" },
            ].map((b) => (
              <div
                key={b.stat}
                className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/75 border border-white/70 dark:border-slate-800/60 shadow-md backdrop-blur-sm"
              >
                <div className={`text-lg sm:text-xl font-extrabold ${b.color}`}>{b.stat}</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5 leading-snug">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. "Who Is It For?" Interactive Profession Selector */}
      <ProfessionSelectorSection />

      {/* 4. "How It Works" 3 Simple Steps */}
      <HowItWorksSection />

      {/* 5. Features Grid in Plain Benefit Language */}
      <FeaturesBenefitGrid />

      {/* 6. Template Preview Strip (Photo & Non-Photo) */}
      <TemplatePreviewStrip />

      {/* 7. Honest FAQ (Privacy, Pricing, Data Deletion, Screening Software) */}
      <HonestFAQSection />

      {/* 8. Call to Action Strip */}
      <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800/80 text-center transition-colors">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Ready to build a resume you feel confident sending?
          </h2>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
            Join thousands of students, healthcare providers, educators, sales professionals, and engineers who trust ResumeForge.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/editor"
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-base font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-700 dark:text-slate-300 font-medium pt-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Instant Download</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zero Fake Content</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Private & Secure</span>
            </span>
          </div>
        </div>
      </section>

      {/* 9. Honest Brand Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-12 px-6 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo href="/" size="sm" showTagline={false} />
            <p className="text-xs text-slate-700 dark:text-slate-300 max-w-sm leading-relaxed">
              {BRAND.taglines.primary}
            </p>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} ResumeForge. Template design & career engine. Candidates retain 100% copyright and ownership of their resume content.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
            <Link href="/editor" className="hover:text-indigo-600 dark:hover:text-white transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
              Resume Editor
            </Link>
            <Link href="/templates" className="hover:text-indigo-600 dark:hover:text-white transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
              Templates
            </Link>
            <Link href="/ats-scanner" className="hover:text-indigo-600 dark:hover:text-white transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
              Screening Check
            </Link>
            <Link href="/interview" className="hover:text-indigo-600 dark:hover:text-white transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
              Interview Coach
            </Link>
            <Link href="/applications" className="hover:text-indigo-600 dark:hover:text-white transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
              Application Tracker
            </Link>
            <Link href="#faq" className="hover:text-indigo-600 dark:hover:text-white transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
              Privacy & FAQ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
