import { NextRequest, NextResponse } from "next/server";
import { generateStructuredAI, wrapUntrustedInput, MissingAPIKeyError } from "@/lib/ai/provider";
import { SalaryCoachResponseSchema } from "@/schemas/ai.schema";
import { checkRateLimit } from "@/lib/ai/rateLimiter";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const rateCheck = await checkRateLimit(req, session?.user?.id);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: rateCheck.error }, { status: rateCheck.statusCode || 429 });
    }

    const body = await req.json();
    const {
      roleTitle = "Senior Software Engineer",
      location = "San Francisco, CA / Remote",
      yearsOfExperience = 5,
      currentOffer = "",
      competingOffers = "",
    } = body;

    const systemPrompt = `You are a Silicon Valley Executive Compensation Negotiator and Career Strategist.
Provide realistic market benchmarks for total compensation (base, equity, bonus), high-leverage negotiation scripts, and psychological counter-offer tactics. Return JSON adhering to SalaryCoachResponseSchema.`;

    const userPrompt = `Role: ${roleTitle}
Location: ${location}
Years of Experience: ${yearsOfExperience}
Current Offer Details:
${wrapUntrustedInput("current_offer", currentOffer || "Base $165k, $40k equity/yr, 10% bonus")}
${competingOffers ? `Competing Offers:\n${wrapUntrustedInput("competing_offers", competingOffers)}` : ""}

Generate the compensation analysis and custom negotiation scripts.`;

    const result = await generateStructuredAI({
      systemPrompt,
      userPrompt,
      schema: SalaryCoachResponseSchema,
      temperature: 0.3,
    });

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": String(rateCheck.limit),
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (error) {
    console.error("Salary Coach error:", error);
    if (error instanceof MissingAPIKeyError) {
      return NextResponse.json({ error: error.message, isMissingKey: true }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to generate salary coaching guidance" }, { status: 500 });
  }
}
