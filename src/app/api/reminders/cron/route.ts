import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { Resend } from "resend";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const expectedSecret = env.CRON_SECRET || "resumeforge_cron_secret_token";
    const bearerToken = authHeader?.replace(/^Bearer\s+/i, "");

    if (bearerToken !== expectedSecret && token !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }

    const now = new Date();

    // Find due reminders
    const dueReminders = await prisma.applicationReminder.findMany({
      where: {
        remindAt: { lte: now },
        sent: false,
      },
      include: {
        application: {
          include: {
            user: {
              select: { email: true, name: true },
            },
          },
        },
      },
    });

    let sentCount = 0;
    const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

    for (const reminder of dueReminders) {
      const recipientEmail = reminder.application.user.email;
      const company = reminder.application.company;
      const position = reminder.application.position;

      if (resend && recipientEmail) {
        try {
          await resend.emails.send({
            from: env.RESEND_FROM_EMAIL || "reminders@resend.dev",
            to: recipientEmail,
            subject: `Follow-Up Reminder: ${position} at ${company}`,
            html: `
              <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; color: #1e293b;">
                <h2 style="color: #4f46e5;">ResumeForge Career Copilot</h2>
                <p>Hi ${reminder.application.user.name || "there"},</p>
                <p>This is your scheduled follow-up reminder for your job application:</p>
                <div style="background: #f8fafc; border-left: 4px solid #4f46e5; padding: 12px 16px; margin: 16px 0;">
                  <strong>Position:</strong> ${position}<br/>
                  <strong>Company:</strong> ${company}<br/>
                  <strong>Scheduled Date:</strong> ${reminder.remindAt.toLocaleDateString()}
                </div>
                <p>Check in with the recruiter or hiring manager to keep your application at top of mind!</p>
                <p style="font-size: 12px; color: #64748b;">— The ResumeForge Team</p>
              </div>
            `,
          });
        } catch (mailErr) {
          console.error(`Failed to send email to ${recipientEmail}:`, mailErr);
        }
      }

      // Mark reminder as sent
      await prisma.applicationReminder.update({
        where: { id: reminder.id },
        data: {
          sent: true,
          sentAt: new Date(),
        },
      });

      sentCount++;
    }

    return NextResponse.json({
      success: true,
      processed: dueReminders.length,
      sent: sentCount,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Cron reminders error:", error);
    return NextResponse.json({ error: "Failed to process scheduled reminders" }, { status: 500 });
  }
}
