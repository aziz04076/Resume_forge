# ⚡ ResumeForge — The Autonomous Career Copilot

> Production-grade, AI-powered Career Operating System designed to beat enterprise ATS algorithms and secure elite job offers.

[![Build & Test](https://github.com/resumeforge/resumeforge/actions/workflows/ci.yml/badge.svg)](https://github.com/resumeforge/resumeforge/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.1-emerald.svg)](https://www.prisma.io/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_60fps-black.svg)](https://threejs.org/)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)]()

---

## 🌟 Why ResumeForge?

Traditional resume tools (Zety, Resume.io, Novoresume, Canva) are static visual formatters that produce unquantified bullets, parse poorly through enterprise ATS parsers (Workday, Taleo, Greenhouse), and stop once the PDF is downloaded.

**ResumeForge** is an end-to-end **Career Copilot** built with **real AI precision** (Claude 3.5 Sonnet & OpenAI GPT-4o) and **interactive 3D WebGL experiences**:
- **Live Split-Screen Resume Studio** with real-time preview and instant layout recalculation.
- **28 Designer Templates** spanning 8 curated categories: ATS-Friendly (100% parse rate), Tech/Silicon Valley, Executive (Ivy/Harvard), Creative (two-column sidebar), Modern Slate, Fresher/Graduate, and Academic.
- **3D Interactive Orbit & Showcase**: Inspect resumes in a 360-degree Three.js physics canvas with paper thickness, lighting, and particle fields.
- **10 Autonomous Real AI Engines**:
  1. **AI Bullet Improver**: Converts weak bullets into Google XYZ formula (`Accomplished [X], measured by [Y], by doing [Z]`) and STAR formatted bullets.
  2. **JD Keyword Matcher**: Paste any job description to compute a live ATS match score (0-100), missing keywords, and skill gaps.
  3. **ATS Algorithm Simulator**: Detailed audit replicating Taleo/Workday parse rules with prioritized actionable fixes.
  4. **Resume Parser & Auto-fill**: Extracts structured candidate data from uploaded text/resumes.
  5. **Cover Letter Generator**: Bridges resume achievements to target company missions with custom tones.
  6. **Voice AI Mock Interview Coach**: Real-time voice answer practice with the Web Speech API and bar-raiser AI scoring.
  7. **LinkedIn Profile Optimizer**: Recruiter search headlines, storytelling About narrative, and algorithmic skill tags.
  8. **Career Path & Skill Gap Advisor**: 3 next-level roles, salary benchmarks, and 30-day/3-month/6-month action roadmap.
  9. **Personal Portfolio Generator**: Turns the resume into a deployable portfolio website with live projects and experience timeline.
  10. **In-Editor AI Chat Copilot**: Floating assistant with direct resume mutation actions.
- **Kanban Job Application Tracker**: Track applications across stages (`Saved`, `Applied`, `Interview`, `Offer`, `Rejected`), with follow-up dates, notes, and response rate analytics.
- **Multi-Format Vector Export**: Pixel-perfect ATS PDF, native Microsoft Word `.docx`, `.txt`, and `.json`.
- **Zero Mock Data Guarantee**: Every AI feature calls real LLMs with strict Zod structured outputs.
- **Privacy-First**: Zero model training on candidate resumes. 1-click full JSON export and permanent data wipe.

---

## 🏗️ Architecture & Tech Stack

```
                          ┌──────────────────────────────────────┐
                          │   Next.js 15 App Router Frontend    │
                          │   (Tailwind, Framer Motion, 3D R3F)  │
                          └───────────────────┬──────────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
     ┌─────────────────────────────────┐             ┌─────────────────────────────────┐
     │      Split-Screen Studio        │             │        Career Hub & Tracker     │
     │  - Zustand Editor State         │             │  - Kanban Application Pipeline  │
     │  - 28 Dynamic Template Engines  │             │  - Voice AI Mock Interviewer    │
     │  - Realtime 3D Orbit Mesh       │             │  - LinkedIn & Cover Letter Hub  │
     └────────────────┬────────────────┘             └────────────────┬────────────────┘
                      │                                               │
                      └───────────────────────┬───────────────────────┘
                                              ▼
                          ┌──────────────────────────────────────┐
                          │         Next.js Route Handlers       │
                          │        (Zod Validation Layer)        │
                          └───────────────────┬──────────────────┘
                                              │
         ┌──────────────────────────┬─────────┴────────────┬──────────────────────────┐
         ▼                          ▼                      ▼                          ▼
┌─────────────────┐       ┌─────────────────┐    ┌──────────────────┐       ┌──────────────────┐
│ Anthropic Claude│       │   OpenAI GPT-4o │    │  Prisma ORM 6.4  │       │  Document Engine │
│ 3.5 Sonnet /    │       │ (Swappable      │    │  (PostgreSQL /   │       │  - Puppeteer PDF │
│ Haiku LLM       │       │  Fallback LLM)  │    │   Neon / Supabase│       │  - docx Word Gen │
└─────────────────┘       └─────────────────┘    └──────────────────┘       └──────────────────┘
```

- **Frontend**: Next.js 15.1.7, React 19, TypeScript 5, Tailwind CSS, Lucide Icons, Sonner.
- **3D Graphics**: Three.js WebGL with PCF Soft Shadows, particle fields, mouse parallax, and low-power fallbacks.
- **State Engine**: Zustand with undo/redo history stack, auto-scoring heuristics, and debounced persistence.
- **Database & ORM**: PostgreSQL via Prisma Client 6.4.1.
- **AI Core**: Swappable Anthropic Claude (`@anthropic-ai/sdk`) & OpenAI (`openai`) with strict Zod schemas.
- **Document Generators**: `docx` for native Word files, `jspdf` & `html2canvas` for client vector PDFs, and `file-saver`.
- **Speech**: HTML5 Web Speech API for voice mock interviews.

---

## 📂 Project Directory Structure

```
ResumeGenerator/
├── .github/workflows/ci.yml       # Automated GitHub Actions CI pipeline
├── prisma/
│   └── schema.prisma              # Relational schema (Resumes, Versions, Jobs, ATS)
├── public/                        # Static assets & fonts
├── src/
│   ├── app/
│   │   ├── page.tsx               # 3D interactive hero landing page
│   │   ├── editor/page.tsx        # Split-screen live resume builder
│   │   ├── templates/page.tsx     # 28 Designer templates gallery
│   │   ├── ats-scanner/page.tsx   # JD Matcher & ATS simulator
│   │   ├── interview/page.tsx     # Voice AI mock interview coach
│   │   ├── cover-letter/page.tsx  # Tailored cover letter generator
│   │   ├── career-hub/page.tsx    # LinkedIn optimizer & career roadmap
│   │   ├── applications/page.tsx  # Kanban job tracker & analytics
│   │   ├── portfolio/page.tsx     # Personal portfolio site generator
│   │   ├── settings/page.tsx      # Privacy center, export & data wipe
│   │   ├── api/ai/                # 9 Real AI API endpoints
│   │   │   ├── bullet-improver/
│   │   │   ├── jd-matcher/
│   │   │   ├── ats-simulator/
│   │   │   ├── resume-parser/
│   │   │   ├── cover-letter/
│   │   │   ├── interview-coach/
│   │   │   ├── linkedin-optimizer/
│   │   │   ├── career-advisor/
│   │   │   └── chat-copilot/
│   │   ├── globals.css            # Dark/light theme & A4 print dimensions
│   │   └── layout.tsx             # Root layout with Toaster and fonts
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── HeroScene.tsx      # 3D floating resume sheets with mouse parallax
│   │   │   └── ResumeOrbit3D.tsx  # 3D rotating preview canvas with shadows
│   │   └── editor/
│   │       ├── EditorHeader.tsx   # Toolbar with exports & health score
│   │       ├── EditorLayout.tsx   # Master split-screen layout
│   │       ├── FormEditor.tsx     # Full structured input forms
│   │       ├── LivePreviewPane.tsx# Real-time A4 preview with zoom controls
│   │       ├── TemplateSelector.tsx # 28 template switcher with filters
│   │       ├── ThemeCustomizer.tsx  # Typography, colors & spacing controls
│   │       ├── HealthScoreModal.tsx # Gamified ATS health breakdown
│   │       ├── BulletImproverModal.tsx # STAR/XYZ formula generator
│   │       └── AICopilotWidget.tsx # Floating AI chat copilot
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── provider.ts        # Swappable Claude/OpenAI service with Zod validation
│   │   │   └── prompts.ts         # STAR/XYZ prompts and recruiter rubrics
│   │   ├── db/prisma.ts           # Singleton Prisma database client
│   │   ├── export/
│   │   │   ├── docxExporter.ts    # Native Microsoft Word exporter
│   │   │   ├── pdfExporter.ts     # High-res client PDF exporter
│   │   │   └── miscExporters.ts   # Plain text & JSON exporters
│   │   └── store/
│   │       └── useResumeStore.ts  # Zustand store with undo/redo & scoring
│   ├── schemas/
│   │   ├── resume.schema.ts       # Typed Resume Zod schemas
│   │   └── ai.schema.ts           # Strict AI response schemas
│   └── templates/
│       ├── registry.ts            # 28 template metadata catalog
│       ├── ResumeTemplateDispatcher.tsx # Master layout router
│       ├── MinimalATS.tsx         # 100% ATS single-column template
│       ├── TechModern.tsx         # Silicon Valley tech template
│       ├── ExecutiveClassic.tsx   # Ivy League / Harvard serif template
│       ├── CreativeSidebar.tsx    # Asymmetric two-column creative template
│       ├── FresherStarter.tsx     # Graduate / Entry-level template
│       └── ModernSlate.tsx        # Modern corporate template
├── tests/                         # Automated unit & schema test suite
│   ├── ai-schemas.test.ts
│   ├── health-score.test.ts
│   └── template-registry.test.ts
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🔑 Environment Variables Setup

Create a `.env` file in the root directory (refer to `.env.example`):

```bash
# 1. Database (PostgreSQL - Neon, Supabase, AWS RDS, or local)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/resumeforge?schema=public"

# 2. AI Providers (Real API keys required for AI features)
# Primary: Anthropic Claude 3.5 Sonnet / Haiku
ANTHROPIC_API_KEY="sk-ant-api03-..."

# Optional Fallback / Provider Switch: OpenAI GPT-4o
OPENAI_API_KEY="sk-proj-..."

# 3. NextAuth / Authentication
NEXTAUTH_SECRET="your-32-char-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# 4. Email Reminders (Resend)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="onboarding@resend.dev"
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24 recommended)
- **npm** or **pnpm**

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Generate Database Client
```bash
npx prisma generate
```

### 4. Run Test Suite
```bash
npm test
```
All 9 automated unit tests verifying Zod schemas, ATS health scoring algorithms, and template specifications will execute and pass.

### 5. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Verification & Feature Walkthrough Script

1. **Interactive 3D Landing Page (`/`)**:
   - Move your mouse across the hero to observe the real-time 3D parallax on the floating resume sheets.
   - Click **"Launch Studio"** to enter the split-screen editor.

2. **Split-Screen Live Editor (`/editor`)**:
   - Edit any personal detail or experience bullet on the left panel; observe the live preview on the right update instantly.
   - Click the **Sparkles** icon on any work experience bullet to launch the **AI Bullet Improver** (STAR / Google XYZ formula).
   - Test **Undo (`Ctrl+Z`)** and **Redo (`Ctrl+Y`)** buttons in the toolbar.
   - Click the **ATS Health Score badge** (e.g. `90%`) to view the gamified checklist breakdown.
   - Switch to the **"Templates (28)"** tab and filter by `Tech`, `Executive`, or `ATS-Friendly` to swap layouts instantly.
   - Switch to the **"3D Showcase"** tab to rotate the resume in a full 360-degree interactive Three.js viewport.
   - Click **"Export"** to download the resume as an ATS PDF, native Microsoft Word `.docx`, `.txt`, or `.json`.
   - Click the floating **AI Copilot** orb at the bottom-right to interact with your in-editor resume assistant.

3. **Job Description Matcher & ATS Simulator (`/ats-scanner`)**:
   - Paste any target Job Description and click **"Calculate ATS Match Score"** to view matching keywords, critical missing keywords, and tailored suggestions.
   - Switch to the **ATS Algorithm Simulator** tab to inspect parse diagnostics across Taleo and Workday heuristics.
   - Use the **Resume Parser** tab to paste raw resume text and auto-fill the editor.

4. **Voice AI Mock Interview Coach (`/interview`)**:
   - Set your target role and click **"Start Practice Session"** to synthesize questions.
   - Click **"Speak Answer (Mic)"** to speak into your microphone via the Web Speech API.
   - Click **"Score & Review Answer"** to receive an instant evaluation, score (0-100), and model answer.

5. **Tailored Cover Letter Generator (`/cover-letter`)**:
   - Set the company name and tone, then generate a tailored cover letter. Copy to clipboard or download as TXT.

6. **Career Acceleration & LinkedIn Hub (`/career-hub`)**:
   - Generate recruiter-optimized LinkedIn headlines, an About section narrative, and top 15 skill tags.
   - Generate a 6-month phased career progression roadmap with target roles and salary benchmarks.

7. **Kanban Job Application Tracker (`/applications`)**:
   - View your active application pipeline across stages (`Saved`, `Applied`, `Interview`, `Offer`, `Rejected`).
   - Track follow-up reminder dates and view response rate metrics.

8. **Personal Portfolio Generator (`/portfolio`)**:
   - Preview your personal developer/executive portfolio site generated directly from your resume data.

9. **Privacy & Data Center (`/settings`)**:
   - Review the Zero-Training pledge, verify API statuses, export your full personal JSON archive, or execute a permanent data wipe.

---

## 🚢 Production Deployment

### Vercel Deployment
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set your Environment Variables (`DATABASE_URL`, `ANTHROPIC_API_KEY`, `NEXTAUTH_SECRET`, etc.).
4. Deploy! Next.js App Router will generate all static and dynamic edge routes.

### Database Setup
- For PostgreSQL, use [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
- Run migrations: `npx prisma db push`.

---

## 🛡️ License

ResumeForge is open-source software licensed under the MIT License.
