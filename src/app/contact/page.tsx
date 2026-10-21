import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { EmergencyNotice } from "@/components/ui-provider";
import { isServiceSlug } from "@/data/services";
import { getI18n } from "@/i18n/server";
import { site } from "@/lib/site";
import { rich } from "@/components/rich";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.nav.contact, description: dict.contactPage.lead };
}

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const { service } = await searchParams;
  const defaultService = isServiceSlug(service) ? service : undefined;
  const { dict } = await getI18n();
  const t = dict.contactPage;

  return (
    <>
      <PageHero title={t.title} lead={t.lead} crumbs={[{ label: dict.nav.contact }]} homeLabel={dict.nav.home} breadcrumbLabel={dict.common.breadcrumb} />
      <section className="section lead-section" id="lead" style={{ paddingTop: "var(--space-6)" }} aria-labelledby="ways-title">
        <div className="container">
          <div className="grid lead__grid">
            <div className="lg-5 stack" style={{ gap: "var(--space-3)" }} data-reveal>
              <h2 className="h3" id="ways-title">{t.ways}</h2>
              <ul className="contact-list" role="list">
                <li>
                  <a href={`tel:${site.helplineTel}`}>
                    <span className="icon-tile"><Icon name="phone" /></span>
                    <span><strong>{site.helplineDisplay}</strong><br /><span className="caption">{t.helplineSub}</span></span>
                  </a>
                </li>
                <li>
                  <a href={site.whatsappUrl}>
                    <span className="icon-tile"><Icon name="whatsapp" /></span>
                    <span><strong>{t.whatsapp}</strong><br /><span className="caption">{t.whatsappSub}</span></span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`}>
                    <span className="icon-tile icon-tile--blue"><Icon name="mail" /></span>
                    <span><strong>{site.email}</strong><br /><span className="caption">{t.emailSub}</span></span>
                  </a>
                </li>
                <li>
                  <div>
                    <span className="icon-tile icon-tile--gold"><Icon name="map-pin" /></span>
                    <span><strong>{site.company}</strong><br /><span className="caption">{t.office}</span></span>
                  </div>
                </li>
              </ul>
              <div className="card card--glass" id="grievance">
                <p className="trust-badge__title">{t.grievanceTitle}</p>
                <p className="small muted">{rich(t.grievanceText, { email: <a className="link" href={`mailto:${site.grievanceEmail}`}>{site.grievanceEmail}</a> })}</p>
              </div>
            </div>
            <div className="lg-7 stack" style={{ gap: "var(--space-2)" }} data-reveal>
              <EmergencyNotice />
              <div className="card lead__card">
                <h2 className="h3" style={{ marginBottom: "var(--space-3)" }}>{t.formTitle}</h2>
                <LeadForm key={defaultService ?? "none"} idPrefix="contact" defaultService={defaultService} source="contact" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
