# ⚡ ResumeForge — The Autonomous AI Career Copilot

> Production-grade, AI-powered Career Operating System designed to beat enterprise ATS algorithms and accelerate tech careers.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.1-emerald.svg)](https://www.prisma.io/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_60fps-black.svg)](https://threejs.org/)
[![Automated Tests](https://img.shields.io/badge/Tests-13%2F13_Passing-brightgreen.svg)]()

---

## 🌟 What is ResumeForge?

Traditional resume builders (Zety, Resume.io, Canva) are static visual tools that export flattened raster images (unparseable by enterprise ATS like Workday or Greenhouse) and end the journey once a PDF is downloaded.

**ResumeForge** is a full-stack **Career Copilot** built with **real AI intelligence** (Anthropic Claude 3.5 Sonnet & OpenAI GPT-4o), **true vector text PDF generation**, and **interactive 3D WebGL experiences**:
- **Text-Based Vector PDF Engine**: Clean vector PDF streams via `@react-pdf/renderer` v4 with 100% selectable text, guaranteed reading order, and automated text-extraction verification in CI.
- **28 Designer Templates**: Spanning 8 categories: ATS-Friendly, Silicon Valley Tech, Executive Classic, Creative Sidebar, Modern Slate, Fresher Graduate, Academic CV, and Compact Minimal.
- **Mobile-Responsive Split Screen**: Live side-by-side editing on desktop and fluid tab switching on mobile devices.
- **Interactive 3D WebGL Orbit**: 360° Three.js physics canvas with real-time shadow casting, reduced-motion compliance, and memory leak prevention.
- **Strict Anti-Hallucination & Security**: Delimiter boundary wrapping against prompt injection, sliding-window IP rate limiting, and daily quotas.
- **Zero Mock Data Guarantee**: Every endpoint calls real LLMs with Zod schema validation; missing keys return structured 401s rather than fake placeholder responses.

---

## 🚀 Key Feature Matrix

| Feature | Description | Engine / Tech |
| :--- | :--- | :--- |
| **Vector ATS PDF Export** | True text streams with standard reading order; selectable & ATS readable | `@react-pdf/renderer` v4 + `unpdf` |
| **Tailor to JD with Diffs** | Anti-hallucination JD alignment with side-by-side visual diffs & flagged suggestions | Claude 3.5 Sonnet / GPT-4o |
| **GitHub Repo Importer** | Imports public GitHub repositories and auto-generates quantified STAR bullets | GitHub REST API + LLM |
| **Recruiter 6-Sec Scan** | Simulates recruiter eye tracking (F-pattern), heatmaps, and instant dealbreakers | Claude 3.5 Sonnet |
| **Public Share & Mentor Mode**| Password-protected shareable links with section-level mentor review & QR code | PostgreSQL + SHA-256 |
| **Kanban Job Tracker** | Drag-and-drop application pipeline with response metrics & version tracking | `@dnd-kit/core` |
| **Automated Email Reminders** | Scheduled follow-up reminders and AI follow-up email drafts | Resend API + Vercel Cron |
| **STAR Interview Coach** | Voice answer practice with rubric scoring (S-T-A-R) and filler-word detection | Web Speech API + LLM |
| **Salary Negotiation Coach** | Role benchmarks (25th–90th percentile) and psychological counter-offer scripts | Real LLM Provider |
| **Multi-Language Translation** | Cultural adaptation and translation into 7 languages (Hindi, Spanish, French, etc.) | Claude 3.5 Sonnet |
| **Command Palette & Tour** | Keyboard-first navigation (`Ctrl+K` / `Cmd+K`) and interactive onboarding tour | React 19 + Custom Hooks |
| **Multi-Format Upload Parser**| Ingests candidate data from PDF (`unpdf`) and Word `.docx` (`mammoth`) | Next.js Multipart API |

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 15.1.7 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React icons, Sonner toast notifications
- **3D Graphics**: Three.js (WebGL with automatic geometry/material disposal and reduced-motion detection)
- **State Management**: Zustand with 15-step undo/redo stack and localStorage sync
- **Authentication**: Auth.js (NextAuth v5) with PostgreSQL Prisma adapter & 1-click guest migration
- **Database**: PostgreSQL with Prisma ORM 6.4.1
- **File Storage**: AWS S3 / Cloudflare R2 presigned uploads via `@aws-sdk/client-s3`
- **AI Validation**: Zod structured schema enforcement with 1-attempt repair retry
- **Email**: Resend API for interview and follow-up cron reminders

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for complete system design diagrams and rationale.

---

## ⚡ Getting Started Locally

### 1. Prerequisites
- **Node.js**: v20+ or v24+
- **PostgreSQL**: Local instance or hosted database (e.g. Neon, Supabase)
- **API Key**: Anthropic Claude API key (`ANTHROPIC_API_KEY`) or OpenAI key (`OPENAI_API_KEY`)

### 2. Clone and Install
```bash
git clone https://github.com/resumeforge/resumeforge.git
cd ResumeGenerator
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in the following variables:
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/resumeforge?schema=public"

# Auth.js (NextAuth v5)
NEXTAUTH_SECRET="your_secure_32_char_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# AI Provider (Anthropic Claude 3.5 Sonnet recommended)
ANTHROPIC_API_KEY="sk-ant-..."
ANTHROPIC_MODEL="claude-3-5-sonnet-20241022"

# Optional Fallback / Alternative
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

## 🧪 Testing & Verification

Run the full automated test suite (Zod schemas, ATS scoring, vector PDF extraction, security guardrails):
```bash
# Automated Test Suite (13 passing tests)
npm test

# TypeScript Typecheck
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
