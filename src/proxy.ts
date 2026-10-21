import { NextResponse, type NextRequest } from "next/server";
import { adminEnabled, BASIC_AUTH_CHALLENGE, checkBasicAuth } from "@/lib/admin-auth";

// Next.js 16 "proxy" (formerly middleware): gate the admin area behind HTTP Basic auth.
export function proxy(request: NextRequest) {
  if (!adminEnabled()) return new NextResponse("Not found", { status: 404 });
  if (checkBasicAuth(request.headers.get("authorization"))) return NextResponse.next();
  return new NextResponse("Authentication required", { status: 401, headers: BASIC_AUTH_CHALLENGE });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
