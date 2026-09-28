import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const resume = await prisma.resume.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { versionNumber: "desc" },
        },
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Allow public access if resume is public
    if (!resume.isPublic && resume.userId !== session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("GET /api/resumes/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.resume.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Resume not found or unauthorized" }, { status: 404 });
    }

    const body = await req.json();
    const { title, targetRole, content, themeConfig, healthScore, changeSummary } = body;

    // Increment version number
    const lastVersion = await prisma.resumeVersion.findFirst({
      where: { resumeId: id },
      orderBy: { versionNumber: "desc" },
    });

    const nextVersionNumber = (lastVersion?.versionNumber || 0) + 1;

    const updated = await prisma.resume.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(targetRole !== undefined ? { targetRole } : {}),
        ...(content !== undefined ? { content: content as object } : {}),
        ...(themeConfig !== undefined ? { themeConfig: themeConfig as object } : {}),
        ...(healthScore !== undefined ? { healthScore } : {}),
        versions: content
          ? {
              create: {
                versionNumber: nextVersionNumber,
                snapshotData: content as object,
                changeSummary: changeSummary || `Autosave version ${nextVersionNumber}`,
              },
            }
          : undefined,
      },
    });

    return NextResponse.json({ success: true, resume: updated });
  } catch (error) {
    console.error("PUT /api/resumes/[id] error:", error);
    return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.resume.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Resume not found or unauthorized" }, { status: 404 });
    }

    await prisma.resume.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/resumes/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}
