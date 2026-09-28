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

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const versions = await prisma.resumeVersion.findMany({
      where: { resumeId: id, resume: { userId: session.user.id } },
      orderBy: { versionNumber: "desc" },
    });

    return NextResponse.json({ versions });
  } catch (error) {
    console.error("GET /api/resumes/[id]/versions error:", error);
    return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { versionId } = body;

    const targetVersion = await prisma.resumeVersion.findFirst({
      where: { id: versionId, resumeId: id, resume: { userId: session.user.id } },
    });

    if (!targetVersion) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    // Restore this snapshot into the resume content
    const updated = await prisma.resume.update({
      where: { id },
      data: {
        content: targetVersion.snapshotData as object,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Restored to version ${targetVersion.versionNumber}`,
      resume: updated,
    });
  } catch (error) {
    console.error("POST /api/resumes/[id]/versions restore error:", error);
    return NextResponse.json({ error: "Failed to restore version" }, { status: 500 });
  }
}
