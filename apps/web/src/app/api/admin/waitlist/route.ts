import { NextResponse } from "next/server";
import { webLogger } from "@/lib/logger";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/waitlist/admin-auth";
import { entriesToCsv, readWaitlistEntries } from "@/lib/waitlist/storage";

export async function GET(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return unauthorizedResponse();
  }

  const url = new URL(request.url);
  if (url.searchParams.get("format") === "csv") {
    const entries = readWaitlistEntries();
    webLogger.info("Waitlist admin export", { count: entries.length });

    return new NextResponse(entriesToCsv(entries), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="waitlist.csv"',
      },
    });
  }

  const entries = readWaitlistEntries();
  webLogger.info("Waitlist admin list", { count: entries.length });

  return NextResponse.json({ entries, count: entries.length });
}
