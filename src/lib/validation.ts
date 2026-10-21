// Lead validation shared by the client form, the Server Action and the REST API.
import { isLanguageName, type LanguageName } from "@/data/languages";
import { isServiceSlug, type ServiceSlug } from "@/data/services";

export const LEAD_FIELDS = ["name", "mobile", "city", "language", "service", "consent"] as const;
export type LeadField = (typeof LEAD_FIELDS)[number];

export type LeadInput = {
  name: string;
  mobile: string; // normalised 10-digit Indian mobile
  city: string;
  language: LanguageName;
  service: ServiceSlug;
  consent: true;
};

export type RawLead = Partial<Record<LeadField, unknown>>;

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** "+91 98765-43210" → "9876543210" */
export function normaliseMobile(value: string): string {
  const digits = value.replace(/[^\d]/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function formatMobile(mobile: string): string {
  return `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`;
}

export function validateField(field: LeadField, value: unknown): boolean {
  switch (field) {
    case "name": {
      const s = text(value);
      return s.length >= 2 && s.length <= 80;
    }
    case "mobile":
      return /^[6-9]\d{9}$/.test(normaliseMobile(text(value)));
    case "city": {
      const s = text(value);
      return /^\d{6}$/.test(s) || /^[\p{L}\p{M} .'-]{2,60}$/u.test(s);
    }
    case "language":
      return isLanguageName(text(value));
    case "service":
      return isServiceSlug(text(value));
    case "consent":
      return value === true || value === "on" || value === "true";
    default:
      return false;
  }
}

export type ValidationResult = { ok: true; data: LeadInput } | { ok: false; errors: LeadField[] };

export function validateLead(raw: RawLead): ValidationResult {
  const errors = LEAD_FIELDS.filter((f) => !validateField(f, raw[f]));
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      name: text(raw.name).replace(/\s+/g, " "),
      mobile: normaliseMobile(text(raw.mobile)),
      city: text(raw.city).replace(/\s+/g, " "),
      language: text(raw.language) as LanguageName,
      service: text(raw.service) as ServiceSlug,
      consent: true,
    },
  };
}

export function leadFromFormData(fd: FormData): RawLead {
  return {
    name: fd.get("name"),
    mobile: fd.get("mobile"),
    city: fd.get("city"),
    language: fd.get("language"),
    service: fd.get("service"),
    consent: fd.get("consent") === "on",
  };
}
