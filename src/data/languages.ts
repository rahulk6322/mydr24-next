import type { L10n } from "@/i18n/config";

export const LANGUAGE_LABELS = {
  Hindi: { en: "Hindi", hi: "हिन्दी" },
  English: { en: "English", hi: "अंग्रेज़ी" },
  Bengali: { en: "Bengali", hi: "बांग्ला" },
  Marathi: { en: "Marathi", hi: "मराठी" },
  Telugu: { en: "Telugu", hi: "तेलुगु" },
  Tamil: { en: "Tamil", hi: "तमिल" },
  Gujarati: { en: "Gujarati", hi: "गुजराती" },
  Kannada: { en: "Kannada", hi: "कन्नड़" },
  Odia: { en: "Odia", hi: "ओड़िया" },
  Malayalam: { en: "Malayalam", hi: "मलयालम" },
  Punjabi: { en: "Punjabi", hi: "पंजाबी" },
  Assamese: { en: "Assamese", hi: "असमिया" },
  Urdu: { en: "Urdu", hi: "उर्दू" },
  Bhojpuri: { en: "Bhojpuri", hi: "भोजपुरी" },
} satisfies Record<string, L10n>;

export type LanguageName = keyof typeof LANGUAGE_LABELS;

/** Languages offered in the lead form. */
export const LEAD_LANGUAGES: LanguageName[] = [
  "Hindi", "English", "Bengali", "Marathi", "Telugu", "Tamil",
  "Gujarati", "Kannada", "Odia", "Malayalam", "Punjabi", "Assamese",
];

export function isLanguageName(value: unknown): value is LanguageName {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(LANGUAGE_LABELS, value);
}
