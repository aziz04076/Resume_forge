import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput, MissingAPIKeyError } from "@/lib/ai/provider";
import { z } from "zod";
import { checkRateLimit } from "@/lib/ai/rateLimiter";
import { auth } from "@/auth";

const GitHubProjectGeneratorSchema = z.object({
  name: z.string(),
  role: z.string(),
  description: z.string(),
  bullets: z.array(z.string()).min(2),
  technologies: z.array(z.string()),
  liveUrl: z.string().optional().default(""),
  githubUrl: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const rateCheck = await checkRateLimit(req, session?.user?.id);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: rateCheck.error }, { status: rateCheck.statusCode || 429 });
    }

    const body = await req.json();
    const { repoName, repoDescription, repoUrl, language, topics = [], targetRole = "Software Engineer" } = body;

    if (!repoName || !repoUrl) {
      return NextResponse.json({ error: "Repository name and URL are required" }, { status: 400 });
    }

    const systemPrompt = `You are a Senior Staff Engineer and Technical Resume Reviewer.
Turn this GitHub open-source project into a high-impact, professional resume project entry.
Format 2-3 bullets using the Google XYZ formula ("Accomplished [X], measured by [Y], by doing [Z]").
Quantify realistic architecture achievements, latency reductions, test coverage, and distributed system impact.`;

    const userPrompt = `Target Role: ${targetRole}
Repository Name: ${repoName}
Description: ${wrapUntrustedInput("repo_description", repoDescription)}
Repository URL: ${repoUrl}
Primary Language: ${language}
Topics/Tags: ${topics.join(", ")}

Generate a structured Project entry conforming to the schema.`;

    const projectEntry = await generateStructuredAI({
      systemPrompt,
      userPrompt,
      schema: GitHubProjectGeneratorSchema,
      temperature: 0.3,
    });

    return NextResponse.json({ success: true, project: projectEntry });
  } catch (error) {
    console.error("GitHub project generator error:", error);
    if (error instanceof MissingAPIKeyError) {
      return NextResponse.json({ error: error.message, isMissingKey: true }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to generate project bullets from GitHub" }, { status: 500 });
  }
}
