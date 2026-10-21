// Central site configuration. Public values come from NEXT_PUBLIC_* env vars (see .env.example).
// TODO(Accufly): set real values before launch.
export const site = {
  name: "MyDR24",
  company: "Accufly Healthcare",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  helplineTel: process.env.NEXT_PUBLIC_HELPLINE_TEL || "+910000000024",
  helplineDisplay: process.env.NEXT_PUBLIC_HELPLINE_DISPLAY || "+91 00000 00024",
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL || "#",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "care@mydr24.in",
  grievanceEmail: process.env.NEXT_PUBLIC_GRIEVANCE_EMAIL || "grievance@mydr24.in",
  playStoreUrl: process.env.NEXT_PUBLIC_PLAY_STORE_URL || "#",
  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL || "#",
  emergencyTel: "112",
  ambulanceTel: "108",
} as const;
