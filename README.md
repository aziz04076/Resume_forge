# ⚡ ResumeForge — The Autonomous AI Career Copilot

> Production-grade, AI-powered Career Operating System featuring 1:1 WYSIWYG LaTeX-grade PDF rendering, enterprise ATS optimization, interactive 3D WebGL hero, and hardened multi-LLM orchestration.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.1-emerald.svg)](https://www.prisma.io/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_60fps-black.svg)](https://threejs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-Headless_Chromium-darkgreen.svg)](https://playwright.dev/)
[![Automated Tests](https://img.shields.io/badge/Tests-46%2F46_Passing-brightgreen.svg)]()
[![Zero Mock Data](https://img.shields.io/badge/Zero_Mock_Data-100%25_Verified-success.svg)]()

---

## 🌟 What is ResumeForge?

Traditional resume builders (Zety, Resume.io, Canva) are static visual tools that export flattened raster images (unparseable by enterprise ATS like Workday or Greenhouse), leak website watermarks, and end their journey once a PDF is downloaded.

**ResumeForge** is a full-stack **Career Operating System** engineered for job seekers across all disciplines:
- **1:1 WYSIWYG Vector PDF Engine**: Eliminates the preview-vs-PDF gap. What you see in the editor is mathematically identical to the downloaded PDF down to millimeter accuracy, powered by server-side headless Chromium with client-side `@react-pdf/renderer` vector fallback.
- **Strict Page Count Guarantee**: Zero blank 2nd pages. Dynamic content-driven pagination measures physical elements (A4: 210mm, Letter: 215.9mm) and avoids breaks inside blocks.
- **LaTeX-Grade Classic Template**: Small-caps typography, ruled section dividers, compact top-right photo, left-aligned 2-column skills, serif typography, and resilience against special characters (`% & $ # _ { } < > " ' – — ’`).
- **28+ Interactive Templates with Real Miniatures**: Template picker showcases real scaled rendered components instead of static icons, with instant "Preview with My Resume" mode and click-to-zoom inspection.
- **Zero Website Traces (3-Level White-Labeling)**: No forced "Created with ResumeForge" watermarks. Configurable branding modes (`none`, `metadata-only`, `visible`) and clean browser printing without URLs or headers.
- **Hardened Multi-LLM Intelligence**: Anthropic Claude 3.5 Sonnet & OpenAI GPT-4o with Zod schema validation, sliding-window rate limiting, and prompt injection defense. Zero mock data guarantee.
- **Interactive 3D WebGL Orbit**: 360° Three.js physics canvas with real-time shadow casting, reduced-motion compliance, and memory leak prevention.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (Next.js 15 App Router / React 19)"]
        UI["Editor / Kanban Tracker / Career Hub / Interview Coach"]
        Store["Zustand Store (useResumeStore)<br/>- 15-Step Undo/Redo<br/>- Realtime ATS Scoring<br/>- LocalStorage Sync"]
        ThreeCanvas["Three.js WebGL 3D Canvas<br/>- Floating Resume Sheets<br/>- Reduced-Motion Compliance<br/>- WebGL Context Disposal"]
        SharedLayout["SharedPageLayout Engine<br/>- Physical Millimeter Dimensions<br/>- Scale Transforms<br/>- Realtime Page Overflow Counter"]
        MiniPreview["TemplateMiniPreview<br/>- Real Rendered Scaled Miniatures<br/>- Lazy IntersectionObserver"]
    end

    subgraph ExportPipeline ["Dual-Engine Export Pipeline"]
        ChromiumEngine["Server-Side Headless Chromium<br/>(/api/export/pdf via Playwright)<br/>- 1:1 Vector Fidelity<br/>- Bundled CSS & Latin Modern Fonts<br/>- Zero Trailing Blank Pages"]
        ReactPdfEngine["Client-Side Fallback<br/>(@react-pdf/renderer v4)<br/>- Instant Client Vector PDF<br/>- ATS Clean Reading Order"]
        CleanPrint["Clean Iframe Print Service<br/>- Zero Browser Headers/URLs<br/>- @page margin: 0"]
    end

    subgraph APILayer ["API & Intelligence Layer (Next.js 15 Route Handlers)"]
        AuthMiddleware["Auth.js (NextAuth v5)<br/>- Guest-to-User Profile Migration"]
        RateLimiter["Sliding-Window IP Rate Limiter<br/>- 30 req/min + 100/day User Quota"]
        PromptGuard["Prompt Injection Defense<br/>- Boundary Tag Wrapping<br/>- Tag Neutralization"]
        AIProvider["Multi-LLM Dispatcher<br/>- Anthropic Claude 3.5 Sonnet (Primary)<br/>- OpenAI GPT-4o (Fallback)<br/>- Zod Schema Sanitizer & Auto-Repair"]
        DocParser["Document Parsing Engine<br/>- unpdf (PDF) + mammoth (DOCX)"]
    end

    subgraph Persistence ["Persistence & Cloud Infrastructure"]
        PostgreSQL[("PostgreSQL via Prisma ORM 6.4.1<br/>- Resumes, Versions, Applications, Comments")]
        S3Storage[("AWS S3 / Cloudflare R2<br/>- Presigned Uploads for Photos")]
        ExternalLLM["Anthropic Claude / OpenAI Endpoints"]
        ResendEmail["Resend Email API<br/>- Cron Follow-Up Notifications"]
    end

    UI --> Store
    Store --> SharedLayout
    SharedLayout --> ChromiumEngine
    SharedLayout --> CleanPrint
    Store --> ReactPdfEngine
    UI --> ThreeCanvas
    UI --> MiniPreview
    UI --> APILayer

    APILayer --> RateLimiter
    RateLimiter --> PromptGuard
    PromptGuard --> AIProvider
    AIProvider --> ExternalLLM
    APILayer --> AuthMiddleware
    AuthMiddleware --> PostgreSQL
    APILayer --> PostgreSQL
    APILayer --> S3Storage
    APILayer --> ResendEmail
```

---

## 🔍 Core Architecture Deep Dive

### 1. 1:1 WYSIWYG Rendering Pipeline
* **The Problem**: Traditional resume webapps use independent rendering layers for the web preview (HTML/CSS) and PDF output (Canvas or third-party wrappers), causing font mismatches, cut-off bullet points, and unexpected extra blank pages.
* **The Solution**: ResumeForge unifies both worlds through [`SharedPageLayout.tsx`](src/components/preview/SharedPageLayout.tsx) and [`serverPdfRenderer.ts`](src/lib/export/serverPdfRenderer.ts):
  - **Physical Layout Accuracy**: Dimensions are pinned to exact physical units (`210mm` for A4, `215.9mm` for US Letter).
  - **Single Render Tree**: Headless Chromium spins up server-side, renders the identical React component tree, injects compiled Tailwind and Latin Modern serif stylesheets, and prints vector PDFs with `@page { margin: 0 }`.
  - **Dynamic Page Bounds**: Container height is measured against physical page heights (`297mm` for A4, `279.4mm` for Letter) with a 4px hysteresis buffer to ensure that content never bleeds onto an unwanted blank 2nd page.

### 2. Multi-LLM Provider Engine (`src/lib/ai/`)
* **Dual-Provider Architecture**: Anthropic Claude 3.5 Sonnet serves as the primary engine for high-reasoning tasks (tailoring, interview coaching, recruiter scan simulation). OpenAI GPT-4o serves as the configurable alternative/fallback.
* **Strict Type Safety**: Every AI response is validated with Zod schemas before being returned to the client. If an LLM returns markdown artifacts, an automated 1-attempt repair sanitizer normalizes the payload.
* **Prompt Injection Defense**: All user-supplied resumes, job descriptions, and GitHub READMEs pass through `wrapUntrustedInput()`, wrapping content in explicit `<untrusted_tag>` boundaries and escaping nested closing tags.
* **Zero Mock Data Guarantee**: If an API key is unconfigured, the system returns typed `MissingAPIKeyError` (HTTP 401 with `isMissingKey: true`) rather than generating synthetic placeholder data.

### 3. State Management & Offline Guest Mode (`src/lib/store/useResumeStore.ts`)
* **Dual-Mode Persistence**: Unauthenticated users can build, customize, and export resumes immediately via localStorage-backed Zustand state.
* **1-Click Account Migration**: Upon signing in with Auth.js (OAuth or Magic Link), `/api/auth/migrate-guest` automatically transfers the local resume and application history into PostgreSQL under the user's permanent profile.
* **Deep History**: The Zustand store maintains a 15-state undo/redo stack, tracking all mutations, custom section insertions, and styling modifications.

---

## 🚀 Key Feature Matrix

| Feature | Description | Engine / Tech |
| :--- | :--- | :--- |
| **WYSIWYG Chromium PDF Export** | Exact 1:1 match with preview; vector text; zero blank pages | Headless Chromium + Playwright |
| **Client Vector PDF Fallback** | Instant client-side PDF generation without server roundtrip | `@react-pdf/renderer` v4 + `unpdf` |
| **Classic Professional Template** | LaTeX-grade classic resume; small-caps; ruled sections; compact photo | React + Tailwind + Latin Modern |
| **Real Miniature Gallery** | Scaled live miniatures with "Preview with My Resume" toggle & zoom | `TemplateMiniPreview` + Scale CSS |
| **Clean Iframe Printing** | Browser print dialog without page URLs, date stamps, or browser chrome | Hidden Iframe Service |
| **3-Level Branding Control** | White-label export: `none`, `metadata-only`, or `visible` | Schema + Exporter Pipeline |
| **Content Quality Linter** | Flags incomplete sentences, trailing numbers, and spelling mistakes | `formatUtils.ts` + Inline Badges |
| **Tailor to JD with Diffs** | Anti-hallucination JD alignment with side-by-side visual diffs | Claude 3.5 Sonnet / GPT-4o |
| **GitHub Repo Importer** | Imports public GitHub repositories and auto-generates quantified STAR bullets | GitHub REST API + LLM |
| **Recruiter 6-Sec Scan** | Simulates recruiter eye tracking (F-pattern), heatmaps, and dealbreakers | Claude 3.5 Sonnet |
| **Public Share & Mentor Mode**| Password-protected shareable links with section-level mentor review & QR code | PostgreSQL + SHA-256 |
| **Kanban Job Tracker** | Drag-and-drop application pipeline with response metrics & version tracking | `@dnd-kit/core` |
| **STAR Interview Coach** | Voice answer practice with rubric scoring (S-T-A-R) and filler-word detection | Web Speech API + LLM |
| **Salary Negotiation Coach** | Role benchmarks (25th–90th percentile) and psychological counter-offer scripts | Real LLM Provider |
| **Multi-Language Translation** | Cultural adaptation and translation into 7 languages | Claude 3.5 Sonnet |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1.7 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React icons, Sonner toast notifications
- **3D Graphics**: Three.js (WebGL with automatic geometry/material disposal and reduced-motion detection)
- **PDF Rendering**: Playwright (Headless Chromium Vector Export) + `@react-pdf/renderer` v4
- **State Management**: Zustand with 15-step undo/redo stack and localStorage sync
- **Authentication**: Auth.js (NextAuth v5) with PostgreSQL Prisma adapter & 1-click guest migration
- **Database**: PostgreSQL with Prisma ORM 6.4.1
- **File Storage**: AWS S3 / Cloudflare R2 presigned uploads via `@aws-sdk/client-s3`
- **AI Validation**: Zod structured schema enforcement with 1-attempt repair retry
- **Email**: Resend API for interview and follow-up cron reminders

---

## ⚡ Getting Started Locally

### 1. Prerequisites
- **Node.js**: v20+ or v22+
- **PostgreSQL**: Local instance or hosted database (Neon, Supabase)
- **API Key**: Anthropic Claude API key (`ANTHROPIC_API_KEY`) or OpenAI key (`OPENAI_API_KEY`)

### 2. Clone and Install
```bash
git clone https://github.com/aziz04076/Resume_forge.git
cd Resume_forge
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your configuration:
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/resumeforge?schema=public"

# Auth.js (NextAuth v5)
NEXTAUTH_SECRET="your_secure_32_char_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# AI Provider (Anthropic Claude 3.5 Sonnet recommended)
ANTHROPIC_API_KEY="sk-ant-..."
ANTHROPIC_MODEL="claude-3-5-sonnet-20241022"

# Optional Fallback
OPENAI_API_KEY="sk-proj-..."
OPENAI_MODEL="gpt-4o"

# Email Reminders (Optional)
RESEND_API_KEY="re_..."
CRON_SECRET="your_cron_bearer_token"
```

### 4. Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification Matrix

Run the comprehensive test suite verifying schemas, ATS scoring, vector PDF extraction, and WYSIWYG page bounds:
```bash
# Automated Test Suite (46 passing tests across 11 suites)
npm test

# TypeScript Strict Typecheck
npx tsc --noEmit

# Code Quality & Linter
npm run lint

# Next.js Production Build
npm run build
```

---

## 🔒 Security Hardening

- **Prompt Injection Defense**: Boundary tagging (`<untrusted_job_description>`) and closing tag neutralization.
- **Sliding-Window Rate Limiting**: Max 30 requests/minute per IP address.
- **Daily Quotas**: Max 100 AI requests/day per authenticated user stored in PostgreSQL.
- **Content Security & HTTP Headers**: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`.
- **Zero Model Training**: User data is strictly used for one-shot completions and never retained for training.

---

## 📄 License
MIT License. Created for portfolio and production deployment.
