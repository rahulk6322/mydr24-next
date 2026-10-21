import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DoctorCard, ServiceCard } from "@/components/cards";
import { Icon } from "@/components/icons";
import { BookButton, Carousel } from "@/components/interactive";
import { PageHero } from "@/components/page-hero";
import { PhoneMockup } from "@/components/phone-mockup";
import { DOCTORS } from "@/data/doctors";
import { getService, SERVICES, toneClass, type Service } from "@/data/services";
import { tr, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getI18n } from "@/i18n/server";
import { doctorsWithStatus } from "@/lib/availability";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const { locale } = await getI18n();
  return { title: tr(service.title, locale), description: tr(service.summary, locale) };
}

const ELDERLY_TILES = [
  { icon: "heart-pulse", feature: 3 },
  { icon: "elderly", feature: 0 },
  { icon: "users", feature: 1 },
] as const;

function ServiceVisual({ service, dict, locale }: { service: Service; dict: Dictionary; locale: Locale }) {
  if (service.visual === "consult" || service.visual === "appointments") return <PhoneMockup screen={service.visual} size="sm" />;
  if (service.visual === "rpm") {
    return (
      <div className="card card--glass" style={{ width: "min(380px, 100%)" }}>
        <div className="cluster" style={{ justifyContent: "space-between" }}>
          <span className="small muted">BP · 7 days</span>
          <span className="badge badge--illustrative">{dict.common.illustrative}</span>
        </div>
        <svg viewBox="0 0 300 100" role="img" aria-label="Illustrative blood pressure trend line" style={{ width: "100%" }}>
          <path d="M0 70 C40 60 60 40 90 50 S150 80 180 55 240 30 300 40" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 85 C40 80 70 70 100 75 S160 88 200 72 260 60 300 66" fill="none" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round" opacity=".8" />
        </svg>
      </div>
    );
  }
  return (
    <div className="stack" style={{ gap: 12, width: "min(360px, 100%)" }}>
      {ELDERLY_TILES.map(({ icon, feature }) => {
        const f = service.features[feature];
        return f ? (
          <div key={icon} className="card card--glass trust-badge trust-badge--compact">
            <span className="icon-tile icon-tile--gold"><Icon name={icon} /></span>
            <span className="small">{tr(f, locale)}</span>
          </div>
        ) : null;
      })}
    </div>
  );
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const { dict, locale } = await getI18n();
  const t = dict.servicesPage;
  const related = doctorsWithStatus(DOCTORS.filter((d) => service.specialities.includes(d.speciality)));
  const others = SERVICES.filter((s) => s.slug !== service.slug);
  const cta = service.comingSoon ? dict.common.joinWaitlist : tr(service.cta, locale);

  return (
    <>
      <PageHero
        title={tr(service.title, locale)}
        lead={tr(service.description, locale)}
        crumbs={[{ label: dict.nav.services, href: "/services" }, { label: tr(service.title, locale) }]}
        homeLabel={dict.nav.home}
        breadcrumbLabel={dict.common.breadcrumb}
      >
        <div className="cluster">
          {service.comingSoon && <span className="badge badge--blue">{dict.common.comingSoon}</span>}
          {service.badge && <span className="badge badge--primary badge--live">{tr(service.badge, locale)}</span>}
        </div>
      </PageHero>

      <section className="section" style={{ paddingTop: "var(--space-6)" }} aria-labelledby="features-title">
        <div className="container">
          <div className="grid service-detail" style={{ borderTop: 0, paddingTop: 0 }}>
            <div className="service-detail__copy lg-6" data-reveal>
              <span className={`${toneClass(service.tone)} icon-tile--lg`}><Icon name={service.icon} size="lg" /></span>
              <h2 className="h3" id="features-title">{t.features}</h2>
              <ul className="feature-list" role="list">
                {service.features.map((f) => (
                  <li key={f.en}><Icon name="check-circle" />{tr(f, locale)}</li>
                ))}
              </ul>
              <div className="cluster">
                <BookButton service={service.slug} className={`btn ${service.comingSoon ? "btn--secondary" : "btn--primary"} btn--lg`}>
                  <Icon name={service.comingSoon ? "bell" : service.icon} />
                  {cta}
                </BookButton>
                <Link className="btn btn--ghost" href={`/contact?service=${service.slug}#lead`}>{dict.common.requestCallback}</Link>
              </div>
              {service.badge && <p className="caption">{dict.servicesSection.note}</p>}
            </div>
            <div className="service-detail__visual lg-6" data-reveal>
              <ServiceVisual service={service} dict={dict} locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--elevated" aria-labelledby="related-title">
          <div className="container">
            <Carousel label={dict.doctorsPage.carousel} className="doctors" heading={<h2 className="h2" id="related-title">{t.related}</h2>}>
              {related.map(({ doctor, status }) => (
                <DoctorCard key={doctor.id} doctor={doctor} status={status} locale={locale} dict={dict} />
              ))}
            </Carousel>
            <p className="caption" style={{ marginTop: "var(--space-2)" }}>{dict.doctorsPage.sample}</p>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="other-title">
        <div className="container">
          <div className="section__head"><h2 className="h2" id="other-title">{t.other}</h2></div>
          <div className="services-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))" }}>
            {others.map((s) => (
              <ServiceCard key={s.slug} service={s} locale={locale} dict={dict} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
