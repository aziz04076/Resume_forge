import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { ApplicationStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ applications: [] });
    }

    const applications = await prisma.jobApplication.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        resume: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      company,
      position,
      location = "",
      salaryRange = "",
      status = ApplicationStatus.SAVED,
      jobUrl = "",
      jobDescription = "",
      notes = "",
      resumeId = null,
      followUpDate = null,
    } = body;

    if (!company || !position) {
      return NextResponse.json({ error: "Company and position are required" }, { status: 400 });
    }

    const application = await prisma.jobApplication.create({
      data: {
        userId: session.user.id,
        company,
        position,
        location,
        salaryRange,
        status: status in ApplicationStatus ? (status as ApplicationStatus) : ApplicationStatus.SAVED,
        jobUrl,
        jobDescription,
        notes,
        resumeId: resumeId || undefined,
        followUpDate: followUpDate ? new Date(followUpDate) : undefined,
        appliedDate: status === ApplicationStatus.APPLIED ? new Date() : undefined,
      },
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, notes, followUpDate, salaryRange, location } = body;

    if (!id) {
      return NextResponse.json({ error: "Application id is required" }, { status: 400 });
    }

    const updated = await prisma.jobApplication.update({
      where: { id, userId: session.user.id },
      data: {
        ...(status && status in ApplicationStatus ? { status: status as ApplicationStatus } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(salaryRange !== undefined ? { salaryRange } : {}),
        ...(location !== undefined ? { location } : {}),
        ...(followUpDate !== undefined
          ? { followUpDate: followUpDate ? new Date(followUpDate) : null }
          : {}),
      },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error("PUT /api/applications error:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    await prisma.jobApplication.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true, message: "Application deleted" });
  } catch (error) {
    console.error("DELETE /api/applications error:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
