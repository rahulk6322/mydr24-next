import type { IconName } from "@/components/icons";
import type { L10n } from "@/i18n/config";
import type { Speciality } from "./doctors";

export const SERVICE_SLUGS = ["quick-consultation", "doctor-appointment", "elderly-care", "remote-monitoring"] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];
export type Tone = "primary" | "blue" | "gold";
export type ServiceVisual = "consult" | "appointments" | "elderly" | "rpm";

export type Service = {
  slug: ServiceSlug;
  icon: IconName;
  tone: Tone;
  featured?: boolean;
  comingSoon?: boolean;
  badge?: L10n;
  title: L10n;
  /** One-liner used in the mega-menu. */
  short: L10n;
  /** Card summary. */
  summary: L10n;
  points: L10n[];
  cta: L10n;
  description: L10n;
  features: L10n[];
  visual: ServiceVisual;
  specialities: Speciality[];
};

export const SERVICES: Service[] = [
  {
    slug: "quick-consultation",
    icon: "stethoscope",
    tone: "primary",
    featured: true,
    badge: { en: "Within 2 min*", hi: "2 मिनट में*" },
    title: { en: "Quick Doctor Consultation", hi: "क्विक डॉक्टर परामर्श" },
    short: { en: "Video or voice call with a doctor, typically within 2 minutes.", hi: "डॉक्टर से वीडियो या वॉइस कॉल, आमतौर पर 2 मिनट में।" },
    summary: { en: "Instant video or voice consult with a general physician, day or night.", hi: "दिन हो या रात, जनरल फ़िज़िशियन से तुरंत वीडियो या वॉइस परामर्श।" },
    points: [
      { en: "e-Prescription in your language", hi: "आपकी भाषा में ई-प्रिस्क्रिप्शन" },
      { en: "Audio-only mode for weak networks", hi: "कमज़ोर नेटवर्क के लिए सिर्फ़-ऑडियो मोड" },
    ],
    cta: { en: "Consult now", hi: "अभी परामर्श लें" },
    description: {
      en: "Video or voice consult with a general physician, available 24×7. Ideal for fever, infections, skin concerns, follow-ups and general advice.",
      hi: "जनरल फ़िज़िशियन से वीडियो या वॉइस परामर्श, 24×7 उपलब्ध। बुखार, संक्रमण, त्वचा की समस्या, फ़ॉलो-अप और सामान्य सलाह के लिए उपयुक्त।",
    },
    features: [
      { en: "Audio-only fallback on weak networks", hi: "कमज़ोर नेटवर्क पर सिर्फ़-ऑडियो विकल्प" },
      { en: "e-Prescription sent by SMS / WhatsApp", hi: "SMS / WhatsApp पर ई-प्रिस्क्रिप्शन" },
      { en: "AI-assisted symptom intake, always reviewed by a doctor", hi: "AI-सहायता से लक्षणों की जानकारी, हमेशा डॉक्टर द्वारा जाँची गई" },
    ],
    visual: "consult",
    specialities: ["general-physician", "paediatrics", "dermatology"],
  },
  {
    slug: "doctor-appointment",
    icon: "calendar",
    tone: "blue",
    title: { en: "Doctor Appointment", hi: "डॉक्टर अपॉइंटमेंट" },
    short: { en: "Book a GP or specialist at a time that suits you.", hi: "अपनी सुविधा के समय GP या विशेषज्ञ बुक करें।" },
    summary: { en: "Schedule GPs and specialists online or at a partner clinic near you.", hi: "GP और विशेषज्ञों से ऑनलाइन या पास के पार्टनर क्लिनिक में समय तय करें।" },
    points: [
      { en: "20+ specialities", hi: "20+ विशेषज्ञताएँ" },
      { en: "SMS & WhatsApp reminders", hi: "SMS और WhatsApp रिमाइंडर" },
    ],
    cta: { en: "Book appointment", hi: "अपॉइंटमेंट बुक करें" },
    description: {
      en: "Book online consults or in-clinic visits at partner hospitals with cardiologists, gynaecologists, paediatricians, diabetologists and more.",
      hi: "कार्डियोलॉजिस्ट, स्त्री रोग विशेषज्ञ, बाल रोग विशेषज्ञ, डायबिटोलॉजिस्ट और अन्य से ऑनलाइन परामर्श या पार्टनर अस्पतालों में विज़िट बुक करें।",
    },
    features: [
      { en: "20+ specialities, transparent fees", hi: "20+ विशेषज्ञताएँ, पारदर्शी फ़ीस" },
      { en: "Reminders by SMS, WhatsApp and IVR", hi: "SMS, WhatsApp और IVR से रिमाइंडर" },
      { en: "Records linked to your ABHA ID, with your consent", hi: "आपकी सहमति से ABHA ID से जुड़े रिकॉर्ड" },
    ],
    visual: "appointments",
    specialities: ["cardiology", "gynaecology", "paediatrics", "diabetology", "psychiatry", "dermatology"],
  },
  {
    slug: "elderly-care",
    icon: "home-care",
    tone: "gold",
    title: { en: "Elderly Care / Home Healthcare", hi: "बुज़ुर्ग देखभाल / होम हेल्थकेयर" },
    short: { en: "Nursing, physio and check-ins at home.", hi: "घर पर नर्सिंग, फ़िज़ियो और नियमित जाँच।" },
    summary: { en: "Nurse visits, physiotherapy, sample collection and regular check-ins at home.", hi: "घर पर नर्स विज़िट, फ़िज़ियोथेरेपी, सैंपल कलेक्शन और नियमित जाँच।" },
    points: [
      { en: "Updates for family abroad", hi: "विदेश में रह रहे परिवार को अपडेट" },
      { en: "Trained, background-checked staff", hi: "प्रशिक्षित और जाँचे-परखे कर्मचारी" },
    ],
    cta: { en: "Plan home care", hi: "होम केयर प्लान करें" },
    description: {
      en: "Nursing, physiotherapy, post-hospital recovery, sample collection and regular wellness check-ins, coordinated by a dedicated care manager.",
      hi: "नर्सिंग, फ़िज़ियोथेरेपी, अस्पताल के बाद रिकवरी, सैंपल कलेक्शन और नियमित स्वास्थ्य जाँच — एक समर्पित केयर मैनेजर के तालमेल से।",
    },
    features: [
      { en: "Trained, background-checked caregivers", hi: "प्रशिक्षित, जाँचे-परखे देखभालकर्ता" },
      { en: "Family updates after every visit", hi: "हर विज़िट के बाद परिवार को अपडेट" },
      { en: "Voice-call medicine reminders", hi: "वॉइस कॉल से दवा के रिमाइंडर" },
      { en: "Vitals check at every visit: BP, sugar, SpO₂", hi: "हर विज़िट पर वाइटल्स जाँच: BP, शुगर, SpO₂" },
    ],
    visual: "elderly",
    specialities: ["geriatrics", "general-physician"],
  },
  {
    slug: "remote-monitoring",
    icon: "monitor",
    tone: "blue",
    comingSoon: true,
    title: { en: "Remote Patient Monitoring", hi: "रिमोट पेशेंट मॉनिटरिंग" },
    short: { en: "Connected vitals tracking for chronic care.", hi: "लंबी बीमारियों के लिए कनेक्टेड वाइटल्स ट्रैकिंग।" },
    summary: { en: "Connected BP, glucose and SpO₂ tracking with alerts to your care team.", hi: "कनेक्टेड BP, ग्लूकोज़ और SpO₂ ट्रैकिंग, आपकी केयर टीम को अलर्ट के साथ।" },
    points: [{ en: "AI-assisted early-warning flags", hi: "AI-सहायता से शुरुआती चेतावनी" }],
    cta: { en: "Join the waitlist", hi: "प्रतीक्षा सूची में जुड़ें" },
    description: {
      en: "Connected devices for BP, glucose and SpO₂ send readings to your care team, with AI-assisted flags for early follow-up in chronic conditions.",
      hi: "BP, ग्लूकोज़ और SpO₂ के कनेक्टेड डिवाइस आपकी रीडिंग केयर टीम तक भेजते हैं, और लंबी बीमारियों में जल्दी फ़ॉलो-अप के लिए AI-सहायता वाले संकेत देते हैं।",
    },
    features: [
      { en: "Connected BP, glucose and SpO₂ tracking", hi: "कनेक्टेड BP, ग्लूकोज़ और SpO₂ ट्रैकिंग" },
      { en: "Alerts to your care team", hi: "आपकी केयर टीम को अलर्ट" },
      { en: "AI-assisted early-warning flags, reviewed by clinicians", hi: "AI-सहायता वाले चेतावनी संकेत, चिकित्सकों द्वारा जाँचे गए" },
    ],
    visual: "rpm",
    specialities: ["diabetology", "cardiology"],
  },
];

export function isServiceSlug(value: unknown): value is ServiceSlug {
  return typeof value === "string" && (SERVICE_SLUGS as readonly string[]).includes(value);
}

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function toneClass(tone: Tone): string {
  return tone === "primary" ? "icon-tile" : `icon-tile icon-tile--${tone}`;
}
