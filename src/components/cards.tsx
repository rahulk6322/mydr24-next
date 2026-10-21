import Link from "next/link";
import type { ReactNode } from "react";
import { LANGUAGE_LABELS } from "@/data/languages";
import { SPECIALITIES, type Doctor } from "@/data/doctors";
import type { Testimonial } from "@/data/content";
import { toneClass, type Service } from "@/data/services";
import { tr, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { DoctorStatus } from "@/lib/availability";
import { fmt, formatHour } from "@/lib/format";
import { Icon, type IconName } from "./icons";

/* ---------- Service Card (variants: featured · default · coming soon) ---------- */
export function ServiceCard({ service, locale, dict, action }: { service: Service; locale: Locale; dict: Dictionary; action?: ReactNode }) {
  const variant = service.comingSoon ? " service-card--soon" : service.featured ? " service-card--featured" : "";
  return (
    <article className={`card service-card${service.comingSoon ? "" : " card--interactive"}${variant}`}>
      <div className="service-card__top">
        <span className={`${toneClass(service.tone)} icon-tile--lg`}>
          <Icon name={service.icon} size="lg" />
        </span>
        {service.comingSoon ? (
          <span className="badge badge--blue">{dict.common.comingSoon}</span>
        ) : service.badge ? (
          <span className="badge badge--primary badge--live">{tr(service.badge, locale)}</span>
        ) : null}
      </div>
      <h3 className="card__title">{tr(service.title, locale)}</h3>
      <p className="card__text">{tr(service.summary, locale)}</p>
      <ul role="list">
        {service.points.map((p) => (
          <li key={p.en}>
            <Icon name={service.comingSoon ? "sparkle" : "check"} />
            {tr(p, locale)}
          </li>
        ))}
      </ul>
      <div className="card__footer">
        {action ?? (
          <Link className="card__link" href={`/services/${service.slug}`}>
            {tr(service.cta, locale)} <Icon name="arrow-right" />
          </Link>
        )}
      </div>
    </article>
  );
}

/* ---------- Doctor Card (states: online · busy · offline) ---------- */
export function DoctorCard({ doctor, status, locale, dict }: { doctor: Doctor; status: DoctorStatus; locale: Locale; dict: Dictionary }) {
  const t = dict.common;
  const next =
    status.state === "offline" && status.nextHour !== undefined
      ? fmt(status.nextIsTomorrow ? t.nextTomorrow : t.nextToday, { time: formatHour(status.nextHour, locale) })
      : null;
  return (
    <article className="card doctor-card" data-status={status.state}>
      <div className="doctor-card__head">
        <span className={`avatar${doctor.warm ? " avatar--gold" : ""}`}>
          {doctor.initials}
          <span className="avatar__status" />
        </span>
        <div>
          <h3 className="doctor-card__name">{doctor.name}</h3>
          <p className="small muted">
            {tr(SPECIALITIES[doctor.speciality], locale)} · {doctor.qualification}
          </p>
        </div>
      </div>
      <div className="doctor-card__meta">
        {status.state === "online" && <span className="badge badge--primary badge--live">{t.online}</span>}
        {status.state === "busy" && <span className="badge badge--gold">{t.busy}</span>}
        {status.state === "offline" && <span className="badge">{next ?? t.offline}</span>}
        <span className="badge">{fmt(t.years, { n: doctor.years })}</span>
      </div>
      <p className="doctor-card__row">
        <Icon name="language" />
        {doctor.languages.map((l) => tr(LANGUAGE_LABELS[l], locale)).join(", ")}
      </p>
      <p className="doctor-card__row">
        <Icon name="id-card" />
        {t.verified}
      </p>
      {status.state === "online" && (
        <Link className="btn btn--primary btn--sm btn--block" href="/contact?service=quick-consultation#lead">
          {t.consultNow}
        </Link>
      )}
      {status.state === "busy" && (
        <Link className="btn btn--secondary btn--sm btn--block" href="/contact?service=doctor-appointment#lead">
          {t.book}
        </Link>
      )}
      {status.state === "offline" && (
        <button className="btn btn--sm btn--block" type="button" disabled>
          {t.unavailable}
        </button>
      )}
    </article>
  );
}

/* ---------- Testimonial Card ---------- */
export function TestimonialCard({ testimonial, locale }: { testimonial: Testimonial; locale: Locale }) {
  return (
    <figure className="card testimonial">
      <div className="testimonial__stars" role="img" aria-label={`${testimonial.rating} out of 5`}>
        {Array.from({ length: testimonial.rating }, (_, i) => (
          <Icon key={i} name="star" />
        ))}
      </div>
      <blockquote className="testimonial__quote">“{tr(testimonial.quote, locale)}”</blockquote>
      <figcaption className="testimonial__person">
        <span className={`avatar avatar--sm${testimonial.warm ? " avatar--gold" : ""}`}>{testimonial.initials}</span>
        <span>
          <span className="testimonial__name">{testimonial.name}</span>
          <br />
          <span className="caption">{tr(testimonial.role, locale)}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/* ---------- Trust Badge (variants: default · compact) ---------- */
export function TrustBadge({ icon, title, text, tone = "primary", compact = false }: { icon: IconName; title: string; text?: string; tone?: "primary" | "blue" | "gold"; compact?: boolean }) {
  const tile = toneClass(tone);
  if (compact) {
    return (
      <div className="card trust-badge trust-badge--compact">
        <span className={tile}><Icon name={icon} /></span>
        <span className="small">{title}</span>
      </div>
    );
  }
  return (
    <div className="card trust-badge">
      <span className={`${tile} icon-tile--lg`}><Icon name={icon} size="lg" /></span>
      <div>
        <h3 className="trust-badge__title">{title}</h3>
        {text && <p className="trust-badge__text">{text}</p>}
      </div>
    </div>
  );
}
