import type { Doctor } from "@/data/doctors";
import { LANGUAGE_LABELS } from "@/data/languages";
import { SERVICES } from "@/data/services";
import { tr, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { LiveStats } from "@/lib/availability";
import { delay, fmt, formatDuration, vars } from "@/lib/format";
import { site } from "@/lib/site";
import Link from "next/link";
import { ServiceCard } from "../cards";
import { Icon, type IconName } from "../icons";
import { Carousel, LiveTrustStrip, ServiceCta, SosButton } from "../interactive";
import { PhoneMockup } from "../phone-mockup";
import { rich } from "../rich";
import { QrCode, StoreBadges } from "../store";

type Props = { dict: Dictionary; locale: Locale };

/* ============ 1. Hero ============ */
const CHIP_ICONS: IconName[] = ["shield-check", "language", "signal"];

function EcgLine() {
  return (
    <svg className="ecg" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="ecg-grad" x1="0" x2="1">
          <stop offset="0" stopColor="#00C2A8" stopOpacity="0" />
          <stop offset=".25" stopColor="#00C2A8" />
          <stop offset=".7" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 90h260l18-22 16 22h120l14-70 22 130 16-60h170l18-22 16 22h120l14-70 22 130 16-60h170l18-22 16 22h120l14-70 22 130 16-60H1440" />
    </svg>
  );
}

export function Hero({ dict, locale, stats, doctor }: Props & { stats: LiveStats; doctor: Doctor }) {
  const t = dict.hero;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <EcgLine />
      <div className="container">
        <div className="grid hero__grid">
          <div className="hero__copy lg-7">
            <span className="badge badge--primary badge--live">{t.eyebrow}</span>
            <h1 className="display" id="hero-title">{t.title}</h1>
            <p className="lead" style={{ maxWidth: "56ch" }}>{t.lead}</p>
            <div className="cluster hero__actions">
              <ServiceCta service="quick-consultation" className="btn btn--primary btn--lg">
                <Icon name="video" />
                {t.ctaPrimary}
              </ServiceCta>
              <a className="btn btn--secondary btn--lg" href="#app"><Icon name="phone" />{t.ctaSecondary}</a>
            </div>
            <ul className="caption cluster hero__chips" role="list" style={vars({ "--cluster-gap": "16px" })}>
              {t.chips.map((chip, i) => (
                <li key={chip} className="cluster" style={vars({ "--cluster-gap": "6px" })}>
                  <Icon name={CHIP_ICONS[i] ?? "check"} size="sm" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>
          <div className="hero__visual lg-5">
            <PhoneMockup screen="consult" />
            <div className="float-card float-card--a card--glass" aria-hidden="true">
              <span className={`avatar avatar--sm${doctor.warm ? " avatar--gold" : ""}`}>{doctor.initials}</span>
              <span>
                <strong>{doctor.name}</strong>
                <span className="caption">{t.onlineNow} · {tr(LANGUAGE_LABELS[doctor.languages[0] ?? "Hindi"], locale)}</span>
              </span>
            </div>
            <div className="float-card float-card--b card--glass" aria-hidden="true">
              <span className="icon-tile" style={{ width: 40, height: 40 }}><Icon name="clock" size="sm" /></span>
              <span>
                <strong>{fmt(t.connectedIn, { time: formatDuration(stats.avgConnectSeconds) })}</strong>
                <span className="caption">{dict.common.illustrative}</span>
              </span>
            </div>
          </div>
        </div>
        <LiveTrustStrip initial={stats} />
      </div>
    </section>
  );
}

/* ============ 2. Quick Medical Service (golden hour) ============ */
const GOLDEN_ICONS: IconName[] = ["phone", "ambulance", "activity", "hospital"];

export function GoldenHour({ dict }: Props) {
  const t = dict.golden;
  return (
    <section className="section golden" id="golden-hour" aria-labelledby="golden-title">
      <div className="container">
        <div className="section__head section__head--center" data-reveal>
          <span className="eyebrow eyebrow--gold"><Icon name="ambulance" size="sm" />{t.eyebrow}</span>
          <h2 className="h2" id="golden-title">{t.title}</h2>
          <p className="lead">{t.lead}</p>
        </div>
        <ol className="timeline" role="list">
          {t.steps.map((step, i) => (
            <li className="timeline__step" key={step.title} data-reveal style={delay(i * 80)}>
              <span className="timeline__dot"><Icon name={GOLDEN_ICONS[i] ?? "check"} /></span>
              <span className="timeline__time">{step.time}</span>
              <h3 className="timeline__title">{step.title}</h3>
              <p className="timeline__text">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="golden__foot card card--glass" data-reveal>
          <p className="small muted" style={{ maxWidth: "62ch" }}>
            {rich(t.foot, {
              strong: <strong style={{ color: "var(--color-text)" }}>{t.footStrong}</strong>,
              112: <a className="link" href={`tel:${site.emergencyTel}`}>{site.emergencyTel}</a>,
              108: <a className="link" href={`tel:${site.ambulanceTel}`}>{site.ambulanceTel}</a>,
            })}
          </p>
          <SosButton><span className="sos-dot" aria-hidden="true" />{t.cta}</SosButton>
        </div>
      </div>
    </section>
  );
}

/* ============ 3. Mobile App Spotlight ============ */
const APP_ICONS: IconName[] = ["video", "alert", "users", "pill"];

export function AppSpotlight({ dict }: Props) {
  const t = dict.app;
  return (
    <section className="section app-spotlight" id="app" aria-labelledby="app-title">
      <div className="container">
        <div className="grid app-spotlight__grid">
          <div className="app-spotlight__copy lg-4" data-reveal>
            <span className="eyebrow">{t.eyebrow}</span>
            <h2 className="h2" id="app-title">{t.title}</h2>
            <p className="lead">{t.lead}</p>
            <ul className="app-features" role="list">
              {t.features.map((f, i) => (
                <li key={f}><Icon name={APP_ICONS[i] ?? "check"} />{f}</li>
              ))}
            </ul>
            <div className="app-download">
              <StoreBadges />
              <div className="qr-wrap qr card--glass" style={{ border: "1px solid var(--color-border)" }}>
                <div className="qr__code"><QrCode /></div>
                <div>
                  <p className="qr__label">{t.scanTitle}</p>
                  <p className="caption">{t.scanText}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg-8">
            <Carousel label={t.carousel} className="phones">
              {(["consult", "sos", "appointments"] as const).map((screen) => (
                <figure key={screen}>
                  <PhoneMockup screen={screen} size="sm" />
                  <figcaption className="phone-caption">{t.screens[screen]}</figcaption>
                </figure>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ 4. Services grid ============ */
export function ServicesSection({ dict, locale }: Props) {
  const t = dict.servicesSection;
  return (
    <section className="section" id="services" aria-labelledby="services-title">
      <div className="container">
        <div className="section__head" data-reveal>
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 className="h2" id="services-title">{t.title}</h2>
          <p className="lead">{t.lead}</p>
        </div>
        <div className="services-grid">
          {SERVICES.map((service, i) => (
            <div key={service.slug} data-reveal style={delay(i * 60)}>
              <ServiceCard
                service={service}
                locale={locale}
                dict={dict}
                action={
                  service.comingSoon ? (
                    <ServiceCta service={service.slug} className="btn btn--secondary btn--sm">
                      <Icon name="bell" />
                      {dict.common.joinWaitlist}
                    </ServiceCta>
                  ) : undefined
                }
              />
            </div>
          ))}
        </div>
        <div className="cluster" style={{ justifyContent: "space-between", marginTop: "var(--space-2)" }}>
          <p className="caption">{t.note}</p>
          <Link className="link small" href="/services">{t.viewAll}</Link>
        </div>
      </div>
    </section>
  );
}

/* ============ 5. How it works ============ */
export function HowItWorks({ dict }: Props) {
  const t = dict.how;
  return (
    <section className="section section--elevated" id="how" aria-labelledby="how-title">
      <div className="container">
        <div className="section__head section__head--center" data-reveal>
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 className="h2" id="how-title">{t.title}</h2>
        </div>
        <ol className="steps" role="list">
          {t.steps.map((step, i) => (
            <li className="card card--glass step" key={step.title} data-reveal style={delay(i * 80)}>
              <span className="step__num" aria-hidden="true" />
              <h3 className="card__title">{step.title}</h3>
              <p className="card__text">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
