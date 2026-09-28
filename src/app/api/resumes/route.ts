import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { DEFAULT_RESUME_CONTENT, DEFAULT_THEME_CONFIG } from "@/schemas/resume.schema";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ resumes: [] }, { status: 200 });
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        versions: {
          select: { id: true, versionNumber: true, createdAt: true, changeSummary: true },
          orderBy: { versionNumber: "desc" },
          take: 5,
        },
      },
    });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("GET /api/resumes error:", error);
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to create a database-backed resume." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      title = "New Software Resume",
      targetRole = "Software Engineer",
      content = DEFAULT_RESUME_CONTENT,
      themeConfig = DEFAULT_THEME_CONFIG,
      healthScore = 85,
    } = body;

    const newResume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        title,
        targetRole,
        content: content as object,
        themeConfig: themeConfig as object,
        healthScore,
        versions: {
          create: {
            versionNumber: 1,
            snapshotData: content as object,
            changeSummary: "Initial resume creation",
          },
        },
      },
    });

    return NextResponse.json({ success: true, resume: newResume }, { status: 201 });
  } catch (error) {
    console.error("POST /api/resumes error:", error);
    return NextResponse.json({ error: "Failed to create resume" }, { status: 500 });
  }
}
