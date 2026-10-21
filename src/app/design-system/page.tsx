import type { Metadata } from "next";
import { DoctorCard, ServiceCard, TestimonialCard, TrustBadge } from "@/components/cards";
import { Icon, ICON_NAMES } from "@/components/icons";
import { Accordion } from "@/components/interactive";
import { LeadForm } from "@/components/lead-form";
import { PhoneMockup } from "@/components/phone-mockup";
import { QrCode, StoreBadges } from "@/components/store";
import { EmergencyNotice } from "@/components/ui-provider";
import { TESTIMONIALS } from "@/data/content";
import { DOCTORS } from "@/data/doctors";
import { SERVICES } from "@/data/services";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = { title: "Design System", robots: { index: false, follow: false } };

const SWATCHES = [
  ["bg", "--color-bg", "#0A0F1A"], ["bg-elevated", "--color-bg-elevated", "#111827"], ["surface-glass", "--color-surface-glass", "rgba(255,255,255,.05)"],
  ["primary", "--color-primary", "#00C2A8"], ["primary-ink", "--color-primary-ink", "#00C2A8 / #00776A"], ["secondary", "--color-secondary", "#3B82F6"],
  ["urgent (SOS only)", "--color-urgent", "#FF4D4F"], ["urgent-fill", "--color-urgent-fill", "#D92D2F"], ["gold", "--color-gold", "#F5B942"],
  ["text", "--color-text", "#F8FAFC / #0A0F1A"], ["text-muted", "--color-text-muted", "#94A3B8 / #475569"], ["success", "--color-success", "#34D399"],
  ["error", "--color-error", "#FF8A8C / #C42528"], ["focus", "--color-focus", "#5EEAD4"],
] as const;

const TYPE = [
  ["Display · Jakarta 800 · 40→72", "display", "Talk to a Doctor"],
  ["H1 · Jakarta 800 · 36→56", "h1", "Care in your pocket"],
  ["H2 · Jakarta 700 · 28→44", "h2", "Built around the golden hour"],
  ["H3 · Jakarta 700 · 22→28", "h3", "Quick Doctor Consultation"],
  ["H4 · Jakarta 700 · 20", "h4", "Doctor Appointment"],
  ["Body L · Inter · 17→20", "lead", "Talk to NMC-verified doctors by video or voice."],
  ["Small · Inter · 14", "small", "e-Prescription in your language"],
  ["Caption · Inter · 13", "caption", "*Illustrative figures for design purposes."],
] as const;

export default async function DesignSystemPage() {
  const { dict, locale } = await getI18n();
  const now = new Date();
  const doctor = DOCTORS[0]!;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__inner">
            <span className="eyebrow">MyDR24 DS · v1.0</span>
            <h1 className="h1">Design System</h1>
            <p className="lead">Tokens, type, icons and every component state, rendered from the production components. Use the header toggle to preview light mode.</p>
          </div>
        </div>
      </section>
      <div className="container">
        <section className="ds-section">
          <h2 className="h2">Colour</h2>
          <div className="swatches">
            {SWATCHES.map(([name, token, value]) => (
              <div className="swatch" key={token}>
                <div className="swatch__chip" style={{ background: `var(${token})` }} />
                <div className="swatch__meta"><strong>{name}</strong><code>{token}</code><code>{value}</code></div>
              </div>
            ))}
          </div>
        </section>

        <section className="ds-section">
          <h2 className="h2">Typography</h2>
          {TYPE.map(([label, cls, sample]) => (
            <div className="type-row" key={cls}><span className="caption">{label}</span><p className={cls}>{sample}</p></div>
          ))}
          <div className="type-row"><span className="caption">Hindi · Noto Sans Devanagari</span><p className="h2" lang="hi">अभी डॉक्टर से बात करें</p></div>
        </section>

        <section className="ds-section">
          <h2 className="h2">Spacing · Radius · Shadow</h2>
          <p className="ds-label">8-pt spacing scale</p>
          <div className="stack" style={{ gap: 8 }}>
            {[4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128].map((s) => (
              <div className="cluster" key={s} style={{ gap: 16 }}><code className="caption" style={{ width: 48 }}>{s}</code><div className="scale-bar" style={{ width: s }} /></div>
            ))}
          </div>
          <p className="ds-label">Radius</p>
          <div className="ds-row">
            {[["12 · sm", 12], ["16 · md", 16], ["24 · lg", 24], ["pill", 999]].map(([label, r]) => (
              <div key={label} className="card" style={{ borderRadius: r, width: 120, height: 80, padding: 12 }}><span className="caption">{label}</span></div>
            ))}
          </div>
          <p className="ds-label">Shadow scale</p>
          <div className="ds-row">
            {["shadow-1", "shadow-2", "shadow-3", "shadow-4", "shadow-glow-primary"].map((s) => (
              <div key={s} className="card" style={{ boxShadow: `var(--${s})`, width: 140, height: 96 }}><span className="caption">{s}</span></div>
            ))}
          </div>
        </section>

        <section className="ds-section">
          <h2 className="h2">Icons · 24px · 1.75 stroke</h2>
          <div className="icon-grid">
            {ICON_NAMES.map((n) => <div className="icon-cell" key={n}><Icon name={n} /><span>{n}</span></div>)}
          </div>
        </section>

        <section className="ds-section">
          <h2 className="h2">Buttons</h2>
          <p className="ds-label">Default · Hover · Focus · Disabled · Loading</p>
          <div className="stack" style={{ gap: 16 }}>
            <div className="ds-row">
              <button className="btn btn--primary" type="button">Primary</button>
              <button className="btn btn--primary force-hover" type="button">Hover</button>
              <button className="btn btn--primary force-focus" type="button">Focus</button>
              <button className="btn btn--primary" type="button" disabled>Disabled</button>
              <button className="btn btn--primary is-loading" type="button">Loading</button>
            </div>
            <div className="ds-row">
              <button className="btn btn--secondary" type="button">Secondary</button>
              <button className="btn btn--secondary force-hover" type="button">Hover</button>
              <button className="btn btn--secondary force-focus" type="button">Focus</button>
              <button className="btn btn--secondary" type="button" disabled>Disabled</button>
            </div>
            <div className="ds-row">
              <button className="btn btn--sos" type="button"><span className="sos-dot" />SOS</button>
              <button className="btn btn--sos force-hover" type="button">Hover</button>
              <button className="btn btn--sos force-focus" type="button">Focus</button>
              <button className="btn btn--ghost" type="button">Ghost</button>
            </div>
          </div>
        </section>

        <section className="ds-section">
          <h2 className="h2">Form controls</h2>
          <div className="ds-grid-3">
            <div className="field"><label className="field__label" htmlFor="ds1">Default</label><input className="input" id="ds1" placeholder="Placeholder" /></div>
            <div className="field"><label className="field__label" htmlFor="ds2">Focus</label><input className="input force-focus" id="ds2" defaultValue="Sunita Devi" /></div>
            <div className="field"><label className="field__label" htmlFor="ds3">Disabled</label><input className="input" id="ds3" defaultValue="Not editable" disabled /></div>
            <div className="field is-invalid">
              <label className="field__label" htmlFor="ds4">Error</label>
              <div className="input-group"><span className="input-group__prefix">🇮🇳 +91</span><input className="input" id="ds4" defaultValue="12345" aria-invalid /></div>
              <p className="field__error"><Icon name="alert" /><span>{dict.form.errors.mobile}</span></p>
            </div>
            <div className="field"><label className="field__label" htmlFor="ds5">Dropdown</label><select className="select" id="ds5"><option>Hindi</option><option>English</option></select></div>
            <div className="field">
              <span className="field__label">Checkbox</span>
              <label className="checkbox"><input type="checkbox" defaultChecked /><span>Checked</span></label>
              <label className="checkbox"><input type="checkbox" /><span>Unchecked</span></label>
              <label className="checkbox"><input type="checkbox" disabled /><span>Disabled</span></label>
            </div>
          </div>
          <p className="ds-label">Emergency notice</p>
          <EmergencyNotice />
        </section>

        <section className="ds-section">
          <h2 className="h2">Badges</h2>
          <div className="ds-row">
            <span className="badge">Neutral</span>
            <span className="badge badge--primary badge--live">{dict.common.online}</span>
            <span className="badge badge--gold">{dict.mega.goldenBadge}</span>
            <span className="badge badge--blue">{dict.common.comingSoon}</span>
            <span className="badge badge--illustrative">{dict.common.illustrative}</span>
          </div>
        </section>

        <section className="ds-section">
          <h2 className="h2">Cards</h2>
          <div className="ds-grid-3">
            <ServiceCard service={SERVICES[0]!} locale={locale} dict={dict} />
            <ServiceCard service={SERVICES[3]!} locale={locale} dict={dict} />
            <div className="card card--glass"><h3 className="card__title">Glass Card</h3><p className="card__text">rgba(255,255,255,.05) · blur 20 · shadow-3</p></div>
            <DoctorCard doctor={doctor} status={{ state: "online" }} locale={locale} dict={dict} />
            <DoctorCard doctor={DOCTORS[1]!} status={{ state: "busy" }} locale={locale} dict={dict} />
            <DoctorCard doctor={DOCTORS[3]!} status={{ state: "offline", nextHour: 9, nextIsTomorrow: now.getUTCHours() > 3 }} locale={locale} dict={dict} />
            <TrustBadge icon="id-card" title="Trust Badge" text="Default variant" />
            <TestimonialCard testimonial={TESTIMONIALS[0]!} locale={locale} />
            <div className="stack">
              <StoreBadges />
              <div className="qr card--glass" style={{ border: "1px solid var(--color-border)" }}>
                <div className="qr__code"><QrCode /></div>
                <p className="qr__label">Store badges + QR</p>
              </div>
            </div>
          </div>
        </section>

        <section className="ds-section">
          <h2 className="h2">Accordion</h2>
          <Accordion items={[{ q: "Open state", a: "Panel animates grid-rows 0fr→1fr over 300ms ease-out." }, { q: "Closed state", a: "Content." }]} />
        </section>

        <section className="ds-section">
          <h2 className="h2">Phone mockup</h2>
          <div className="ds-row" style={{ justifyContent: "center", gap: 24 }}>
            <PhoneMockup screen="consult" size="sm" />
            <PhoneMockup screen="sos" size="sm" />
            <PhoneMockup screen="appointments" size="sm" />
          </div>
        </section>

        <section className="ds-section">
          <h2 className="h2">Lead form</h2>
          <div className="card lead__card" style={{ maxWidth: 720 }}><LeadForm idPrefix="ds" source="design-system" /></div>
          <p className="caption" style={{ marginTop: 12 }}>Submit empty to see error states; submit valid data to see the success state (this creates a real lead).</p>
        </section>
      </div>
    </>
  );
}
