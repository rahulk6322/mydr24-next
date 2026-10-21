import type { Metadata } from "next";
import Link from "next/link";
import { DoctorCard, ServiceCard } from "@/components/cards";
import { Carousel, SosButton } from "@/components/interactive";
import { PageHero } from "@/components/page-hero";
import { SERVICES } from "@/data/services";
import { getI18n } from "@/i18n/server";
import { doctorsWithStatus } from "@/lib/availability";
import { delay } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.nav.services, description: dict.servicesPage.lead };
}

export default async function ServicesPage() {
  const { dict, locale } = await getI18n();
  const t = dict.servicesPage;
  const doctors = doctorsWithStatus().slice(0, 6);

  return (
    <>
      <PageHero title={t.title} lead={t.lead} crumbs={[{ label: dict.nav.services }]} homeLabel={dict.nav.home} breadcrumbLabel={dict.common.breadcrumb} />

      <section className="section" style={{ paddingTop: "var(--space-6)" }} aria-label={dict.nav.services}>
        <div className="container">
          <div className="services-grid">
            {SERVICES.map((service, i) => (
              <div key={service.slug} data-reveal style={delay(i * 60)}>
                <ServiceCard service={service} locale={locale} dict={dict} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--elevated" aria-labelledby="docs-title">
        <div className="container">
          <Carousel
            label={dict.doctorsPage.carousel}
            className="doctors"
            heading={
              <div className="stack">
                <span className="eyebrow">{dict.doctorsPage.eyebrow}</span>
                <h2 className="h2" id="docs-title">{dict.doctorsPage.title}</h2>
              </div>
            }
          >
            {doctors.map(({ doctor, status }) => (
              <DoctorCard key={doctor.id} doctor={doctor} status={status} locale={locale} dict={dict} />
            ))}
          </Carousel>
          <div className="cluster" style={{ justifyContent: "space-between", marginTop: "var(--space-2)" }}>
            <p className="caption">{dict.doctorsPage.sample}</p>
            <Link className="link small" href="/doctors">{dict.doctorsPage.seeAll}</Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="cmp-title">
        <div className="container">
          <div className="section__head" data-reveal>
            <span className="eyebrow">{t.compareEyebrow}</span>
            <h2 className="h2" id="cmp-title">{t.compareTitle}</h2>
          </div>
          <div className="compare-wrap" data-reveal tabIndex={0} role="region" aria-labelledby="cmp-title">
            <table className="compare">
              <thead>
                <tr>
                  <th scope="col"><span className="visually-hidden">{t.feature}</span></th>
                  {t.headers.map((h) => <th scope="col" key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {t.rows.map(([label, ...cells]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {cells.map((c, i) => <td key={i}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="caption" style={{ marginTop: "var(--space-1-5)" }}>{t.compareNote}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="card cta-band" data-reveal>
            <h2 className="h2">{t.ctaTitle}</h2>
            <p className="lead" style={{ maxWidth: "52ch" }}>{t.ctaText}</p>
            <div className="cluster" style={{ justifyContent: "center" }}>
              <Link className="btn btn--primary btn--lg" href="/contact#lead">{dict.common.requestCallback}</Link>
              <SosButton className="btn btn--sos btn--lg"><span className="sos-dot" aria-hidden="true" />{dict.common.emergency}</SosButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
