import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Must be signed in to migrate data." }, { status: 401 });
    }

    const body = await req.json();
    const { localResume, localApplications = [] } = body;

    let savedResume = null;

    if (localResume && localResume.content) {
      savedResume = await prisma.resume.create({
        data: {
          userId: session.user.id,
          title: localResume.title || "Migrated Resume",
          targetRole: localResume.targetRole || "Software Engineer",
          content: localResume.content as object,
          themeConfig: (localResume.themeConfig || {}) as object,
          healthScore: localResume.healthScore || 80,
          versions: {
            create: {
              versionNumber: 1,
              snapshotData: localResume.content as object,
              changeSummary: "Migrated from guest session",
            },
          },
        },
      });
    }

    if (Array.isArray(localApplications) && localApplications.length > 0) {
      for (const app of localApplications) {
        if (app.company && app.position) {
          await prisma.jobApplication.create({
            data: {
              userId: session.user.id,
              company: app.company,
              position: app.position,
              status: app.status || "SAVED",
              location: app.location || "",
              notes: app.notes || "",
              resumeId: savedResume?.id,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Guest data successfully migrated to your account!",
      resumeId: savedResume?.id,
    });
  } catch (error) {
    console.error("Guest migration error:", error);
    return NextResponse.json({ error: "Failed to migrate guest data" }, { status: 500 });
  }
}
