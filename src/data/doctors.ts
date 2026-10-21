import type { L10n } from "@/i18n/config";
import type { LanguageName } from "./languages";

// ILLUSTRATIVE sample profiles for design/development. Replace with the verified doctor registry.

export const SPECIALITIES = {
  "general-physician": { en: "General Physician", hi: "जनरल फ़िज़िशियन" },
  cardiology: { en: "Cardiologist", hi: "हृदय रोग विशेषज्ञ" },
  paediatrics: { en: "Paediatrician", hi: "बाल रोग विशेषज्ञ" },
  geriatrics: { en: "Geriatrician", hi: "वृद्धावस्था रोग विशेषज्ञ" },
  gynaecology: { en: "Gynaecologist", hi: "स्त्री रोग विशेषज्ञ" },
  diabetology: { en: "Diabetologist", hi: "मधुमेह विशेषज्ञ" },
  dermatology: { en: "Dermatologist", hi: "त्वचा रोग विशेषज्ञ" },
  psychiatry: { en: "Psychiatrist", hi: "मनोरोग विशेषज्ञ" },
} satisfies Record<string, L10n>;

export type Speciality = keyof typeof SPECIALITIES;

export type Doctor = {
  id: string;
  name: string;
  initials: string;
  speciality: Speciality;
  qualification: string;
  years: number;
  languages: LanguageName[];
  /** Shift in IST hours [start, end). end < start means an overnight shift; [0, 24] is 24×7. */
  shift: [number, number];
  warm?: boolean;
};

export const DOCTORS: Doctor[] = [
  { id: "d01", name: "Dr. A. Sharma", initials: "AS", speciality: "general-physician", qualification: "MBBS", years: 12, languages: ["Hindi", "English", "Bhojpuri"], shift: [0, 24] },
  { id: "d02", name: "Dr. P. Kulkarni", initials: "PK", speciality: "cardiology", qualification: "MD, DM (Cardiology)", years: 18, languages: ["Marathi", "Hindi", "English"], shift: [9, 18], warm: true },
  { id: "d03", name: "Dr. F. Naqvi", initials: "FN", speciality: "paediatrics", qualification: "MD (Paediatrics)", years: 9, languages: ["Urdu", "Hindi", "English"], shift: [8, 22] },
  { id: "d04", name: "Dr. L. Raghavan", initials: "LR", speciality: "geriatrics", qualification: "MD (Geriatrics)", years: 21, languages: ["Tamil", "Malayalam", "English"], shift: [9, 13], warm: true },
  { id: "d05", name: "Dr. S. Banerjee", initials: "SB", speciality: "gynaecology", qualification: "MS (OBG)", years: 14, languages: ["Bengali", "Hindi", "English"], shift: [10, 20] },
  { id: "d06", name: "Dr. R. Reddy", initials: "RR", speciality: "general-physician", qualification: "MBBS", years: 7, languages: ["Telugu", "Hindi", "English"], shift: [20, 8], warm: true },
  { id: "d07", name: "Dr. M. Patel", initials: "MP", speciality: "diabetology", qualification: "MD (Medicine)", years: 15, languages: ["Gujarati", "Hindi", "English"], shift: [8, 16] },
  { id: "d08", name: "Dr. H. Kaur", initials: "HK", speciality: "dermatology", qualification: "MD (Dermatology)", years: 10, languages: ["Punjabi", "Hindi", "English"], shift: [11, 19], warm: true },
  { id: "d09", name: "Dr. N. Das", initials: "ND", speciality: "psychiatry", qualification: "MD (Psychiatry)", years: 11, languages: ["Odia", "Bengali", "Hindi", "English"], shift: [14, 22] },
  { id: "d10", name: "Dr. K. Gowda", initials: "KG", speciality: "general-physician", qualification: "MBBS", years: 6, languages: ["Kannada", "English", "Hindi"], shift: [6, 14] },
];

export function isSpeciality(value: unknown): value is Speciality {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(SPECIALITIES, value);
}

/** Languages spoken by at least one doctor, in a stable order. */
export const DOCTOR_LANGUAGES: LanguageName[] = Array.from(new Set(DOCTORS.flatMap((d) => d.languages)));
