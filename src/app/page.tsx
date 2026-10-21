import { AppSpotlight, GoldenHour, Hero, HowItWorks, ServicesSection } from "@/components/home/sections-a";
import { ElderlyCare, FaqSection, LeadSection, TrustSection } from "@/components/home/sections-b";
import { DOCTORS } from "@/data/doctors";
import { getI18n } from "@/i18n/server";
import { doctorsWithStatus, getLiveStats } from "@/lib/availability";
import { site } from "@/lib/site";

export default async function HomePage() {
  const { dict, locale } = await getI18n();
  const now = new Date();
  const stats = getLiveStats(now);
  const doctor = doctorsWithStatus(DOCTORS, now).find((d) => d.status.state === "online")?.doctor ?? DOCTORS[0]!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: site.name,
    url: site.url,
    telephone: site.helplineTel,
    email: site.email,
    parentOrganization: { "@type": "Organization", name: site.company },
    areaServed: { "@type": "Country", name: "India" },
    availableLanguage: ["en", "hi"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero dict={dict} locale={locale} stats={stats} doctor={doctor} />
      <GoldenHour dict={dict} locale={locale} />
      <AppSpotlight dict={dict} locale={locale} />
      <ServicesSection dict={dict} locale={locale} />
      <HowItWorks dict={dict} locale={locale} />
      <ElderlyCare dict={dict} locale={locale} />
      <TrustSection dict={dict} locale={locale} />
      <FaqSection dict={dict} locale={locale} />
      <LeadSection dict={dict} locale={locale} />
    </>
  );
}
