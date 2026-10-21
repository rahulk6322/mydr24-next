import Link from "next/link";
import { FAQS, TESTIMONIALS } from "@/data/content";
import { tr, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { delay, vars } from "@/lib/format";
import { site } from "@/lib/site";
import { TestimonialCard, TrustBadge } from "../cards";
import { Icon, type IconName } from "../icons";
import { Accordion, Carousel, ServiceCta } from "../interactive";
import { LeadForm } from "../lead-form";
import { rich } from "../rich";
import { EmergencyNotice } from "../ui-provider";

type Props = { dict: Dictionary; locale: Locale };

/* ============ 6. Elderly care ============ */
function ElderlyIllustration({ dict }: { dict: Dictionary }) {
  const t = dict.elderly;
  const onWhite = { color: "#0A0F1A", background: "rgba(255,255,255,.82)" };
  return (
    <div className="elderly__art" role="img" aria-label={t.artLabel}>
      <svg viewBox="0 0 500 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle cx="390" cy="90" r="56" fill="#FFE7B0" opacity=".7" />
        <rect x="40" y="60" width="130" height="150" rx="10" fill="#fff" opacity=".12" />
        <path d="M105 60v150M40 135h130" stroke="#fff" strokeOpacity=".18" strokeWidth="4" />
        <path d="M0 310 Q250 270 500 310 V400 H0z" fill="#5A2A22" opacity=".55" />
        <circle cx="190" cy="170" r="30" fill="#3B1D17" opacity=".85" />
        <path d="M140 330c0-70 22-120 50-120s50 50 50 120z" fill="#3B1D17" opacity=".85" />
        <path d="M160 200c-6 0-10-24 4-34 12-8 40-8 52 0 14 10 10 34 4 34" fill="#E8E1D9" opacity=".9" />
        <circle cx="320" cy="160" r="28" fill="#20302F" opacity=".9" />
        <path d="M270 330c0-80 22-130 50-130s50 50 50 130z" fill="#0F766E" opacity=".9" />
        <path d="M290 250c-20 10-50 20-80 30" stroke="#20302F" strokeWidth="16" strokeLinecap="round" opacity=".9" />
        <rect x="196" y="268" width="34" height="22" rx="6" fill="#00C2A8" />
        <path d="M110 120h20l6-10 8 22 6-12h22" stroke="#FFE7B0" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".8" />
      </svg>
      <div className="float-card float-card--a card--glass" style={onWhite} aria-hidden="true">
        <span className="icon-tile icon-tile--gold" style={{ width: 40, height: 40, color: "#8F5E00" }}><Icon name="heart-pulse" size="sm" /></span>
        <span><strong>{t.bpCard}</strong><span className="caption" style={{ color: "#475569" }}>{t.bpSub}</span></span>
      </div>
      <div className="float-card float-card--b card--glass" style={onWhite} aria-hidden="true">
        <span className="avatar avatar--sm avatar--gold">NR</span>
        <span><strong>{t.nurseCard}</strong><span className="caption" style={{ color: "#475569" }}>{t.nurseSub}</span></span>
      </div>
    </div>
  );
}

export function ElderlyCare({ dict, locale }: Props) {
  const t = dict.elderly;
  return (
    <section className="section elderly" id="elderly" aria-labelledby="elderly-title">
      <div className="container">
        <div className="grid elderly__grid">
          <div className="lg-6" data-reveal>
            <ElderlyIllustration dict={dict} />
            <p className="caption" style={{ marginTop: "var(--space-1)" }}>{t.artNote}</p>
          </div>
          <div className="elderly__copy" data-reveal>
            <span className="eyebrow eyebrow--gold">{t.eyebrow}</span>
            <h2 className="h2" id="elderly-title">{t.title}</h2>
            <p className="lead">{t.lead}</p>
            <ul className="check-list" role="list">
              {t.points.map((p) => (
                <li key={p.strong}><Icon name="check-circle" /><span><strong>{p.strong}</strong> {p.text}</span></li>
              ))}
            </ul>
            <div className="cluster">
              <ServiceCta service="elderly-care" className="btn btn--primary">{t.cta} <Icon name="arrow-right" /></ServiceCta>
            </div>
          </div>
        </div>
        <Carousel
          label={t.carousel}
          className="testimonials"
          heading={<h3 className="h3">{t.testimonials} <span className="badge badge--illustrative" style={{ verticalAlign: "middle" }}>{dict.common.illustrative}</span></h3>}
        >
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={item.name} testimonial={item} locale={locale} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}

/* ============ 7. Trust & compliance ============ */
const TRUST: { icon: IconName; tone: "primary" | "blue" | "gold" }[] = [
  { icon: "id-card", tone: "primary" },
  { icon: "network", tone: "blue" },
  { icon: "lock", tone: "gold" },
];
const TRUST_CHIPS: IconName[] = ["shield-check", "lock", "check-circle", "doctor"];

export function TrustSection({ dict }: Props) {
  const t = dict.trustSection;
  return (
    <section className="section" id="trust" aria-labelledby="trust-title">
      <div className="container">
        <div className="section__head section__head--center" data-reveal>
          <span className="eyebrow"><Icon name="shield-check" size="sm" />{t.eyebrow}</span>
          <h2 className="h2" id="trust-title">{t.title}</h2>
          <p className="lead">{t.lead}</p>
        </div>
        <div className="trust-grid">
          {t.badges.map((b, i) => (
            <div key={b.title} data-reveal style={delay(i * 80)}>
              <TrustBadge icon={TRUST[i]?.icon ?? "shield-check"} tone={TRUST[i]?.tone} title={b.title} text={b.text} />
            </div>
          ))}
        </div>
        <div className="trust-grid trust-grid--sub">
          {t.chips.map((c, i) => (
            <TrustBadge key={c} compact icon={TRUST_CHIPS[i] ?? "check"} title={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ 8. FAQ ============ */
export function FaqSection({ dict, locale }: Props) {
  const t = dict.faq;
  return (
    <section className="section section--elevated" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <div className="grid faq__grid">
          <div className="faq__aside lg-4" data-reveal>
            <span className="eyebrow">{t.eyebrow}</span>
            <h2 className="h2" id="faq-title">{t.title}</h2>
            <p className="muted">{rich(t.more, { link: <Link className="link" href="/contact">{t.moreLink}</Link> })}</p>
          </div>
          <div className="lg-8">
            <Accordion items={FAQS.map((f) => ({ q: tr(f.q, locale), a: tr(f.a, locale) }))} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ 9. Lead form ============ */
export function LeadSection({ dict }: Props) {
  const t = dict.leadSection;
  return (
    <section className="section lead-section" id="lead" aria-labelledby="lead-title">
      <div className="container">
        <div className="grid lead__grid">
          <div className="lead__copy lg-5" data-reveal>
            <span className="eyebrow">{t.eyebrow}</span>
            <h2 className="h2" id="lead-title">{t.title}</h2>
            <p className="lead">{t.lead}</p>
            <ul className="contact-list" role="list">
              <li>
                <a href={`tel:${site.helplineTel}`}>
                  <span className="icon-tile"><Icon name="phone" /></span>
                  <span><strong>{site.helplineDisplay}</strong><br /><span className="caption">{t.helpline}</span></span>
                </a>
              </li>
              <li>
                <div>
                  <span className="icon-tile icon-tile--blue"><Icon name="language" /></span>
                  <span>{t.languages}</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="lg-7 stack" style={vars({ "--stack-gap": "var(--space-2)" })} data-reveal>
            <EmergencyNotice />
            <div className="card lead__card">
              <LeadForm idPrefix="home" source="home" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
