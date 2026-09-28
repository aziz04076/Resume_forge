# ResumeForge Architecture & System Design Document

## 1. System Overview

**ResumeForge** is an autonomous AI Career Copilot built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Zustand, Three.js, Prisma ORM, and Multi-LLM orchestration (Anthropic Claude + OpenAI).

Unlike traditional resume builders that output flattened canvas screenshots or static templates, ResumeForge is built around three core engineering pillars:
1. **100% Text-Based Vector PDF Generation**: Guaranteed ATS machine-parsability and crisp typography at infinite zoom.
2. **Hardened Multi-LLM Provider Engine**: Type-safe streaming and JSON schema enforcement with Zod, sliding-window rate limiting, and prompt-injection defenses.
3. **Full Career Lifecycle Management**: From JD matching and STAR interview prep to GitHub repository ingestion and salary negotiation scripts.

---

## 2. Architecture Diagram

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Next.js 15 / React 19)"]
        UI["Editor / Kanban / Career Hub / Interview Coach"]
        Store["Zustand Store (useResumeStore)<br/>- 15-step Deep Undo/Redo<br/>- Realtime ATS Scoring<br/>- LocalStorage Persistence"]
        Renderer3D["Three.js WebGL Orbit & Hero Scene<br/>- Context Loss Handling<br/>- Reduced-Motion Compliance"]
        PDFRenderer["@react-pdf/renderer Engine<br/>- True Vector Text Stream<br/>- ATS Readable Structure"]
    end

    subgraph API ["Next.js App Router API Routes"]
        AuthMiddleware["Auth.js (NextAuth v5) + Guest Token Bridge"]
        RateLimiter["Sliding-Window IP Rate Limiter & User Quota"]
        PromptSanitizer["Prompt Injection Guardrail (wrapUntrustedInput)"]
        AIEngine["Multi-LLM Provider (Anthropic Primary, OpenAI Fallback)"]
        DataExtractor["Document Parser (unpdf for PDF, mammoth for DOCX)"]
    end

    subgraph Storage ["Persistence & External Services"]
        PG[("PostgreSQL Database (Prisma ORM)")]
        S3[("AWS S3 / Cloudflare R2")]
        LLMs["Anthropic Claude 3.5 Sonnet / OpenAI GPT-4o"]
        ResendAPI["Resend Email Service (Application Reminders)"]
    end

    UI --> Store
    Store --> UI
    Store --> PDFRenderer
    UI --> Renderer3D
    UI --> API

    API --> RateLimiter
    RateLimiter --> PromptSanitizer
    PromptSanitizer --> AIEngine
    AIEngine --> LLMs
    API --> AuthMiddleware
    AuthMiddleware --> PG
    API --> PG
    API --> S3
    API --> ResendAPI
```

---

## 3. Core Subsystems

### 3.1. Vector Text PDF Engine (`src/lib/export/pdfExporter.ts`)
* **Problem**: Traditional resume builders often use `html2canvas` + `jspdf` to convert HTML to images. ATS parsers (Workday, Greenhouse, Lever) cannot extract text from raster images, causing automated rejections.
* **Solution**: ResumeForge uses `@react-pdf/renderer` v4 with a custom vector document generator (`src/lib/export/pdfTextRenderer.tsx`). Content is emitted as native PDF text streams with strict structural reading order: Name $\rightarrow$ Summary $\rightarrow$ Experience $\rightarrow$ Education $\rightarrow$ Skills.
* **Verification**: Verified by automated CI tests using `unpdf` (`extractText`), asserting zero raster degradation and 100% extracted text accuracy.

### 3.2. Multi-LLM Provider Pattern (`src/lib/ai/provider.ts`)
* **Dual-Provider Architecture**: Anthropic Claude 3.5 Sonnet serves as the primary engine for high-reasoning tasks (tailoring, interview coaching, recruiter scan simulation). OpenAI GPT-4o serves as the configurable alternative/fallback.
* **Strict Type Safety**: Every AI response is validated with Zod schemas before being returned to the client. If an LLM returns slight markdown artifacts (e.g. ````json ````` wrapper), an automated 1-attempt repair sanitizer normalizes the payload.
* **Prompt Injection Defense**: All user-supplied resumes, job descriptions, and GitHub READMEs pass through `wrapUntrustedInput()`, which wraps content in explicit `<untrusted_tag>` boundaries and escapes nested closing tags.
* **Zero Mock Data Guarantee**: If an API key is unconfigured, the system returns typed `MissingAPIKeyError` (HTTP 401 with `isMissingKey: true`) rather than generating misleading synthetic dummy data.

### 3.3. State Management & Offline Guest Mode (`src/lib/store/useResumeStore.ts`)
* **Dual-Mode Persistence**: Unauthenticated users can build, customize, and export resumes immediately via localStorage-backed Zustand state.
* **1-Click Account Migration**: Upon signing in with Auth.js (OAuth or Magic Link), `/api/auth/migrate-guest` automatically transfers the local resume and application history into PostgreSQL under the user's permanent profile.
* **Deep History**: The Zustand store maintains a 15-state undo/redo stack, tracking all mutations, custom section insertions, and styling modifications.

### 3.4. Security & Abuse Prevention (`src/lib/ai/rateLimiter.ts`)
* **IP Sliding Window**: Enforces a maximum of 30 requests per minute per IP address.
* **User Daily Quota**: Enforces a 100-request daily quota for authenticated accounts tracked directly in the PostgreSQL `User` table.
* **Input Size Validation**: Rejects payloads exceeding 50,000 characters to prevent prompt inflation and token exhaustion attacks.
* **Cron Authentication**: The reminder automation endpoint (`/api/reminders/cron`) requires a cryptographically strong `Bearer ${CRON_SECRET}` header.

### 3.5. WebGL 3D Visualization (`src/components/3d/`)
* **HeroScene**: Particle field with interactive mouse parallax and floating 3D resume meshes.
* **ResumeOrbit3D**: Real-time 3D inspection allowing candidates to rotate, tilt, and examine their document with dynamic shadows and rim lighting.
* **Production Hardening**:
  - Full WebGL resource disposal on component unmount (`geometry.dispose()`, `material.dispose()`, `texture.dispose()`, `renderer.forceContextLoss()`).
  - Strict compliance with `prefers-reduced-motion` media queries.
  - Graceful CSS/SVG 3D fallback for low-power or WebGL-disabled devices.

---

## 4. Database Schema (Prisma)

The PostgreSQL schema consists of:
- **`User`**: Account identity, OAuth profiles, daily AI usage counter, and security timestamps.
- **`Account`, `Session`, `VerificationToken`**: Auth.js / NextAuth v5 standard authentication models.
- **`Resume`**: JSON resume content, theme configuration, ATS health score, public sharing token, password hash, and expiry.
- **`ResumeVersion`**: Snapshot history for A/B testing and rollbacks.
- **`Application`**: Kanban job tracker items with interview dates, salary offers, notes, and reminder flags.
- **`ResumeComment`**: Public peer & mentor feedback entries attached to specific sections.

---

## 5. Deployment Guide

### Vercel / Railway / AWS ECS
1. Set environment variables from `.env.example`.
2. Connect a PostgreSQL instance (e.g. Neon, Supabase, or AWS RDS).
3. Run migrations: `npx prisma db push`.
4. Deploy the Next.js app: `npm run build && npm start`.
