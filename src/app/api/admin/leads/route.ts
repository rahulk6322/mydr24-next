import { NextResponse, type NextRequest } from "next/server";
import { BASIC_AUTH_CHALLENGE, checkBasicAuth } from "@/lib/admin-auth";
import { listLeads, type Lead } from "@/lib/leads-store";

export const dynamic = "force-dynamic";

const COLUMNS: (keyof Lead)[] = ["createdAt", "ref", "name", "mobile", "city", "language", "service", "source"];

// Quote every cell and neutralise spreadsheet formula injection (=, +, -, @).
function csvCell(value: unknown): string {
  let s = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/** GET /api/admin/leads[?format=csv] — protected by src/proxy.ts and re-checked here. */
export async function GET(request: NextRequest) {
  if (!checkBasicAuth(request.headers.get("authorization"))) {
    return new NextResponse("Authentication required", { status: 401, headers: BASIC_AUTH_CHALLENGE });
  }
  const leads = await listLeads();
  if (request.nextUrl.searchParams.get("format") === "csv") {
    const csv = [COLUMNS.join(","), ...leads.map((l) => COLUMNS.map((c) => csvCell(l[c])).join(","))].join("\r\n");
    return new NextResponse(`\uFEFF${csv}`, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="mydr24-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
        "cache-control": "no-store",
      },
    });
  }
  return NextResponse.json({ count: leads.length, leads }, { headers: { "cache-control": "no-store" } });
}
