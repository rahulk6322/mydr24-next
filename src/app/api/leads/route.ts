import { NextResponse, type NextRequest } from "next/server";
import { saveLead } from "@/lib/leads-store";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { validateLead, type RawLead } from "@/lib/validation";

/**
 * POST /api/leads — JSON API for the mobile app / partners.
 * Body: { name, mobile, city, language, service, consent: true, source? }
 * 201 { ok, ref } · 400 invalid JSON · 422 { error, fields } · 429 rate limited
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const raw = body as RawLead & { company?: unknown; source?: unknown };

  // Honeypot
  if (typeof raw.company === "string" && raw.company.trim()) return NextResponse.json({ ok: true, ref: "MD24-000000" }, { status: 201 });

  const result = validateLead(raw);
  if (!result.ok) return NextResponse.json({ error: "validation_failed", fields: result.errors }, { status: 422 });

  if (!rateLimit(`lead:${clientIp(request.headers)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": "600" } });
  }

  const lead = await saveLead(result.data, {
    source: typeof raw.source === "string" ? raw.source : "api",
    userAgent: request.headers.get("user-agent") ?? undefined,
  });
  return NextResponse.json({ ok: true, ref: lead.ref }, { status: 201 });
}
