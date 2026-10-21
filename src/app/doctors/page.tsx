import type { Metadata } from "next";
import Link from "next/link";
import { DoctorCard } from "@/components/cards";
import { DoctorFilters } from "@/components/doctor-filters";
import { Icon } from "@/components/icons";
import { AutoRefresh } from "@/components/interactive";
import { PageHero } from "@/components/page-hero";
import { DOCTORS, isSpeciality } from "@/data/doctors";
import { isLanguageName } from "@/data/languages";
import { getI18n } from "@/i18n/server";
import { doctorsWithStatus } from "@/lib/availability";
import { fmt } from "@/lib/format";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.nav.doctors, description: dict.doctorsPage.lead };
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function DoctorsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const speciality = isSpeciality(first(sp.speciality)) ? first(sp.speciality) : "";
  const language = isLanguageName(first(sp.language)) ? first(sp.language) : "";
  const online = first(sp.online) === "1";
  const { dict, locale } = await getI18n();
  const t = dict.doctorsPage;

  const list = doctorsWithStatus(DOCTORS).filter(
    ({ doctor, status }) =>
      (!speciality || doctor.speciality === speciality) &&
      (!language || (doctor.languages as string[]).includes(language)) &&
      (!online || status.state === "online"),
  );

  return (
    <>
      <PageHero title={t.title} lead={t.lead} crumbs={[{ label: dict.nav.doctors }]} homeLabel={dict.nav.home} breadcrumbLabel={dict.common.breadcrumb} />
      <section className="section" style={{ paddingTop: "var(--space-6)" }} aria-labelledby="results-title">
        <div className="container">
          <DoctorFilters speciality={speciality} language={language} online={online} />
          <div className="results-bar">
            <h2 className="h4" id="results-title" aria-live="polite">{fmt(t.results, { n: list.length })}</h2>
            <span className="caption cluster" style={{ gap: 6 }}><Icon name="activity" size="sm" />{t.updated}</span>
          </div>
          {list.length ? (
            <div className="doctor-grid">
              {list.map(({ doctor, status }) => (
                <DoctorCard key={doctor.id} doctor={doctor} status={status} locale={locale} dict={dict} />
              ))}
            </div>
          ) : (
            <div className="card empty-state">
              <span className="icon-tile icon-tile--lg"><Icon name="doctor" size="lg" /></span>
              <p className="muted">{t.none}</p>
              <Link className="btn btn--secondary" href="/doctors">{t.reset}</Link>
            </div>
          )}
          <p className="caption" style={{ marginTop: "var(--space-3)" }}>{t.sample}</p>
        </div>
      </section>
      <AutoRefresh intervalMs={60_000} />
    </>
  );
}
