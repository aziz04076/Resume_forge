import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import crypto from "crypto";

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

    const resume = await prisma.resume.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const body = await req.json();
    const { isPublic, password, expiresDays } = body;

    let publicToken = resume.publicToken;
    if (isPublic && !publicToken) {
      publicToken = crypto.randomBytes(12).toString("hex");
    }

    let sharePasswordHash = resume.sharePasswordHash;
    if (password) {
      sharePasswordHash = crypto.createHash("sha256").update(password).digest("hex");
    } else if (password === "") {
      sharePasswordHash = null;
    }

    let shareExpiresAt = null;
    if (expiresDays && typeof expiresDays === "number") {
      shareExpiresAt = new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000);
    }

    const updated = await prisma.resume.update({
      where: { id },
      data: {
        isPublic: Boolean(isPublic),
        publicToken: isPublic ? publicToken : resume.publicToken,
        sharePasswordHash,
        shareExpiresAt,
      },
    });

    const shareUrl = publicToken
      ? `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/share/${publicToken}`
      : null;

    return NextResponse.json({
      success: true,
      isPublic: updated.isPublic,
      publicToken: updated.publicToken,
      shareUrl,
      hasPassword: Boolean(updated.sharePasswordHash),
      expiresAt: updated.shareExpiresAt,
      viewCount: updated.viewCount,
    });
  } catch (error) {
    console.error("POST /api/resumes/[id]/share error:", error);
    return NextResponse.json({ error: "Failed to configure sharing" }, { status: 500 });
  }
}
