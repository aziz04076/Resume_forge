import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import crypto from "crypto";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const resume = await prisma.resume.findUnique({
      where: { publicToken: token },
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!resume || !resume.isPublic) {
      return NextResponse.json({ error: "Resume not found or sharing disabled" }, { status: 404 });
    }

    // Check expiration
    if (resume.shareExpiresAt && new Date(resume.shareExpiresAt) < new Date()) {
      return NextResponse.json({ error: "This share link has expired" }, { status: 410 });
    }

    // Check password protection
    if (resume.sharePasswordHash) {
      return NextResponse.json({
        requiresPassword: true,
        title: resume.title,
        targetRole: resume.targetRole,
      });
    }

    // Increment view count atomically
    await prisma.resume.update({
      where: { id: resume.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      resume: {
        id: resume.id,
        title: resume.title,
        targetRole: resume.targetRole,
        templateId: resume.templateId,
        themeConfig: resume.themeConfig,
        content: resume.content,
        healthScore: resume.healthScore,
        viewCount: resume.viewCount + 1,
        comments: resume.comments,
      },
    });
  } catch (error) {
    console.error("GET /api/public/resume/[token] error:", error);
    return NextResponse.json({ error: "Failed to load public resume" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await req.json();
    const { password } = body;

    const resume = await prisma.resume.findUnique({
      where: { publicToken: token },
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!resume || !resume.isPublic) {
      return NextResponse.json({ error: "Resume not found or sharing disabled" }, { status: 404 });
    }

    if (resume.shareExpiresAt && new Date(resume.shareExpiresAt) < new Date()) {
      return NextResponse.json({ error: "This share link has expired" }, { status: 410 });
    }

    if (resume.sharePasswordHash) {
      const hash = crypto.createHash("sha256").update(password || "").digest("hex");
      if (hash !== resume.sharePasswordHash) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
      }
    }

    // Increment view count
    await prisma.resume.update({
      where: { id: resume.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      resume: {
        id: resume.id,
        title: resume.title,
        targetRole: resume.targetRole,
        templateId: resume.templateId,
        themeConfig: resume.themeConfig,
        content: resume.content,
        healthScore: resume.healthScore,
        viewCount: resume.viewCount + 1,
        comments: resume.comments,
      },
    });
  } catch (error) {
    console.error("POST /api/public/resume/[token] error:", error);
    return NextResponse.json({ error: "Password verification failed" }, { status: 500 });
  }
}
