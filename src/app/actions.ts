"use server";

import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, type Locale } from "@/i18n/config";
import type { LeadState } from "@/lib/lead-types";
import { saveLead } from "@/lib/leads-store";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { formatMobile, leadFromFormData, validateLead } from "@/lib/validation";

/** Lead form Server Action (used with useActionState; also works without JS). */
export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (String(formData.get("company") ?? "").trim()) return { status: "success", ref: "MD24-000000", mobile: "" };

  const result = validateLead(leadFromFormData(formData));
  if (!result.ok) return { status: "error", errors: result.errors };

  const h = await headers();
  if (!rateLimit(`lead:${clientIp(h)}`, 5, 10 * 60_000)) return { status: "error", errors: [], message: "rate" };

  try {
    const lead = await saveLead(result.data, {
      source: String(formData.get("source") ?? "web"),
      userAgent: h.get("user-agent") ?? undefined,
    });
    return { status: "success", ref: lead.ref, mobile: formatMobile(lead.mobile) };
  } catch (error) {
    console.error("[leads] submitLead failed", error);
    return { status: "error", errors: [], message: "server" };
  }
}

/** Persist the UI language. Setting a cookie in an action re-renders the route on the server. */
export async function setLocale(locale: Locale): Promise<void> {
  (await cookies()).set(LOCALE_COOKIE, locale === "hi" ? "hi" : "en", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
