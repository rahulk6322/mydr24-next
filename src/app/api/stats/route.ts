import { NextResponse } from "next/server";
import { getLiveStats } from "@/lib/availability";

export const dynamic = "force-dynamic";

/** GET /api/stats — live trust-strip figures (simulated; polled every 30s by the home page). */
export function GET() {
  return NextResponse.json(getLiveStats(), { headers: { "cache-control": "no-store" } });
}
