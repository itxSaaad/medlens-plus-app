import { NextResponse } from "next/server";
import { z } from "zod";
import { webLogger } from "@/lib/logger";
import { appendWaitlistEntry, waitlistEntryExists } from "@/lib/waitlist/storage";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  consent: z.literal(true, { message: "Consent is required to join the waitlist." }),
});

export async function POST(request: Request) {
  try {
    const body = waitlistSchema.parse(await request.json());
    const normalizedEmail = body.email.toLowerCase().trim();

    if (waitlistEntryExists(normalizedEmail)) {
      return NextResponse.json({ message: "You are already on the waitlist." });
    }

    appendWaitlistEntry(normalizedEmail);
    webLogger.info("Waitlist signup", { success: true });

    return NextResponse.json({ message: "Successfully joined the waitlist." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    webLogger.error("Waitlist signup failed");
    return NextResponse.json(
      { error: "Unable to join the waitlist. Please try again." },
      { status: 500 },
    );
  }
}
