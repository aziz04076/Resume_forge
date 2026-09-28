import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const resume = await prisma.resume.findUnique({
      where: { publicToken: token },
      select: { id: true, isPublic: true },
    });

    if (!resume || !resume.isPublic) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const comments = await prisma.resumeComment.findMany({
      where: { resumeId: resume.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("GET comments error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const resume = await prisma.resume.findUnique({
      where: { publicToken: token },
      select: { id: true, isPublic: true },
    });

    if (!resume || !resume.isPublic) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const body = await req.json();
    const { authorName = "Mentor / Reviewer", authorEmail = "", sectionKey = "general", text } = body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
    }

    const comment = await prisma.resumeComment.create({
      data: {
        resumeId: resume.id,
        authorName,
        authorEmail,
        sectionKey,
        text: text.trim(),
      },
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error("POST comment error:", error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
